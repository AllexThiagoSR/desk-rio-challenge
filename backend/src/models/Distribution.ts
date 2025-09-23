import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";
import Queue from "./Queue";

@Table
export default class Distribuition extends Model<Distribuition> {
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userToReceiveNextTicket: number;

  @HasOne(() => User)
  user: User;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;
}

