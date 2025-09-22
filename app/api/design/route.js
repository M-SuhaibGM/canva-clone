
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/actions/getSession";

export async function POST(request) {
  try {
    const session = await getSession()
    const userId = session.user?.id
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, canvasData, height, width, category } = await request.json()

    const design = await db.designSchema.create({
      data: {
        userId,
        name,
        canvasData,
        height,
        width,
        category: category || "youtube_thumbnal"
      }
    })


    return NextResponse.json(design);

  } catch (error) {
    console.log("Error getting design:", error);
    return NextResponse.json({ message: "Error getting designes" }, { status: 500 });
  }
}
export async function GET(request) {
  try {
    const session = await getSession()
    const userId = session.user?.id
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const design = await db.designSchema.findMany({
      where: {
        userId
      }
    })


    return NextResponse.json(design);

  } catch (error) {
    console.log("Error getting design:", error);
    return NextResponse.json({ message: "Error getting designes" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    const userId = session.user?.id
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { designId, name, canvasData, width, height, category } = await request.json();
    const existingDesign = await db.designSchema.findFirst({
      where: {
        id: designId,
        userId: userId
      }
    });

    if (!existingDesign) {
      return NextResponse.json(
        {
          success: false,
          message: "Design not found or you don't have permission to update it."
        },
        { status: 404 }
      );
    }

    const updatedDesign = await db.designSchema.update({
      where: {
        id: designId
      },
      data: {
        name,
        canvasData,
        category,
        width,
        height,
        userId
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedDesign
    });

  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update design" },
      { status: 500 }
    );
  }
}






