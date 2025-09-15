import sequelize from "../../database";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import ShowTicketService from "../TicketServices/ShowTicketService";

interface Request {
  ticketId: string;
  pageNumber?: string;
  query: string;
}

interface Response {
  messages: Message[];
  hasMore: boolean;
  total: number;
}

const toBooleanQuery = (query: string) => {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(t => `+${t}*`)
    .join(' ');
}

const ListMessagesMinifiedService = async ({
  pageNumber = "1",
  ticketId,
  query
}: Request): Promise<Response> => {
  const limit = 40;
  const ticket = await ShowTicketService(ticketId);

  if (!ticket) throw new AppError("ERR_NO_TICKET_FOUND", 404);

  const offset = limit * (+pageNumber - 1);

  const queryToGetMessages = `
    SELECT
      id,
      body,
      createdAt,
      mediaType
    FROM Messages
    WHERE
      ticketId = ?
      AND mediaType = "chat"
      AND MATCH(body) AGAINST (? IN BOOLEAN MODE)
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?;
  `;

  const queryToCountResults = `
    SELECT COUNT(*) AS totalResults
    FROM Messages
    WHERE ticketId = ?
      AND MATCH(body) AGAINST(? IN BOOLEAN MODE);
  `

  const [[messages], [[count]]] = await Promise.all([
    await sequelize.query({ query: queryToGetMessages, values: [ticketId, toBooleanQuery(query), limit, offset]}),
    await sequelize.query({ query: queryToCountResults, values: [ticketId, toBooleanQuery(query)] })
  ]);
  const {totalResults} = count as { totalResults: number };
  const hasMore = totalResults > offset + limit;

  return {
    messages: messages as unknown as Message[],
    hasMore,
    total: totalResults,
  };
};

export default ListMessagesMinifiedService;
