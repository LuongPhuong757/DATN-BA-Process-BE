import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDatabaseNullableInProcessedItems1767000000000 implements MigrationInterface {
    name = 'MakeDatabaseNullableInProcessedItems1767000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` MODIFY \`database\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` MODIFY \`database\` varchar(100) NOT NULL`);
    }
}

