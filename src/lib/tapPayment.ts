import axios from 'axios';
import crypto from 'crypto';

const TAP_SECRET_KEY = process.env.TAP_SECRET_KEY;
const TAP_PUBLISHABLE_KEY = process.env.TAP_PUBLISHABLE_KEY;
const TAP_API_URL = process.env.TAP_API_URL || 'https://api.tap.company/v2';

if (!TAP_SECRET_KEY) {
  console.warn('TAP_SECRET_KEY is not set in environment variables');
}

export interface TapChargeRequest {
  amount: number;
  currency: string;
  customer: {
    first_name: string;
    email: string;
    phone?: {
      country_code: string;
      number: string;
    };
  };
  source?: {
    id: string;
  };
  redirect?: {
    url: string;
  };
  post?: {
    url: string;
  };
  metadata?: {
    [key: string]: string;
  };
  description?: string;
}

export interface TapChargeResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  redirect?: {
    url: string;
  };
  transaction?: {
    url: string;
  };
}

export interface TapRefundRequest {
  charge_id: string;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface TapRefundResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  charge: string;
}

/**
 * Create a Tap charge for payment
 */
export async function createTapCharge(
  request: TapChargeRequest
): Promise<TapChargeResponse> {
  if (!TAP_SECRET_KEY) {
    throw new Error('TAP_SECRET_KEY is not configured');
  }

  try {
    const response = await axios.post(
      `${TAP_API_URL}/charges`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${TAP_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    const errors = errorData?.errors || [];
    
    console.error('Error creating Tap charge:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errors: errors,
      fullResponse: JSON.stringify(errorData, null, 2),
      requestData: JSON.stringify(request, null, 2),
    });
    
    // Provide more detailed error message
    let errorMessage = 'Failed to create Tap charge';
    if (errors && errors.length > 0) {
      const firstError = errors[0];
      errorMessage = firstError.message || firstError.code || errorMessage;
      if (firstError.field) {
        errorMessage = `${firstError.field}: ${errorMessage}`;
      }
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Create a refund for a Tap charge
 */
export async function createTapRefund(
  request: TapRefundRequest
): Promise<TapRefundResponse> {
  if (!TAP_SECRET_KEY) {
    throw new Error('TAP_SECRET_KEY is not configured');
  }

  try {
    const response = await axios.post(
      `${TAP_API_URL}/refunds`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${TAP_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating Tap refund:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create Tap refund'
    );
  }
}

/**
 * Retrieve a Tap charge by ID
 */
export async function getTapCharge(chargeId: string): Promise<TapChargeResponse> {
  if (!TAP_SECRET_KEY) {
    throw new Error('TAP_SECRET_KEY is not configured');
  }

  try {
    const response = await axios.get(
      `${TAP_API_URL}/charges/${chargeId}`,
      {
        headers: {
          'Authorization': `Bearer ${TAP_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error retrieving Tap charge:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to retrieve Tap charge'
    );
  }
}

/**
 * Verify Tap webhook signature using HMAC-SHA256
 */
export function verifyTapWebhook(
  payload: string,
  signature: string
): boolean {
  const webhookSecret = process.env.TAP_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.warn('TAP_WEBHOOK_SECRET is not set, webhook verification skipped');
    // In development, allow webhooks without verification
    // In production, this should return false
    return process.env.NODE_ENV === 'development';
  }

  if (!signature) {
    console.error('No signature provided in webhook');
    return false;
  }

  try {
    // Create HMAC-SHA256 hash of the payload
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    // Tap may send signature in different formats (hex, base64, or with prefix)
    // Try to match the signature
    const signatureToCompare = signature.replace(/^sha256=/, '').toLowerCase();
    const expectedSignatureLower = expectedSignature.toLowerCase();
    
    // Use constant-time comparison to prevent timing attacks
    if (signatureToCompare.length !== expectedSignatureLower.length) {
      console.error('Signature length mismatch');
      return false;
    }
    
    let match = true;
    for (let i = 0; i < signatureToCompare.length; i++) {
      if (signatureToCompare[i] !== expectedSignatureLower[i]) {
        match = false;
      }
    }
    
    if (!match) {
      console.error('Webhook signature verification failed');
      console.error('Expected:', expectedSignatureLower);
      console.error('Received:', signatureToCompare);
    }
    
    return match;
  } catch (error: any) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

export { TAP_PUBLISHABLE_KEY };

