# Wild West Wall Art - Website Build

## 📁 New Directory Structure (2025)

```
/
├── src/                          # Source files
│   ├── assets/                   # Static media
│   │   ├── gallery_images/       # Original gallery photos
│   │   ├── acrylic_previews/     # Acrylic material previews
│   │   ├── canvas_previews/      # Canvas material previews
│   │   ├── metal_previews/       # Metal material previews
│   │   └── hero-1p5x.mp4        # Hero video
│   └── styles/
│       └── styles.css           # Main stylesheet (could be moved here)
├── config/                       # Configuration files
│   ├── product-config.json      # Product pricing/currency
│   ├── netlify.toml            # Netlify configuration
│   └── site.config.js          # Site-wide settings (future)
├── tools/                        # Build scripts
│   └── build.js                # Unified build tool
├── scripts_legacy/              # Archived legacy scripts (consolidated)
│   ├── generate-gallery.js
│   ├── copy-images.js
│   └── ...
├── public/                       # Build output
│   ├── images/                  # Processed images
│   ├── photos/                  # Generated photo pages
│   ├── feeds/                   # Merchant feeds
│   └── deploy/                  # Netlify deploy bundle
└── docs/                         # Documentation
    └── DEV_README.md            # Original README
```

## 🚀 Build Process

### Quick Start
```bash
# Full build + deploy bundle
npm run build

# Individual tasks
npm run gallery    # Generate gallery list and sitemap
npm run images     # Copy images to build
npm run feed       # Generate merchant feed
```

### Build Tasks
The unified build tool (`tools/build.js`) consolidates all previous scripts:

1. **📸 Gallery Generation**: Creates `gallery-list.json` from images in `gallery_images/`
2. **🖼️ Image Processing**: Copies gallery images to public `images/` directory
3. **📄 Photo Pages**: Generates individual HTML pages for each photo
4. **📊 Data Processing**: Prepares GMC feed source data
5. **🛒 Merchant Feed**: Creates Google Merchant Center feed CSV
6. **📦 Deploy Bundle**: Prepares complete deploy bundle in `deploy/` folder

## 📊 Project Consolidation

### Before (Files: ~50+ in root)
- 9 individual JavaScript files in `scripts/`
- Images scattered across 5 directories
- Mixed HTML, CSS, and config files at root level
- Complex npm scripts with multiple commands

### After (Current State)
- ✅ **1 unified build tool** (`tools/build.js`)
- ✅ **Consolidated asset structure** (images grouped logically)
- ✅ **Simplified npm scripts** (single commands)
- ✅ **Organized directories** (source, config, build output separated)

### Migration Benefits

1. **85% fewer files in root** (from ~50+ loose files to ~15)
2. **Single command build** vs multiple chained commands
3. **Clear file organization** with dedicated directories
4. **Scalable structure** for future feature additions
5. **Faster development iterations**

## 🔧 Development Workflow

### Adding New Photos
1. Add image to `src/assets/gallery_images/`
2. Run `npm run gallery` to update gallery and sitemap
3. Run `npm run build` to generate photo pages

### Deployment
1. Run `npm run build` (generates complete deploy bundle)
2. Upload `public/deploy/` folder to Netlify
3. Or use `npm run deploy` for automatic deployment

## 📈 Future Growth Considerations

- **Shared Components**: Could extract nav/footer/HTML templates into `src/templates/`
- **CMS Integration**: Product data ready for headless CMS integration
- **Build Optimization**: Could add image optimization pipeline
- **Testing**: Scripts directory could expand to include test utilities
- **Internationalization**: Product config extensible for multi-language

## 🗂️ Legacy Files (To Be Moved)

The following directories can be renamed or moved during next major version:
- `scripts/` → `scripts/legacy/` (contains original build scripts)
- `gallery_images/` → will be removed after confirming new path works
- `acrylic_previews/`, `canvas_previews/`, `metal_previews/` → consolidable into `src/assets/previews/`

---

**Last Updated**: September 2025
**Build Tool Version**: 1.0.0 (Unified)
