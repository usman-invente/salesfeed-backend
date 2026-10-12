import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Factory function to create a unified multer upload middleware.
 * @param {string} uploadSubDir - Subdirectory under 'uploads/' where files should go (e.g., 'pdfs', 'images')
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types (e.g., ['application/pdf', 'image/png'])
 * @param {number} maxFileSize - Maximum file size in bytes
 */
export const createUnifiedUpload = (uploadSubDir, allowedMimeTypes, maxFileSize) => {
  const uploadDir = path.join(process.cwd(), "uploads", uploadSubDir);

  // 1. Dynamic Storage Configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure directory exists at the moment of upload
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `attachment-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types are: ${allowedMimeTypes.join(", ")}`), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxFileSize }
  });
};