import { JWT_EXCEPTION_CODES } from './auth';

export const EXCEPTION_CODES = {
  ...JWT_EXCEPTION_CODES,
} as const;

export type ExceptionCode = (typeof EXCEPTION_CODES)[keyof typeof EXCEPTION_CODES];
