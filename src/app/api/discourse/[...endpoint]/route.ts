import { NextRequest, NextResponse } from 'next/server';

const DISCOURSE_URL = process.env.DISCOURSE_BASE_URL;
const API_KEY = process.env.DISCOURSE_API_KEY;
const API_USERNAME = process.env.DISCOURSE_API_USERNAME || 'system'; // Default to system if not set

// Define the type for the route context parameters
type RouteContext = {
  params: {
    endpoint: string[];
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext // Use the defined type here
) {
  if (!DISCOURSE_URL || !API_KEY) {
    return NextResponse.json(
      { error: 'Discourse environment variables not set' },
      { status: 500 }
    );
  }

  // Destructure params inside the function
  const { params } = context;
  const endpointPath = params.endpoint.join('/');
  const { searchParams } = new URL(request.url);

  // Ensure endpoint path starts with a slash if it doesn't have one
  const fullDiscourseUrl = `${DISCOURSE_URL}/${endpointPath.startsWith('/') ? endpointPath.substring(1) : endpointPath}?${searchParams.toString()}`;

  console.log(`Proxying request to: ${fullDiscourseUrl}`);

  try {
    const response = await fetch(fullDiscourseUrl, {
      method: 'GET',
      headers: {
        'Api-Key': API_KEY,
        'Api-Username': API_USERNAME,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Revalidate quickly during development, longer in production
      next: { revalidate: process.env.NODE_ENV === 'development' ? 10 : 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error fetching from Discourse API (${response.status}): ${errorText}`
      );
      return NextResponse.json(
        {
          error: `Error from Discourse API: ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Set CORS headers to allow requests from your frontend origin during development
    // In production with Vercel, this might not be strictly necessary if frontend/backend are same origin
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*'); // Adjust in production if needed
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return NextResponse.json(data, { headers });

  } catch (error) {
    console.error('Error in Discourse API proxy:', error);
    return NextResponse.json(
      { error: 'Internal Server Error proxying to Discourse' },
      { status: 500 }
    );
  }
} 