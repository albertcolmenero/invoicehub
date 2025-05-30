import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'auto',
        folder: 'invoice-logos',
      }, (error: any, result?: CloudinaryUploadResult) => {
        if (error || !result) {
          reject(error || new Error('No result from Cloudinary'));
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.log('[UPLOAD_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 