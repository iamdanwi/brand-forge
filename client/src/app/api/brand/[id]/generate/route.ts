import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

        const response = await axios.post(`${BACKEND_URL}/brand/${id}/generate`, body, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
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
