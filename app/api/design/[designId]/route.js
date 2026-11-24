import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import getSession from "@/actions/getSession";

async function getUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}

const isObjectId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

export async function GET(request, { params }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { designId } = await params;
    if (!isObjectId(designId)) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    // Scope by owner so users can't read each other's designs.
    const design = await db.designSchema.findFirst({
      where: { id: designId, userId },
    });

    if (!design) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    return NextResponse.json(design);
  } catch (error) {
    console.error("Error getting design:", error);
    return NextResponse.json({ message: "Error getting design" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { designId } = await params;
    if (!isObjectId(designId)) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    const { count } = await db.designSchema.deleteMany({
      where: { id: designId, userId },
    });

    if (!count) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json({ message: "Error deleting design" }, { status: 500 });
  }
}
