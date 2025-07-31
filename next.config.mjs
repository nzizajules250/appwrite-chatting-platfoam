/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // Apply these headers to all routes
          source: "/(.*)",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Allow all origins (replace with your domain in production)
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
    // Proxy Appwrite API requests (optional but recommended for local dev)
    async rewrites() {
      return [
        {
          source: "/appwrite/:path*",
          destination: "https://fra.cloud.appwrite.io/v1/:path*", // Your Appwrite endpoint
        },
      ];
    },
  };
  
  export default nextConfig;