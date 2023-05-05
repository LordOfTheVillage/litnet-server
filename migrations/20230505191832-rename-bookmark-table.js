'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('bookmark', 'bookmarks');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('bookmarks', 'bookmark');
  }
};
