import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataTypeAndDbFieldToProcessedItems1760108188809 implements MigrationInterface {
    name = 'AddDataTypeAndDbFieldToProcessedItems1760108188809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP FOREIGN KEY \`FK_processed_items_image_processing_result\``);
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD \`dataType\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD \`dbField\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD CONSTRAINT \`FK_85e39d773a97c7f80c5d2457898\` FOREIGN KEY (\`imageProcessingResultId\`) REFERENCES \`image_processing_results\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP FOREIGN KEY \`FK_85e39d773a97c7f80c5d2457898\``);
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`image_processing_results\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP COLUMN \`dbField\``);
        await queryRunner.query(`ALTER TABLE \`processed_items\` DROP COLUMN \`dataType\``);
        await queryRunner.query(`ALTER TABLE \`processed_items\` ADD CONSTRAINT \`FK_processed_items_image_processing_result\` FOREIGN KEY (\`imageProcessingResultId\`) REFERENCES \`image_processing_results\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
