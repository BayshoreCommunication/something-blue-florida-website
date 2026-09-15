import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDirectory = path.join(
  projectRoot,
  "public",
  "images",
  "wedding-photography",
);
const manifestPath = path.join(
  projectRoot,
  "data",
  "wedding-portfolio.json",
);

// Images are organized into ordered batch folders (first30, second30, third30, ...)
// so the gallery can reveal one batch at a time. New batches just need a folder
// name starting with the next ordinal word below.
const ORDINAL_WORDS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
];

const batchRank = (dirName) => {
  const match = dirName.match(/^[a-z]+/i);
  const word = match ? match[0].toLowerCase() : "";
  const index = ORDINAL_WORDS.indexOf(word);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
const batchDirs = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => {
    const rankDiff = batchRank(a) - batchRank(b);
    return rankDiff !== 0 ? rankDiff : a.localeCompare(b, undefined, { numeric: true });
  });

if (batchDirs.length === 0) {
  throw new Error(
    `No batch folders (e.g. "first30", "second30") found in ${sourceDirectory}`,
  );
}

const portfolio = [];

for (const dirName of batchDirs) {
  const batchDirectory = path.join(sourceDirectory, dirName);
  const fileNames = (await fs.readdir(batchDirectory))
    .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const fileName of fileNames) {
    const inputPath = path.join(batchDirectory, fileName);
    const metadata = await sharp(inputPath).metadata();
    const rotated = [5, 6, 7, 8].includes(metadata.orientation ?? 1);
    const width = rotated ? metadata.height : metadata.width;
    const height = rotated ? metadata.width : metadata.height;

    if (!width || !height) {
      throw new Error(`Unable to read image dimensions for ${dirName}/${fileName}`);
    }

    portfolio.push({
      src: `/images/wedding-photography/${dirName}/${fileName}`,
      width,
      height,
    });

    process.stdout.write(
      `[${portfolio.length}] ${dirName}/${fileName}\n`,
    );
  }
}

await fs.writeFile(manifestPath, `${JSON.stringify(portfolio, null, 2)}\n`);
process.stdout.write(`Generated ${portfolio.length} wedding portfolio images.\n`);
