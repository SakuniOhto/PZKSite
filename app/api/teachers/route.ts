import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany();
        return NextResponse.json(teachers);
    } catch (error) {
        console.error('Failed to fetch teachers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        );
    }
}
