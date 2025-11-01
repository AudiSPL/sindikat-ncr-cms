import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export interface VerificationToken {
  memberId: string;
  qlid: string;
  exp: number;
}

export function generateVerificationToken(memberId: string, qlid: string): string {
  const token = jwt.sign(
    { memberId, qlid },
    JWT_SECRET,
    { expiresIn: '7d' } // 7 days to complete verification
  );
  return token;
}

export function verifyVerificationToken(token: string): VerificationToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as VerificationToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}