import { Controller, Post, Get, Query, Body, BadRequestException, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
// import { GoogleSheetService } from './google-sheet.service';
import { GoogleOAuthService } from './google-oauth.service';

@ApiTags('google-sheet')
@Controller('google-sheet')
export class GoogleSheetController {
  constructor(
    // private readonly googleSheetService: GoogleSheetService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Google Sheet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the Google Sheet',
        },
        folderId: {
          type: 'string',
          description: 'Optional: Google Drive folder ID to create sheet in',
        },
        data: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          description: 'Optional: 2D array of data to write to the sheet',
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Google Sheet created successfully',
    schema: {
      type: 'object',
      properties: {
        spreadsheetId: { type: 'string' },
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Title is required' })
  @ApiResponse({ status: 403, description: 'Google Drive storage quota exceeded' })
  async createSheet(@Body() body: { title: string; folderId?: string; data?: any[][] }) {
    if (!body.title || body.title.trim() === '') {
      throw new BadRequestException('Title is required');
    }
    // https://drive.google.com/drive/folders/1N3YAbRu2jo0Nw_NChgYr02TglcHd-Hti?usp=sharing
    // https://docs.google.com/spreadsheets/d/1pitIPT6C4S1LOuSMMlhmCKT9mLUEJD1Wv01K7CnLt6I/edit?usp=sharing
    // https://drive.google.com/drive/folders/1N3YAbRu2jo0Nw_NChgYr02TglcHd-Hti?usp=sharing
    const folderId = body.folderId || '1N3YAbRu2jo0Nw_NChgYr02TglcHd-Hti';
    console.log(folderId);
    try {
      // const result = await this.googleSheetService.createGoogleSheet(body.title, folderId, body.data);
      // return result;
      return {
        message: 'Google Sheet created successfully',
        folderId,
      };
    } catch (error) {
      if (error.message?.includes('quota')) {
        throw new BadRequestException({
          message: error.message,
          error: 'Storage Quota Exceeded',
          statusCode: 403,
        });
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('/oauth/auth')
  @ApiOperation({ summary: 'Initiate Google OAuth2 authentication flow' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID for token storage' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth consent screen' })
  async initiateAuth(@Query('userId') userId: string, @Res() res: Response) {
    const authUrl = this.googleOAuthService.getAuthUrl(userId);
    return res.redirect(authUrl);
  }

  @Get('oauth/callback')
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiQuery({ name: 'code', required: true, description: 'Authorization code from Google' })
  @ApiQuery({ name: 'state', required: false, description: 'State parameter' })
  @ApiQuery({ name: 'error', required: false, description: 'Error from Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with success/error status' })
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const successPath = this.configService.get<string>('OAUTH_SUCCESS_PATH') || '/oauth/success';
    const errorPath = this.configService.get<string>('OAUTH_ERROR_PATH') || '/oauth/error';

    if (error) {
      const redirectUrl = `${frontendUrl}${errorPath}?error=${encodeURIComponent(error)}&message=${encodeURIComponent('OAuth authentication failed')}`;
      return res.redirect(redirectUrl);
    }

    if (!code) {
      const redirectUrl = `${frontendUrl}${errorPath}?error=no_code&message=${encodeURIComponent('Authorization code is required')}`;
      return res.redirect(redirectUrl);
    }

    try {
      const userId = state || 'default';
      await this.googleOAuthService.handleCallback(code, userId);
      
      const redirectUrl = `${frontendUrl}${successPath}?success=true&userId=${encodeURIComponent(userId)}&message=${encodeURIComponent('Authentication successful')}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      const redirectUrl = `${frontendUrl}${errorPath}?error=auth_failed&message=${encodeURIComponent(error.message || 'Failed to authenticate')}`;
      return res.redirect(redirectUrl);
    }
  }

  @Post('oauth/create')
  @ApiOperation({ summary: 'Create a Google Sheet using OAuth2 user authentication' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the Google Sheet',
        },
        userId: {
          type: 'string',
          description: 'User ID (default: "default")',
        },
        folderId: {
          type: 'string',
          description: 'Optional: Google Drive folder ID to create sheet in',
        },
        data: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          description: 'Optional: 2D array of data to write to the sheet',
        },
      },
      required: ['title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Google Sheet created successfully',
    schema: {
      type: 'object',
      properties: {
        spreadsheetId: { type: 'string' },
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  async createSheetWithOAuth(
    @Body() body: { title: string; userId?: string; folderId?: string; data?: any[][] },
  ) {
    if (!body.title || body.title.trim() === '') {
      throw new BadRequestException('Title is required');
    }

    const userId = body.userId || 'default';

    if (!this.googleOAuthService.isAuthenticated(userId)) {
      throw new BadRequestException(
        'User not authenticated. Please visit /google-sheet/oauth/auth first.',
      );
    }

    try {
      const result = await this.googleOAuthService.createSheetWithUserAuth(
        userId,
        body.title,
        body.data,
        body.folderId,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('oauth/status')
  @ApiOperation({ summary: 'Check OAuth authentication status' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID to check' })
  @ApiResponse({ status: 200, description: 'Authentication status' })
  async getAuthStatus(@Query('userId') userId: string) {
    const checkUserId = userId || 'default';
    return {
      authenticated: this.googleOAuthService.isAuthenticated(checkUserId),
      userId: checkUserId,
    };
  }

  @Post('oauth/revoke')
  @ApiOperation({ summary: 'Revoke OAuth tokens' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User ID to revoke (default: "default")',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tokens revoked successfully' })
  async revokeTokens(@Body() body: { userId?: string }) {
    const userId = body.userId || 'default';
    this.googleOAuthService.revokeToken(userId);
    return {
      message: 'Tokens revoked successfully',
      userId,
    };
  }
}

