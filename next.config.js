/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "i.waifu.pics"
        },
    {
        protocol: "https",
        hostname: "cdn.discordapp.com"
    }]
    }
}

module.exports = nextConfig
