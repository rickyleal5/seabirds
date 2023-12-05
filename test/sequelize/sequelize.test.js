import { describe, it } from 'mocha';
import { Database } from '../../seabirds/src/sequelize/sequelize.js';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('Database', async function () {
    describe('Sequelize', function () {
        it('should get all models', async function () {
            const database = new Database();
            await database.sync({ force: true });
            expect(Object.keys(database.sequelize.models).length).to.equal(0);

            database.getModels();
            await database.sync({ force: true });
            expect(Object.keys(database.sequelize.models).length).to.equal(4);
        });

        it('should create indexes', async function () {
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.createMaterializedViews();

            const indexConfig = {
                indexname: 'gps_track_idx_bird',
                tablename: 'gps_track'
            };
            const query = `SELECT tablename, indexname, indexdef FROM pg_indexes WHERE indexname = '${indexConfig.indexname}';`;

            let result = await database.sequelize.query(query, {
                plain: true
            });
            expect(result).to.be.null;

            await database.createIndex();
            result = await database.sequelize.query(query, {
                plain: true
            });
            expect(result).to.include(indexConfig);
        });

        it('should grant privileges', async function () {
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.grantPrivileges();

            const result = await database.sequelize.query(
                `SELECT   pg_catalog.has_schema_privilege('${process.env.GRAFANA_USER}', 'public', 'USAGE');`,
                { plain: true }
            );

            expect(result.has_schema_privilege).to.be.true;
        });

        it('should create and refresh materialized views', async function () {
            const materializedView = 'colony_summary';
            const database = new Database();
            database.getModels();
            await database.sync({ force: true });
            await database.createMaterializedViews();
            await database.sync();

            let result = await database.sequelize.query(
                'SELECT   matviewname, definition from pg_matviews;',
                { plain: true }
            );

            expect(result.matviewname).to.equal(materializedView);

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

            const { GPSTrack, Colony, Species, Bird } =
                database.sequelize.models;
            await Colony.create({ id: colonyId }, { returning: false });
            await Species.create({ id: speciesId }, { returning: false });
            await Bird.create(
                { id: birdId, colonyId, speciesId },
                { returning: false }
            );
            await GPSTrack.create(gpsTrack);

            await database.refreshMaterializedViews();
            await database.sync();
            await sleep(1000);

            result = await database.sequelize.query(
                `SELECT   * from ${materializedView};`,
                { plain: true }
            );

            expect(parseInt(result.colonyId)).to.equal(colonyId);
            expect(parseInt(result.species)).to.equal(1);
            expect(parseInt(result.birds)).to.equal(1);
            expect(parseInt(result.gpsTracks)).to.equal(1);
        });
    });
});
