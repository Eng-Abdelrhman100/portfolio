import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable SSR for specific pages if needed
    // ssr: false, // Uncomment if you want to disable SSR entirely
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the frontend to prevent this error on build
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    config.externals = config.externals || [];

    if (isServer) {
      config.externals.push({
        "react-lottie": "react-lottie",
      });
    }

    return config;
  },

  // Disable static generation for pages with SSR issues
  generateStaticParams: false,

  // Add transpilation for problematic packages
  transpilePackages: ["react-lottie"],

  // Disable minification if it's causing issues
  // swcMinify: false,

  images: {
    // Add image optimization settings
    // domains: ["localhost"],
    // unoptimized: true, // Disable image optimization if needed
  },
};

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "",
    project: "",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
