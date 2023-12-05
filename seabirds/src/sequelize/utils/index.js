'use strict';
import Bird from '../models/bird.js';
import Colony from '../models/colony.js';
import GPSTrack from '../models/gpsTrack.js';
import Species from '../models/species.js';

export const getModels = (sequelize, DataTypes) => ({
    Colony: Colony(sequelize, DataTypes),
    Species: Species(sequelize, DataTypes),
    Bird: Bird(sequelize, DataTypes),
    GPSTrack: GPSTrack(sequelize, DataTypes)
});

export const grantPrivileges = (sequelize) => {
    return Promise.all([
        sequelize.query(
            `GRANT USAGE ON SCHEMA public TO ${process.env.GRAFANA_USER};`
        ),
        sequelize.query(
            `GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${process.env.GRAFANA_USER};`
        )
    ]);
};

export const createMaterializedViews = async (sequelize) => {
    return Promise.all([
        sequelize.query(
            'CREATE MATERIALIZED VIEW IF NOT EXISTS colony_summary AS \
            SELECT \
                "colonyId", \
                COUNT(DISTINCT "speciesId") AS "species", \
                COUNT(DISTINCT bird.id) AS "birds", \
                COUNT(*) AS "gpsTracks" \
            FROM \
                bird \
                JOIN gps_track ON gps_track."birdId" = bird.id \
            GROUP BY \
                "colonyId" \
            ORDER BY \
                "colonyId" \
            WITH NO DATA;'
        )
    ]);
};

export const refreshMaterializedViews = (sequelize) => {
    return Promise.all([
        sequelize.query('REFRESH MATERIALIZED VIEW colony_summary;')
    ]);
};

export const createIndex = (sequelize) => {
    return Promise.all([
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS gps_track_idx_bird ON gps_track ("birdId");'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS bird_idx_colonyId_species ON bird ("colonyId", "speciesId");'
        ),
        sequelize.query(
            'CREATE INDEX IF NOT EXISTS mv_colony_summary_idx_colony ON colony_summary ("colonyId");'
        )
    ]);
};
