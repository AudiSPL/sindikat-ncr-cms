import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
    const projectId = process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID;

    if (!apiKey || !projectId) {
      return NextResponse.json(
        { error: 'reCAPTCHA Enterprise credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token,
            expectedAction: 'submit',
            siteKey: '6Lc7y_grAAAAAGRS2F0wKCXl_QcubnQCC_z1MXg5'
          }
        })
      }
    );

    const data = await response.json();
    const score = data.riskAnalysis?.score || 0;

    return NextResponse.json({ success: score > 0.5, score });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
