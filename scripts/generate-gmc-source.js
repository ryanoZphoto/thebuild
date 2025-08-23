const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const outputCsv = path.join(__dirname, '..', 'ryanosmunphoto_gmc_feed.csv');
const configPath = path.join(__dirname, '..', 'product-config.json');

function titleFromFile(file){
	return file.replace(/\.[^.]+$/, '').replace(/[-_]+/g,' ').replace(/\b\w/g, m => m.toUpperCase());
}

function buildRowsForImage(file, cfg){
	const base = file.replace(/\.[^.]+$/, '');
	const title = titleFromFile(file);
	const imgParam = encodeURIComponent(file);
	const linkBase = `https://ryanosmunphoto.com/cart.html?img=${imgParam}&title=${encodeURIComponent(title)}`;
	const imageUrl = `https://ryanosmunphoto.com/images/${imgParam}`;
	const itemGroupId = base.replace(/\s+/g,'-');
	const rows = [];
	cfg.finishes.forEach(fin => {
		fin.sizes.forEach(sz => {
			const id = `${base}-${fin.finish}-${sz.label}`.replace(/\s+/g,'-');
			const row = [
				id,
				`${title} Print - ${fin.finish.charAt(0).toUpperCase()+fin.finish.slice(1)} ${sz.label}`,
				`Fine art ${fin.finish} print of '${title}'. Signed by ${cfg.brand}.`,
				`${linkBase}&finish=${encodeURIComponent(fin.finish)}&size=${encodeURIComponent(sz.label)}`,
				imageUrl,
				cfg.availability,
				`${Number(sz.price).toFixed(2)} ${cfg.currency}`,
				cfg.brand,
				cfg.condition,
				cfg.google_product_category,
				itemGroupId,
				cfg.product_type
			];
			rows.push(row);
		});
	});
	return rows;
}

function serializeCsv(rows){
	const header = ['id','title','description','link','image_link','availability','price','brand','condition','google_product_category','item_group_id','product_type'];
	function esc(v){
		if (v == null) v = '';
		const s = String(v).replace(/"/g,'""');
		return /[",\n\r]/.test(s) ? `"${s}"` : s;
	}
	return [header, ...rows].map(r => r.map(esc).join(',')).join('\n') + '\n';
}

try {
	if (!fs.existsSync(galleryDir)) {
		console.warn('gallery_images/ not found. No products generated.');
		process.exit(0);
	}
	const cfg = JSON.parse(fs.readFileSync(configPath,'utf8'));
	const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
	let allRows = [];
	for (const f of files) {
		allRows = allRows.concat(buildRowsForImage(f, cfg));
	}
	const csv = serializeCsv(allRows);
	fs.writeFileSync(outputCsv, csv, 'utf8');
	console.log(`Generated ${allRows.length} product rows to ${path.basename(outputCsv)}.`);
} catch (e) {
	console.error('Failed generating GMC source CSV:', e);
}


