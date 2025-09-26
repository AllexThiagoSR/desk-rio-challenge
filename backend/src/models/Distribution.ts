import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";
import Queue from "./Queue";

@Table({ tableName: "Distribution", timestamps: false })
export default class Distribution extends Model<Distribution> {
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userToReceiveNextTicket: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;
}

