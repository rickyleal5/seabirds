'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GPSTrack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    GPSTrack.init({
        id: DataTypes.INTEGER,
        dateTime: DataTypes.DATE,
        longitude: DataTypes.FLOAT,
        latitude: DataTypes.FLOAT,
        altitude: DataTypes.FLOAT,
        unix: DataTypes.BIGINT,
        year: DataTypes.INTEGER,
        maxDepth: DataTypes.FLOAT,
        coverageRatio: DataTypes.FLOAT,
        birdId: DataTypes.STRING,
        isDive0m: DataTypes.BOOLEAN,
        isDive1m: DataTypes.BOOLEAN,
        isDive2m: DataTypes.BOOLEAN,
        isDive3m: DataTypes.BOOLEAN,
        isDive4m: DataTypes.BOOLEAN,
        isDive5m: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'GPSTrack'
    });
    return GPSTrack;
};