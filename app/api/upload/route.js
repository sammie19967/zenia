// app/api/upload/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = new IncomingForm();
  form.multiples = true; // Allow multiple uploads

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const allFiles = Array.isArray(data.files.file) ? data.files.file : [data.files.file];

  const uploadPromises = allFiles.map(async (file) => {
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: 'uploads', // Optional: where to store inside Cloudinary
      resource_type: 'auto', // auto detects if it's image or video
    });

    return upload.secure_url;
  });

  const uploadedUrls = await Promise.all(uploadPromises);

  return NextResponse.json({ urls: uploadedUrls });
}
