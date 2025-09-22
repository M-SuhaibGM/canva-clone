// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { uploadMediaToCloudinary } from '@/lib/cloudinary.js';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        // Get the form data
        const formData = await request.formData();
        const file = formData.get('file');

        // Check if file exists
        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file found" },
                { status: 400 }
            );
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: "File too large" },
                { status: 400 }
            );
        }

        // Authentication - replace with your actual auth method
        // For example, using NextAuth.js:
        // const session = await getServerSession(authOptions);
        // if (!session?.user) { return unauthorized response }
        const userId = session.user.id;

        // Convert file to buffer for Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileWithBuffer = {
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
            buffer,
        };

        // Upload to Cloudinary
        const cloudinaryResult = await uploadMediaToCloudinary(fileWithBuffer);

        // Save to database
        const newlyCreatedMedia = await db.mediaSchema.create({
            data: {
                userId,
                name: file.name,
                cloudinaryId: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
                mimeType: file.type,
                size: file.size,
                width: 0, // Add actual dimensions if needed
                height: 0, // Add actual dimensions if needed
            },
        });

        return NextResponse.json(
            { success: true, data: newlyCreatedMedia },
            { status: 201 }
        );

    } catch (error) {
        console.error('Upload error:', error);

        // Handle specific errors
        if (error.message.includes('File')) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Error uploading file" },
            { status: 500 }
        );
    }
}