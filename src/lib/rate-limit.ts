import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = store[identifier];

  if (!record || now > record.resetTime) {
    store[identifier] = { count: 1, resetTime: now + windowMs };
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) return { success: false, remaining: 0 };
  record.count++;
  return { success: true, remaining: limit - record.count };
}

export function getRateLimitIdentifier(req: NextRequest): string {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return ip;
}


