'use strict';
import { Model } from 'sequelize';

export const model = (sequelize, DataTypes) => {
    const modelName = 'Colony';
    const tableName = 'colony';
    class Colony extends Model {
        static associate() {
            const { Bird } = sequelize.models;
            this.hasMany(Bird, {
                foreignKey: 'colonyId',
                as: 'bird',
                allowNull: false
            });
        }
    }
    Colony.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName,
            tableName
        }
    );
    return Colony;
};

export default model;
