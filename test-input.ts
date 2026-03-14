import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to homepage...");
  await page.goto("http://localhost:3000");

  // Wait for content to load
  await page.waitForSelector("h1");

  // Try to find and interact with textarea
  const textarea = page.locator("textarea");
  const isVisible = await textarea.isVisible();
  console.log("Textarea visible:", isVisible);

  // Try to click on textarea
  await textarea.click();
  console.log("Clicked on textarea");

  // Try to type
  await textarea.fill("console.log('test')");
  console.log("Filled textarea");

  const value = await textarea.inputValue();
  console.log("Textarea value:", value);

  // Get bounding box
  const box = await textarea.boundingBox();
  console.log("Textarea box:", box);

  await browser.close();
  console.log("Done!");
}

main().catch(console.error);
