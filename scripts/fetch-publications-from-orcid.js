/**
 * Fetches works from ORCID profile and writes publications.json.
 * Run from project root: node scripts/fetch-publications-from-orcid.js
 *
 * No browser or API key needed. Uses public ORCID API:
 * https://info.orcid.org/documentation/api-tutorials/api-tutorial-read-data-on-a-record/
 */

const fs = require('fs');
const path = require('path');

const ORCID_ID = '0000-0002-1908-9637';
const WORKS_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
const OUTPUT_PATH = path.join(__dirname, '..', 'publications.json');

function parseWorksFromXml(xml) {
  const works = [];
  const summaryRegex = /<work:work-summary[^>]*>([\s\S]*?)<\/work:work-summary>/gi;
  let m;
  while ((m = summaryRegex.exec(xml)) !== null) {
    const block = m[1];
    const titleMatch = block.match(/<common:title[^>]*>([\s\S]*?)<\/common:title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
    const yearMatch = block.match(/<common:year[^>]*>([^<]+)<\/common:year>/i);
    const year = yearMatch ? yearMatch[1].trim() : '';
    const journalMatch = block.match(/<work:journal-title[^>]*>([\s\S]*?)<\/work:journal-title>/i);
    const venue = journalMatch ? journalMatch[1].replace(/\s+/g, ' ').trim() : '';
    let url = '';
    const urlMatch = block.match(/<common:url[^>]*>([^<]+)<\/common:url>/i);
    if (urlMatch) url = urlMatch[1].trim();
    if (!url) {
      const doiUrlMatch = block.match(/<common:external-id-url[^>]*>([^<]+)<\/common:external-id-url>/i);
      if (doiUrlMatch) url = doiUrlMatch[1].trim();
    }
    const typeMatch = block.match(/<work:type[^>]*>([^<]+)<\/work:type>/i);
    const type = typeMatch ? typeMatch[1].trim() : '';

    if (title) works.push({ title, authors: '', year, venue, url, type });
  }
  return works;
}

function parseWorksFromJson(data) {
  const works = [];
  const groups = data.group || [];
  groups.forEach((g) => {
    const list = g['work-summary'] != null ? (Array.isArray(g['work-summary']) ? g['work-summary'] : [g['work-summary']]) : [];
    list.forEach((w) => {
      const titleObj = w.title || w['work-title'];
      const title = (titleObj && (titleObj.title || titleObj.value)) ? (titleObj.title?.value ?? titleObj.value) : '';
      const pub = w['publication-date'] || w['publication-date'] || {};
      const year = (pub.year && pub.year.value) || pub.year || '';
      const venue = (w['journal-title'] && w['journal-title'].value) || w['journal-title'] || '';
      let url = w.url?.value ?? w.url ?? '';
      if (!url && w['external-ids'] && w['external-ids']['external-id']) {
        const ids = Array.isArray(w['external-ids']['external-id']) ? w['external-ids']['external-id'] : [w['external-ids']['external-id']];
        const doi = ids.find((e) => (e['external-id-type'] && e['external-id-type'].value === 'doi') || e['external-id-type'] === 'doi');
        if (doi && (doi['external-id-url'] || doi['external-id-url']?.value)) url = doi['external-id-url']?.value ?? doi['external-id-url'];
      }
      const type = w.type || '';
      if (title) works.push({ title, authors: '', year, venue, url, type });
    });
  });
  return works;
}

async function main() {
  const headers = {
    Accept: 'application/vnd.orcid+json',
    'User-Agent': 'CV-Web/1.0 (https://github.com)',
  };

  let body;
  let contentType = '';

  try {
    const res = await fetch(WORKS_URL, { headers });
    contentType = res.headers.get('content-type') || '';
    body = await res.text();
    if (!res.ok) throw new Error('ORCID API returned ' + res.status + ': ' + body.slice(0, 200));
  } catch (err) {
    console.error('Fetch failed:', err.message);
    process.exit(1);
  }

  let works = [];
  if (contentType.includes('json') && body.trim().startsWith('{')) {
    try {
      const data = JSON.parse(body);
      works = parseWorksFromJson(data);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      process.exit(1);
    }
  } else {
    works = parseWorksFromXml(body);
  }

  const seen = new Set();
  const out = works
    .filter((w) => {
      const key = (w.title + '|' + (w.year || '')).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((w) => ({
      title: w.title,
      authors: w.authors || '',
      year: w.year || '',
      venue: w.venue || '',
      url: w.url || '',
    }));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', out.length, 'publications to', OUTPUT_PATH);
}

main();
