'use strict';
import { Model } from 'sequelize';
import Debug from 'debug';
const debug = Debug('database');

export const model = (sequelize, DataTypes) => {
    const modelName = 'GPSTrack';
    const tableName = 'gps_track';
    class GPSTrack extends Model {
        static associate() {
            const { Bird } = sequelize.models;
            this.belongsTo(Bird, {
                foreignKey: 'birdId',
                as: 'bird',
                allowNull: false
            });
        }

        static async createHypertable() {
            debug(`${modelName}: createHypertable`);
            return sequelize.query(
                `SELECT create_hypertable('${tableName}', 'dateTime');`
            );
        }
    }
    GPSTrack.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            dateTime: {
                type: DataTypes.DATE,
                primaryKey: true
            },
            longitude: DataTypes.FLOAT,
            latitude: DataTypes.FLOAT,
            altitude: DataTypes.FLOAT,
            unix: DataTypes.BIGINT,
            year: DataTypes.INTEGER,
            maxDepth: DataTypes.FLOAT,
            coverageRatio: DataTypes.FLOAT,
            isDive0m: DataTypes.BOOLEAN,
            isDive1m: DataTypes.BOOLEAN,
            isDive2m: DataTypes.BOOLEAN,
            isDive3m: DataTypes.BOOLEAN,
            isDive4m: DataTypes.BOOLEAN,
            isDive5m: DataTypes.BOOLEAN,
            birdId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName,
            tableName
        }
    );

    // eslint-disable-next-line
    GPSTrack.afterBulkCreate(async (gps_track, options) => {
        await sequelize.query('REFRESH MATERIALIZED VIEW colony_summary;', {
            transaction: options.transaction
        });
    });

    return GPSTrack;
};

export default model;
