/**
 * M-Pesa Daraja API Integration
 * Safaricom M-Pesa STK Push for Newsletter Subscriptions
 */

import axios from 'axios';

// M-Pesa Configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortcode: process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY || '',
  callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
};

// M-Pesa API URLs
const MPESA_URLS = {
  sandbox: {
    oauth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkPush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    stkQuery: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
  },
  production: {
    oauth: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    stkPush: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    stkQuery: 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query',
  },
};

const urls = MPESA_URLS[MPESA_CONFIG.environment as 'sandbox' | 'production'];

/**
 * Get M-Pesa OAuth Token
 */
export async function getMpesaToken(): Promise<string> {
  try {
    const auth = Buffer.from(
      `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(urls.oauth, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error: any) {
    console.error('[MPESA] Token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa token');
  }
}

/**
 * Generate M-Pesa Password
 */
function generatePassword(timestamp: string): string {
  const data = MPESA_CONFIG.shortcode + MPESA_CONFIG.passkey + timestamp;
  return Buffer.from(data).toString('base64');
}

/**
 * Generate Timestamp (YYYYMMDDHHmmss)
 */
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Format Phone Number
 * Converts various formats to 254XXXXXXXXX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('0')) {
    // 0712345678 -> 254712345678
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    // Already in correct format
    cleaned = cleaned;
  } else if (cleaned.startsWith('+254')) {
    // +254712345678 -> 254712345678
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    // 712345678 -> 254712345678
    cleaned = '254' + cleaned;
  }

  // Validate length (should be 12 digits: 254XXXXXXXXX)
  if (cleaned.length !== 12 || !cleaned.startsWith('254')) {
    throw new Error('Invalid Kenyan phone number format');
  }

  return cleaned;
}

/**
 * Initiate STK Push
 */
export interface STKPushParams {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface STKPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  responseDescription?: string;
  errorMessage?: string;
}

export async function initiateSTKPush(
  params: STKPushParams
): Promise<STKPushResponse> {
  try {
    // Get OAuth token
    const token = await getMpesaToken();

    // Format phone number
    const formattedPhone = formatPhoneNumber(params.phoneNumber);

    // Generate timestamp and password
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    // Prepare request payload
    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: params.amount,
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: params.accountReference,
      TransactionDesc: params.transactionDesc,
    };

    console.log('[MPESA] STK Push Request:', {
      phone: formattedPhone,
      amount: params.amount,
      reference: params.accountReference,
    });

    // Make STK Push request
    const response = await axios.post(urls.stkPush, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[MPESA] STK Push Response:', response.data);

    if (response.data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseDescription: response.data.ResponseDescription,
      };
    } else {
      return {
        success: false,
        errorMessage: response.data.ResponseDescription || 'STK Push failed',
      };
    }
  } catch (error: any) {
    console.error('[MPESA] STK Push error:', error.response?.data || error.message);
    return {
      success: false,
      errorMessage: error.response?.data?.errorMessage || 'Failed to initiate payment',
    };
  }
}

/**
 * Query STK Push Status
 */
export interface STKQueryParams {
  checkoutRequestId: string;
}

export async function querySTKPushStatus(
  params: STKQueryParams
): Promise<any> {
  try {
    const token = await getMpesaToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: params.checkoutRequestId,
    };

    const response = await axios.post(urls.stkQuery, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('[MPESA] STK Query error:', error.response?.data || error.message);
    throw new Error('Failed to query payment status');
  }
}

/**
 * Validate M-Pesa Configuration
 */
export function validateMpesaConfig(): boolean {
  const required = [
    MPESA_CONFIG.consumerKey,
    MPESA_CONFIG.consumerSecret,
    MPESA_CONFIG.shortcode,
    MPESA_CONFIG.passkey,
  ];

  return required.every(val => val && val.length > 0);
}
