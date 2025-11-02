import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly salt = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  validatePasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= 8 && hasUpperCase && hasNumber;
  }
}
