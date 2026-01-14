import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUser1705160001000 implements MigrationInterface {
  name = "AddUsernameToUser1705160001000";



  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN username VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN username;
    `);
  }
}
