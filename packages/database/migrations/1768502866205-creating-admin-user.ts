import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcrypt";


export class CreatingAdminUser1768502866205 implements MigrationInterface{
  name = "SeedRolesAndAdmin1705160003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (name)
      VALUES ('admin'), ('user'), ('guest')
      ON CONFLICT (name) DO NOTHING;
    `);

    const adminRole = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'admin'
    `);

    const adminRoleId = adminRole[0]?.id;
    if (!adminRoleId) {
      throw new Error("Admin role not found");
    }

    
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    
    await queryRunner.query(
      `
      INSERT INTO users (email, username, password, role_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING;
    `,
      [
        "admin@admin.com",
        "admin",
        hashedPassword,
        adminRoleId,
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'admin@admin.com'
    `);

    await queryRunner.query(`
      DELETE FROM roles WHERE name IN ('admin', 'user', 'guest')
    `);
  }
}
