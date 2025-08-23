const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, '..', 'gallery_images');
const outputDir = path.join(__dirname, '..', 'images');

const MAX_AREA = 64_000_000; // 64 megapixels
const MAX_BYTES = 16 * 1024 * 1024; // 16MB

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeToJpeg(srcPath, destPath) {
	const image = sharp(srcPath, { failOn: 'none' });
	const meta = await image.metadata();
	let { width, height } = meta;
	if (!width || !height) {
		// Try to proceed; sharp will throw if unreadable
		width = meta.width || 0;
		height = meta.height || 0;
	}

	let pipeline = image;
	// Downscale if over 64MP
	if (width && height && (width * height > MAX_AREA)) {
		const scale = Math.sqrt(MAX_AREA / (width * height));
		const newW = Math.max(1, Math.floor(width * scale));
		pipeline = pipeline.resize({ width: newW });
	}

	// Encode JPEG with quality loop to keep under 16MB
	let quality = 85;
	let outputBuffer = await pipeline.jpeg({ quality, progressive: true, mozjpeg: true }).toBuffer();
	while (outputBuffer.length > MAX_BYTES && quality > 50) {
		quality -= 5;
		outputBuffer = await image.jpeg({ quality, progressive: true, mozjpeg: true }).toBuffer();
	}
	await sharp(outputBuffer).toFile(destPath);
}

(async () => {
	try {
		ensureDir(outputDir);
		if (!fs.existsSync(sourceDir)) {
			console.warn('gallery_images/ not found, skipping optimization.');
			process.exit(0);
		}
		const files = fs.readdirSync(sourceDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
		let success = 0;
		for (const file of files) {
			const src = path.join(sourceDir, file);
			const base = path.basename(file, path.extname(file));
			const dest = path.join(outputDir, `${base}.jpg`);
			try {
				await optimizeToJpeg(src, dest);
				success++;
			} catch (e) {
				console.warn('Failed optimizing', file, e.message);
			}
		}
		console.log(`Optimized ${success}/${files.length} images to images/ as JPEG under 64MP and 16MB.`);
	} catch (e) {
		console.error('optimize-images failed:', e);
		process.exit(1);
	}
})();


