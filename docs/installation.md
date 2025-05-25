# Installation Guide

This guide provides detailed installation instructions for the Enhanced grok Export Script across different browsers and userscript managers.

## 🚀 Quick Installation

### Method 1: Direct Install (Recommended)
1. **Install a userscript manager** (see detailed instructions below)
2. **Click this link**: [Install Enhanced grok Export](https://github.com/iikoshteruu/enhanced-grok-export/raw/main/enhanced-grok-export.user.js)
3. **Confirm installation** in your userscript manager
4. **Visit x.com/i/grok** and start using the export feature

### Method 2: Manual Installation
1. Download the script file: [`enhanced-grok-export.user.js`](https://github.com/iikoshteruu/enhanced-grok-export/raw/main/enhanced-grok-export.user.js)
2. Open your userscript manager dashboard
3. Create new script or import file
4. Paste the code and save

## 🔧 Userscript Manager Installation

### Tampermonkey (Recommended)

**Chrome:**
1. Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. Click "Add to Chrome"
3. Confirm installation

**Firefox:**
1. Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. Click "Add to Firefox"
3. Confirm installation

**Safari:**
1. Visit [App Store](https://apps.apple.com/us/app/tampermonkey/id1482490089)
2. Install Tampermonkey for Safari
3. Enable in Safari Extensions preferences

**Edge:**
1. Visit [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2. Click "Get"
3. Confirm installation

### Greasemonkey (Firefox Only)

1. Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
2. Click "Add to Firefox"
3. Restart Firefox if required

### Violentmonkey (Cross-browser)

**Chrome:**
1. Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
2. Click "Add to Chrome"

**Firefox:**
1. Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
2. Click "Add to Firefox"

## 📱 Mobile Installation

### iOS (Safari)
1. Install [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) from App Store
2. Enable the app in Safari Settings → Extensions
3. Install the script through the app

### Android (Firefox)
1. Install Firefox for Android
2. Install Tampermonkey for Firefox
3. Follow standard installation process

### Android (Kiwi Browser)
1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser)
2. Install Tampermonkey from Chrome Web Store
3. Install the userscript normally

## ✅ Verification

After installation, verify the script is working:

1. **Visit x.com/i/grok** and start a conversation
2. **Look for the export button** in the bottom-right corner (📥 Export Full)
3. **Test export functionality** by clicking the button
4. **Check the dropdown menu** shows three format options

### Troubleshooting Installation

**Script not appearing:**
- Check if userscript manager is enabled
- Verify the script is active in your manager
- Refresh x.com/i/grok page
- Check browser console for errors

**Export button missing:**
- Ensure you're on a x.com/i/grok conversation page
- Try scrolling or interacting with the page
- Disable other userscripts temporarily
- Check if x.com/i/grok updated their interface

## ⚙️ Configuration

### Basic Settings
The script works out-of-the-box with default settings. Advanced users can modify the configuration by editing the script:

```javascript
const CONFIG = {
    buttonText: 'Export Full',      // Button text
    formats: ['txt', 'md', 'json'], // Available formats
    defaultFormat: 'md',            // Default selection
    autoScroll: true,               // Auto-scroll to load full conversation
    debug: true                     // Enable debug logging
};
```

### Customization Options

**Change Button Position:**
```javascript
// In createExportButton() function, modify:
button.style.cssText = `
    position: fixed;
    bottom: 10px;    // Change this
    right: 10px;     // Change this
    // ... rest of styles
`;
```

**Modify Export Formats:**
```javascript
// In createExportMenu() function, modify:
const formats = [
    { ext: 'md', name: 'Markdown', icon: '📝' },
    { ext: 'txt', name: 'Plain Text', icon: '📄' },
    { ext: 'json', name: 'JSON Data', icon: '📊' }
    // Add more formats here
];
```

## 🔄 Updates

### Automatic Updates
If installed from the GitHub raw link, the script will automatically check for updates through your userscript manager.

### Manual Updates
1. Visit the [latest release](https://github.com/iikoshteruu/enhanced-grok-export/raw/main/enhanced-grok-export.user.js)
2. Your userscript manager will detect the update
3. Confirm the update installation

### Version Checking
Check your current version:
1. Open your userscript manager
2. Find "Enhanced grok Export" in the list
3. Version number is displayed in the script details

## 🛡️ Security Notes

- **Local Processing**: All data processing happens in your browser
- **No External Servers**: Script doesn't send data anywhere
- **Open Source**: Full source code is available for review
- **Minimal Permissions**: Only requires access to x.com/i/grok

## 📞 Support

If you encounter issues during installation:

1. **Check the troubleshooting section** above
2. **Search existing issues** on [GitHub Issues](https://github.com/iikoshteruu/enhanced-grok-export/issues)
3. **Create a new issue** with your browser and userscript manager details
4. **Include console output** if available (F12 → Console)

## 🔗 Related Links

- [Main Repository](https://github.com/iikoshteruu/enhanced-grok-export)
- [Usage Guide](usage.md)
- [Troubleshooting](troubleshooting.md)
- [Changelog](../CHANGELOG.md)
- [Security Policy](../SECURITY.md)
