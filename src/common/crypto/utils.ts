import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export function generateSha(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function generateBcrypt(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function validateBcrypt(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString('hex');
}
