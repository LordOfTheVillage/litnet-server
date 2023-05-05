'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('comments', 'book-comments');

    await queryInterface.sequelize.query(`
      INSERT INTO "book-comments" (id, text, userId, bookId, createdAt, updatedAt)
      SELECT id, text, userId, bookId, createdAt, updatedAt FROM comments;
    `);

    await queryInterface.dropTable('comments');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      bookId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.sequelize.query(`
      INSERT INTO comments (id, text, userId, bookId, createdAt, updatedAt)
      SELECT id, text, userId, bookId, createdAt, updatedAt FROM "book-comments";
    `);

    await queryInterface.dropTable('book-comments');
  },
};
