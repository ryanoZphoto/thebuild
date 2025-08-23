const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');

function readSignature(filePath, length = 12) {
	const fd = fs.openSync(filePath, 'r');
	const buf = Buffer.alloc(length);
	fs.readSync(fd, buf, 0, length, 0);
	fs.closeSync(fd);
	return buf;
}

function detectType(buf) {
	// JPEG: FF D8 FF
	if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpeg';
	// PNG: 89 50 4E 47 0D 0A 1A 0A
	if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 && buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A) return 'png';
	// GIF87a / GIF89a
	if (buf.length >= 6 && buf.toString('ascii', 0, 6).startsWith('GIF8')) return 'gif';
	// BMP: 42 4D
	if (buf.length >= 2 && buf[0] === 0x42 && buf[1] === 0x4D) return 'bmp';
	// TIFF: 49 49 2A 00 or 4D 4D 00 2A
	if (buf.length >= 4 && ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x00) || (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x00 && buf[3] === 0x2A))) return 'tiff';
	return 'unknown';
}

try {
	if (!fs.existsSync(imagesDir)) {
		console.warn('images/ not found. Run scripts/copy-images.js first.');
		process.exit(0);
	}
	const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/i.test(f));
	let issues = 0;
	for (const file of files) {
		const full = path.join(imagesDir, file);
		try {
			const sig = readSignature(full);
			const type = detectType(sig);
			const ext = path.extname(file).slice(1).toLowerCase();
			const normalizedExt = ext === 'jpg' ? 'jpeg' : (ext === 'tif' ? 'tiff' : ext);
			const match = (type === normalizedExt) || (type === 'jpeg' && normalizedExt === 'jpg');
			if (!match) {
				issues++;
				console.warn(`Type mismatch or unknown: ${file} -> detected=${type}, ext=${ext}`);
			}
		} catch (e) {
			issues++;
			console.warn(`Failed to inspect ${file}:`, e.message);
		}
	}
	if (issues === 0) {
		console.log('All images passed basic signature checks.');
	} else {
		console.log(`Found ${issues} potential issue(s).`);
		process.exitCode = 1;
	}
} catch (e) {
	console.error('Unexpected error while validating images:', e);
}


