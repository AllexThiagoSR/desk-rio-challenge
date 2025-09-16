import { count } from "console";
import sequelize from "../../database";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import ShowTicketService from "../TicketServices/ShowTicketService";

interface Request {
  ticketId: string;
  messageId: string;
}

interface Response {
  page: number;
  total: number;
  pageSize: number;
}

const GetMessageMetadata = async ({
  ticketId,
  messageId
}: Request): Promise<Response> => {
  const limit = 40;
  const ticket = await ShowTicketService(ticketId);

  if (!ticket) throw new AppError("ERR_NO_TICKET_FOUND", 404);

  const queryToGetMetadata = `
    SELECT
      FLOOR((
        SELECT COUNT(*)
        FROM Messages m2
        WHERE m2.ticketId = m1.ticketId
          AND (
            m2.createdAt > m1.createdAt OR
            (m2.createdAt = m1.createdAt AND m2.id > m1.id)
          )
      ) / :pageSize) + 1 AS pageNumber
    FROM Messages m1
    WHERE m1.id = :messageId
  `;

  const queryToCountResults = `
    SELECT COUNT(*) AS totalResults
    FROM Messages
    WHERE ticketId = ?;
  `;

  const result = await sequelize.query(queryToGetMetadata,  { replacements: { pageSize: limit, messageId } });

  const [[[pageNumberResult]], [[totalResults]]] = await Promise.all([
    await sequelize.query(queryToGetMetadata,  { replacements: { pageSize: limit, messageId } }),
    await sequelize.query({ query: queryToCountResults, values: [ticketId] })
  ]);

  console.log({totalResults });
  const { pageNumber } = pageNumberResult as {pageNumber: string}
  const { totalResults: total } = totalResults as {totalResults: number}
  return {
    page: Number(pageNumber),
    total,
    pageSize: limit,
  };
};

export default GetMessageMetadata;
