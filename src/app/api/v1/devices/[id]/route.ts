
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkApiKey } from '@/lib/apiAuth';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!checkApiKey(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;

    try {
        const device = await prisma.device.findUnique({
            where: { id },
        });

        if (!device) {
            return NextResponse.json({ error: 'Device not found' }, { status: 404 });
        }

        return NextResponse.json(device);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch device' }, { status: 500 });
    }
}
