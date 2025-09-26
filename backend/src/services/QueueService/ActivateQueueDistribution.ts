import AppError from "../../errors/AppError";
import Distribution from "../../models/Distribution";
import Queue from "../../models/Queue"
import User from "../../models/User"

const ActivateDistributionService = async (queueId: number | string): Promise<Queue> => {
  
  const readOperations = [
    Queue.findByPk(
      queueId,
      {
        include: [{ model: User, as: "users", }],
        order: [[{ model: User, as: "users" }, "id", "ASC"]]
      }
    ),
    Distribution.findOne(
      { where: { queueId } }
    )
  ];

  const [queue, distribution] = await Promise.all(readOperations);
  if (!queue) throw new AppError("ERR_QUEUE_NOT_FOUND");

  if ((queue as Queue).ticketDistributionIsActive) throw new AppError("ERR_TICKET_DISTRIBUTION_IS_ACTIVE", 409);

  const writeOperations:any[] = [Queue.update({ ticketDistributionIsActive: true }, { where: { id: queue.id }})];
  if (!distribution) writeOperations.push(Distribution.create({ queueId: queue.id, userToReceiveNextTicket: (queue as Queue).users[0].id }));

  const result = await Promise.all(writeOperations)

  if (result[0][0] !== 1) throw new AppError("ERR_TO_UPDATE_QUEUE");

  (queue as Queue).ticketDistributionIsActive = true;
  
  return queue as Queue;
}

export default ActivateDistributionService