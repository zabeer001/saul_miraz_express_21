import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Support __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define destination folder
const destinationPath = path.join(__dirname, '../uploads');

// Create uploads folder if not exists
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}

export function uploadImageInLocal(file) {
  try {
    if (!file) return null;

    const originalName = file.originalname.replace(/\s+/g, '_');
    const uniqueName = Date.now() + '_' + originalName;
    const fullPath = path.join(destinationPath, uniqueName);

    // Move file from temp to uploads/
    fs.renameSync(file.path, fullPath);

    // Return the relative path (like Laravel)
    return 'uploads/' + uniqueName;
  } catch (error) {
    console.error('Image upload failed:', error.message);
    return null;
  }
}
