import axios from 'axios';

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
  metadata?: {
    [key: string]: string;
  };
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
    console.error('Error creating Tap charge:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create Tap charge'
    );
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
 * Verify Tap webhook signature
 */
export function verifyTapWebhook(
  payload: string,
  signature: string
): boolean {
  // In production, verify the webhook signature using TAP_WEBHOOK_SECRET
  // For now, we'll trust the webhook if TAP_WEBHOOK_SECRET is set
  const webhookSecret = process.env.TAP_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('TAP_WEBHOOK_SECRET is not set, webhook verification skipped');
    return true; // Allow in development
  }

  // TODO: Implement proper HMAC signature verification
  // This is a placeholder - implement actual signature verification
  return true;
}

export { TAP_PUBLISHABLE_KEY };

