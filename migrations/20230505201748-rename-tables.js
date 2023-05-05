'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('contest', 'contests');
    await queryInterface.renameTable('page', 'pages');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('contests', 'contest');
    await queryInterface.renameTable('pages', 'page');
  }
};
