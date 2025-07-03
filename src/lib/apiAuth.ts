
import { NextRequest } from 'next/server';

export function checkApiKey(req: NextRequest): boolean {
    const authHeader = req.headers.get('Authorization');
    const apiKey = process.env.API_SECRET_KEY;

    if (!apiKey) {
        // If no API key is configured in the environment, deny access.
        // This is a security measure to prevent running an open API by mistake.
        console.error("API_SECRET_KEY is not set in the environment.");
        return false;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const providedKey = authHeader.split(' ')[1];
    return providedKey === apiKey;
}
