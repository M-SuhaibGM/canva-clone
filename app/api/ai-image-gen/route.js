// app/api/ai-image-gen/route.js
import { NextResponse } from 'next/server';
import { uploadMediaToCloudinary } from '@/lib/cloudinary.js';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request
    const { prompt } = await request.json();
    const userId = session.user.id;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log('Generating image for:', prompt.substring(0, 50));

    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    
    if (!STABILITY_API_KEY) {
      console.error('❌ STABILITY_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          success: false, 
          message: "Service configuration error. Please try again later." 
        },
        { status: 500 }
      );
    }

    // Try SD3 first, fallback to SDXL if needed
    let imageBuffer;
    let modelUsed = 'sd3';
    
    try {
      // Attempt SD3
      console.log('Trying SD3 model...');
      const response = await fetch(
        'https://api.stability.ai/v2beta/stable-image/generate/sd3',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STABILITY_API_KEY}`,
            'Accept': 'image/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            output_format: 'png',
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('SD3 failed, trying SDXL...');
        throw new Error(`SD3 failed: ${response.status}`);
      }

      const imageArrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(imageArrayBuffer);
      
    } catch (sd3Error) {
      console.log('SD3 failed, falling back to SDXL...');
      
      // Fallback to SDXL
      try {
        const response = await fetch(
          'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${STABILITY_API_KEY}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt, weight: 1 }],
              cfg_scale: 7,
              height: 1024,
              width: 1024,
              steps: 30,
              samples: 1,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`SDXL also failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const generatedImage = data.artifacts[0];
        
        if (!generatedImage) {
          throw new Error("No image generated from Stability AI");
        }

        imageBuffer = Buffer.from(generatedImage.base64, 'base64');
        modelUsed = 'sdxl';
        
      } catch (sdxlError) {
        console.error('Both SD3 and SDXL failed:', sdxlError.message);
        throw new Error(`AI service unavailable: ${sdxlError.message}`);
      }
    }

    // Upload to Cloudinary
    const file = {
      buffer: imageBuffer,
      originalname: `ai-generated-${Date.now()}.png`,
      mimetype: 'image/png',
      size: imageBuffer.length,
    };

    const cloudinaryResult = await uploadMediaToCloudinary(file);

    // Save to database
    const newlyCreatedMedia = await db.mediaSchema.create({
      data: {
        userId,
        name: `AI Generated: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}`,
        cloudinaryId: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        mimeType: 'image/png',
        size: imageBuffer.length,
        width: 1024,
        height: 1024,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newlyCreatedMedia,
        prompt: prompt.substring(0, 100),
        message: "AI image generated successfully!",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ AI generation error:', error.message);

    // User-friendly error messages
    let userMessage = "Failed to generate image. Please try again.";
    let statusCode = 500;

    if (error.message.includes('Unauthorized')) {
      userMessage = "Please log in to generate images.";
      statusCode = 401;
    } else if (error.message.includes('API key') || error.message.includes('configuration')) {
      userMessage = "Service configuration issue. Please contact support.";
      statusCode = 500;
    } else if (error.message.includes('AI service unavailable')) {
      userMessage = "AI service is temporarily unavailable. Please try again in a few minutes.";
      statusCode = 503;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: userMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}