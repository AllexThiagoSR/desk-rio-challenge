import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const qi = queryInterface;
    const sequelize = qi.sequelize;

    // 1) Garantir collation/acento-insensitive na coluna body
    // Obs.: só altera a COLUNA (não mexe no default da tabela).
    await sequelize.query(`
      ALTER TABLE \`Messages\`
      MODIFY \`body\` TEXT
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
      NOT NULL;
    `);

    // 2) FULLTEXT em body (rápido para busca por termos/prefixos)
    // Nomeamos para facilitar o rollback.
    await sequelize.query(`
      CREATE FULLTEXT INDEX \`ft_body\`
      ON \`Messages\` (\`body\`);
    `);

    // 3) Índice composto para recorte/ordenação por conversa
    await sequelize.query(`
      CREATE INDEX \`idx_ticket_created\`
      ON \`Messages\` (\`ticketId\`, \`createdAt\`);
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    const qi = queryInterface;
    const sequelize = qi.sequelize;

    // Reverte passo 3
    await sequelize.query(`
      DROP INDEX \`idx_ticket_created\` ON \`Messages\`;
    `);

    // Reverte passo 2
    await sequelize.query(`
      DROP INDEX \`ft_body\` ON \`Messages\`;
    `);

    // Reverte passo 1: volta body para collation binária original informada
    await sequelize.query(`
      ALTER TABLE \`Messages\`
      MODIFY \`body\` TEXT
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_bin
      NOT NULL;
    `);
  }
};
