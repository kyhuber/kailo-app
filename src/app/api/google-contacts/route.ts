// src/app/api/google-contacts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get Google access token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const googleToken = authHeader.split('Bearer ')[1];
    
    // Call Google People API with the provided token
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos',
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      }
    );

    if (!response.ok) {
      // Handle token expiration specifically
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      
      const errorData = await response.json();
      console.error('Google API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch contacts from Google API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching Google contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}