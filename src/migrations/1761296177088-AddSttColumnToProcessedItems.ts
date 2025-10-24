import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSttColumnToProcessedItems1761296177088 implements MigrationInterface {
    name = 'AddSttColumnToProcessedItems1761296177088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD \`stt\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP COLUMN \`stt\``);
    }

}
