# Tap Payment Gateway Setup

## Test Credentials

Add these to your `.env` file (get credentials from your Tap dashboard):

```env
# Tap Payment Gateway - TEST MODE
TAP_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
TAP_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
TAP_API_URL=https://api.tap.company/v2
TAP_WEBHOOK_SECRET=your_webhook_secret_here

# Application URL (for redirects and webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (for automated auction ending)
CRON_SECRET=your_cron_secret_here
```

## Production Credentials (when ready)

```env
# Tap Payment Gateway - PRODUCTION MODE
TAP_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
TAP_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

## Getting Your Credentials

1. Log in to your Tap Payments dashboard
2. Navigate to API Settings
3. Copy your Test and Production keys
4. Add them to your `.env` file

**Note:** Never commit your `.env` file to version control. Keep your API keys secure.

## Webhook Setup

1. Go to your Tap dashboard
2. Navigate to Webhooks section
3. Add webhook URL: `https://yourdomain.com/api/payments/tap-webhook`
4. Copy the webhook secret and add it to `TAP_WEBHOOK_SECRET` in your `.env` file

## Testing

- Use test cards from Tap documentation for testing
- Test mode uses `sk_test_` and `pk_test_` keys
- Production mode uses `sk_live_` and `pk_live_` keys

