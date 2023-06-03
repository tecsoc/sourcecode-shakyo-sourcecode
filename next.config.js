/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const repository = process.env.GITHUB_REPOSITORY;
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const repositoryName = repository?.replace(repositoryOwner, "");
const nextConfig = {
  assetPrefix: isProduction ? repositoryName : "",
  output: "export"
};

module.exports = nextConfig;
