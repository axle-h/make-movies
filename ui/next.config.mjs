/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/movies',
                permanent: false,
            },
        ]
    }
};

export default nextConfig;
