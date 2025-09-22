import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { designId } = await params;

        const design = await db.designSchema.findUnique({
            where: {
                id: designId,
            },
        });

        return NextResponse.json(design);
    } catch (error) {
        console.error("Error getting design:", error);
        return NextResponse.json(
            { message: "Error getting design" },
            { status: 500 }
        );
    }
}


export async function DELETE(request,{ params }) {
    try {
        const { designId } = await params;

        const design = await db.designSchema.delete({
            where: {
                id:designId
            },
        })


        return NextResponse.json({ message: "Design deleted successfully" }, { status: 201 });

    } catch (error) {
        console.log("Error getting design:", error);
        return NextResponse.json({ message: "Error getting designes" }, { status: 500 });
    }
} 
