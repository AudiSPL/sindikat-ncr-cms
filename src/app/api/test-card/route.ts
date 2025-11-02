import { NextResponse } from 'next/server';
import { generateMembershipCard } from '@/lib/card-generator';

export async function GET() {
  try {
    // Test data
    const firstName = 'Miloš';
    const lastName = 'Savić';
    const memberNumber = 'SIN-AT001';
    const joinDate = new Date().toISOString().split('T')[0];
    
    // Generate card
    const cardBuffer = await generateMembershipCard(
      firstName,
      lastName,
      memberNumber,
      joinDate
    );
    
    // Return PDF as response
    return new NextResponse(new Uint8Array(cardBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="card-preview.pdf"`,
        'Content-Length': cardBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Card preview error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate card preview' },
      { status: 500 }
    );
  }
}

