// Individual hero slide operations API route
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Mark POST (view tracking) as dynamic and public - no CSRF needed
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/hero-slides/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch hero slide' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.formData();
    
    const response = await fetch(`${API_BASE_URL}/hero-slides/${params.id}`, {
      method: 'PUT',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/hero-slides/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}

// Track views for a specific slide
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Tracking view for slide:', params.id);
    
    const response = await fetch(`${API_BASE_URL}/hero-slides/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend API error:', response.status, response.statusText);
      
      // If slide not found, return 404 but don't throw error
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Hero slide not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to track view' },
        { status: response.status }
      );
    }

    console.log('View tracked successfully for slide:', params.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track view' },
      { status: 500 }
    );
  }
}
