import { NextRequest, NextResponse } from 'next/server';
import { authorizedUsers } from '@/app/lib/auth';

// POST /api/auth/login - Login to get API key
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password required' },
                { status: 400 }
            );
        }

        const user = authorizedUsers[username as keyof typeof authorizedUsers];

        if (!user || user.password !== password) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                username,
                role: user.role,
                apiKey: user.apiKey
            },
            instructions: 'Use this API key in the Authorization header: Bearer your-api-key'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Login failed', error: (error as Error).message },
            { status: 500 }
        );
    }
}