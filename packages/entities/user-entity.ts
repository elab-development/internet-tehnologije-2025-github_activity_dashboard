import "reflect-metadata";
import { JoinColumn, OneToMany } from "typeorm";
import { FollowedRepository } from "./followed-repository-entity";
import { Role } from "./role-entity";
import { UserSettings } from "./user-settings-entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserSettings, settings => settings.user)
  settings: UserSettings;
  
 @CreateDateColumn({ name: "created_at" })
createdAt: Date;

@ManyToOne(() => Role, role => role.users)
@JoinColumn({ name: "role_id" })
role: Role;


  @OneToMany(() => FollowedRepository, fr => fr.user)
  followedRepositories: FollowedRepository[];


}




