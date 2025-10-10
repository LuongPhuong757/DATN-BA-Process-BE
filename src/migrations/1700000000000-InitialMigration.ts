import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create image_processing_results table
    await queryRunner.query(`
      CREATE TABLE \`image_processing_results\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`body\` text NOT NULL,
        \`source\` varchar(100) NOT NULL,
        \`timestamp\` timestamp NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create processed_items table
    await queryRunner.query(`
      CREATE TABLE \`processed_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`itemId\` int NOT NULL,
        \`content\` text NOT NULL,
        \`type\` varchar(50) NOT NULL,
        \`database\` varchar(100) NOT NULL,
        \`description\` text NOT NULL,
        \`imageProcessingResultId\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE \`processed_items\` 
      ADD CONSTRAINT \`FK_processed_items_image_processing_result\` 
      FOREIGN KEY (\`imageProcessingResultId\`) 
      REFERENCES \`image_processing_results\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE \`processed_items\` 
      DROP FOREIGN KEY \`FK_processed_items_image_processing_result\`
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE \`processed_items\``);
    await queryRunner.query(`DROP TABLE \`image_processing_results\``);
  }
}
