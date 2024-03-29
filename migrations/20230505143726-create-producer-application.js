'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('producer-application', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('producer-application');
  },
};
