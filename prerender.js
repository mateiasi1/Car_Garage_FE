/**
 * Prerender script for SEO
 *
 * Generates static HTML for public routes at build time.
 * This ensures search engine crawlers see fully rendered content
 * without needing to execute JavaScript.
 *
 * Run after `vite build`: node prerender.js
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, 'dist');

// Public routes to prerender (only pages that should be indexed by search engines)
const ROUTES = ['/', '/stations', '/inspector', '/customer/login', '/terms'];

async function prerender() {
  console.log('🔍 Starting prerendering for SEO...');
  console.log(`📁 Output directory: ${DIST_DIR}`);
  console.log(`📄 Routes to prerender: ${ROUTES.join(', ')}`);

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch {
    console.warn('⚠️  Puppeteer not available. Skipping prerendering.');
    console.warn('   Install with: npm install --save-dev puppeteer');
    console.warn('   The site will still work - Google renders JS, but prerendering improves crawl speed.');
    process.exit(0);
  }

  // Start a simple static file server for the dist directory
  const { createServer } = await import('http');
  const handler = await createStaticHandler(DIST_DIR);
  const server = createServer(handler);

  const PORT = 4173;
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`🌐 Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();

      // Wait for network to be idle (all API calls finished)
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait a bit more for React to finish rendering
      await page.waitForTimeout(2000);

      // Get the fully rendered HTML
      const html = await page.content();

      // Determine output path
      const outputPath =
        route === '/'
          ? path.join(DIST_DIR, 'index.html')
          : path.join(DIST_DIR, route, 'index.html');

      // Create directory if needed
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`✅ Prerendered: ${route} → ${path.relative(DIST_DIR, outputPath)}`);

      await page.close();
    } catch (err) {
      console.error(`❌ Failed to prerender ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('\n🎉 Prerendering complete!');
}

async function createStaticHandler(distDir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };

  return (req, res) => {
    let filePath = path.join(distDir, req.url === '/' ? '/index.html' : req.url);

    // If path doesn't have extension, try serving index.html (SPA fallback)
    if (!path.extname(filePath)) {
      filePath = path.join(distDir, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA fallback - serve index.html for any route
      const indexPath = path.join(distDir, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    }
  };
}

prerender().catch((err) => {
  console.error('Prerendering failed:', err);
  // Don't fail the build - the site still works without prerendering
  process.exit(0);
});
