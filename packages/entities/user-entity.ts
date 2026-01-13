import "reflect-metadata";
import { OneToMany } from "typeorm";
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

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserSettings, settings => settings.user)
  settings: UserSettings;
  
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @OneToMany(() => FollowedRepository, fr => fr.user)
  followedRepositories: FollowedRepository[];


}


/*import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}*/

