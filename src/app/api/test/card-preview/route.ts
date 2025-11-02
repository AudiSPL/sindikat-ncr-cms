import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Test data
    const firstName = 'Miloš';
    const lastName = 'Savić';
    const memberNumber = 'SIN-AT001';
    const joinDate = new Date().toISOString().split('T')[0];
    
    // Logo path
    const logoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-union.png');
    
    // Temporary output path
    const cardPath = path.join(process.cwd(), 'tmp', `card_preview_${Date.now()}.pdf`);
    
    // Ensure tmp directory exists
    const tmpDir = path.dirname(cardPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Python script path
    const pythonScript = path.join(process.cwd(), 'public', 'scripts', 'card_generator.py');
    
    // Call Python script
    const command = `python3 "${pythonScript}" "${firstName}" "${lastName}" "${memberNumber}" "${joinDate}" "${cardPath}" "${logoPath}"`;
    
    await execAsync(command);
    
    // Read the generated PDF
    const cardBuffer = fs.readFileSync(cardPath);
    
    // Clean up temporary file
    try {
      fs.unlinkSync(cardPath);
    } catch (cleanupErr) {
      console.warn('Failed to cleanup temp card file:', cleanupErr);
    }
    
    // Return PDF as response
    return new NextResponse(cardBuffer, {
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

