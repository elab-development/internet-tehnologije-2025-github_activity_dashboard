import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueUsername1705160002000 implements MigrationInterface {
  name = "AddUniqueUsername1705160002000";


  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD CONSTRAINT unique_username
      UNIQUE (username);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP CONSTRAINT unique_username;
    `);
  }
}
