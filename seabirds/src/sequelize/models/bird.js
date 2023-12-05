'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    const modelName = 'Bird';
    const tableName = 'bird';
    class Bird extends Model {
        static associate() {
            const { Colony, Species, GPSTrack } = sequelize.models;
            this.belongsTo(Colony, {
                foreignKey: 'colonyId',
                as: 'colony',
                allowNull: false
            });
            this.belongsTo(Species, {
                foreignKey: 'speciesId',
                as: 'species',
                allowNull: false
            });
            this.hasMany(GPSTrack, {
                foreignKey: 'birdId',
                as: 'gps_track',
                allowNull: false
            });
        }
    }
    Bird.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            speciesId: DataTypes.STRING,
            colonyId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName,
            tableName
        }
    );

    return Bird;
};

export default model;
