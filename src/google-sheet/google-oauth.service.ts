import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

interface TokenStore {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  scope: string;
  token_type: string;
}

@Injectable()
export class GoogleOAuthService {
  private oauth2Client: any;
  private tokenStore: Map<string, TokenStore> = new Map();

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI') || 
      `${this.configService.get<string>('APP_URL') || 'http://localhost:4003'}/google-sheet/oauth/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables');
    }

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  getAuthUrl(state?: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: state || 'default',
    });
  }

  async handleCallback(code: string, userId: string = 'default'): Promise<TokenStore> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      const tokenStore: TokenStore = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
        scope: tokens.scope || '',
        token_type: tokens.token_type || 'Bearer',
      };

      this.tokenStore.set(userId, tokenStore);
      return tokenStore;
    } catch (error) {
      throw new BadRequestException(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  async getAccessToken(userId: string = 'default'): Promise<string> {
    const tokens = this.tokenStore.get(userId);
    
    if (!tokens) {
      throw new UnauthorizedException('User not authenticated. Please complete OAuth flow first.');
    }

    if (this.isTokenExpired(tokens)) {
      if (!tokens.refresh_token) {
        throw new UnauthorizedException('Token expired and no refresh token available. Please re-authenticate.');
      }
      
      await this.refreshAccessToken(userId);
      return this.tokenStore.get(userId)!.access_token;
    }

    return tokens.access_token;
  }

  private isTokenExpired(tokens: TokenStore): boolean {
    return Date.now() >= tokens.expiry_date - 60000;
  }

  private async refreshAccessToken(userId: string): Promise<void> {
    const tokens = this.tokenStore.get(userId);
    if (!tokens || !tokens.refresh_token) {
      throw new UnauthorizedException('No refresh token available');
    }

    this.oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token,
    });

    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      const updatedTokens: TokenStore = {
        ...tokens,
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000,
      };

      this.tokenStore.set(userId, updatedTokens);
    } catch (error) {
      this.tokenStore.delete(userId);
      throw new UnauthorizedException(`Failed to refresh token: ${error.message}`);
    }
  }

  async createSheetWithUserAuth(
    userId: string,
    title: string,
    data?: any[][],
    folderId?: string,
  ): Promise<{ spreadsheetId: string; url: string }> {
    try {
      const accessToken = await this.getAccessToken(userId);
      
      this.oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      const resource = {
        properties: { title },
      };

      const sheet = await sheets.spreadsheets.create({ requestBody: resource });
      const spreadsheetId = sheet.data.spreadsheetId;

      if (!spreadsheetId) {
        throw new Error('Failed to get spreadsheet ID');
      }

      if (data && data.length > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1',
          valueInputOption: 'RAW',
          requestBody: { values: data },
        });
      }

      if (folderId) {
        const file = await drive.files.get({
          fileId: spreadsheetId,
          fields: 'parents',
        });
        
        const previousParents = file.data.parents?.join(',') || '';
        
        if (previousParents) {
          await drive.files.update({
            fileId: spreadsheetId,
            addParents: folderId,
            removeParents: previousParents,
            fields: 'id, parents',
          });
        } else {
          await drive.files.update({
            fileId: spreadsheetId,
            addParents: folderId,
            fields: 'id, parents',
          });
        }
      }

      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      return {
        spreadsheetId,
        url,
      };
    } catch (error) {
      const errorDetails = error.response?.data?.error || {};
      const errorMessage = errorDetails.message || error.message;
      const errorCode = errorDetails.code || error.code;
      
      if (errorCode === 401) {
        this.tokenStore.delete(userId);
        throw new UnauthorizedException('Authentication expired. Please re-authenticate.');
      }
      
      throw new BadRequestException(`Failed to create sheet: ${errorMessage}`);
    }
  }

  isAuthenticated(userId: string = 'default'): boolean {
    return this.tokenStore.has(userId);
  }

  revokeToken(userId: string = 'default'): void {
    this.tokenStore.delete(userId);
  }
}

