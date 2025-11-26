import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const authHeader = request.headers.get('authorization');

        const response = await axios.get(`${BACKEND_URL}/brand/user/${userId}`, {
            headers: {
                'Authorization': authHeader,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Proxy Error:', error.response?.data || error.message);
        return NextResponse.json(
            { message: error.response?.data?.message || 'Internal Server Error' },
            { status: error.response?.status || 500 }
        );
    }
}
