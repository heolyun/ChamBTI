import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const rawSiteUrl = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || ''
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

const indexPath = resolve(distDir, 'index.html')
const indexHtml = await readFile(indexPath, 'utf8')
const patchedIndexHtml = siteUrl
  ? indexHtml.replace(
      '</title>',
      `</title>
    <link rel="canonical" href="${siteUrl}/" />
    <meta property="og:url" content="${siteUrl}/" />`,
    )
  : indexHtml

const robots = siteUrl
  ? `User-agent: *
Allow: /
Disallow: /result/

Sitemap: ${siteUrl}/sitemap.xml
`
  : `User-agent: *
Allow: /
Disallow: /result/
`

await mkdir(distDir, { recursive: true })
await writeFile(indexPath, patchedIndexHtml, 'utf8')
await writeFile(resolve(distDir, 'robots.txt'), robots, 'utf8')

if (siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
  </url>
</urlset>
`

  await writeFile(resolve(distDir, 'sitemap.xml'), sitemap, 'utf8')
}
