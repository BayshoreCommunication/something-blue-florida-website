/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Move this outside the remotePatterns array
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'bayshore.nyc3.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'dashboard-sabbir-nasir.vercel.app',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'backend-sabbir-nasir.vercel.app',
        port: '',
      },
    ],
  },
  skipTrailingSlashRedirect: true,
  // Add headers for PDF files
  async headers() {
    return [
      {
        source: '/Sabbir-Nasir-Transformation-Framework.pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment; filename="Sabbir-Nasir-Transformation-Framework.pdf"',
          },
        ],
      },
    ];
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
