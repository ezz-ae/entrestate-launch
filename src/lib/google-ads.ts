import { GoogleAdsApi } from 'google-ads-api';

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

export async function getGoogleAdsCustomer() {
  if (!CLIENT_ID || !CLIENT_SECRET || !DEVELOPER_TOKEN) {
    console.warn('[GoogleAds] Missing API credentials in environment variables.');
    return null;
  }

  const client = new GoogleAdsApi({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    developer_token: DEVELOPER_TOKEN,
  });

  const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID; // Your Manager Account or Ad Account ID

  if (!REFRESH_TOKEN || !CUSTOMER_ID) {
    console.warn('[GoogleAds] Missing Refresh Token or Customer ID.');
    return null;
  }

  return client.Customer({
    customer_id: CUSTOMER_ID,
    refresh_token: REFRESH_TOKEN,
  });
}

export async function validateGoogleAdsCredentials() {
  try {
    const customer = await getGoogleAdsCustomer();
    if (!customer) {
      return { valid: false, message: 'Missing credentials configuration.' };
    }

    // Perform a lightweight query to validate access
    // Querying for the customer ID itself is a safe way to check auth
    await customer.query(`SELECT customer.id FROM customer LIMIT 1`);

    return { valid: true, message: 'Credentials are valid.' };
  } catch (error: any) {
    return { valid: false, message: error.message || 'Failed to validate credentials.' };
  }
}