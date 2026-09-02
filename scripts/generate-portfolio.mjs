import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceDirectory = path.join(
  projectRoot,
  "public",
  "images",
  "for-website",
);
const outputDirectory = path.join(
  projectRoot,
  "public",
  "images",
  "portfolio-optimized",
);
const manifestPath = path.join(projectRoot, "data", "portfolio.json");

const sourceFiles = (await fs.readdir(sourceDirectory))
  .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

await fs.mkdir(outputDirectory, { recursive: true });

const portfolio = [];

for (const [index, fileName] of sourceFiles.entries()) {
  const outputName = `portfolio-${String(index + 1).padStart(3, "0")}.webp`;
  const inputPath = path.join(sourceDirectory, fileName);
  const outputPath = path.join(outputDirectory, outputName);

  const result = await sharp(inputPath)
    .rotate()
    .resize({
      width: 4800,
      height: 4800,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({
      quality: 94,
      alphaQuality: 100,
      chromaSubsampling: "4:4:4",
      smartSubsample: true,
      effort: 5,
    })
    .toFile(outputPath);

  portfolio.push({
    src: `/images/portfolio-optimized/${outputName}`,
    width: result.width,
    height: result.height,
  });

  process.stdout.write(
    `[${index + 1}/${sourceFiles.length}] ${fileName} -> ${outputName}\n`,
  );
}

await fs.writeFile(manifestPath, `${JSON.stringify(portfolio, null, 2)}\n`);
process.stdout.write(`Generated ${portfolio.length} portfolio images.\n`);
