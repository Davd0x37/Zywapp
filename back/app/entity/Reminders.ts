import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./index";

@Entity({ name: "Reminders" })
export class Reminders extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  public readonly id!: string;

  // Powiadomienie o spożywaniu płynów
  @Column({ type: "boolean", nullable: false, default: false })
  public fluids!: boolean;

  // Powiadomienie o przyjmowaniu makro/mikro składników
  @Column({ type: "boolean", nullable: false, default: false })
  public microIngredients!: boolean;

  // O określonych godzinach
  @Column({ type: "boolean", nullable: false, default: false })
  public hours!: boolean;

  // O codziennych wyzwaniach
  @Column({ type: "boolean", nullable: false, default: false })
  public challenges!: boolean;

  // O ćwiczeniach
  @Column({ type: "boolean", nullable: false, default: false })
  public exercises!: boolean;

  @OneToOne((_) => User, (user) => user.reminders)
  public user!: User;

  public static async updateReminders(id: string, update: Record<string, boolean>): Promise<boolean> {
    try {
      const reminderRepo = this.getRepository().manager;
      const userRepo = this.getRepository<User>().manager;

      const user = await User.getById(id);
      if (user) {
        // @ts-ignore
        let reminder = await Reminders.findOne(user.remindersId);
        reminder = new Reminders();
        reminder.fluids = update.fluids ?? false;
        reminder.microIngredients = update.microIngredients ?? false;
        reminder.hours = update.hours ?? false;
        reminder.challenges = update.challenges ?? false;
        reminder.exercises = update.exercises ?? false;
        // reminder.user = user;

        reminderRepo.save(reminder);
        user.reminders = reminder;
        userRepo.save(user);

        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
