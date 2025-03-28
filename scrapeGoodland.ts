import puppeteer from 'puppeteer';

export type CourtAvailability = {
  time: string;
  info: string;
};

export const scrapeCourtAvailability = async (): Promise<CourtAvailability[]> => {
  console.log('Starting browser...');
  const browser = await puppeteer.launch();
  
  console.log('Opening new page...');
  const page = await browser.newPage();

  // Navigate to the booking page
  console.log('Navigating to booking page...');
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // Gets YYYY-MM-DD format
  await page.goto(`https://goodland.podplay.app/book/greenpoint-indoor-1/${formattedDate}`);

  // Wait for court list to appear
  await page.waitForSelector('ol[class*="BookingItemPicker"][class*="sessions-list"]');
  
  // Instead of a fixed timeout, wait for content to be ready
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('ol[class*="BookingItemPicker"][class*="sessions-list"] > li');
    // Check if we have items and if they have the expected content
    return items.length > 0 && 
           items[0].querySelector('div[class*="sessions-list-item-time"]')?.textContent?.trim() !== '';
  }, { timeout: 10000 });

  console.log('Extracting court availability data...');
  const availability = await page.evaluate(() => {
    // Use more resilient selectors that rely on structure rather than exact class names
    const items = Array.from(
      document.querySelectorAll('ol[class*="BookingItemPicker"][class*="sessions-list"] > li')
    );

    return items.map((item) => {
      // Use partial class name matching with attribute selectors
      const timeEl = item.querySelector<HTMLTimeElement>(
        'div[class*="sessions-list-item-time"] time'
      );
      const infoEl = item.querySelector<HTMLDivElement>(
        'div[class*="sessions-list-item-info-tables"]'
      );

      const time = timeEl?.textContent?.trim() || 'Unknown time';
      const info = infoEl?.textContent?.trim() || 'No availability info';

      return { time, info };
    });
  });
  
  console.log('Closing browser...');
  await browser.close();
  
  console.log('Scraping complete!');
  return availability;
};