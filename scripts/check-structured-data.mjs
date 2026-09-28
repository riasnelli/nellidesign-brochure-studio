import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const BUSINESS_ID = 'https://brochuredesign.pro/#professionalservice';
const SERVICE_ID = 'https://brochuredesign.pro/#services';
const EXPECTED_OFFERS = [
  'Corporate Brochure Design',
  'Company Profile Design',
  'Product Catalogue Design',
  'Annual Report Design',
  'Real Estate Brochure Design',
  'Event and Pitch Deck Design',
];

function extractSchema(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length, 'No JSON-LD scripts found');
  return scripts.map((match) => JSON.parse(match[1]));
}

function validate(html) {
  const nodes = extractSchema(html);
  const business = nodes.find((node) => node['@id'] === BUSINESS_ID);
  const service = nodes.find((node) => node['@id'] === SERVICE_ID);
  assert.ok(business, 'ProfessionalService is missing');
  assert.ok(Array.isArray(business['@type']) ? business['@type'].includes('ProfessionalService') : business['@type'] === 'ProfessionalService', 'Business has wrong schema type');
  assert.ok(service, 'Brochure design Service is missing');
  assert.equal(service.provider?.['@id'], BUSINESS_ID, 'Service does not link to the business');
  assert.equal(business.hasOfferCatalog?.['@id'], service.hasOfferCatalog?.['@id'], 'Business and service catalogs do not match');
  assert.ok(business.hasOfferCatalog?.['@id'], 'Business offer catalog is missing');

  const areas = business.areaServed ?? [];
  for (const name of ['India', 'Kerala', 'Kochi']) {
    assert.ok(areas.some((area) => area.name === name), `Service area ${name} is missing`);
  }
  const offers = service.hasOfferCatalog?.itemListElement?.map((offer) => offer.itemOffered?.name);
  assert.deepEqual(offers, EXPECTED_OFFERS, 'Brochure service offers have changed');
  return { business, service };
}

const [builtPath, liveUrl] = process.argv.slice(2);
if (!builtPath) {
  console.error('Usage: node scripts/check-structured-data.mjs dist/index.html [https://brochuredesign.pro/]');
  process.exit(2);
}

try {
  const built = validate(await readFile(builtPath, 'utf8'));
  console.log('Built HTML: ProfessionalService, India service area, and brochure offers verified.');

  if (liveUrl) {
    let lastError;
    for (let attempt = 1; attempt <= 6; attempt++) {
      try {
        const url = new URL(liveUrl);
        url.searchParams.set('schema_check', Date.now().toString());
        const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(15000) });
        assert.ok(response.ok, `Live site responded HTTP ${response.status}`);
        const live = validate(await response.text());
        assert.deepEqual(live.business, built.business, 'Live ProfessionalService differs from deployed build');
        assert.deepEqual(live.service, built.service, 'Live brochure Service differs from deployed build');
        console.log('Live Hostinger HTML: structured data matches the built page.');
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }
    if (lastError) throw lastError;
  }
} catch (error) {
  console.error(`Structured-data check failed: ${error.message}`);
  process.exitCode = 1;
}