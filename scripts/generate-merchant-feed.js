const fs = require('fs');
const path = require('path');

const sourceCsv = path.join(__dirname, '..', 'ryanosmunphoto_gmc_feed.csv');
const feedsDir = path.join(__dirname, '..', 'feeds');
const outputCsv = path.join(feedsDir, 'merchant_feed.csv');

// Minimal RFC4180 CSV parser/serializer for our feed transformation
function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') { // escaped quote
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
		} else {
			if (char === '"') {
				inQuotes = true;
			} else if (char === ',') {
				row.push(field);
				field = '';
			} else if (char === '\n' || char === '\r') {
				// Handle CRLF or LF
				if (char === '\r' && text[i + 1] === '\n') i++;
				row.push(field);
				rows.push(row);
				row = [];
				field = '';
			} else {
				field += char;
			}
		}
	}
	// Flush last field/row if any
	if (field.length > 0 || row.length > 0) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

function serializeCsv(rows) {
	return rows.map(cols => cols.map(v => {
		if (v == null) v = '';
		const needsQuotes = /[",\n\r]/.test(v);
		let out = String(v).replace(/"/g, '""');
		return needsQuotes ? '"' + out + '"' : out;
	}).join(',')).join('\n') + '\n';
}

function toPhotoPageUrl(imgFile) {
	const base = imgFile.replace(/\.[^.]+$/, '');
	const encoded = encodeURIComponent(base);
	return `https://ryanosmunphoto.com/photos/${encoded}.html`;
}

function toImageUrl(imgFile) {
	const encoded = encodeURIComponent(imgFile);
	return `https://ryanosmunphoto.com/images/${encoded}`;
}

function rewriteLinkToPhotoPage(linkValue) {
	try {
		const url = new URL(linkValue);
		const img = url.searchParams.get('img');
		if (!img) return linkValue;
		return toPhotoPageUrl(img);
	} catch {
		return linkValue;
	}
}

function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function readSourceCsv(filePath) {
	try {
		if (!fs.existsSync(filePath)) {
			console.warn('Source GMC CSV not found at', filePath);
			return '';
		}
		return fs.readFileSync(filePath, 'utf8').trim();
	} catch (e) {
		console.warn('Failed reading source GMC CSV:', e.message);
		return '';
	}
}

function writeOutputCsv(filePath, data) {
	try {
		fs.writeFileSync(filePath, data + (data.endsWith('\n') ? '' : '\n'), 'utf8');
		console.log(`Wrote Google Merchant feed → ${filePath}`);
	} catch (e) {
		console.error('Failed writing merchant feed CSV:', e);
	}
}

try {
	ensureDir(feedsDir);
	const csv = readSourceCsv(sourceCsv);
	if (!csv) {
		// Write a minimal header so the file exists and is valid CSV
		const header = 'id,title,description,link,image_link,availability,price,brand,condition,google_product_category,item_group_id,product_type';
		writeOutputCsv(outputCsv, header + '\n');
		process.exit(0);
	}
	// Transform links to static photo pages derived from the img parameter
	const rows = parseCsv(csv);
	if (rows.length === 0) {
		writeOutputCsv(outputCsv, csv + '\n');
		process.exit(0);
	}
	const header = rows[0];
	const linkIdx = header.indexOf('link');
	const imageIdx = header.indexOf('image_link');
	if (linkIdx === -1) {
		writeOutputCsv(outputCsv, csv + '\n');
		process.exit(0);
	}
	for (let r = 1; r < rows.length; r++) {
		const row = rows[r];
		if (!row || row.length === 0) continue;
		const currentLink = row[linkIdx] || '';
		let imgFile = null;
		try {
			const url = new URL(currentLink);
			imgFile = url.searchParams.get('img');
		} catch {}
		// Rewrite link to static photo page
		row[linkIdx] = imgFile ? toPhotoPageUrl(imgFile) : rewriteLinkToPhotoPage(currentLink);
		// Normalize image_link if present and we have an img file
		if (imageIdx !== -1 && imgFile) {
			row[imageIdx] = toImageUrl(imgFile);
		}
	}
	const out = serializeCsv(rows);
	writeOutputCsv(outputCsv, out);
} catch (e) {
	console.warn('Unexpected error generating merchant feed:', e.message);
}


