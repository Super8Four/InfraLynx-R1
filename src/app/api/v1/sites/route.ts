
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkApiKey } from '@/lib/apiAuth';

export async function GET(req: NextRequest) {
    if (!checkApiKey(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const sites = await prisma.site.findMany();
        return NextResponse.json(sites);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
    }
}
