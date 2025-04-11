import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Create uploads folder if not exists
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Convert the Next.js Web Request into a Node.js IncomingMessage-like stream
async function convertRequestToNodeRequest(req) {
  const body = req.body;
  const headers = Object.fromEntries(req.headers.entries());
  
  const stream = Readable.fromWeb(body);
  
  // Create a fake Node.js IncomingMessage
  const fakeReq = Object.assign(stream, {
    headers,
    method: req.method,
    url: req.url,
  });
  
  return fakeReq;
}

export async function POST(req) {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  createUploadDir(uploadDir);
  
  const form = formidable({
    multiples: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB per file, not cumulative
    maxTotalFileSize: 25 * 1024 * 1024, // 25MB total (assuming max 5 files at 5MB each)
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      return `${Date.now()}-${part.originalFilename.replace(/\s/g, "_")}`;
    },
  });
  
  const nodeReq = await convertRequestToNodeRequest(req);
  
  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) {
        console.error("Upload error:", err);
        return resolve(NextResponse.json({ 
          error: "Upload failed: " + err.message 
        }, { status: 500 }));
      }
      
      // Handle case when no files were uploaded
      if (!files.images) {
        return resolve(NextResponse.json({ urls: [] }, { status: 200 }));
      }
      
      const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images];
      const urls = uploadedFiles.map((file) => `/uploads/${path.basename(file.filepath)}`);
      
      return resolve(NextResponse.json({ urls }, { status: 200 }));
    });
  });
}