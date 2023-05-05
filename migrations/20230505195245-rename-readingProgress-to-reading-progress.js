'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('readingProgress', 'reading-progress');

    await queryInterface.sequelize.query(
      `INSERT INTO "reading-progress" ("id", "chapterId", "pageId", "createdAt", "updatedAt") 
       SELECT "id", "chapterId", "pageId", "createdAt", "updatedAt" FROM "readingProgress";`,
    );

    await queryInterface.dropTable('readingProgress');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'readingProgress',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        chapterId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Chapter',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        pageId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Page',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {},
    );

    await queryInterface.sequelize.query(
      `INSERT INTO "readingProgress" ("id", "chapterId", "pageId", "createdAt", "updatedAt") 
       SELECT "id", "chapterId", "pageId", "createdAt", "updatedAt" FROM "reading-progress";`,
    );

    await queryInterface.dropTable('reading-progress');
  },
};
