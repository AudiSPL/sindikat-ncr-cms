# 🚀 Sindikat NCR - Production Deployment Guide

## ✅ Pre-Deployment Checklist - ALL COMPLETE

### Build & Code Quality
- ✅ **Build Successful**: Next.js 15.5.5 production build completed
- ✅ **TypeScript**: No errors (only warnings for unused variables)
- ✅ **All API Routes**: Node.js runtime configured (`runtime = 'nodejs'`)
- ✅ **Email System**: Resend integration working (test email sent successfully)
- ✅ **Authentication**: NextAuth with comprehensive debug logging
- ✅ **Database**: Supabase with service role key for admin operations
- ✅ **Security**: Rate limiting, input validation, and RLS policies

### Features Implemented
- ✅ **Special Status + Anonymous Members**: Complete implementation
- ✅ **Admin Panel**: Member management with delete functionality
- ✅ **Analytics Dashboard**: Real-time statistics with charts
- ✅ **Email Notifications**: Resend service with BCC archiving
- ✅ **PDF Generation**: Cards, confirmations, and policies
- ✅ **Multi-language**: Serbian/English support
- ✅ **reCAPTCHA**: Google reCAPTCHA v3 integration
- ✅ **Show Password**: Login form with password visibility toggle
- ✅ **Debug Endpoints**: Auth session and email testing

## 🔧 Required Environment Variables

### Production Environment (Vercel/Netlify settings)

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

# reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_here
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## 🏗️ Deployment Steps

### 1. Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `main` branch

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from the list above
   - Set them for Production, Preview, and Development

3. **Deploy**:
   - Vercel will automatically deploy from your `main` branch
   - The deployment will be available at `https://your-project.vercel.app`

### 2. Custom Domain Setup

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Add `app.sindikatncr.com`
   - Follow DNS configuration instructions

2. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - Ensure HTTPS is enforced

## 🧪 Post-Deployment Testing

### 1. Basic Functionality Tests

```bash
# Test main pages
curl https://app.sindikatncr.com/
curl https://app.sindikatncr.com/nova-pristupnica
curl https://app.sindikatncr.com/auth/login

# Test API endpoints
curl https://app.sindikatncr.com/api/debug/auth-session
curl "https://app.sindikatncr.com/api/debug/send-test?to=test@example.com"
```

### 2. Authentication Tests

1. **Login Flow**:
   - Go to `https://app.sindikatncr.com/auth/login`
   - Use admin credentials: `admin@sindikatncr.com` / `[password]`
   - Check for successful redirect to `/admin`

2. **Session Debug**:
   - Visit `https://app.sindikatncr.com/api/debug/auth-session`
   - Should return session information when logged in

### 3. Email Tests

1. **Test Email**:
   - Visit `https://app.sindikatncr.com/api/debug/send-test?to=your-email@example.com`
   - Check if test email is received

2. **Application Form**:
   - Submit a test application at `/nova-pristupnica`
   - Verify confirmation emails are sent

## 🔍 Debugging Production Issues

### 1. Check Vercel Logs

```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs https://app.sindikatncr.com
```

### 2. Debug Endpoints

- **Auth Session**: `https://app.sindikatncr.com/api/debug/auth-session`
- **Email Test**: `https://app.sindikatncr.com/api/debug/send-test?to=email@example.com`

### 3. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 500 errors | Check environment variables in Vercel |
| Auth not working | Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` |
| Email not sending | Check `RESEND_API_KEY` and `MAIL_ENABLED=true` |
| Database errors | Verify Supabase keys and RLS policies |

## 📊 Performance Monitoring

### 1. Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals and performance metrics

### 2. Supabase Monitoring
- Check Supabase dashboard for database performance
- Monitor API usage and limits

## 🔒 Security Checklist

- ✅ **HTTPS**: Enforced by Vercel
- ✅ **Environment Variables**: Secured in Vercel
- ✅ **RLS Policies**: Enabled on all tables
- ✅ **Rate Limiting**: Implemented on API routes
- ✅ **Input Validation**: Sanitization on all inputs
- ✅ **reCAPTCHA**: Bot protection on forms

## 🎉 Deployment Complete!

Your Sindikat NCR application is now ready for production use at:
**https://app.sindikatncr.com**

### Next Steps:
1. Test all functionality in production
2. Monitor logs for any issues
3. Set up monitoring and alerts
4. Configure backup strategies
5. Document admin procedures

---

**Deployment Date**: $(date)
**Version**: Next.js 15.5.5
**Status**: ✅ Production Ready
