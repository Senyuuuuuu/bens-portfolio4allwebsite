import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { logger } from './logger.service';

const DRIVE_ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER || 'AI Content Factory';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: string;
}

export class GoogleDriveService {
  private oauth2Client: OAuth2Client;
  private drive: ReturnType<typeof google.drive>;
  private folderCache: Map<string, string> = new Map();

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    // Load saved tokens if available
    const tokenPath = path.join(process.cwd(), '.tokens', 'google-drive.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      this.oauth2Client.setCredentials(tokens);
    }

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
  }

  async saveTokens(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const tokenDir = path.join(process.cwd(), '.tokens');
    fs.mkdirSync(tokenDir, { recursive: true });
    fs.writeFileSync(path.join(tokenDir, 'google-drive.json'), JSON.stringify(tokens));
    logger.info('✅ Google Drive tokens saved');
  }

  async ensureFolder(folderPath: string): Promise<string> {
    if (this.folderCache.has(folderPath)) {
      return this.folderCache.get(folderPath)!;
    }

    const parts = folderPath.split('/').filter(Boolean);
    let parentId = 'root';

    for (const part of parts) {
      const cacheKey = `${parentId}/${part}`;
      if (this.folderCache.has(cacheKey)) {
        parentId = this.folderCache.get(cacheKey)!;
        continue;
      }

      // Check if folder exists
      const { data } = await this.drive.files.list({
        q: `name='${part}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id,name)',
      });

      if (data.files && data.files.length > 0 && data.files[0].id) {
        parentId = data.files[0].id;
      } else {
        // Create folder
        const { data: folder } = await this.drive.files.create({
          requestBody: {
            name: part,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
          },
          fields: 'id',
        });
        parentId = folder.id!;
      }

      this.folderCache.set(cacheKey, parentId);
    }

    this.folderCache.set(folderPath, parentId);
    return parentId;
  }

  async uploadFile(localPath: string, name: string, drivePath?: string): Promise<DriveFile> {
    if (!fs.existsSync(localPath)) throw new Error(`File not found: ${localPath}`);

    const fullDrivePath = drivePath
      ? `${DRIVE_ROOT}/${drivePath}`
      : `${DRIVE_ROOT}/Uploaded`;

    const folderId = await this.ensureFolder(fullDrivePath);
    const mimeType = this.getMimeType(localPath);

    logger.info(`📤 Uploading ${path.basename(localPath)} to Drive/${fullDrivePath}`);

    const { data } = await this.drive.files.create({
      requestBody: {
        name,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: fs.createReadStream(localPath),
      },
      fields: 'id,name,mimeType,webViewLink,size',
    });

    // Make publicly viewable
    await this.drive.permissions.create({
      fileId: data.id!,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
      id: data.id!,
      name: data.name!,
      mimeType: data.mimeType!,
      webViewLink: data.webViewLink || undefined,
      size: data.size || undefined,
    };
  }

  async listFiles(drivePath: string): Promise<DriveFile[]> {
    const folderId = await this.ensureFolder(`${DRIVE_ROOT}/${drivePath}`);
    const { data } = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,webViewLink,size)',
    });
    return (data.files || []) as DriveFile[];
  }

  async setupFolderStructure(): Promise<void> {
    const folders = [
      'Raw Videos/Downloaded',
      'Transcripts',
      'Clips/Edited',
      'Captions',
      'Thumbnails',
      'Published',
      'Archive',
      'Failed',
    ];

    for (const folder of folders) {
      await this.ensureFolder(`${DRIVE_ROOT}/${folder}`);
      logger.info(`📁 Ensured Drive folder: ${DRIVE_ROOT}/${folder}`);
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
      '.mp3': 'audio/mpeg',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.srt': 'text/plain',
      '.vtt': 'text/vtt',
      '.json': 'application/json',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
