import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Meals, HistoricData, PhysicalActivity, Reminders } from "./index";
import { verify } from "@/components/hash";

@Entity({ name: "Users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column("varchar", { length: 512, unique: true, nullable: false })
  public login!: string;

  @Column("text", { nullable: false })
  public password!: string;

  @Column("varchar", { length: 512, unique: true, nullable: false })
  public email!: string;

  @Column("timestamptz", { nullable: false })
  public registerDate!: Date;

  @Column("text", { nullable: true, default: "free" })
  public accountType?: "free" | "premium";

  @Column("boolean", { nullable: false, default: false })
  public isAdmin?: boolean;

  @Column("jsonb", {
    nullable: true,
    default: JSON.stringify({ why: "", inspiration: "", godzina: "" }),
  })
  public about?: string;

  @Column("jsonb", {
    nullable: true,
    default: JSON.stringify({ pas: 0, biodra: 0, udo: 0, biceps: 0, hours: "" }),
  })
  public parameters?: string;

  // Limit kaloryczny
  @Column("integer", { nullable: false, default: 0 })
  public limitCal!: number;
  // Limit węglowodanów
  @Column("integer", { nullable: false, default: 0 })
  public limitCarbo!: number;
  // Limit tłuszczy
  @Column("integer", { nullable: false, default: 0 })
  public limitFat!: number;
  // Limit białka
  @Column("integer", { nullable: false, default: 0 })
  public limitProtein!: number;
  // Zadanie dnia
  @Column("boolean", { nullable: false, default: false })
  public daily!: boolean;

  // Uzytkownik może zapisywać swoje posiłki
  @OneToMany((_) => Meals, (token) => token.user, { cascade: true, eager: true })
  public meals?: Meals[];

  @OneToMany((_) => HistoricData, (token) => token.user, { cascade: true, eager: true })
  public historicData?: HistoricData[];

  @OneToOne((type) => Reminders, (reminder) => reminder.user, { cascade: true, eager: true })
  @JoinColumn()
  public reminders!: Reminders;

  /**
   * Find user by id.
   * @param {string} id User id
   * @returns {(Promise<User | null>)} User or null if not found
   */
  public static async getById(id: string): Promise<User | null> {
    try {
      return await this.findOneOrFail(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getByLogin(login: string): Promise<User | null> {
    try {
      return await this.findOneOrFail({ where: { login }, loadRelationIds: true });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async getByToken(login: string): Promise<User | null> {
    try {
      return await this.findOneOrFail({ where: { login } });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async authenticate(login: string, password: string): Promise<User | false> {
    try {
      const user = await User.getByLogin(login);
      if (user) {
        if (await verify(user.password, password)) {
          return user;
        } else {
          return false;
        }
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public static async updateAbout(id: string, data: Record<string, any>): Promise<User | null> {
    try {
      const user = await User.findOneOrFail(id);
      await User.update(
        { id },
        {
          about: data.about || user.about,
          parameters: data.parameters || user.parameters,
        },
      );

      return await User.findOneOrFail(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async updateLimits(id: string, data: Record<string, any>): Promise<User | null> {
    try {
      const user = await User.findOneOrFail(id);
      await User.update(
        { id },
        {
          limitCal: data.limitCal || user.limitCal,
          limitCarbo: data.limitCarbo || user.limitCarbo,
          limitFat: data.limitFat || user.limitFat,
          limitProtein: data.limitProtein || user.limitProtein,
        },
      );

      return await User.findOneOrFail(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public static async updateDaily(id: string, daily: boolean): Promise<boolean> {
    try {
      await User.update({ id }, { daily });

      return (await User.findOneOrFail(id)).daily;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public static async upgradeToPremium(id: string): Promise<boolean> {
    try {
      await User.findOneOrFail(id);
      await User.update({ id }, { accountType: "premium" });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
