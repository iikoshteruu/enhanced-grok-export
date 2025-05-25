# Enhanced Claude.ai Export Script

[![Version](https://img.shields.io/badge/version-2.1-blue.svg)](https://github.com/iikoshteruu/enhanced-claude-export)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Greasyfork](https://img.shields.io/badge/install-greasyfork-red.svg)](https://greasyfork.org/scripts/YOUR_SCRIPT_ID)

A powerful userscript that allows you to export your Claude.ai conversations in multiple formats with improved reliability and features.

## 🚀 Features

- **Multiple Export Formats**: Choose from Markdown, Plain Text, or JSON
- **Auto-Scroll Loading**: Automatically loads full conversation before export
- **Smart Conversation Detection**: Robust element detection that adapts to UI changes
- **Speaker Identification**: Distinguishes between human and Claude messages
- **Clean Output**: Automatically removes UI elements, buttons, and icons
- **Metadata Inclusion**: Adds timestamps, export date, and message counts
- **User-Friendly Interface**: Elegant dropdown menu with hover effects
- **Debug Mode**: Built-in debugging for troubleshooting
- **Cross-Browser Compatible**: Works with all major userscript managers
- **Mobile-Friendly**: Compact design that works on small screens

## 📸 Screenshots

### Export Menu
![Export Menu](examples/export-menu-screenshot.png)
*Clean, intuitive interface with multiple format options*

### Sample Output
![Sample Export](examples/sample-output-screenshot.png)
*Professional formatting with proper conversation structure*

## 📋 Export Formats

### Markdown (.md)
- Perfect for documentation and note-taking
- Includes headers and proper formatting
- Compatible with GitHub, Notion, and other markdown editors

### Plain Text (.txt)
- Simple, universal format
- Easy to read and share
- Compatible with any text editor

### JSON (.json)
- Structured data format
- Includes full metadata
- Perfect for programmatic processing or backup

## 🛠 Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Click the userscript file or copy the code
3. Your userscript manager will prompt you to install
4. Visit [Claude.ai](https://claude.ai) and start chatting

## 🎯 Usage

1. Have a conversation with Claude
2. Look for the **📥 Export Full** button in the bottom-right corner
3. Click to open the format selection menu
4. Choose your preferred format:
   - 📝 **Markdown** - For documentation and notes
   - 📄 **Plain Text** - For simple text files
   - 📊 **JSON Data** - For structured data

Your conversation will automatically download with a timestamped filename including message count.

## 🔧 Technical Details

### Robust Element Detection
The script uses multiple CSS selectors to find conversation elements, making it resilient to Claude.ai UI updates:
```javascript
const selectors = [
    '[data-testid*="message"]',
    '[class*="message"]', 
    '.col-start-2',
    '[role="presentation"] > div > div'
];
```

### Smart Content Cleaning
Automatically removes unwanted elements while preserving conversation content:
- SVG icons and images
- UI buttons and controls
- Hidden accessibility elements
- Navigation elements

### Auto-Scroll Technology
Forces complete conversation loading before export:
- Scrolls to top to load older messages
- Waits for content to fully load
- Processes in batches to avoid memory issues
- Shows progress notifications during loading

### File Naming Convention
Files are automatically named with timestamps and message counts:
```
claude-FULL-conversation-156msgs-2025-05-26T14-30-45.md
```

## 🎨 Customization

The script can be easily customized by modifying the `CONFIG` object:

```javascript
const CONFIG = {
    buttonText: 'Export Full',      // Button text
    formats: ['txt', 'md', 'json'], // Available formats
    defaultFormat: 'md',            // Default selection
    includeTimestamps: true,        // Include timestamps
    includeMetadata: true,          // Include conversation metadata
    autoScroll: true,               // Auto-scroll to load full conversation
    debug: true                     // Enable debug logging
};
```

## 🐛 Troubleshooting

**Export button not appearing?**
- Make sure your userscript manager is enabled
- Check that the script is active on claude.ai
- Refresh the page

**Empty or incomplete exports?**
- Ensure you have an active conversation
- Try scrolling through the full conversation first
- Check browser console for debug messages
- Use the "Debug Info" button to see what the script detects

**UI looks different?**
- Claude.ai occasionally updates their interface
- The script uses multiple selectors for compatibility
- File an issue if exports stop working

**Auto-scroll not working?**
- Check console for error messages
- Try disabling auto-scroll in CONFIG if needed
- Some conversations may be too long for auto-loading

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with different conversation types
5. Submit a pull request

## 📜 Credits

- **Original Script**: [TheAlanK](https://github.com/TheAlanK) & SAPIENT
- **Enhanced Version**: [iikoshteruu](https://github.com/iikoshteruu?tab=repositories)
- **Based on**: [Export Claude.Ai v1.1-miniaturized](https://greasyfork.org/scripts/478826)

## 📄 License

MIT License - feel free to modify and distribute!

## 🔗 Links

- [Original Script on Greasyfork](https://greasyfork.org/scripts/478826)
- [Claude.ai](https://claude.ai)
- [Userscript Managers](https://openuserjs.org/about/Userscript-Beginners-HOWTO)

---

*Made with ❤️ for the Claude.ai community*
