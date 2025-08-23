const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'gallery_images');
const outputDir = path.join(__dirname, '..', 'images');

function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function copyFilePreserveName(srcPath, destDir) {
	const base = path.basename(srcPath);
	const destPath = path.join(destDir, base);
	fs.copyFileSync(srcPath, destPath);
}

try {
	ensureDir(outputDir);
	if (!fs.existsSync(sourceDir)) {
		console.warn('gallery_images/ not found, skipping copy to images/.');
		process.exit(0);
	}
	const files = fs.readdirSync(sourceDir);
	const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
	images.forEach(file => copyFilePreserveName(path.join(sourceDir, file), outputDir));
	console.log(`Copied ${images.length} images to images/.`);
} catch (e) {
	console.error('Failed copying images:', e);
}


