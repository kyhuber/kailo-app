// src/app/api/google-contacts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from auth header (for authentication structure validation)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Simulate a real API with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return NextResponse.json({
      connections: [
        {
          resourceName: 'people/123456789',
          names: [{ displayName: 'John Doe' }],
          emailAddresses: [{ value: 'john.doe@example.com' }],
          photos: [{ url: 'https://via.placeholder.com/150' }],
          phoneNumbers: [{ value: '+1 555-123-4567' }]
        },
        {
          resourceName: 'people/987654321',
          names: [{ displayName: 'Jane Smith' }],
          emailAddresses: [{ value: 'jane.smith@example.com' }],
          photos: [{ url: 'https://via.placeholder.com/150' }],
          phoneNumbers: [{ value: '+1 555-987-6543' }]
        },
        {
          resourceName: 'people/555555555',
          names: [{ displayName: 'Alex Johnson' }],
          emailAddresses: [{ value: 'alex.johnson@example.com' }],
          phoneNumbers: null
        },
        {
          resourceName: 'people/111222333',
          names: [{ displayName: 'Maria Garcia' }],
          phoneNumbers: [{ value: '+1 555-222-3333' }]
        },
        {
          resourceName: 'people/444555666',
          names: [{ displayName: 'David Lee' }],
          emailAddresses: [{ value: 'david.lee@example.com' }],
          photos: [{ url: 'https://via.placeholder.com/150' }]
        },
        {
          resourceName: 'people/777888999',
          names: [{ displayName: 'Sarah Williams' }],
          emailAddresses: [{ value: 'sarah.w@example.com' }],
          phoneNumbers: [{ value: '+1 555-777-8888' }]
        },
        {
          resourceName: 'people/123123123',
          names: [{ displayName: 'Michael Brown' }],
          emailAddresses: [{ value: 'michael.b@example.com' }],
          phoneNumbers: [{ value: '+1 555-123-1234' }],
          photos: [{ url: 'https://via.placeholder.com/150' }]
        },
        {
          resourceName: 'people/456456456',
          names: [{ displayName: 'Jennifer Davis' }],
          emailAddresses: [{ value: 'jen.davis@example.com' }]
        },
        {
          resourceName: 'people/789789789',
          names: [{ displayName: 'Robert Wilson' }],
          phoneNumbers: [{ value: '+1 555-789-7890' }],
          photos: [{ url: 'https://via.placeholder.com/150' }]
        },
        {
          resourceName: 'people/321321321',
          names: [{ displayName: 'Emily Taylor' }],
          emailAddresses: [{ value: 'emily.t@example.com' }],
          phoneNumbers: [{ value: '+1 555-321-3210' }]
        }
      ]
    });
  } catch (error) {
    console.error('Error in mock Google contacts API:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}