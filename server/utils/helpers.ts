import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '../config/cloudinaryConfig';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const key = crypto.createHash('sha256').update(ENCRYPTION_KEY || 'someSuperSecretValue123'!).digest();
const iv = Buffer.alloc(16, 0);

interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  body: any;
}

export const failed = (res: Response, message: string | object = ''): Response<ApiResponse> => {
  const finalMessage =
    typeof message === 'object'
      ? (message as any).message || ''
      : message;

  return res.status(400).json({
    success: false,
    message: finalMessage,
    body: {},
  });
};

export const error = (res: Response, err: any): Response<ApiResponse> => {
  const code = typeof err === 'object' && err.code ? err.code : 403;
  const message = typeof err === 'object' ? err.message || '' : err;

  return res.status(code).json({
    success: false,
    message,
    body: {},
  });
};

export const success = (
  res: Response,
  message: string | object = '',
  data: any
): Response<ApiResponse> => {
  const finalMessage =
    typeof message === 'object'
      ? (message as any).message || ''
      : message;

  return res.status(200).json({
    success: true,
    message: finalMessage,
    body: data,
  });
};

export const encrypt = (email: string): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(email, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedEmail: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedEmail, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const fileUpload = async (file: any): Promise<any> => {
    if (!file) {
      return { error: 'No file uploaded' };
    }

    if (Array.isArray(file)) {
      const results = [];
      for (const singleFile of file) {
        const result = await fileUpload(singleFile);
        if ('error' in result) {
          return result;
        }
        results.push(result);
      }
      return results;
    }

    const uploadedFile = file as UploadedFile;
    if (!uploadedFile.mimetype || !uploadedFile.tempFilePath) {
      return { error: 'Invalid file structure' };
    }

    if (!uploadedFile.tempFilePath || uploadedFile.tempFilePath.trim() === '') {
      return { error: 'File path is empty or invalid' };
    }

    const mimeType = uploadedFile.mimetype;
    const fileType = mimeType.split("/")[0];

    const supportedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!supportedMimeTypes.includes(mimeType)) {
      return { error: "Unsupported file type. Only image, PDF, DOC, and DOCX are allowed." };
    }

    try {
    if (!fs.existsSync(uploadedFile.tempFilePath)) {
      return { error: 'Temporary file not found' };
    }
    const folderPath = getUploadFolder(mimeType);
    const originalName = path.parse(uploadedFile.name).name;

    const result: any = await cloudinary.uploader.upload(uploadedFile.tempFilePath, {
      resource_type: fileType === "image" ? "image" : "auto",
      folder: folderPath,
      public_id: originalName,
      use_filename: true,
      unique_filename: false,  
    });

    if('error' in result){
      return { error: result.error };
    }

    const responseData: any = {
      fileUrl: result.secure_url,
    };

    return responseData;
  } catch (error) {
    console.error('File upload error:', error);
    return { error: 'Failed to upload file to cloud storage' };
  }
};

const getUploadFolder = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) {
    return "uploads/images";
  } else if (mimeType === "application/pdf") {
    return "uploads/docs/pdf";
  } else if (mimeType === "application/msword" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mimeType === "application/vnd.ms-excel" || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return "uploads/docs/doc";
  } else {
    return "uploads/others";
  }
};

export const generateRandomNumbers = (length: number): string => {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
};

export const generateOtp = () => {
  const otp = generateRandomNumbers(6);
  const expiryTime = Date.now() + 1000 * 60 * 5; // 5 minutes
  return { otp, expiryTime };
}