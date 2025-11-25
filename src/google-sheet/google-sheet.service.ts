// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import { join } from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class GoogleSheetService {
//   private auth: any;

//   constructor() {
//     const serviceAccountPath = join(process.cwd(), 'src', 'config', 'service-account.json');

//     if (!fs.existsSync(serviceAccountPath)) {
//       throw new Error(`Service account file not found at: ${serviceAccountPath}`);
//     }

//     try {
//       this.auth = new google.auth.GoogleAuth({
//         keyFile: serviceAccountPath,
//         scopes: [
//           'https://www.googleapis.com/auth/spreadsheets',
//           'https://www.googleapis.com/auth/drive',
//           'https://www.googleapis.com/auth/drive.file'
//         ],
//       });
//     } catch (error) {
//       throw new Error(`Failed to initialize Google Auth: ${error.message}`);
//     }
//   }

//   async createSheet(title: string, folderId?: string, data?: any[][]): Promise<any> {
//     try {
//       const authClient = await this.auth.getClient();
//       const sheets = google.sheets({ version: 'v4', auth: authClient });
//       const drive = google.drive({ version: 'v3', auth: authClient });

//       const fileMetadata = {
//         name: 'My Sheet',
//         mimeType: 'application/vnd.google-apps.spreadsheet',
//         parents: [folderId], // folder đã chia sẻ
//       };
      
//       const file = await drive.files.create({
//         requestBody: fileMetadata,
//         fields: 'id',
//       });

//       return file

//       const resource = {
//         properties: { title },
//         // parentId: folderId,
//         parents: [folderId],
//       };

//       const sheet = await sheets.spreadsheets.create({ requestBody: resource });
//       const spreadsheetId = sheet.data.spreadsheetId;

//       if (!spreadsheetId) {
//         throw new Error('Failed to get spreadsheet ID');
//       }

//       if (data && data.length > 0) {
//         await sheets.spreadsheets.values.update({
//           spreadsheetId,
//           range: 'Sheet1!A1',
//           valueInputOption: 'RAW',
//           requestBody: { values: data },
//         });
//       }

//       if (folderId) {
//         const file = await drive.files.get({
//           fileId: spreadsheetId,
//           fields: 'parents',
//         });
        
//         const previousParents = file.data.parents?.join(',') || '';
        
//         await drive.files.update({
//           fileId: spreadsheetId,
//           addParents: folderId,
//           removeParents: previousParents,
//           fields: 'id, parents',
//         });
//       }

//       return {
//         spreadsheetId,
//       };
//     } catch (error) {
//       console.log(error);
//       throw error;
//       const errorDetails = error.response?.data?.error || {};
//       const errorMessage = errorDetails.message || error.message;
//       const errorCode = errorDetails.code || error.code;
      
//       if (errorCode === 403 && errorMessage?.includes('quota')) {
//         throw new Error('Google Drive storage quota has been exceeded. Please free up space or use a shared folder from another account.');
//       }
      
//       const fullError = `Failed to create sheet: ${errorMessage}${errorCode ? ` (Code: ${errorCode})` : ''}`;
//       throw new Error(fullError);
//     }
//   }

//   async shareSheet(spreadsheetId: string): Promise<void> {
//     try {
//       const authClient = await this.auth.getClient();
//       const drive = google.drive({ version: 'v3', auth: authClient });
//       await drive.permissions.create({
//         fileId: spreadsheetId,
//         requestBody: {
//           role: 'writer',
//           type: 'anyone',
//         },
//       });
//     } catch (error) {
//       const errorDetails = error.response?.data?.error || {};
//       const errorMessage = errorDetails.message || error.message;
//       throw new Error(`Failed to share sheet: ${errorMessage}`);
//     }
//   }

//   async createGoogleSheet(title: string, folderId?: string, data?: any[][]): Promise<{ spreadsheetId: string; url: string }> {
//     try {
//       const spreadsheet = await this.createSheet(title, folderId, data);
//       const spreadsheetId = spreadsheet.spreadsheetId;

//       await this.shareSheet(spreadsheetId);

//       const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

//       return {
//         spreadsheetId,
//         url,
//       };
//     } catch (error) {
//       throw new Error(`Failed to create Google Sheet: ${error.message}`);
//     }
//   }
// }

