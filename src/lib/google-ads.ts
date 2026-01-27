import type { GoogleAdsApi as GoogleAdsApiType } from 'google-ads-api';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const REDIRECT_URI = process.env.GOOGLE_ADS_REDIRECT_URI;

export async function getGoogleAdsCustomer(tenantId?: string) {
  if (!CLIENT_ID || !CLIENT_SECRET || !DEVELOPER_TOKEN) {
    console.warn('[GoogleAds] Missing API credentials in environment variables.');
    return null;
  }

  // Dynamically import to avoid build errors if package is missing or in edge runtime
  const { GoogleAdsApi } = await import('google-ads-api');

  const client = new GoogleAdsApi({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    developer_token: DEVELOPER_TOKEN,
  });

  let REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  let CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID; // Your Manager Account or Ad Account ID

  if (tenantId) {
    const db = (await import('@/server/firebase-admin')).getAdminDb();
    const tokens = await getGoogleAdsTokensFromFirestore(tenantId, db);
    if (tokens?.refresh_token) {
      REFRESH_TOKEN = tokens.refresh_token;
      // In a real multi-tenant app, you'd also store/retrieve the customer_id per tenant
    }
  }

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

export async function exchangeAuthCodeForTokens(authCode: string, redirectUri: string) {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    redirectUri || REDIRECT_URI
  );

  const { tokens } = await oAuth2Client.getToken(authCode);
  return tokens;
}

export async function saveGoogleAdsTokensToFirestore(tenantId: string, tokens: any, db: any) {
  // Placeholder for saving tokens to Firestore
  console.log('Saving Google Ads tokens for tenant', tenantId);
  if (db && typeof db.collection === 'function') {
    await db.collection('tenants').doc(tenantId).collection('integrations').doc('google_ads').set(tokens, { merge: true });
  }
}

export async function getGoogleAdsTokensFromFirestore(tenantId: string, db: any) {
  if (db && typeof db.collection === 'function') {
    const doc = await db.collection('tenants').doc(tenantId).collection('integrations').doc('google_ads').get();
    return doc.exists ? doc.data() : null;
  }
  return null;
}

export function generateAuthUrl(redirectUri: string) {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    redirectUri || REDIRECT_URI
  );

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/adwords'],
    prompt: 'consent', // Force consent to ensure we get a refresh token
  });
}

export async function refreshAccessToken(refreshToken: string) {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET
  );
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oAuth2Client.refreshAccessToken();
  return credentials;
}

export async function removeGoogleAdsTokensFromFirestore(tenantId: string, db: any) {
  if (db && typeof db.collection === 'function') {
    await db.collection('tenants').doc(tenantId).collection('integrations').doc('google_ads').delete();
  }
}