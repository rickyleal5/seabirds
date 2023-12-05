'use strict';
import Debug from 'debug';
import { Database } from './sequelize/sequelize.js';
import { processCSV } from './processData/csv/index.js';

const debug = Debug('seabirds');

(async () => {
    debug('Creating database tables');
    const db = new Database();
    db.getModels();
    db.associate();
    await db.sync({ force: true });
    db.createHypertables();
    await db.createMaterializedViews();
    await db.grantPrivileges();
    await db.sync();

    debug('Processing Seabirds dataset');
    await processCSV(db);
    await db.createIndex();
    await db.sync();
})();
