import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlSheetToImageProcessingResults1766000000000 implements MigrationInterface {
    name = 'AddUrlSheetToImageProcessingResults1766000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` ADD \`urlSheet\` varchar(1000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` DROP COLUMN \`urlSheet\``);
    }
}

