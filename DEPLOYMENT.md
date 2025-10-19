# 🚀 Sindikat NCR - Production Deployment Guide

## ✅ Build Status
- **Build**: ✅ Successful (Next.js 15.5.5)
- **TypeScript**: ✅ No errors (warnings only)
- **Linting**: ✅ Passed

## 🔧 Required Environment Variables

### Production Environment (.env.production or Vercel/Netlify settings)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xiwocjucgvwikjcuqcgi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=https://app.sindikatncr.com
NEXTAUTH_SECRET=your_production_secret_here
AUTH_TRUST_HOST=true

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
MAIL_ENABLED=true

# Site Configuration
SITE_URL=https://app.sindikatncr.com

# reCAPTCHA (if using)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_here
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## 🏗️ Deployment Steps

### 1. Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Go to: Project Settings → Environment Variables
```

### 2. Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔍 Pre-Deployment Checklist

- [x] Build successful (`npm run build`)
- [x] All API routes have `runtime = 'nodejs'`
- [x] Supabase service key configured
- [x] Resend email service configured
- [x] NextAuth URL set to production domain
- [x] Debug endpoints available for testing

## 🧪 Testing Endpoints

After deployment, test these endpoints:

1. **Auth Debug**: `https://app.sindikatncr.com/api/debug/auth-session`
2. **Email Test**: `https://app.sindikatncr.com/api/debug/send-test?to=test@example.com`
3. **Admin Panel**: `https://app.sindikatncr.com/admin`
4. **Membership Form**: `https://app.sindikatncr.com/nova-pristupnica`

## 🔐 Security Notes

- ✅ Service role key bypasses RLS (admin operations)
- ✅ All API routes use Node.js runtime
- ✅ Email archiving via BCC (not CC)
- ✅ Input validation and sanitization
- ✅ Rate limiting enabled

## 📊 Features Included

- ✅ Special Status + Anonymous Members
- ✅ Admin member management with delete functionality
- ✅ Real-time analytics dashboard
- ✅ Email notifications via Resend
- ✅ PDF generation (cards, confirmations, policies)
- ✅ Multi-language support (SR/EN)
- ✅ Audit logging

## 🚨 Important Notes

1. **Domain Verification**: Ensure `sindikatncr.com` domain is verified in Resend
2. **Supabase RLS**: Policies are configured for public inserts and authenticated reads
3. **Admin Access**: First admin user must be created manually in Supabase
4. **Email Domain**: All emails sent from `no.reply@sindikatncr.com` with replies to `office@sindikatncr.com`

## 📞 Support

If deployment issues occur:
1. Check Vercel/Netlify logs
2. Verify all environment variables are set
3. Test debug endpoints for diagnostics
4. Check Supabase connection and RLS policies
