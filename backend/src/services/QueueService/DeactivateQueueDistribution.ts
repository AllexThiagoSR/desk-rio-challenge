import AppError from "../../errors/AppError";
import Queue from "../../models/Queue"
import User from "../../models/User"

const DeactivateDistributionService = async (queueId: number | string): Promise<Queue> => {
  const queue = await Queue.findByPk(
    queueId,
    {
      include: [{ model: User, as: "users", }],
      order: [[{ model: User, as: "users" }, "id", "ASC"]]
    }
  );

  if (!queue) throw new AppError("ERR_QUEUE_NOT_FOUND");

  if (!queue.ticketDistributionIsActive) throw new AppError("ERR_TICKET_DISTRIBUTION_IS_DEACTIVE", 409);

  const queueUpdate = await Queue.update({ ticketDistributionIsActive: false }, { where: { id: queue.id }});
  
  if (queueUpdate[0] !== 1) throw new AppError("ERR_TO_UPDATE_QUEUE");

  queue.ticketDistributionIsActive = false;
  
  return queue;
}

export default DeactivateDistributionService