import { BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../core/constants/error-message.constant';

export const validatePassword = (password: string): boolean => {
  const upperLetter = /[A-Z]/.test(password);
  const numberInPassword = /\d/.test(password);

  if (password.length < 8 || !upperLetter || !numberInPassword) {
    throw new BadRequestException(ERROR_MESSAGES.WEAK_PASSWORD);
  }
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException(ERROR_MESSAGES.INVALID_EMAIL);
  }
  return true;
};

export const validateBirthDate = (date: Date): boolean => {
  const birthDate = new Date(date);
  const today = new Date();
  const minAge = 13;
  const ageGap = today.getFullYear() - birthDate.getFullYear();

  if (isNaN(birthDate.getTime())) {
    throw new BadRequestException(ERROR_MESSAGES.INVALID_DATE);
  }
  if (birthDate > today) {
    throw new BadRequestException(ERROR_MESSAGES.DATE_BIRTH_CANNOT_FUTURE);
  }
  if (ageGap < minAge) {
    throw new BadRequestException(ERROR_MESSAGES.INVALID_AGE);
  }

  return true;
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthGap = today.getMonth() - birth.getMonth();

  if (monthGap < 0 || (monthGap === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toISOString();
};

export const passwordMatch = (
  password: string,
  confirmPassword: string,
): boolean => {
  if (password !== confirmPassword) {
    throw new BadRequestException(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
  }
  return true;
};
