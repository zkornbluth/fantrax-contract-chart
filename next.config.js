/** 
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'fantrax-contract-chart';

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isGitHubPages ? `/${repoName}/` : '',
  basePath: isGitHubPages ? `/${repoName}` : '',
};

module.exports = nextConfig;