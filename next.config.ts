import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply CSP headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.gstatic.com/",
              "style-src 'self' 'unsafe-inline' https://www.gstatic.com/recaptcha/ https://fonts.googleapis.com",
              "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com",
              "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/ https://recaptcha.google.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;