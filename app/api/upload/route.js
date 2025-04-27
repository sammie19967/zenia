// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

//import { authOptions } from "@/lib/auth";
import  cloudinary  from "@/lib/cloudinary";



export async function POST(request) {
  try {
    // Check authentication
   /* const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }*/

    // Handle file upload
    const formData = await request.formData();
    const file = formData.get("file") ;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const filename = `${Date.now()}_${file.name.replace(/\s/g, "-")}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "marketplace-ads",
          public_id: filename,
          transformation: [{ width: 1200, crop: "limit" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Return the URL of the uploaded image
    return NextResponse.json({
      url: (uploadResult).secure_url,
      public_id: (uploadResult).public_id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}