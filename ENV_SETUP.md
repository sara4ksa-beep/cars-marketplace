# Environment Variables Setup

## Tap Payments API Credentials

Add these to your `.env` file:

```env
# Tap Payments API - TEST MODE
TAP_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
TAP_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
TAP_API_URL=https://api.tap.company/v2

# Tap Payments API - PRODUCTION MODE (when ready)
# TAP_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
# TAP_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE

# Webhook Secret (set this in Tap dashboard)
TAP_WEBHOOK_SECRET=your_webhook_secret_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Test Mode (optional - automatically enabled in development)
# Set to 'true' to enable test mode that bypasses payment
# TEST_MODE=true
```

## Test Mode

The application includes a **Test Mode** feature that allows you to test the payment flow without actually processing payments:

- **Automatic in Development**: Test mode is automatically enabled when running on `localhost` or when `NODE_ENV=development`
- **Manual Override**: You can set `TEST_MODE=true` in your `.env` file to enable it in any environment
- **Test Button**: When test mode is active, a purple "🧪 تجربة بدون دفع (Test Mode)" button appears below the regular payment button
- **How it works**: Clicking the test button will:
  - Mark the deposit as PAID immediately
  - Skip the Tap payment gateway
  - Allow you to test the bidding flow without real payments

**Note**: Test mode only works on `localhost` for security reasons.

## goSell API (Old API - if needed)

If you need to use the old goSell API instead:

```env
# goSell API Credentials
GOSELL_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
GOSELL_USERNAME=YOUR_USERNAME_HERE
GOSELL_PASSWORD=YOUR_PASSWORD_HERE
GOSELL_API_KEY=YOUR_API_KEY_HERE
GOSELL_API_URL=https://api.gosell.io
```

## Important Notes

1. **Restart your Next.js dev server** after updating `.env` file
2. Never commit your `.env` file to version control
3. Use test credentials for development
4. Switch to production credentials only when deploying to production


