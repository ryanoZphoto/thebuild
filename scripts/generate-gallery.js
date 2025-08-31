const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const outputFile = path.join(__dirname, '..', 'gallery-list.json');
const sitemapFile = path.join(__dirname, '..', 'sitemap.xml');

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

		// Generate sitemap.xml with index and static photo pages
		try {
			const base = 'https://ryanosmunphoto.com/';
			const urls = [
				`${base}`,
				`${base}index.html`,
				`${base}cart.html`,
				`${base}legal/shipping.html`,
				`${base}legal/returns.html`,
				`${base}thankyou.html`
			];
			images.forEach(img => {
				const name = img.replace(/\.[^.]+$/, '');
				urls.push(`${base}photos/${encodeURIComponent(name)}.html`);
			});
			const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
				`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
				urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
				`\n</urlset>\n`;
			fs.writeFileSync(sitemapFile, xml, 'utf8');
			console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
		} catch (e) {
			console.warn('Failed to generate sitemap.xml:', e.message);
		}
	});
} catch (e) {
	console.warn('Unexpected error while generating gallery-list.json. Proceeding with empty list.', e.message);
	writeList([]);
}
// Duplicate legacy block removed
