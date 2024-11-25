import { chromium, test as setup } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const authFile = ".auth/user.json";

setup("authenticate", async () => {
  const browser = await chromium.launch({
    headless: false, // Open the browser with UI
    slowMo: 50, // Slows down actions to see what's happening
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto("https://www.figma.com/login");

  // Fill in email and password fields (you can manually modify or override these as needed)
  await page
    .getByRole("textbox", { name: "email" })
    .fill(process.env.FIGMA_EMAIL!);
  await page
    .getByRole("textbox", { name: "password" })
    .fill(process.env.FIGMA_PASSWORD!);

  await page.getByRole("button", { name: "log in" }).click();

  // Popup for manual interaction
  console.log(
    "Manual login needed. Please sign in through the browser window."
  );

  // Give time for manual interaction before proceeding
  await new Promise((resolve) => {
    // Wait for 2 minutes for manual login; you can adjust this timeout as needed
    setTimeout(() => {
      resolve(true);
    }, 10 * 1000); // 120 seconds
  });

  // Save session state to authFile after login is complete
  await page.context().storageState({ path: authFile });

  // Close the browser after authentication
  await browser.close();

  console.log("Authentication completed and state saved.");
});
