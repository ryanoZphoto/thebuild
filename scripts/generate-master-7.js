const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const configPath = path.join(__dirname, '..', 'product-config.json');
const outCsv = path.join(__dirname, '..', 'master_products.csv');
const ID_PREFIX = 'm7-';

function titleFromFile(file){
	return file.replace(/\.[^.]+$/, '').replace(/[-_]+/g,' ').replace(/\b\w/g, m => m.toUpperCase());
}

function escCsv(v){
	if (v == null) v = '';
	const s = String(v).replace(/"/g,'""');
	return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

try {
	if (!fs.existsSync(galleryDir)) {
		throw new Error('gallery_images/ not found');
	}
	const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	const acrylic = (cfg.finishes || []).find(f => f.finish === 'acrylic') || cfg.finishes?.[0];
	const size = acrylic?.sizes?.find(s => s.label === '16x24') || acrylic?.sizes?.[0];
	if (!acrylic || !size) {
		throw new Error('product-config.json missing acrylic 16x24 (or any finish/size)');
	}

	const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)).slice(0,7);
	const header = ['id','title','description','link','image_link','availability','price','brand','condition','google_product_category','product_type'];
	const rows = [header];
	for (const file of files) {
		const base = file.replace(/\.[^.]+$/, '');
		const title = titleFromFile(file);
		const price = `${Number(size.price).toFixed(2)} ${cfg.currency}`;
		const link = `https://ryanosmunphoto.com/photos/${encodeURIComponent(base)}.html`;
		const imageLink = `https://ryanosmunphoto.com/images/${encodeURIComponent(file)}`;
		const id = `${ID_PREFIX}${base}-${acrylic.finish}-${size.label}`.replace(/\s+/g,'-');
		rows.push([
			id,
			`${title} Print - ${acrylic.finish.charAt(0).toUpperCase()+acrylic.finish.slice(1)} ${size.label}`,
			`Fine art ${acrylic.finish} print of '${title}'. Signed by ${cfg.brand}.`,
			link,
			imageLink,
			cfg.availability,
			price,
			cfg.brand,
			cfg.condition,
			cfg.google_product_category,
			cfg.product_type
		].map(escCsv).join(','));
	}
	const csv = rows.map(r => Array.isArray(r) ? r.join(',') : r).join('\n') + '\n';
	fs.writeFileSync(outCsv, csv, 'utf8');
	console.log(`Wrote ${files.length} products to ${path.basename(outCsv)}.`);
} catch (e) {
	console.error('Failed generating master_products.csv:', e.message);
	process.exit(1);
}


