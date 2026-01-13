import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user-entity";
import { Repository } from "./repository-entity";

@Entity("followed_repositories")
export class FollowedRepository {
  @PrimaryGeneratedColumn()
  id: number;

  // korisnik koji prati repo
  @ManyToOne(() => User, user => user.followedRepositories, {
    onDelete: "CASCADE",
  })
  user: User;

  // repozitorijum koji se prati
  @ManyToOne(() => Repository, repo => repo.followers, {
    onDelete: "CASCADE",
  })
  repository: Repository;

  // kada je repo zapraćen
  @CreateDateColumn()
  followedAt: Date;
}
