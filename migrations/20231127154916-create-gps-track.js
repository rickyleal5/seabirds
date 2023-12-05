'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GPSTracks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      dateTime: {
        type: Sequelize.DATE
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      altitude: {
        type: Sequelize.FLOAT
      },
      unix: {
        type: Sequelize.BIGINT
      },
      year: {
        type: Sequelize.INTEGER
      },
      maxDepth: {
        type: Sequelize.FLOAT
      },
      coverageRatio: {
        type: Sequelize.FLOAT
      },
      birdId: {
        type: Sequelize.STRING
      },
      isDive0m: {
        type: Sequelize.BOOLEAN
      },
      isDive1m: {
        type: Sequelize.BOOLEAN
      },
      isDive2m: {
        type: Sequelize.BOOLEAN
      },
      isDive3m: {
        type: Sequelize.BOOLEAN
      },
      isDive4m: {
        type: Sequelize.BOOLEAN
      },
      isDive5m: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GPSTracks');
  }
};