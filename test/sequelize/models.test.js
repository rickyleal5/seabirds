import { describe, it, afterEach, before } from 'mocha';
import { Database } from '../../seabirds/src/sequelize/sequelize.js';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';

let db;

describe('Database', async function () {
    before(async function () {
        db = new Database();
        db.getModels();
        db.associate();
        await db.sync({ force: true });
        db.createHypertables();
        await db.createMaterializedViews();
    });

    afterEach(async function () {
        const { GPSTrack, Colony, Species, Bird } = db.sequelize.models;
        await GPSTrack.truncate({ cascade: true });
        await Colony.truncate({ cascade: true });
        await Species.truncate({ cascade: true });
        await Bird.truncate({ cascade: true });
    });

    describe('Models', function () {
        describe('GPSTrack', async function () {
            it('it should create a record in the database', async function () {
                const birdId = faker.number.int(100);
                const colonyId = faker.number.int(100);
                const speciesId = faker.animal.bird();

                const gpsTrack = {
                    id: faker.number.int(100),
                    dateTime: new Date(),
                    longitude: faker.location.longitude(),
                    latitude: faker.location.latitude(),
                    altitude: faker.number.float(),
                    unix: BigInt(Date.now()),
                    year: new Date().getFullYear(),
                    maxDepth: faker.number.float(),
                    coverageRatio: faker.number.float(),
                    isDive0m: faker.datatype.boolean(0.5),
                    isDive1m: faker.datatype.boolean(0.5),
                    isDive2m: faker.datatype.boolean(0.5),
                    isDive3m: faker.datatype.boolean(0.5),
                    isDive4m: faker.datatype.boolean(0.5),
                    isDive5m: faker.datatype.boolean(0.5),
                    birdId
                };

                const { GPSTrack, Colony, Species, Bird } = db.sequelize.models;
                await Colony.create({ id: colonyId }, { returning: false });
                await Species.create({ id: speciesId }, { returning: false });
                await Bird.create(
                    { id: birdId, colonyId, speciesId },
                    { returning: false }
                );
                const record = await GPSTrack.create(gpsTrack);
                gpsTrack.dateTime = gpsTrack.dateTime.getTime();
                record.dataValues.dateTime =
                    record.dataValues.dateTime.getTime();
                record.dataValues.unix = BigInt(record.dataValues.unix);
                expect(record.dataValues).to.include(gpsTrack);
            });
        });

        describe('Bird', async function () {
            it('it should create a record in the database', async function () {
                const colonyId = faker.number.int(100);
                const speciesId = faker.animal.bird();

                const bird = {
                    id: faker.number.int(100),
                    speciesId,
                    colonyId
                };

                const { Colony, Species, Bird } = db.sequelize.models;
                await Colony.create({ id: colonyId }, { returning: false });
                await Species.create({ id: speciesId }, { returning: false });
                const record = await Bird.create(bird);
                expect(record.dataValues).to.include(bird);
            });
        });

        describe('Species', async function () {
            it('it should create a record in the database', async function () {
                const species = {
                    id: faker.animal.bird()
                };

                const { Species } = db.sequelize.models;
                const record = await Species.create(species);
                expect(record.dataValues).to.include(species);
            });
        });

        describe('Colony', async function () {
            it('it should create a record in the database', async function () {
                const colony = {
                    id: faker.number.int(100)
                };

                const { Colony } = db.sequelize.models;
                const record = await Colony.create(colony);
                expect(record.dataValues).to.include(colony);
            });
        });
    });
});
