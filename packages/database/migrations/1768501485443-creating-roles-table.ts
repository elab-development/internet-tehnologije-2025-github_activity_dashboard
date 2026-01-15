import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingRolesTable1768501485443 implements MigrationInterface {
  name = "SeedRoles1705160004000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (name)
      VALUES ('admin'), ('user'), ('guest')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM roles
      WHERE name IN ('admin', 'user', 'guest');
    `);
  }
}

