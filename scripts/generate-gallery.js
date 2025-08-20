const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const outputFile = path.join(__dirname, '..', 'gallery-list.json');

function writeList(images) {
	try {
		fs.writeFileSync(outputFile, JSON.stringify({ images }, null, 2), 'utf8');
		console.log(`Generated gallery-list.json with ${images.length} images.`);
	} catch (e) {
		console.error('Failed writing gallery-list.json:', e);
		// Do not fail the build; leave without throwing
	}
}

try {
	if (!fs.existsSync(galleryDir)) {
		console.warn('gallery_images/ not found. Creating it and generating empty gallery list.');
		fs.mkdirSync(galleryDir, { recursive: true });
		writeList([]);
		process.exit(0);
	}

	fs.readdir(galleryDir, (err, files) => {
		if (err) {
			console.warn('Error reading gallery_images, generating empty list:', err.message);
			writeList([]);
			return;
		}

		const images = files
			.filter(file => /\.(jpg|jpeg|png)$/i.test(file))
			.sort();

		writeList(images);
	});
} catch (e) {
	console.warn('Unexpected error while generating gallery-list.json. Proceeding with empty list.', e.message);
	writeList([]);
}
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const outputFile = path.join(__dirname, '..', 'gallery-list.json');

fs.readdir(galleryDir, (err, files) => {
  if (err) {
    console.error('Error reading gallery_images:', err);
    process.exit(1);
  }

  const images = files
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file)) // Only images
    .sort(); // Alphabetical sort

  fs.writeFileSync(outputFile, JSON.stringify({ images }), 'utf8');
  console.log(`Generated gallery-list.json with ${images.length} images.`);
});
