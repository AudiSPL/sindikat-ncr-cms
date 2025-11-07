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

      // Extract sender email (firstname.lastname + optional digits) - MUST be from @ncratleos.com
      const emailMatch = from.match(/([a-zA-Z0-9._-]+)@ncratleos\.com/i);
      if (!emailMatch) {
        console.warn(`⚠️ Email from ${from} is not from @ncratleos.com domain - skipping`);
        continue;
      }

      const localPart = emailMatch[1];
      const parts = localPart.split('.');

      if (parts.length < 2) {
        console.warn(`⚠️ Unable to parse first/last name from email local-part: ${localPart}`);
        continue;
      }

      const firstNameRaw = parts[0];
      const lastNameRaw = parts[parts.length - 1];

      const firstName = firstNameRaw.replace(/\d+$/, '').toLowerCase();
      const lastName = lastNameRaw.replace(/\d+$/, '').toLowerCase();

      if (!firstName || !lastName) {
        console.warn(`⚠️ Parsed empty first or last name from ${localPart}@ncratleos.com`);
        continue;
      }

      processedEmails.push({
        messageId: message.id!,
        emailAddress: `${localPart}@ncratleos.com`,
        firstName,
        lastName,
        subject,
        date,
      });

      console.log(`✅ Email received from ${localPart}@ncratleos.com (parsed: ${firstName} ${lastName})`);

      // Mark as read so we don't process it again
      await gmail.users.messages.modify({
        userId: 'me',
        id: message.id!,
        requestBody: {
          removeLabelIds: ['UNREAD'],
        },
      });
    }

    return processedEmails;
  } catch (error) {
    const err = error as any;
    const statusCode = err?.code || err?.response?.status;

    switch (statusCode) {
      case 400:
        console.error('❌ Gmail API error: 400 Bad Request – check query parameters or request body.');
        break;
      case 401:
        console.error('❌ Gmail API error: 401 Unauthorized – OAuth credentials may be missing or expired.');
        break;
      case 403:
        console.error('❌ Gmail API error: 403 Forbidden – ensure Gmail API is enabled and scopes are correct.');
        break;
      default:
        if (statusCode) {
          console.error(`❌ Gmail API error: ${statusCode} – unexpected status received.`);
        } else {
          console.error('❌ Gmail API error: No status code returned – possible network issue or SDK error.');
        }
        break;
    }

    console.error('📨 Gmail API error details:', err);
    throw error;
  }
}