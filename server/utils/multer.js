import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";
import path from "path";

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "tiff",
];
const videoExtensions = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "wmv",
  "flv",
  "3gp",
];
const docExtensions = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "txt",
  "rtf",
];
const codeExtensions = [
  "js",
  "py",
  "java",
  "cpp",
  "html",
  "css",
  "json",
  "xml",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1); // Remove the dot
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    // Generate unique filename
    const uniqueName = `${Date.now()}_${baseName}`;

    // Images - can be displayed directly
    if (imageExtensions.includes(ext)) {
      return {
        folder: "talentro/jobs/images",
        resource_type: "image",
        public_id: uniqueName,
        format: ext === "svg" ? "svg" : ext, // SVGs need special handling
      };
    }

    // Special handling for PDFs to allow viewing in browser
    if (ext === "pdf") {
      return {
        folder: "talentro/jobs/documents",
        resource_type: "image",
        public_id: uniqueName,
        format: "pdf",
      };
    }

    // Videos - can be streamed
    if (videoExtensions.includes(ext)) {
      return {
        folder: "talentro/jobs/videos",
        resource_type: "video",
        public_id: uniqueName,
        format: ext,
      };
    }

    // Documents (excluding PDF), code files, and everything else - use raw
    return {
      folder: "talentro/jobs/documents",
      resource_type: "raw",
      public_id: uniqueName,
      format: ext,
      // This is crucial for downloads
      flags: "attachment",
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

export default upload;
