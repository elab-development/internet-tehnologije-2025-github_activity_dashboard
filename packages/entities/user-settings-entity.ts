import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user-entity";

@Entity("user_settings")
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme: string;

  @Column({ default: true })
  defaultActivityView: boolean;

  @OneToOne(() => User, user => user.settings)
  
  @JoinColumn()
  user: User;
}
