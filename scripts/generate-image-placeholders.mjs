import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicDirectory = path.join(projectRoot, "public");
const imagesDirectory = path.join(publicDirectory, "images");
const outputPath = path.join(projectRoot, "data", "image-placeholders.json");
const supportedImage = /\.(avif|jpe?g|png|webp)$/i;

async function findImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return findImages(entryPath);
      return supportedImage.test(entry.name) ? [entryPath] : [];
    }),
  );

  return files.flat();
}

const imageFiles = (await findImages(imagesDirectory)).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true }),
);
const placeholders = {};

for (const [index, imagePath] of imageFiles.entries()) {
  const buffer = await sharp(imagePath)
    .rotate()
    .resize({ width: 24, height: 24, fit: "inside", withoutEnlargement: true })
    .blur(1.5)
    .webp({ quality: 40, effort: 4 })
    .toBuffer();
  const publicPath = `/${path
    .relative(publicDirectory, imagePath)
    .split(path.sep)
    .join("/")}`;

  placeholders[publicPath] = `data:image/webp;base64,${buffer.toString("base64")}`;
  process.stdout.write(`[${index + 1}/${imageFiles.length}] ${publicPath}\n`);
}

await fs.writeFile(outputPath, `${JSON.stringify(placeholders, null, 2)}\n`);
process.stdout.write(`Generated ${imageFiles.length} blurred image placeholders.\n`);
