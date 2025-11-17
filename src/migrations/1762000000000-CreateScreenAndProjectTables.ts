import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScreenAndProjectTables1762000000000 implements MigrationInterface {
  name = 'CreateScreenAndProjectTables1762000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if projects table exists, if not create it
    const projectsTable = await queryRunner.getTable('projects');
    if (!projectsTable) {
      await queryRunner.query(`
        CREATE TABLE \`projects\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`description\` text NULL,
          \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
    }

    // Check if screens table exists, if not create it
    const screensTable = await queryRunner.getTable('screens');
    if (!screensTable) {
      await queryRunner.query(`
        CREATE TABLE \`screens\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(255) NOT NULL,
          \`description\` text NULL,
          \`projectId\` int NOT NULL,
          \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`),
          KEY \`IDX_screens_projectId\` (\`projectId\`)
        ) ENGINE=InnoDB
      `);
    }

    // Check if screenId column exists in image_processing_results, if not add it
    const imageProcessingTable = await queryRunner.getTable('image_processing_results');
    if (imageProcessingTable) {
      const screenIdColumn = imageProcessingTable.findColumnByName('screenId');
      if (!screenIdColumn) {
        await queryRunner.query(`
          ALTER TABLE \`image_processing_results\` 
          ADD \`screenId\` int NOT NULL
        `);
      }

      // Check if index exists, if not add it
      const screenIdIndex = imageProcessingTable.indices.find(
        index => index.columnNames.includes('screenId')
      );
      if (!screenIdIndex) {
        await queryRunner.query(`
          ALTER TABLE \`image_processing_results\` 
          ADD INDEX \`IDX_image_processing_results_screenId\` (\`screenId\`)
        `);
      }

      // Remove old projectId column if it exists
      const projectIdColumn = imageProcessingTable.findColumnByName('projectId');
      if (projectIdColumn) {
        // First try to drop foreign key if exists
        try {
          const foreignKeys = imageProcessingTable.foreignKeys.filter(
            fk => fk.columnNames.includes('projectId')
          );
          for (const fk of foreignKeys) {
            await queryRunner.query(`
              ALTER TABLE \`image_processing_results\` 
              DROP FOREIGN KEY \`${fk.name}\`
            `);
          }
        } catch (error) {
          // Foreign key might not exist, ignore error
        }

        await queryRunner.query(`
          ALTER TABLE \`image_processing_results\` 
          DROP COLUMN \`projectId\`
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove index and screenId column from image_processing_results
    await queryRunner.query(`
      ALTER TABLE \`image_processing_results\` 
      DROP INDEX IF EXISTS \`IDX_image_processing_results_screenId\`
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`image_processing_results\` 
      DROP COLUMN IF EXISTS \`screenId\`
    `);

    // Drop screens table
    await queryRunner.query(`DROP TABLE IF EXISTS \`screens\``);

    // Drop projects table
    await queryRunner.query(`DROP TABLE IF EXISTS \`projects\``);
  }
}

