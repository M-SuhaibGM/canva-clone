import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = session.user.id;
        const medias = await db.mediaSchema.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: medias,
            },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error fetching media:', e);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch assets",
            },
            { status: 500 }
        );
    }
};