import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
const scryptAsync = promisify(scrypt);

export class PasswordHelper {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async comparePassword(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return hashPassword === buf.toString('hex');
  }
}
