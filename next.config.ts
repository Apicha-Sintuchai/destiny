import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
    },
    images: {
        domains: ["i.pinimg.com", "103.117.149.61", "127.0.0.1:9000", "image.xcoptech.net"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "9000",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
