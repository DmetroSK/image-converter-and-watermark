const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use("/converted", express.static("converted"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

let lastConvertedFiles = [];

app.post("/convert", upload.array("images"), async (req, res) => {
  try {
    fs.mkdirSync("converted", { recursive: true });
    const convertTo = req.body.convertTo.toLowerCase();
    const watermarkTextInput = (req.body.watermarkText || "").trim();
    const results = [];

    for (const file of req.files) {
      const baseName = path.parse(file.originalname).name;
      const watermarkOption = req.body[`watermark_${baseName}`] || "none";
      const ext = convertTo;
      const outputPath = path.join("converted", `${baseName}.${ext}`);

      let image = sharp(file.path);
      const metadata = await image.metadata();
      let { width, height } = metadata;

      // Resize if image too large
      const MAX_DIMENSION = 16000;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const aspect = width / height;
        if (width > height) {
          width = MAX_DIMENSION;
          height = Math.round(MAX_DIMENSION / aspect);
        } else {
          height = MAX_DIMENSION;
          width = Math.round(MAX_DIMENSION * aspect);
        }
        image = image.resize(width, height);
      }

      // Watermark only if watermarkTextInput is not empty
      if (watermarkOption !== "none" && watermarkTextInput !== "") {
        const color =
          watermarkOption === "light"
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.08)";
        const fontSize = Math.floor(width / 30);
        const hSpacing = fontSize * 4;
        const vSpacing = fontSize * 6;

        let svg = `<svg width="${width}" height="${height}">`;
        for (let y = -height; y < height * 2; y += vSpacing) {
          const offsetX = (y / vSpacing) % 2 === 0 ? 0 : hSpacing / 2;
          for (let x = -width; x < width * 2; x += hSpacing) {
            svg += `<text x="${
              x + offsetX
            }" y="${y}" fill="${color}" font-size="${fontSize}" font-family="Arial" transform="rotate(-45 ${
              x + offsetX
            },${y})">${watermarkTextInput}</text>`;
          }
        }
        svg += "</svg>";
        image = image.composite([
          { input: Buffer.from(svg), gravity: "center" },
        ]);
      }

      // Convert
      const options = { quality: 80 };
      switch (ext) {
        case "webp":
          await image.webp(options).toFile(outputPath);
          break;
        case "png":
          await image.png(options).toFile(outputPath);
          break;
        case "jpg":
        case "jpeg":
          await image.jpeg(options).toFile(outputPath);
          break;
        default:
          await image.toFile(outputPath);
      }

      const originalSize = fs.statSync(file.path).size;
      const convertedSize = fs.statSync(outputPath).size;
      fs.unlinkSync(file.path);

      const savedPercent = ((1 - convertedSize / originalSize) * 100).toFixed(
        2
      );
      results.push({
        name: path.basename(outputPath),
        originalSize: formatSize(originalSize),
        convertedSize: formatSize(convertedSize),
        savedPercent,
      });

      if (!lastConvertedFiles.includes(path.basename(outputPath))) {
        lastConvertedFiles.push(path.basename(outputPath));
      }
    }

    res.json({ success: true, files: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Conversion failed" });
  }
});

// Download all
app.get("/download-all", (req, res) => {
  if (!lastConvertedFiles.length)
    return res.status(400).send("No files to download");
  const archive = archiver("zip", { zlib: { level: 9 } });
  res.attachment("converted_images.zip");
  archive.pipe(res);
  lastConvertedFiles.forEach((file) => {
    const filePath = path.join("converted", file);
    if (fs.existsSync(filePath)) archive.file(filePath, { name: file });
  });
  archive.finalize();
});

// Clear all
app.post("/clear-all", (req, res) => {
  const dir = path.join(__dirname, "converted");
  fs.readdir(dir, (err, files) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    for (const file of files) fs.unlink(path.join(dir, file), () => {});
    lastConvertedFiles = [];
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
