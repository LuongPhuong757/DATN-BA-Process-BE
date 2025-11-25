import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIoAndRequiredToProcessedItems1764000000000 implements MigrationInterface {
    name = 'AddIoAndRequiredToProcessedItems1764000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD \`io\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD \`required\` tinyint(1) NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP COLUMN \`required\``);
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP COLUMN \`io\``);
    }
}

