'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Sequelize.sequelize.query(`
      ALTER TABLE "employees"
      ADD googleid varchar(55);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    return await Sequelize.sequelize.query(`
      DROP TABLE "employees";
    `);
  }
};
