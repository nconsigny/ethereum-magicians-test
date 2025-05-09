import { NextRequest, NextResponse } from 'next/server';

const DISCOURSE_URL = process.env.DISCOURSE_BASE_URL;
const API_KEY = process.env.DISCOURSE_API_KEY;
const API_USERNAME = process.env.DISCOURSE_API_USERNAME || 'system';

export const GET = async (
  request: NextRequest,
  { params }: { params: { segments: string[] } }
): Promise<NextResponse> => {

  if (!DISCOURSE_URL || !API_KEY) {
    return NextResponse.json(
      { error: 'Discourse environment variables not set' },
      { status: 500 }
    );
  }

  const endpointPath = params.segments.join('/');
  // Restore extraction of searchParams from the original request URL
  const { searchParams } = new URL(request.url);

  // Restore construction of the full Discourse URL
  const fullDiscourseUrl = `${DISCOURSE_URL}/${endpointPath.startsWith('/') ? endpointPath.substring(1) : endpointPath}?${searchParams.toString()}`;

  console.log(`Proxying request to: ${fullDiscourseUrl}`);

  // Restore the try/catch block for fetching from Discourse
  try {
    const response = await fetch(fullDiscourseUrl, {
      method: 'GET',
      headers: {
        'Api-Key': API_KEY,
        'Api-Username': API_USERNAME,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
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
}; 