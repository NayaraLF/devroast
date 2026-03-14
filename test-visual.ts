import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to homepage...");
  await page.goto("http://localhost:3000");

  // Wait for content to load
  await page.waitForSelector("h1");

  // Take screenshot
  await page.screenshot({ path: "homepage.png", fullPage: true });
  console.log("Screenshot saved to homepage.png");

  // Test leaderboard page
  console.log("Navigating to leaderboard...");
  await page.goto("http://localhost:3000/leaderboard");
  await page.waitForSelector("h1");
  await page.screenshot({ path: "leaderboard.png", fullPage: true });
  console.log("Screenshot saved to leaderboard.png");

  await browser.close();
  console.log("Done!");
}

main().catch(console.error);
