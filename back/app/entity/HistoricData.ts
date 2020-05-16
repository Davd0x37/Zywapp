import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Like,
  Equal,
  MoreThanOrEqual,
  MoreThan,
} from "typeorm";
import { User, Meals } from "./index";

// Tab - Progres - dane historyczne
@Entity({ name: "HistoricData" })
export class HistoricData extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public readonly id!: string;

  @Column("timestamptz", { nullable: false })
  public date!: Date;

  @ManyToOne((_) => User, (user) => user.historicData, { nullable: true })
  public user!: User;

  @ManyToOne((_) => Meals, (meals) => meals.historicData, { nullable: true })
  public meals!: Meals;

  public static async getByUserId(
    id: string,
    { title, date }: { title?: string; date?: string },
  ): Promise<HistoricData[] | null> {
    try {
      return await this.find({
        where: {
          user: {
            id,
          },
          // ...(date ? { date: MoreThanOrEqual(date) } : ""),
          ...(title ? { name: Like(`%${title}%`) } : ""),
        },
        relations: ["meals", "user"],
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getByUserIdDate(
    id: string,
    { title, date }: { title?: string; date?: string },
  ): Promise<HistoricData[] | null> {
    try {
      const req = await this.createQueryBuilder("hd")
        .leftJoinAndSelect("hd.user", "user")
        .where("CAST(hd.date as DATE) = :dat", { dat: date })
        .andWhere("user.id = :id", { id })
        .execute();

      return req;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getByMealsId(id: string): Promise<HistoricData[] | null> {
    try {
      return await this.find({
        where: {
          meals: {
            id,
          },
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getMealsByHistoricDate(id: string, date: string): Promise<HistoricData[] | null> {
    try {
      return await this.find({
        where: {
          meals: {
            id,
          },
          date: MoreThan(date),
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async addData(mealId: string, userId: string, date: string): Promise<boolean> {
    try {
      const meal = await Meals.findOneOrFail(mealId);
      const user = await User.findOneOrFail(userId);
      if (meal && user) {
        await this.create({
          date,
          meals: {
            id: meal.id,
          },
          user: {
            id: user.id,
          },
        }).save();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public static async removeData(mealId: string, userId: string): Promise<boolean> {
    try {
      const data = await this.findOne({
        where: {
          meals: {
            id: mealId,
          },
          user: {
            id: userId,
          },
        },
      });
      if (data) {
        await data.remove();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
