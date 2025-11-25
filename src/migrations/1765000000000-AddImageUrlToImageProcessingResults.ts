import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageUrlToImageProcessingResults1765000000000 implements MigrationInterface {
    name = 'AddImageUrlToImageProcessingResults1765000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` ADD \`imageUrl\` varchar(500) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` DROP COLUMN \`imageUrl\``);
    }
}

