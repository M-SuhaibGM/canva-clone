import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Lightweight ping to MongoDB via Prisma
        // $runCommandRaw is the cheapest way to ping MongoDB
        await db.$runCommandRaw({ ping: 1 });

        return NextResponse.json(
            {
                success: true,
                message: 'Database pinged successfully',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (e) {
        console.error('Keep-alive ping failed:', e);
        return NextResponse.json(
            {
                success: false,
                message: 'Ping failed',
            },
            { status: 500 }
        );
    }
}

// Ensure this route is never cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;
