import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { FollowedRepository } from "./followed-repository-entity";

@Entity("repositories")
export class Repository {
  @PrimaryGeneratedColumn()
  id: number;

  // ime repozitorijuma (npr. activity-dashboard)
  @Column()
  name: string;

  // owner na GitHubu (npr. elab-development)
  @Column()
  owner: string;

  // GitHub ID repozitorijuma (jedinstven)
  @Column({ unique: true })
  githubId: number;

  // svi korisnici koji prate ovaj repo
  @OneToMany(() => FollowedRepository, fr => fr.repository)
  followers: FollowedRepository[];
}
