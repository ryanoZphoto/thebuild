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
