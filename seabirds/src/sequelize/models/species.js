'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    const modelName = 'Species';
    const tableName = 'species';
    class Species extends Model {
        static associate() {
            const { Bird } = sequelize.models;
            this.hasMany(Bird, {
                foreignKey: 'speciesId',
                as: 'bird',
                allowNull: false
            });
        }
    }
    Species.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: DataTypes.STRING
        },
        {
            sequelize,
            modelName,
            tableName
        }
    );
    return Species;
};

export default model;
