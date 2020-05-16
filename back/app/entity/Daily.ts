import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Like } from "typeorm";
import { User, Meals } from "./index";

@Entity({ name: "Daily" })
export class Daily extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public readonly id!: string;

  @Column("text", { nullable: true })
  public name?: number;
}
