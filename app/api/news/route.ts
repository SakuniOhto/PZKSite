import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            orderBy: { id: 'desc' },
        });
        return NextResponse.json(news);
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

