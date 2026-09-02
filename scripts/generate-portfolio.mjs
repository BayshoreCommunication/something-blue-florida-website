import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDirectory = path.join(
  projectRoot,
  "public",
  "images",
  "portfolio",
);
const manifestPath = path.join(projectRoot, "data", "portfolio.json");

const sourceFiles = (await fs.readdir(sourceDirectory))
  .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const portfolio = [];

for (const fileName of sourceFiles) {
  const inputPath = path.join(sourceDirectory, fileName);
  const metadata = await sharp(inputPath).metadata();
  const rotated = [5, 6, 7, 8].includes(metadata.orientation ?? 1);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;

  if (!width || !height) {
    throw new Error(`Unable to read image dimensions for ${fileName}`);
  }

  portfolio.push({
    src: `/images/portfolio/${fileName}`,
    width,
    height,
  });

  process.stdout.write(`[${portfolio.length}/${sourceFiles.length}] ${fileName}\n`);
}

await fs.writeFile(manifestPath, `${JSON.stringify(portfolio, null, 2)}\n`);
process.stdout.write(`Generated ${portfolio.length} portfolio images.\n`);
