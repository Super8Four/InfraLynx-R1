
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
        const site = await prisma.site.findUnique({
            where: { id },
        });

        if (!site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        return NextResponse.json(site);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
    }
}
