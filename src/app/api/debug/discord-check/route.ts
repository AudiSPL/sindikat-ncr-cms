import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  return NextResponse.json({
    webhook_configured: !!webhookUrl,
    webhook_length: webhookUrl ? webhookUrl.length : 0,
    webhook_starts_with: webhookUrl ? webhookUrl.substring(0, 30) + '...' : 'NOT SET',
    env_keys: Object.keys(process.env).filter(key => key.includes('DISCORD')),
    all_env_keys: Object.keys(process.env).length,
  });
}

