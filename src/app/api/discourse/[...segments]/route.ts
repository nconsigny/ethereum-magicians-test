import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { segments: string[] } }
): Promise<NextResponse> => {
  // Log params just to ensure they are technically accessible if needed
  console.log(params.segments);

  // Return the simplest possible response
  return NextResponse.json({});
}; 