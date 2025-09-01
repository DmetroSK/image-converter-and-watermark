<h1 align="center">Image Converter & Watermarker</h1>
<div align="center">
  <a href="https://github.com/DmetroSK/image-converter-and-watermark/stargazers"><img src="https://img.shields.io/github/stars/DmetroSK/image-converter-and-watermark" alt="Stars Badge"/></a>
<a href="https://github.com/DmetroSK/image-converter-and-watermark/network/members"><img src="https://img.shields.io/github/forks/DmetroSK/image-converter-and-watermark" alt="Forks Badge"/></a>
<a href="https://github.com/DmetroSK/image-converter-and-watermark/pulls"><img src="https://img.shields.io/github/issues-pr/DmetroSK/image-converter-and-watermark" alt="Pull Requests Badge"/></a>
<a href="https://github.com/DmetroSK/image-converter-and-watermark/issues"><img src="https://img.shields.io/github/issues/DmetroSK/image-converter-and-watermark" alt="Issues Badge"/></a>
<a href="https://github.com/DmetroSK/image-converter-and-watermark/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/DmetroSK/image-converter-and-watermark?color=2b9348"></a>
<a href="https://github.com/DmetroSK/image-converter-and-watermark/blob/main/LICENSE"><img src="https://img.shields.io/github/license/DmetroSK/image-converter-and-watermark?color=2b9348" alt="License Badge"/></a>
</div>
<br/>

## About The Project

A simple **Node.js + Express** application to convert images between formats (`JPG`, `JPEG`, `PNG`, `WEBP`) with optional **watermarking support**.

## Built With

1. `Express.js` – Web server framework.
2. `Multer` - File upload middleware.
3. `Sharp` - High-performance image processing.
4. `Archiver` - ZIP creation.

## Features

- Convert uploaded images to **JPG/JPEG, PNG, or WEBP**.
- Add optional **watermarks**:
  - Choose between **light** (white, semi-transparent) or **dark** (black, semi-transparent).
  - Provide your own **custom watermark text**.
  - Skip watermarking by leaving input empty.
- Handles **large images** (auto-resizes if dimensions exceed `16000px`).
- Bulk upload and conversion.
- Download all converted files as a **ZIP**.
- Clear converted files easily with one click.

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/DmetroSK/image-converter-and-watermark
cd image-converter-and-watermark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
node server.js
```

Server will start at 👉 http://localhost:3000

## Usage

1. Open the app in your browser.
2. Upload one or multiple images.
3. Select the output format (JPG, PNG, WEBP).
4. (Optional) Enter watermark text:

   - Leave empty = no watermark.
   - Enter text = watermark applied.

5. Choose watermark style:

   - None → Skip watermark.
   - Light → White transparent text.
   - Dark → Black transparent text.

6. Convert and download your images individually or as a ZIP.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

Give a ⭐️ if this project helped you!
