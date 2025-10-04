import { describe, it, expect } from 'vitest';
import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  describe('Standard 10-digit US numbers', () => {
    it('formats a 10-digit number correctly', () => {
      expect(formatPhoneNumber(5551234567)).toBe('(555) 123-4567');
    });

    it('formats a 10-digit string correctly', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('formats with different area codes', () => {
      expect(formatPhoneNumber(2125551234)).toBe('(212) 555-1234');
      expect(formatPhoneNumber(4155559999)).toBe('(415) 555-9999');
      expect(formatPhoneNumber(3105550000)).toBe('(310) 555-0000');
    });
  });

  describe('11-digit numbers with country code', () => {
    it('formats 11-digit number starting with 1', () => {
      expect(formatPhoneNumber(15551234567)).toBe('+1 (555) 123-4567');
    });

    it('formats 11-digit string starting with 1', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    });
  });

  describe('Edge cases', () => {
    it('handles numbers with non-digit characters', () => {
      expect(formatPhoneNumber('+1-555-123-4567')).toBe('+1 (555) 123-4567');
      expect(formatPhoneNumber('(555)-123-4567')).toBe('(555) 123-4567');
    });

    it('returns original for invalid lengths', () => {
      expect(formatPhoneNumber(12345)).toBe('12345');
      expect(formatPhoneNumber(123456789012)).toBe('123456789012');
      expect(formatPhoneNumber('123')).toBe('123');
    });

    it('handles empty or zero values', () => {
      expect(formatPhoneNumber(0)).toBe('0');
      expect(formatPhoneNumber('')).toBe('');
    });
  });
});
