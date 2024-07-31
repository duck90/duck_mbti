/** @type {import('next').NextConfig} */
const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: false,
  images: {
    domains: ["s3.ap-northeast-2.amazonaws.com"],
  },
};
