/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // 在生产环境中不建议使用，因为它可能导致类型错误被忽略
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
