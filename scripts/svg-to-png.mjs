/**
 * SVG to PNG screenshot utility.
 *
 * Usage:
 *   node scripts/svg-to-png.mjs <svg-path> [<output-png-path>]
 *
 * If no output path is given, the PNG is written next to the SVG
 * with the same base name.
 *
 * Examples:
 *   node scripts/svg-to-png.mjs public/images/projects/anatomy-of-a-symbiote/anatomy-of-a-symbiote.svg
 *   node scripts/svg-to-png.mjs public/images/writings/symbiote/symbiote.svg symbiote-og.png
 */

import { chromium } from 'playwright';
import { resolve, dirname, basename, join } from 'path';
import { pathToFileURL } from 'url';

const [svgPath, outputPath] = process.argv.slice(2);

if (!svgPath) {
  console.error('Usage: node scripts/svg-to-png.mjs <svg-path> [<output-png-path>]');
  process.exit(1);
}

const resolvedSvg = resolve(svgPath);
const png = outputPath
  ? resolve(outputPath)
  : join(dirname(resolvedSvg), basename(resolvedSvg, '.svg') + '.png');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();
await page.goto(pathToFileURL(resolvedSvg).href);
await page.screenshot({ path: png });
console.log(`✓ ${png}`);
await page.close();
await browser.close();
