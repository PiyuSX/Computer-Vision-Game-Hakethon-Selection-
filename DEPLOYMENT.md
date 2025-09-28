# Deployment Troubleshooting Guide 🚀

## Common Deployment Issues & Solutions

### 1. **HTTPS Requirement** ⚠️
**Problem:** Camera/MediaPipe doesn't work on HTTP sites
**Solution:** 
- Deploy to HTTPS hosting (GitHub Pages, Netlify, Vercel)
- For local testing, use `http://localhost` or `http://127.0.0.1`

### 2. **CDN/Library Loading Issues** 📚
**Problem:** MediaPipe libraries fail to load
**Solutions:**
- Check network connectivity
- Use the `simple.html` version as fallback
- Verify CDN links are accessible
- Clear browser cache

### 3. **Camera Permissions** 📹
**Problem:** Camera access denied
**Solutions:**
- Use HTTPS (required for camera access)
- Check browser permissions in settings
- Try different browsers (Chrome recommended)
- Use keyboard controls as fallback

### 4. **Cross-Origin Issues** 🌐
**Problem:** CORS errors when loading resources
**Solutions:**
- Serve from a proper web server
- Use GitHub Pages, Netlify, or similar
- Don't open HTML file directly in browser

## Deployment Checklist ✅

### For Web Hosting:
1. **Upload all files:**
   - `index.html` (main version)
   - `simple.html` (fallback version)
   - `game.js`
   - `hand-detection.js`
   - `main.js`
   - `README.md`

2. **Ensure HTTPS:**
   - Most free hosting provides HTTPS automatically
   - GitHub Pages: `https://username.github.io/repo-name`
   - Netlify: Drag & drop folder for instant HTTPS hosting

3. **Test in multiple browsers:**
   - Chrome (recommended)
   - Firefox
   - Edge
   - Safari (limited MediaPipe support)

### Quick Deploy Options:

#### Option 1: GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Enable GitHub Pages in settings
4. Access via `https://username.github.io/repository-name`

#### Option 2: Netlify
1. Go to netlify.com
2. Drag & drop the Computer Vision folder
3. Get instant HTTPS URL

#### Option 3: Vercel
1. Go to vercel.com
2. Connect GitHub repo or upload folder
3. Automatic HTTPS deployment

## Browser Compatibility 🌐

| Browser | Hand Gestures | Keyboard | Status |
|---------|---------------|----------|--------|
| Chrome | ✅ Full | ✅ | Recommended |
| Firefox | ✅ Full | ✅ | Good |
| Edge | ✅ Full | ✅ | Good |
| Safari | ⚠️ Limited | ✅ | Use keyboard |
| Mobile Chrome | ⚠️ Varies | ✅ | Device dependent |
| Mobile Safari | ❌ Poor | ✅ | Use keyboard |

## Fallback Strategy 🔄

If hand gesture detection fails:
1. Game automatically falls back to keyboard controls
2. Use `simple.html` for guaranteed compatibility
3. All core game features work with SPACEBAR

## Testing Locally 🏠

For local development:
```bash
# Option 1: Python HTTP server
python -m http.server 8000
# Then visit: http://localhost:8000

# Option 2: Node.js http-server
npx http-server
# Then visit: http://localhost:8080

# Option 3: PHP built-in server
php -S localhost:8000
```

## Performance Tips ⚡

1. **Close other applications** using camera
2. **Good lighting** helps hand detection
3. **Clear background** improves accuracy
4. **Modern browser** for best performance
5. **Stable internet** for CDN resources

## Debug Information 🔍

Open browser console (F12) to see:
- MediaPipe loading status
- Camera initialization errors
- Frame processing errors
- Performance warnings

## File Structure 📁

```
Computer Vision/
├── index.html          # Main version with hand gestures
├── simple.html         # Keyboard-only fallback
├── game.js            # Core game engine
├── hand-detection.js  # MediaPipe hand detection
├── main.js           # Application controller
└── README.md         # Documentation
```

## Still Not Working? 🆘

1. **Try simple.html first** - guarantees basic functionality
2. **Check browser console** for specific errors
3. **Test on different device/browser**
4. **Verify HTTPS hosting**
5. **Clear cache and hard refresh** (Ctrl+Shift+R)

## Contact & Support 💬

If issues persist:
- Check console errors
- Try the simple.html version
- Test different browsers
- Ensure HTTPS deployment

The game should work on any modern HTTPS website with proper hosting! 🎮