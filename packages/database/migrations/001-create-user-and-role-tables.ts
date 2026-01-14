import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndRoleTables1705160000000 implements MigrationInterface {
  name = "CreateUserAndRoleTables1705160000000";


  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        role_id INT,
        CONSTRAINT fk_user_role
          FOREIGN KEY (role_id)
          REFERENCES roles(id)
          ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TABLE roles`);
  }
}
