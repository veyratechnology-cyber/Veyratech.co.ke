/**
 * M-Pesa Integration Tests
 */

import { formatPhoneNumber, validateMpesaConfig } from '../index';

describe('M-Pesa Utils', () => {
  describe('formatPhoneNumber', () => {
    it('should format Kenyan phone starting with 0', () => {
      expect(formatPhoneNumber('0712345678')).toBe('254712345678');
      expect(formatPhoneNumber('0701234567')).toBe('254701234567');
    });

    it('should format phone starting with 254', () => {
      expect(formatPhoneNumber('254712345678')).toBe('254712345678');
    });

    it('should format phone starting with +254', () => {
      expect(formatPhoneNumber('+254712345678')).toBe('254712345678');
    });

    it('should format phone starting with 7', () => {
      expect(formatPhoneNumber('712345678')).toBe('254712345678');
    });

    it('should remove non-digit characters', () => {
      expect(formatPhoneNumber('+254 712 345 678')).toBe('254712345678');
      expect(formatPhoneNumber('0712-345-678')).toBe('254712345678');
    });

    it('should throw error for invalid phone numbers', () => {
      expect(() => formatPhoneNumber('123')).toThrow('Invalid Kenyan phone number format');
      expect(() => formatPhoneNumber('999999999999')).toThrow('Invalid Kenyan phone number format');
      expect(() => formatPhoneNumber('')).toThrow('Invalid Kenyan phone number format');
    });
  });

  describe('validateMpesaConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return true when all config is present', () => {
      process.env.MPESA_CONSUMER_KEY = 'test-key';
      process.env.MPESA_CONSUMER_SECRET = 'test-secret';
      process.env.MPESA_SHORTCODE = '174379';
      process.env.MPESA_PASSKEY = 'test-passkey';

      expect(validateMpesaConfig()).toBe(true);
    });

    it('should return false when config is missing', () => {
      process.env.MPESA_CONSUMER_KEY = '';
      process.env.MPESA_CONSUMER_SECRET = '';
      process.env.MPESA_SHORTCODE = '';
      process.env.MPESA_PASSKEY = '';

      expect(validateMpesaConfig()).toBe(false);
    });
  });
});
