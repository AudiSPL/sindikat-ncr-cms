export function sanitizeInput(input: string): string {
  return String(input || '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
}

export function sanitizeEmail(email: string): string {
  const cleaned = String(email || '').toLowerCase().trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

export function sanitizeQuicklookId(id: string): string {
  const upper = String(id || '').toUpperCase();
  const idRegex = /^[A-Z]{2}\d{6}$/;
  return idRegex.test(upper) ? upper : '';
}


