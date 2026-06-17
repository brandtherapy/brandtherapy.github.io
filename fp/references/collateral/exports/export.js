const { chromium } = require('/Users/florian/.npm/_npx/705bc6b22212b352/node_modules/playwright');
const path = require('path');

const COLLATERAL_DIR = '/Users/florian/Projects/FP/brand-os/source/output/collateral';
const EXPORTS_DIR = path.join(COLLATERAL_DIR, 'exports');
const DPR = 2; // device scale factor for retina

async function screenshotElement(page, selector, outputPath, label) {
  const el = await page.$(selector);
  if (!el) {
    console.error(`  MISS: ${label} — selector '${selector}' not found`);
    return false;
  }
  await el.screenshot({ path: outputPath });
  console.log(`  OK: ${label} → ${path.basename(outputPath)}`);
  return true;
}

async function screenshotAllElements(page, selector, prefix, outputDir) {
  const els = await page.$$(selector);
  console.log(`  Found ${els.length} elements matching '${selector}'`);
  const results = [];
  for (let i = 0; i < els.length; i++) {
    const outputPath = path.join(outputDir, `${prefix}-${i + 1}.png`);
    await els[i].screenshot({ path: outputPath });
    console.log(`  OK: ${prefix}-${i + 1} → ${path.basename(outputPath)}`);
    results.push(outputPath);
  }
  return results;
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({ deviceScaleFactor: DPR });

  try {
    // ============================================================
    // C01 - Instagram Carousel: 5 slides, 360x450 each → 720x900 @2x
    // ============================================================
    console.log('\n=== C01: Instagram Carousel ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(`file://${COLLATERAL_DIR}/c01-ig-carousel.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // let fonts settle
      const slides = await page.$$('.slide');
      console.log(`  Found ${slides.length} slides`);
      for (let i = 0; i < slides.length; i++) {
        await slides[i].screenshot({
          path: path.join(EXPORTS_DIR, `c01-ig-carousel-${i + 1}.png`),
        });
        console.log(`  OK: slide ${i + 1}`);
      }
      await page.close();
    }

    // ============================================================
    // C02 - Social Quote Cards: 6 cards, 340x340 each → 680x680 @2x
    // ============================================================
    console.log('\n=== C02: Social Quote Cards ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1200, height: 1000 });
      await page.goto(`file://${COLLATERAL_DIR}/c02-social-quotes.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const cards = await page.$$('.card');
      console.log(`  Found ${cards.length} cards`);
      for (let i = 0; i < cards.length; i++) {
        await cards[i].screenshot({
          path: path.join(EXPORTS_DIR, `c02-social-quotes-${i + 1}.png`),
        });
        console.log(`  OK: card ${i + 1}`);
      }
      await page.close();
    }

    // ============================================================
    // C03 - LinkedIn + Instagram Stories
    //   LinkedIn: 3 li-card elements (600x314)
    //   Stories: 4 story elements (240x427)
    // ============================================================
    console.log('\n=== C03: LinkedIn + Instagram Stories ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1400, height: 1200 });
      await page.goto(`file://${COLLATERAL_DIR}/c03-linkedin-story.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const liCards = await page.$$('.li-card');
      console.log(`  Found ${liCards.length} LinkedIn cards`);
      const liNames = ['li-a', 'li-b', 'li-c'];
      for (let i = 0; i < liCards.length; i++) {
        const name = liNames[i] || `${i + 1}`;
        await liCards[i].screenshot({
          path: path.join(EXPORTS_DIR, `c03-linkedin-${name}.png`),
        });
        console.log(`  OK: LinkedIn ${name}`);
      }

      const stories = await page.$$('.story');
      console.log(`  Found ${stories.length} Instagram stories`);
      const storyNames = ['a', 'b', 'c', 'd'];
      for (let i = 0; i < stories.length; i++) {
        const name = storyNames[i] || `${i + 1}`;
        await stories[i].screenshot({
          path: path.join(EXPORTS_DIR, `c03-ig-story-${name}.png`),
        });
        console.log(`  OK: story-${name}`);
      }
      await page.close();
    }

    // ============================================================
    // C07 - Presentation Slides: 8 slides, 640x360 each → 1280x720 @2x
    // ============================================================
    console.log('\n=== C07: Presentation Slides ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1400, height: 1200 });
      await page.goto(`file://${COLLATERAL_DIR}/c07-slides.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const slides = await page.$$('.slide');
      console.log(`  Found ${slides.length} slides`);
      for (let i = 0; i < slides.length; i++) {
        await slides[i].screenshot({
          path: path.join(EXPORTS_DIR, `c07-slides-${i + 1}.png`),
        });
        console.log(`  OK: slide ${i + 1}`);
      }
      await page.close();
    }

    // ============================================================
    // C08 - Email: 3 header banners + 1 full newsletter template
    // ============================================================
    console.log('\n=== C08: Email Headers + Newsletter ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 800, height: 2000 });
      await page.goto(`file://${COLLATERAL_DIR}/c08-email-newsletter.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const headers = await page.$$('.email-header');
      console.log(`  Found ${headers.length} email headers`);
      const headerNames = ['btw', 'article', 'promo'];
      for (let i = 0; i < headers.length; i++) {
        const name = headerNames[i] || `${i + 1}`;
        await headers[i].screenshot({
          path: path.join(EXPORTS_DIR, `c08-email-header-${name}.png`),
        });
        console.log(`  OK: header-${name}`);
      }

      const template = await page.$('.email-template');
      if (template) {
        await template.screenshot({
          path: path.join(EXPORTS_DIR, 'c08-email-newsletter.png'),
        });
        console.log('  OK: full newsletter template');
      }
      await page.close();
    }

    // ============================================================
    // C11 - Print Collateral
    //   Business cards: 4 .biz-card elements (350x200)
    //   Badges: 2 .badge elements (280x420)
    //   Letterhead: 1 .letterhead (600px wide)
    // ============================================================
    console.log('\n=== C11: Print Collateral ===');
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1000, height: 2000 });
      await page.goto(`file://${COLLATERAL_DIR}/c11-print-collateral.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const bizCards = await page.$$('.biz-card');
      console.log(`  Found ${bizCards.length} business cards`);
      const cardNames = ['dark-front', 'white-back', 'white-front', 'dark-back'];
      for (let i = 0; i < bizCards.length; i++) {
        const name = cardNames[i] || `${i + 1}`;
        await bizCards[i].screenshot({
          path: path.join(EXPORTS_DIR, `c11-business-card-${name}.png`),
        });
        console.log(`  OK: business-card-${name}`);
      }

      const badges = await page.$$('.badge');
      console.log(`  Found ${badges.length} badges`);
      const badgeNames = ['speaker', 'attendee'];
      for (let i = 0; i < badges.length; i++) {
        const name = badgeNames[i] || `${i + 1}`;
        await badges[i].screenshot({
          path: path.join(EXPORTS_DIR, `c11-badge-${name}.png`),
        });
        console.log(`  OK: badge-${name}`);
      }

      const letterhead = await page.$('.letterhead');
      if (letterhead) {
        await letterhead.screenshot({
          path: path.join(EXPORTS_DIR, 'c11-letterhead.png'),
        });
        console.log('  OK: letterhead');
      }
      await page.close();
    }

  } finally {
    await context.close();
    await browser.close();
  }

  console.log('\n=== DONE ===');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
