import AppError from "../../errors/AppError";
import Distribution from "../../models/Distribution";
import Queue from "../../models/Queue";
import User from "../../models/User";

const DistributionTicketService = async (queueId: string | number): Promise<Distribution | null> => {
  const distributionInfo = await Distribution.findOne({
    where: { queueId },
    include: [{
      model: Queue,
      as: "queue",
      include: [{
        model: User,
        as: "users"
      }],
      order: [[{ model: User, as: "users" }, "id", "ASC"]]
    }]
  });
  
  let userToReceiveNextTicketIndex: number = 0;
  if (!distributionInfo || !distributionInfo.queue.ticketDistributionIsActive) return null;

  for (let i = 0; i < (distributionInfo?.queue.users.length || 0); i += 1) {
    if (distributionInfo?.queue.users[i].id === distributionInfo.userToReceiveNextTicket){
      if (distributionInfo?.queue.users.length - 1 === i) {
        userToReceiveNextTicketIndex = 0;
      } else {
        userToReceiveNextTicketIndex = i + 1;
      }
      break;
    }
  }

  Distribution.update({ userToReceiveNextTicket: distributionInfo?.queue.users[userToReceiveNextTicketIndex].id }, { where: { queueId } });

  return distributionInfo;
}

export default DistributionTicketService;