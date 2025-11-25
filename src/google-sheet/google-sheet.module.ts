import { Module } from '@nestjs/common';
// import { GoogleSheetService } from './google-sheet.service';
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleSheetController } from './google-sheet.controller';

@Module({
  controllers: [GoogleSheetController],
  providers: [ GoogleOAuthService],
  exports: [ GoogleOAuthService],
})
export class GoogleSheetModule {}

