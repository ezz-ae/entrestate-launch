import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google Ads for Real Estate | Entrestate',
  description: 'Launch Google Ads for your properties and track leads with simple reporting.',
  alternates: {
    canonical: '/google-ads',
  },
  openGraph: {
    title: 'Google Ads for Real Estate | Entrestate',
    description: 'Launch Google Ads for your properties and track leads with simple reporting.',
    url: '/google-ads',
  },
};

export default function GoogleAdsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
