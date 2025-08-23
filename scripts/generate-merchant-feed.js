const fs = require('fs');
const path = require('path');

const sourceCsv = path.join(__dirname, '..', 'ryanosmunphoto_gmc_feed.csv');
const feedsDir = path.join(__dirname, '..', 'feeds');
const outputCsv = path.join(feedsDir, 'merchant_feed.csv');

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
	writeOutputCsv(outputCsv, csv + '\n');
} catch (e) {
	console.warn('Unexpected error generating merchant feed:', e.message);
}


