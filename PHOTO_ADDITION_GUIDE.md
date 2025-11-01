# 📸 Adding New Photos to Wild West Wall Art

## 📋 **Complete Step-by-Step Guide**

### **Step 1: Add Original High-Resolution Photo**
```
Location: src/assets/gallery_images/
File: your_photo_name.jpg
Example: sunset_canyon.jpg
```

**Requirements:**
- High-resolution image (minimum 2000px on longest side)
- JPG format
- Vertical or horizontal orientation (use consistent sizing)
- Proper naming: lowercase, underscores for spaces

### **Step 2: Create Material Preview Images**

For each finish type, create a preview image showing how the photo looks:

#### **Acrylic Finish Previews**
```
Location: src/assets/acrylic_previews/
File Format: your_photo_name_acrylic1.jpg
Example: sunset_canyon_acrylic1.jpg
```

**Creation Tips:**
- Increase vibrancy/saturation by 10-15%
- Enhance sharpness and contrast
- Remove any color cast
- Show glossy, vibrant appearance

#### **Canvas Finish Previews**
```
Location: src/assets/canvas_previews/
File Format: your_photo_name_canvas.jpg
Example: sunset_canyon_canvas.jpg
```

**Creation Tips:**
- Reduce saturation slightly
- Add soft texture overlay
- Slightly soften edges for artistic look
- Show matte, textured appearance

#### **Metal Finish Previews**
```
Location: src/assets/metal_previews/
File Format: your_photo_name_metal1.jpg
Example: sunset_canyon_metal1.jpg
```

**Creation Tips:**
- Increase contrast significantly
- Deepen blacks and enhance highlights
- Show metallic reflection/gloss
- Very vibrant and sharp details

### **Step 3: Build & Deploy**
```bash
# Run the unified build (this does everything automatically):
npm run build
```

**What the Build Does:**
1. ✅ Adds photo to gallery grid
2. ✅ Generates individual product page (`photos/your_photo_name.html`)
3. ✅ Updates sitemap.xml for SEO
4. ✅ Creates merchant feed entries
5. ✅ Prepares complete deploy bundle in `deploy/`
6. ✅ Copies all files for production

### **Step 4: Verify Results**
After building, check these locations:
- `index.html` - Photo appears in hero gallery
- `gallery.html` - Photo appears in main gallery
- `photos/your_photo_name.html` - Individual product page
- `deploy/` - Complete production bundle

## 📏 **Standard Size & Pricing Configuration**

Your current size/pricing is configured in `config/product-config.json`:

**Metal Prints:**
- 16x24" ($70)
- 20x30" ($120)
- 24x36" ($150)
- 20x40" ($220)

**Acrylic Prints:**
- 16x24" ($60)
- 20x30" ($100)
- 24x36" ($130)
- 20x40" ($180)

**Note:** Canvas pricing needs to be added to the configuration.

## 🔄 **File Naming Conventions**

```
Original: sunset_canyon.jpg
├── Acrylic: sunset_canyon_acrylic1.jpg
├── Canvas:  sunset_canyon_canvas.jpg
└── Metal:   sunset_canyon_metal1.jpg
```

## ✅ **Quick Checklist**
- [ ] High-res photo added to `src/assets/gallery_images/`
- [ ] Acrylic preview(s) created in `acrylic_previews/`
- [ ] Canvas preview created in `canvas_previews/`
- [ ] Metal preview(s) created in `metal_previews/`
- [ ] Run `npm run build`
- [ ] Test gallery and individual product page
- [ ] Deploy `deploy/` folder

This process ensures every new photo is automatically integrated into your entire e-commerce system with proper SEO, product pages, and merchant feeds!
