import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Like } from "typeorm";

@Entity({ name: "PhysicalActivity" })
export class PhysicalActivity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public readonly id!: string;

  @Column("text", { nullable: false })
  public title!: string;

  @Column("text", { nullable: false })
  public about!: number;

  public static async getByTitle(title: string): Promise<PhysicalActivity[] | null> {
    try {
      return await this.find({
        where: {
          title: Like(`%${title}%`),
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
