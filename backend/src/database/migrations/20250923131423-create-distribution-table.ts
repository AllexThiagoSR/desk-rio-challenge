import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Distribution", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userToReceiveNextTicket: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      queueId: {
        type: DataTypes.INTEGER,
        references: { model: "Queues", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Distribution");
  }
};
