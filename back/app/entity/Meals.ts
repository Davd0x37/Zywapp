import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  In,
  Like,
  MoreThan,
} from "typeorm";
import { User, HistoricData } from "./index";

// Tab - Jedzenie
@Entity({ name: "Meals" })
export class Meals extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public readonly id!: string;

  @Column("text", { nullable: false })
  public name!: number;

  @Column("integer", { nullable: false })
  public calories!: number;

  @Column("jsonb", { nullable: false })
  public composition!: string;

  @ManyToOne((_) => User, (user) => user.meals, { nullable: true })
  @JoinColumn()
  public user!: User;

  @OneToMany((_) => HistoricData, (hd) => hd.meals, { nullable: true })
  public historicData!: HistoricData;

  public static async getByUserId(
    id: string,
    { title, date }: { title?: string; date?: string },
  ): Promise<Meals[] | null> {
    try {
      return await this.find({
        where: {
          user: {
            id,
          },
          ...(date ? { date: MoreThan(date) } : ""),
          ...(title ? { name: Like(`%${title}%`) } : ""),
        },
        relations: ["user"],
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getByMealsId(id: string, title?: string): Promise<Meals | null> {
    try {
      return await this.findOneOrFail({
        where: {
          id,
          ...(title ? { name: Like(`%${title}%`) } : ""),
        },
        relations: ["user", "historicData"],
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async addMeal(id: string, data: Record<string, any>): Promise<string | false> {
    try {
      const user = await User.findOneOrFail(id);
      const meal = await this.create({
        user,
        name: data.name,
        calories: data.calories,
        composition: data.composition,
      }).save();

      return meal.id;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public static async removeMeal(id: string): Promise<boolean> {
    try {
      const meal = await this.findOneOrFail(id);
      const remove = await meal.remove();
      await remove.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
