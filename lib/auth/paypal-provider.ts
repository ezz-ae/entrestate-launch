import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface PayPalProfile {
  user_id?: string;
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

const defaultApiBase = 'https://api-m.paypal.com';
const defaultAuthBase = 'https://www.paypal.com';

export default function PayPalProvider<P extends PayPalProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const apiBase = process.env.PAYPAL_API_BASE || defaultApiBase;
  const isSandbox = apiBase.includes('sandbox');
  const authBase = isSandbox ? 'https://www.sandbox.paypal.com' : defaultAuthBase;

  return {
    id: 'paypal',
    name: 'PayPal',
    type: 'oauth',
    authorization: {
      url: `${authBase}/signin/authorize`,
      params: {
        scope: 'openid email profile',
      },
    },
    token: `${apiBase}/v1/oauth2/token`,
    userinfo: `${apiBase}/v1/oauth2/token/userinfo?schema=openid`,
    checks: ['pkce', 'state'],
    idToken: true,
    profile(profile) {
      const fullName =
        profile.name ||
        [profile.given_name, profile.family_name].filter(Boolean).join(' ') ||
        profile.email ||
        '';
      return {
        id: profile.user_id || profile.sub || profile.email || '',
        name: fullName,
        email: profile.email,
        image: null,
      };
    },
    options,
  };
}
