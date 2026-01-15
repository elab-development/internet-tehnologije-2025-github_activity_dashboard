import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCreatedAt1768499228636 implements MigrationInterface{
  name = "AddUserTimestamps1705160003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN created_at TIMESTAMP DEFAULT now(),
      ADD COLUMN updated_at TIMESTAMP DEFAULT now();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN created_at,
      DROP COLUMN updated_at;
    `);
  }
} 
