/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimization was disabled, so 3408px-wide PNGs shipped raw to a ~600px
    // slot (~1.4 MB of images on the homepage). Enabling it lets next/image
    // resize and serve AVIF/WebP instead.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jhigiytvundazcvldlff.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
