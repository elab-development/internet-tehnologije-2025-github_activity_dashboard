import { User } from "./user-entity";
import { UserSettings } from "./user-settings-entity";
import { Role } from "./role-entity";
import { Repository } from "./repository-entity";
import { FollowedRepository } from "./followed-repository-entity";

const appEntities = [
  User,
  UserSettings,
  Role,
  Repository,
  FollowedRepository,
];

export default appEntities;
