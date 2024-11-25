import { chromium, test } from "@playwright/test";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "path";

// Load environment variables
dotenv.config();

// Read JSON file
const projects = JSON.parse(
  fs.readFileSync("files.json", { encoding: "utf-8" })
);

// Simulate random delays for human-like behavior
const randomDelay = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Simulate human-like mouse movements
const humanMouseMove = async (page: any, selector: string) => {
  const element = await page.locator(selector);
  const box = await element.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps: Math.floor(Math.random() * 10) + 5,
    });
  }
};

// Iterate through projects
for (const project of projects) {
  const projectName = project.name || "Drafts";
  const teamId = project.team_id || null;

  test.describe(`project: ${projectName} (${project.id})`, () => {
    for (const file of project.files) {
      test(`file: ${file.name} (${file.key})`, async () => {
        const browser = await chromium.launch({
          headless: false, // Launch browser in headed mode so you can see the actions
          slowMo: 100, // Slows down the operations for visibility
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // Determine the file path
        const downloadPath = `${process.env.DOWNLOAD_PATH!}/${
          teamId ? teamId + "/" : ""
        }${projectName} (${project.id})`;
        const filename = `${file.name} (${file.key}).pdf`; // Assuming file is a .pdf, use appropriate extension
        const filePath = path.join(downloadPath, filename);

        // Check if the file already exists
        if (fs.existsSync(filePath)) {
          console.log(
            `Skipping ${filename} as it already exists in ${downloadPath}`
          );
        } else {
          // Go to the Figma design file
          await page.goto(`https://www.figma.com/design/${file.key}/`);

          // Simulate human-like interaction with delays and movements
          await page.waitForTimeout(randomDelay(100, 300)); // Random delay between actions
          await humanMouseMove(page, "#toggle-menu-button");
          await page.locator("#toggle-menu-button").click();

          await page.waitForTimeout(randomDelay(100, 300));
          await humanMouseMove(page, "[id^='mainMenu-file-menu-']");
          await page.locator("[id^='mainMenu-file-menu-']").click();

          await page.waitForTimeout(randomDelay(100, 300));
          await humanMouseMove(page, "[id^='mainMenu-save-as-']");
          await page.locator("[id^='mainMenu-save-as-']").click();

          // Handle the download event
          const downloadPromise = page.waitForEvent("download");
          const download = await downloadPromise;

          // Get the filename and save it
          const suggestedFilename = download.suggestedFilename();
          const filename = suggestedFilename.match(/.*(?=\.[\w\d]+)/)![0];
          const extension = suggestedFilename.replace(filename + ".", "");

          await download.saveAs(
            `${process.env.DOWNLOAD_PATH!}/${
              teamId ? teamId + "/" : ""
            }${projectName} (${project.id})/${filename} (${
              file.key
            }).${extension}`
          );

          await page.waitForTimeout(Number(process.env.WAIT_TIMEOUT) || 0);
        }

        await browser.close();
      });
    }
  });
}
