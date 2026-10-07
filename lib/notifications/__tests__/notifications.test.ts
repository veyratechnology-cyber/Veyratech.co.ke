/**
 * Notification System Tests
 */

import { getNotificationServicesStatus } from '../index';

describe('Notification Services', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getNotificationServicesStatus', () => {
    it('should return all services as false when not configured', () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;

      const status = getNotificationServicesStatus();
      expect(status.email).toBe(false);
      expect(status.sms).toBe(false);
      expect(status.whatsapp).toBe(false);
    });

    it('should return email as true when Resend is configured', () => {
      process.env.RESEND_API_KEY = 'test-key';
      
      const status = getNotificationServicesStatus();
      expect(status.email).toBe(true);
    });

    it('should return all services as true when fully configured', () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.TWILIO_ACCOUNT_SID = 'test-sid';
      process.env.TWILIO_AUTH_TOKEN = 'test-token';
      process.env.TWILIO_PHONE_NUMBER = '+1234567890';
      process.env.TWILIO_WHATSAPP_NUMBER = 'whatsapp:+1234567890';

      const status = getNotificationServicesStatus();
      expect(status.email).toBe(true);
      expect(status.sms).toBe(true);
      expect(status.whatsapp).toBe(true);
    });
  });
});
