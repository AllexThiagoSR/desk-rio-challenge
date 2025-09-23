import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn(
      "Queues",
      "ticketDistributionIsActive",
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Queues", "ticketDistributionIsActive");
  }
};
