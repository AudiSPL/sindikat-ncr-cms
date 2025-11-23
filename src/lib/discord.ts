interface MemberNotificationData {
  full_name: string;
  email: string;
  quicklook_id: string;
  city?: string;
  division?: string;
  team?: string;
  is_anonymous: boolean;
  created_at: string;
  member_id?: string;
}

export async function sendDiscordNotification(memberData: MemberNotificationData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('⚠️ Discord webhook URL not configured - skipping notification');
    return;
  }

  try {
    console.log('🔔 Sending Discord notification for:', memberData.full_name);

    // Create rich embed with member info
    const embed = {
      title: "🎉 Nova Prijava Pristigla!",
      description: `Novi član čeka odobrenje u admin panelu.`,
      color: 0xE67E22, // Orange brand color
      fields: [
        {
          name: "👤 Ime i Prezime",
          value: memberData.full_name,
          inline: true
        },
        {
          name: "📧 Email",
          value: memberData.email,
          inline: true
        },
        {
          name: "🆔 Quicklook ID",
          value: memberData.quicklook_id,
          inline: true
        },
        {
          name: "🏙️ Grad",
          value: memberData.city || 'Nije navedeno',
          inline: true
        },
        {
          name: "🏢 Odeljenje",
          value: memberData.division || 'Nije navedeno',
          inline: true
        },
        {
          name: "👥 Tim",
          value: memberData.team || 'Nije navedeno',
          inline: true
        },
        {
          name: "🔒 Status Članstva",
          value: memberData.is_anonymous ? "🔒 Anoniman" : "👤 Aktivan/Vidljiv",
          inline: true
        },
        {
          name: "⏰ Vreme Prijave",
          value: new Date(memberData.created_at).toLocaleString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          inline: true
        }
      ],
      footer: {
        text: "Sindikat NCR - Admin Notification System"
      },
      timestamp: new Date().toISOString()
    };

    // Send webhook request
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: "Sindikat NCR Bot",
        content: `🔔 **Nova pristupnica!** Član čeka odobrenje.`,
        embeds: [embed],
        // Add button to admin panel
        components: [{
          type: 1,
          components: [{
            type: 2,
            style: 5, // Link button
            label: "📋 Otvori Admin Panel",
            url: "https://app.sindikatncr.com/admin/clanovi"
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`);
    }

    console.log('✅ Discord notification sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending Discord notification:', error);
    // Don't throw error - we don't want to fail member application if Discord is down
    return false;
  }
}

// Optional: Function for approval notifications
export async function sendDiscordApprovalNotification(memberData: MemberNotificationData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) return;

  try {
    const embed = {
      title: "✅ Član Odobren!",
      description: `Novi član je odobren i sada je aktivan.`,
      color: 0x00B894, // Green color
      fields: [
        {
          name: "👤 Ime",
          value: memberData.full_name,
          inline: true
        },
        {
          name: "🆔 Član ID",
          value: memberData.member_id || 'N/A',
          inline: true
        },
        {
          name: "📧 Email",
          value: memberData.email,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Sindikat NCR Bot",
        content: `✅ Član odobren!`,
        embeds: [embed]
      }),
    });

    console.log('✅ Discord approval notification sent');
  } catch (error) {
    console.error('❌ Error sending approval notification:', error);
  }
}

