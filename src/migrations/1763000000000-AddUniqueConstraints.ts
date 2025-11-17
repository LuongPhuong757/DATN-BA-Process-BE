import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraints1763000000000 implements MigrationInterface {
  name = 'AddUniqueConstraints1763000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint for projects.name
    const projectsTable = await queryRunner.getTable('projects');
    if (projectsTable) {
      const nameIndex = projectsTable.indices.find(
        index => index.columnNames.includes('name') && index.isUnique
      );
      
      if (!nameIndex) {
        // Check if there are duplicate names before adding constraint
        const duplicates = await queryRunner.query(`
          SELECT name, COUNT(*) as count 
          FROM \`projects\` 
          GROUP BY name 
          HAVING count > 1
        `);
        
        if (duplicates.length > 0) {
          throw new Error(`Cannot add unique constraint: Found duplicate project names: ${duplicates.map(d => d.name).join(', ')}`);
        }

        await queryRunner.query(`
          ALTER TABLE \`projects\` 
          ADD UNIQUE INDEX \`IDX_projects_name\` (\`name\`)
        `);
      }
    }

    // Add unique constraint for screens (name, projectId)
    const screensTable = await queryRunner.getTable('screens');
    if (screensTable) {
      const nameProjectIdIndex = screensTable.indices.find(
        index => index.columnNames.includes('name') && 
                 index.columnNames.includes('projectId') && 
                 index.isUnique
      );
      
      if (!nameProjectIdIndex) {
        // Check if there are duplicate (name, projectId) before adding constraint
        const duplicates = await queryRunner.query(`
          SELECT name, projectId, COUNT(*) as count 
          FROM \`screens\` 
          GROUP BY name, projectId 
          HAVING count > 1
        `);
        
        if (duplicates.length > 0) {
          throw new Error(`Cannot add unique constraint: Found duplicate screen names within projects`);
        }

        await queryRunner.query(`
          ALTER TABLE \`screens\` 
          ADD UNIQUE INDEX \`IDX_screens_name_projectId\` (\`name\`, \`projectId\`)
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove unique constraint from screens
    const screensTable = await queryRunner.getTable('screens');
    if (screensTable) {
      const nameProjectIdIndex = screensTable.indices.find(
        index => index.columnNames.includes('name') && 
                 index.columnNames.includes('projectId') && 
                 index.isUnique
      );
      
      if (nameProjectIdIndex) {
        await queryRunner.query(`
          ALTER TABLE \`screens\` 
          DROP INDEX \`IDX_screens_name_projectId\`
        `);
      }
    }

    // Remove unique constraint from projects
    const projectsTable = await queryRunner.getTable('projects');
    if (projectsTable) {
      const nameIndex = projectsTable.indices.find(
        index => index.columnNames.includes('name') && index.isUnique
      );
      
      if (nameIndex) {
        await queryRunner.query(`
          ALTER TABLE \`projects\` 
          DROP INDEX \`IDX_projects_name\`
        `);
      }
    }
  }
}

