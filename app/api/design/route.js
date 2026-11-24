import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/actions/getSession";

async function getUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

const toPositiveInt = (value, fallback) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export async function POST(request) {
  try {
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const { name, canvasData, height, width, category } = await request.json();

    const design = await db.designSchema.create({
      data: {
        userId,
        name: (typeof name === "string" && name.trim()) || "Untitled design",
        canvasData,
        height: toPositiveInt(height, 465),
        width: toPositiveInt(width, 825),
        category: category || "youtube_thumbnail",
      },
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json({ message: "Error creating design" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const designs = await db.designSchema.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Error getting designs:", error);
    return NextResponse.json({ message: "Error getting designs" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getUserId();
    if (!userId) return unauthorized();

    const { designId, name, canvasData, width, height, category } = await request.json();

    if (!designId) {
      return NextResponse.json(
        { success: false, message: "designId is required" },
        { status: 400 }
      );
    }

    const existingDesign = await db.designSchema.findFirst({
      where: { id: designId, userId },
    });

    if (!existingDesign) {
      return NextResponse.json(
        {
          success: false,
          message: "Design not found or you don't have permission to update it.",
        },
        { status: 404 }
      );
    }

    const updatedDesign = await db.designSchema.update({
      where: { id: designId },
      data: {
        name,
        canvasData,
        category,
        width,
        height,
      },
    });

    return NextResponse.json({ success: true, data: updatedDesign });
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update design" },
      { status: 500 }
    );
  }
}
