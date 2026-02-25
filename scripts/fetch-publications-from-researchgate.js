/**
 * Fetches publications from a ResearchGate profile and writes publications.json.
 * Run from project root: node scripts/fetch-publications-from-researchgate.js
 *
 * Prerequisites: npm install puppeteer
 */

const fs = require('fs');
const path = require('path');

const PROFILE_URL = 'https://www.researchgate.net/profile/Denghui-Hu?ev=hdr_xprf';
const OUTPUT_PATH = path.join(__dirname, '..', 'publications.json');

async function main() {
  let browser;
  try {
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Loading ResearchGate profile…');
    await page.goto(PROFILE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for research content: common containers or publication links
    await page.waitForSelector('a[href*="/publication/"], [data-testid="research-item"], .nova-legacy-e-list, .ResearchItem', {
      timeout: 15000,
    }).catch(() => {});

    const publications = await page.evaluate(() => {
      const results = [];
      const links = document.querySelectorAll('a[href*="/publication/"]');
      const seen = new Set();

      links.forEach((a) => {
        const href = a.href;
        if (seen.has(href)) return;
        seen.add(href);

        const title = (a.textContent || '').trim();
        if (!title || title.length < 3) return;

        let year = '';
        let authors = '';
        let venue = '';

        const row = a.closest('li') || a.closest('[class*="list__item"]') || a.closest('div[class*="Item"]') || a.parentElement?.parentElement;
        if (row) {
          const text = row.textContent || '';
          const yearMatch = text.match(/\b(19|20)\d{2}\b/);
          if (yearMatch) year = yearMatch[0];
        }

        results.push({ title, authors, year, venue, url: href });
      });

      return results;
    });

    await browser.close();
    browser = null;

    if (publications.length === 0) {
      console.warn('No publications found. ResearchGate may have changed their HTML. You can edit publications.json by hand.');
      return;
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(publications, null, 2), 'utf8');
    console.log('Wrote', publications.length, 'publications to', OUTPUT_PATH);
  } catch (err) {
    console.error(err.message || err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
