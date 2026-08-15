/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Substitua pelo host do seu projeto Supabase, ex: abcdefgh.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
