const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'gallery_images');
const outDir = path.join(__dirname, '..', 'photos');

function ensureDir(dir){
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function titleFromFile(file){
	return file.replace(/\.[^.]+$/, '').replace(/[-_]+/g,' ').replace(/\b\w/g, m => m.toUpperCase());
}

function pageTemplate({ title, fileName }){
	const imagePath = `/images/${fileName}`;
	const safeTitle = title;
	const cartUrl = `/cart.html?img=${encodeURIComponent(fileName)}&finish=canvas&title=${encodeURIComponent(title)}`;
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle} – Wild West Wall Art</title>
  <meta name="robots" content="index,follow" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <nav class="nav" aria-label="Primary">
    <div class="nav-inner">
      <a class="nav-brand" href="/index.html">
        <img src="/finlogo.png" alt="Wild West Wall Art logo" class="logo">
        <span>Wild West Wall Art</span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu">☰</button>
      <ul id="nav-menu" class="nav-links">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/gallery.html">Gallery</a></li>
        <li><a href="/cart.html">Cart</a></li>
        <li><a href="/contact.html">Contact</a></li>
      </ul>
    </div>
  </nav>

  <main style="padding: 1.5rem 1rem;">
    <h1>${safeTitle}</h1>
    <figure>
      <img src="${imagePath}" alt="${safeTitle}" style="max-width:100%;height:auto" loading="eager"/>
      <figcaption>${safeTitle}</figcaption>
    </figure>
    <p><a class="order-cta" href="${cartUrl}">Order This Print</a></p>
  </main>

  <script>
  (function(){
    const btn = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    }
  })();
  </script>
</body>
</html>`;
}

try {
	ensureDir(outDir);
	if (!fs.existsSync(galleryDir)) {
		console.warn('gallery_images/ not found, skipping photo page generation.');
		process.exit(0);
	}
	const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
	let count = 0;
	for (const file of files) {
		const title = titleFromFile(file);
		const html = pageTemplate({ title, fileName: file });
		const basename = file.replace(/\.[^.]+$/, '');
		const outPath = path.join(outDir, `${basename}.html`);
		fs.writeFileSync(outPath, html, 'utf8');
		count++;
	}
	console.log(`Generated ${count} photo pages in /photos.`);
} catch (e) {
	console.error('Failed generating photo pages:', e);
}


