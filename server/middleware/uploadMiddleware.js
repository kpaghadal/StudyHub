import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// 1. Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Allowed file types
const ALLOWED_MIME_TYPES = [
  'application/pdf', // pdf
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'image/jpeg', // jpg/jpeg
  'image/png', // png
  'application/zip', // zip
  'application/x-zip-compressed' // zip fallback
];

// 3. Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${basename}${ext}`);
  }
});

// 4. File Filter Validation
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Return error to multer
    cb(new Error(`Unsupported file type: ${file.originalname}. Only PDF, DOC, DOCX, JPG, PNG, and ZIP are allowed.`), false);
  }
};

// 5. Configurable Limits
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 5 * 1024 * 1024; // 5MB default

// 6. Multer Instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});
