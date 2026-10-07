import multer from "multer";
import path from "path";
import fs from "fs";

// Ensured uploads directory exists
const uploadDir = "uploads/pdf";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp-random.pdf
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `attachment-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 2. Strict PDF File Filter
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    // Reject non-PDF files
    cb(new Error("Invalid file type. Only PDF files are allowed!"), false);
  }
};

// 3. Export Multer Middleware
export const uploadPdf = multer({
  storage: storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});