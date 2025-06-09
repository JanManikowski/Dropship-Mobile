import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
/* global process */

async function fetchAliProduct(rawUrl) {
  const cleanUrl = rawUrl.split('?')[0];

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const page = await browser.newPage();

  // Stealth: hide webdriver
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  // desktop UA
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/116.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1280, height: 800 });

  // go!
  await page.goto(cleanUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  // give the slider a moment to lazy-load its imgs
  await page.waitForTimeout(3000);

  // try the “normal” selector first, then fallback to data-src if needed
  let images = [];
  try {
    await page.waitForSelector('.slides .slide img[src]', { timeout: 10000 });
    images = await page.$$eval(
      '.slides .slide img[src]',
      imgs => imgs.map(i => i.getAttribute('src'))
    );
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    console.warn('⚠️  Primary img selector failed, trying fallback…');
    // fallback to data-src (some versions of the page lazy-load into data-src)
    images = await page.$$eval(
      '.slides .slide img[data-src]',
      imgs => imgs.map(i => i.getAttribute('data-src'))
    );
  }

  // title
  const title = await page
    .$$eval('h1[data-pl="product-title"]', els =>
      els.length ? els[0].innerText.trim() : null
    )
    .then(t => t)
    .catch(() => null)
    ||
    await page
      .$$eval('h1[data-tticheck] span', els =>
        els.length ? els[0].innerText.trim() : null
      )
      .catch(() => null);

  // description
  const description = await page
    .$$eval('.detail-desc-decorate-richtext', els =>
      els.length ? els[0].innerHTML : null
    )
    .catch(() => null);

  await browser.close();
  return { title, description, images: images.filter(Boolean) };
}

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.post('/api/product/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing `url`' });
  try {
    const product = await fetchAliProduct(url);
    if (!product.title) {
      throw new Error('Could not find a product title');
    }
    res.json(product);
  } catch (err) {
    console.error('🚨 fetchAliProduct error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
