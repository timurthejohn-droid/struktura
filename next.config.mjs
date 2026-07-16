/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт — сайт деплоится на GitHub Pages (папка out/).
  output: "export",
  // На Pages сайт живёт по адресу /struktura — путь задаётся в CI.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
