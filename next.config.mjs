import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const rawEnableFirebaseAuth = process.env.ENABLE_FIREBASE_AUTH;
const defaultEnableFirebaseAuth =
  rawEnableFirebaseAuth === undefined ? (process.env.NODE_ENV === 'production' ? 'true' : 'false') : rawEnableFirebaseAuth;
const publicEnableFirebaseAuth = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_AUTH ?? defaultEnableFirebaseAuth;
const isVercelPreview = process.env.VERCEL_ENV === 'preview';
const vercelLiveSources = isVercelPreview ? ['https://vercel.live', 'https://*.vercel.live'] : [];
const vercelLiveConnectSources = isVercelPreview ? ['wss://*.vercel.live', ...vercelLiveSources] : [];

const securityHeaders = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "img-src 'self' https: data:",
            "font-src 'self' data:",
            [
                'script-src',
                [
                    "'self'",
                    "'unsafe-inline'",
                    'https://connect.facebook.net',
                    ...vercelLiveSources,
                ].join(' '),
            ].join(' '),
            [
                'script-src-elem',
                [
                    "'self'",
                    "'unsafe-inline'",
                    'https://connect.facebook.net',
                    ...vercelLiveSources,
                ].join(' '),
            ].join(' '),
            "style-src 'self' 'unsafe-inline'",
            [
                'connect-src',
                ["'self'", 'https:', ...vercelLiveConnectSources].join(' '),
            ].join(' '),
            "frame-ancestors 'self'",
        ].join('; '),
    },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_ENABLE_FIREBASE_AUTH: publicEnableFirebaseAuth,
    },
    webpack: (config, { isServer }) => {
        // Resolve Firebase modules to their browser-specific versions for client-side
        if (!isServer) {
            config.resolve.alias['firebase/app'] = require.resolve('firebase/app');
            config.resolve.alias['firebase/auth'] = require.resolve('firebase/auth');
            config.resolve.alias['firebase/firestore'] = require.resolve('firebase/firestore');
        }
        return config;
    },
    turbopack: {
        // Force Next.js to treat this folder as the workspace root so .env.local is loaded here.
        root: __dirname,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.adsttc.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '4.5mb',
        },
    },
    async redirects() {
        return [
            {
                source: '/trending',
                destination: '/instagram-assistant',
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    async rewrites() {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
        const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${rootDomain}`;
        const normalizedSiteDomain = siteDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        const hostPattern = `(?<subdomain>[^.]+)\\.${normalizedSiteDomain.replace(/\./g, '\\.')}`;

        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: hostPattern }],
                destination: '/p/:subdomain',
            },
        ];
    },
};

export default nextConfig;
