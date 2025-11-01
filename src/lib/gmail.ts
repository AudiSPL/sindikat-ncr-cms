import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function getUnprocessedVerificationEmails() {
  try {
    // Search for unread messages from @ncratleos.com to verifikacija926@gmail.com
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `from:@ncratleos.com to:verifikacija926@gmail.com is:unread`,
      maxResults: 50,
    });

    const messages = response.data.messages || [];
    const processedEmails = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });

      const headers = msg.data.payload?.headers || [];
      const from = headers.find(h => h.name === 'From')?.value || '';
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      // Extract qlid from email address - MUST be from @ncratleos.com
      const emailMatch = from.match(/([a-zA-Z0-9]+)@ncratleos\.com/i);
      if (!emailMatch) {
        console.warn(`⚠️ Email from ${from} is not from @ncratleos.com domain - skipping`);
        continue;
      }

      const qlid = emailMatch[1];
      
      if (qlid) {
        console.log(`✅ Email verified from ${qlid}@ncratleos.com - Member verified`);
        
        processedEmails.push({
          messageId: message.id!,
          qlid,
          subject,
          date,
        });

        // Mark as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: message.id!,
          requestBody: {
            removeLabelIds: ['UNREAD'],
          },
        });
      }
    }

    return processedEmails;
  } catch (error) {
    console.error('Gmail API error:', error);
    throw error;
  }
}