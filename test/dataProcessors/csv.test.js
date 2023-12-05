import { describe, it, afterEach, before } from 'mocha';
import { Database } from '../../seabirds/src/sequelize/sequelize.js';
import { processCSV } from '../../seabirds/src/processData/csv/index.js';
import { expect } from 'chai';
import { mocks } from '../mocks/objects/objects.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let db;

describe('CSV', function () {
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

    it('should process a CSV file and store its data', async function () {
        const { GPSTrack, Colony, Species, Bird } = db.sequelize.models;

        let colonies = await Colony.findAll({ raw: true });
        let species = await Species.findAll({ raw: true });
        let birds = await Bird.findAll({ raw: true });
        let gpsTracks = await GPSTrack.findAll({ raw: true });

        expect(gpsTracks).to.be.empty;
        expect(colonies).to.be.empty;
        expect(species).to.be.empty;
        expect(birds).to.be.empty;

        await processCSV(db);
        await sleep(1000);

        colonies = await Colony.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        species = await Species.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        birds = await Bird.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        gpsTracks = await GPSTrack.findAll({
            raw: true,
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        gpsTracks = gpsTracks.map((gpsTrack) => {
            gpsTrack.dateTime = new Date(gpsTrack.dateTime).getTime();
            gpsTrack.unix = BigInt(gpsTrack.unix);
            return gpsTrack;
        });

        expect(colonies).to.have.lengthOf(mocks.colonies.length);
        expect(colonies).to.eql(mocks.colonies);

        expect(species).to.have.lengthOf(mocks.species.length);
        expect(species).to.eql(mocks.species);

        expect(birds).to.have.lengthOf(mocks.birds.length);
        expect(birds).to.eql(mocks.birds);

        expect(gpsTracks).to.have.lengthOf(mocks.gpsTracks.length);
        expect(gpsTracks).to.eql(mocks.gpsTracks);
    });

    it('should rollback transaction', async function () {
        const { GPSTrack, Colony, Species, Bird } = db.sequelize.models;

        let colonies = await Colony.findAll({ raw: true });
        let species = await Species.findAll({ raw: true });
        let birds = await Bird.findAll({ raw: true });
        let gpsTracks = await GPSTrack.findAll({ raw: true });

        expect(gpsTracks).to.be.empty;
        expect(colonies).to.be.empty;
        expect(species).to.be.empty;
        expect(birds).to.be.empty;

        await db.sync({ force: true });
        await processCSV(db);

        await db.sync();

        colonies = await Colony.findAll({ raw: true });
        species = await Species.findAll({ raw: true });
        birds = await Bird.findAll({ raw: true });
        gpsTracks = await GPSTrack.findAll({ raw: true });

        expect(gpsTracks).to.be.empty;
        expect(colonies).to.be.empty;
        expect(species).to.be.empty;
        expect(birds).to.be.empty;
    });
});
