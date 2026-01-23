export function getAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, '');
  }
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim() || 'entrestate.com';
  const base =
    rootDomain.startsWith('http://') || rootDomain.startsWith('https://')
      ? rootDomain
      : `https://${rootDomain}`;
  return base.replace(/\/+$/, '');
}
