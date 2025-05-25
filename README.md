# Enhanced Grok Export

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/iikoshteruu/enhanced-grok-export)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Greasyfork](https://img.shields.io/badge/install-greasyfork-red.svg)](https://greasyfork.org/scripts/YOUR_SCRIPT_ID)

The first comprehensive open-source userscript for exporting Grok.ai conversations with multi-format support, mode preservation, and multimodal content handling.

## 🚀 Features

- **🎭 Mode-Aware Exports** - Preserves Think Mode, Fun Mode, and DeepSearch context
- **📝 Multiple Export Formats** - Choose from Markdown, Plain Text, or JSON
- **🔄 Auto-Scroll Loading** - Automatically loads complete conversation history
- **🎯 Smart Detection** - Robust element detection that adapts to Grok's UI changes
- **🤖 Speaker Identification** - Distinguishes between your messages and Grok's responses
- **🧹 Clean Output** - Automatically removes UI elements while preserving content
- **📊 Rich Metadata** - Includes timestamps, mode indicators, and export statistics
- **🎨 Professional UI** - Elegant dropdown menu seamlessly integrated into Grok
- **🖥️ Cross-Browser Compatible** - Works with all major userscript managers

## 📋 Export Formats

### Markdown (.md)
- Perfect for documentation and note-taking
- Preserves Think Mode reasoning steps
- Includes mode indicators and formatting
- Compatible with GitHub, Notion, and other markdown editors

### Plain Text (.txt)
- Simple, universal format
- Clean conversation flow with mode context
- Easy to read and share
- Compatible with any text editor

### JSON (.json)
- Structured data format with complete metadata
- Includes mode statistics and conversation analysis
- Perfect for data analysis and programmatic processing
- Full conversation context preservation

## 🛠 Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Click the userscript file or copy the code
3. Your userscript manager will prompt you to install
4. Visit [Grok](https://grok.com) or [X.com](https://x.com/grok) and start chatting

## 🎯 Usage

1. Have a conversation with Grok
2. Look for the **🤖 Export Grok** button in the bottom-right corner
3. Click to open the format selection menu
4. Choose your preferred format:
   - 📝 **Markdown** - For documentation and notes
   - 📄 **Plain Text** - For simple text files
   - 📊 **JSON Data** - For structured data and analysis

Your conversation will automatically download with a timestamped filename including message count.

## 🎭 Grok Mode Support

### Think Mode 🤔
- Preserves step-by-step reasoning structure
- Maintains logical flow and analysis steps
- Exports with clear Think Mode indicators

### Fun Mode 😄
- Includes personality and tone context
- Preserves humor and casual interactions
- Mode indicators show conversation style

### DeepSearch Mode 🔍
- Maintains real-time data citations
- Preserves X.com integration context
- Includes source references and links

## 🔧 Technical Details

### Robust Element Detection
The script uses multiple detection strategies for Grok's React-based interface:
```javascript
// Primary strategy - actual Grok DOM structure
document.querySelectorAll('div[class*="css-146c3p1"]')
document.querySelectorAll('span[class*="css-1jxf684"]')
document.querySelectorAll('div[dir="ltr"]')
```

### Auto-Scroll Technology
- Automatically loads complete conversation history
- Handles Grok's dynamic message loading
- Processes conversations of any length
- Shows progress notifications during loading

### File Naming Convention
Files are automatically named with useful information:
```
grok-FULL-conversation-156msgs-2025-05-26T14-30-45.md
```

## 🎨 Customization

The script can be easily customized by modifying the `CONFIG` object:

```javascript
const CONFIG = {
    buttonText: 'Export Grok',        // Button text
    formats: ['txt', 'md', 'json'],   // Available formats
    defaultFormat: 'md',              // Default selection
    autoScroll: true,                 // Auto-scroll to load full conversation
    debug: true                       // Enable debug logging
};
```

## 🐛 Troubleshooting

**Export button not appearing?**
- Make sure your userscript manager is enabled
- Check that the script is active on grok.com or x.com
- Refresh the page and ensure you're in a conversation

**Empty or incomplete exports?**
- Try scrolling through the full conversation manually first
- Use the "Debug Info" button to check message detection
- Check browser console for detailed logging information

**Mode detection not working?**
- Grok modes are detected based on content patterns
- Think Mode: Look for step-by-step reasoning indicators
- Fun Mode: Detected through tone and emoji usage
- DeepSearch: Identified by citation patterns

## 🆚 Why Enhanced Grok Export?

### First-of-Its-Kind
- The only comprehensive open-source Grok export solution
- Built specifically for Grok's unique features and capabilities
- No competing tools exist in the open-source ecosystem

### Grok-Optimized Features
- **Mode Preservation** - Unlike generic chat exporters
- **X Integration Context** - Maintains real-time data sources
- **Multimodal Ready** - Prepared for Grok's image capabilities
- **React UI Compatible** - Works with Grok's modern interface

### Privacy-First
- All processing happens locally in your browser
- No external servers or data transmission
- Your conversations remain completely private
- Open source code for full transparency

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with different Grok conversation types
5. Submit a pull request

## 🔮 Roadmap

### Coming Soon
- **📄 PDF Export** - Professional report generation using jsPDF
- **🐦 Share to X** - Direct posting of conversation snippets
- **🖼️ Image Support** - Export embedded images and generated content
- **📊 Advanced Analytics** - Conversation insights and statistics

### Future Features
- **Batch Export** - Export multiple conversations at once
- **Custom Templates** - Personalized export formatting
- **Cloud Integration** - Direct export to Google Drive, Dropbox
- **Advanced Filtering** - Export specific conversation topics or date ranges

## 📜 Credits

- **Enhanced Version**: [iikoshteruu](https://github.com/iikoshteruu)
- **Inspired by**: Enhanced Claude Export success
- **Built for**: The growing Grok.ai community

## 📄 License

MIT License - feel free to modify and distribute!

## 🔗 Links

- [Grok.ai](https://grok.com)
- [X.com Grok](https://x.com/grok)
- [Userscript Managers Guide](https://openuserjs.org/about/Userscript-Beginners-HOWTO)

---

*Made with 🤖 for the Grok.ai community*
