'use strict';
import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import csv from 'csv-parser';
import _ from 'lodash';
import { extractGPSTrack, speciesName } from './utils.js';
import ora from 'ora';
const spinner = ora();

const debug = Debug('seabirds');

export const processCSV = async (db) => {
    debug('Processing CSV files');
    const csvFilePaths = fs
        .readdirSync(process.env.DATA_FOLDER)
        .filter((file) => path.extname(file) === '.csv')
        .map((file) => path.join(process.env.DATA_FOLDER, file));

    for (const filePath of csvFilePaths) {
        await processFile(filePath, db);
    }
};

const processFile = async (filePath, db) => {
    debug(`Processing CSV file: ${filePath}`);
    spinner.start(`Loading CSV file: ${filePath}`);
    let gpsTracks = [];
    const rs = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });
    const parser = csv();

    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
        rs.pipe(parser)
            .on('data', (data) => {
                gpsTracks.push(data);
                if (gpsTracks.length >= process.env.CHUNK_SIZE) {
                    rs.pause();
                    transformAndLoadData(gpsTracks, db);
                    gpsTracks = [];
                    rs.resume();
                }
            })
            .on('end', () => {
                transformAndLoadData(gpsTracks, db);
                spinner.succeed(`Done loading CSV file: ${filePath}`);
                resolve();
            });
    });
};

// Transform and load in the same function to avoid passing around the large array of objects
const transformAndLoadData = async (data, db) => {
    // Transform the data
    const gpsTracks = data.map((gpsTrack) => extractGPSTrack(gpsTrack));
    const colonies = _.uniqBy(
        gpsTracks.map((gpsTrack) => ({
            id: gpsTrack.colonyId
        })),
        'id'
    );
    const species = _.uniqBy(
        gpsTracks.map((gpsTrack) => ({
            id: gpsTrack.speciesId,
            name: speciesName[gpsTrack.speciesId]
        })),
        'id'
    );
    const birds = _.uniqBy(
        gpsTracks.map((gpsTrack) => ({
            id: gpsTrack.birdId,
            speciesId: gpsTrack.speciesId,
            colonyId: gpsTrack.colonyId
        })),
        'id'
    );

    const t = await db.sequelize.transaction();
    try {
        const { GPSTrack, Colony, Species, Bird } = db.sequelize.models;
        await Colony.bulkCreate(colonies, {
            ignoreDuplicates: true,
            transaction: t
        });
        await Species.bulkCreate(species, {
            ignoreDuplicates: true,
            transaction: t
        });
        await Bird.bulkCreate(birds, {
            ignoreDuplicates: true,
            transaction: t
        });
        await GPSTrack.bulkCreate(gpsTracks, {
            transaction: t
        });
        await t.commit();
    } catch (error) {
        console.log('Rolling back transaction');
        await t.rollback();
    }
};
