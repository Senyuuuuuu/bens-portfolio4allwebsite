import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

async function uploadLatestVideo() {
  const latestFile = path.join(process.cwd(), "out", "OHMnibusLogoAnimation.mp4");
  
  if (!fs.existsSync(latestFile)) {
    console.error(`File not found: ${latestFile}`);
    process.exit(1);
  }

  console.log(`[JARVIS Drive Uploader] Target Video File: ${latestFile}`);
  console.log(`[JARVIS Drive Uploader] Size: ${(fs.statSync(latestFile).size / 1024).toFixed(1)} KB`);

  // Check authentication method
  const apiKey = process.env.GOOGLE_API_KEY;
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyFilePath && fs.existsSync(keyFilePath)) {
    console.log(`[JARVIS Drive Uploader] Authenticating with Service Account JSON Key...`);
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    const drive = google.drive({ version: "v3", auth });

    // Check / Create Folder "Automated Remotion Exports"
    let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const folderRes = await drive.files.list({
      q: "name='Automated Remotion Exports' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name)",
    });

    if (folderRes.data.files && folderRes.data.files.length > 0) {
      folderId = folderRes.data.files[0].id;
      console.log(`[JARVIS Drive Uploader] Found existing 'Automated Remotion Exports' folder (ID: ${folderId})`);
    } else {
      console.log(`[JARVIS Drive Uploader] Creating folder 'Automated Remotion Exports'...`);
      const createFolderRes = await drive.files.create({
        requestBody: {
          name: "Automated Remotion Exports",
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      folderId = createFolderRes.data.id;
      console.log(`[JARVIS Drive Uploader] Created folder ID: ${folderId}`);
    }

    console.log(`[JARVIS Drive Uploader] Uploading '${path.basename(latestFile)}'...`);
    const uploadRes = await drive.files.create({
      requestBody: {
        name: path.basename(latestFile),
        parents: [folderId],
      },
      media: {
        mimeType: "video/mp4",
        body: fs.createReadStream(latestFile),
      },
      fields: "id, name, webViewLink",
    });

    console.log(`[JARVIS Drive Uploader] Upload complete! File ID: ${uploadRes.data.id}`);
    console.log(`[JARVIS Drive Uploader] Google Drive Link: ${uploadRes.data.webViewLink}`);
  } else {
    console.log(`[JARVIS Drive Uploader] Using Google API Key authentication (${apiKey?.slice(0, 8)}...)...`);
    console.log(`[JARVIS Drive Uploader] Note: Google Drive API requires OAuth2 or Service Account JSON key for write permissions to create/upload files.`);
    console.log(`[JARVIS Drive Uploader] Please place your 'service-account-key.json' in the project folder to complete server-to-server file uploads.`);
  }
}

uploadLatestVideo().catch((err) => {
  console.error("[JARVIS Drive Uploader Error]", err.message);
});
