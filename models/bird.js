'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bird extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
        }
    }
    Bird.init({
        id: DataTypes.STRING,
        colonyId: DataTypes.INTEGER,
        speciesId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Bird'
    });
    return Bird;
};