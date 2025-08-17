const prices = {
  Metallic: { "20x40": 220, "24x36": 150, "20x30": 120, "16x24": 70 },
  Acrylic: { "20x40": 180, "24x36": 130, "20x30": 100, "16x24": 60 },
  Canvas:  { "20x40": 180, "24x36": 130, "20x30": 100, "16x24": 60 }
};

const finishSelect = document.getElementById('finish');
const sizeSelect = document.getElementById('size');
const priceDisplay = document.getElementById('price');

function updatePrice() {
  const finish = finishSelect.value;
  const size = sizeSelect.value;
  priceDisplay.textContent = `$${prices[finish][size]}`;
}

finishSelect.addEventListener('change', updatePrice);
sizeSelect.addEventListener('change', updatePrice);

updatePrice();
