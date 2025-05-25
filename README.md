# Enhanced Grok Export

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/iikoshteruu/enhanced-grok-export)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Greasyfork](https://img.shields.io/badge/install-greasyfork-red.svg)](https://greasyfork.org/scripts/YOUR_SCRIPT_ID)

The first comprehensive open-source userscript for exporting Grok conversations with multi-format support, mode preservation, and X.com integration context.

## 🚀 Features

- **🎭 Mode-Aware Exports** - Preserves Think Mode reasoning, Fun Mode personality, and DeepSearch citations
- **📝 Multiple Export Formats** - Choose from Markdown, Plain Text, or JSON with rich metadata
- **🔄 Auto-Scroll Loading** - Automatically loads complete conversation history from X.com's dynamic interface
- **🎯 Smart Detection** - Robust element detection that adapts to Grok's React-based UI changes
- **🤖 Speaker Identification** - Distinguishes between your messages and Grok's responses with mode context
- **🧹 Clean Output** - Removes X.com UI elements while preserving conversation content and citations
- **📊 Rich Metadata** - Includes timestamps, mode statistics, X integration context, and export analytics
- **🎨 Professional UI** - Elegant dropdown menu seamlessly integrated into X.com's interface
- **🖥️ Cross-Browser Compatible** - Works with all major userscript managers on desktop browsers

## 📋 Export Formats

| Format | Best For | Features |
|--------|----------|----------|
| **📝 Markdown** | Documentation & Notes | Think Mode structure, mode indicators, X.com link preservation |
| **📄 Plain Text** | Simple Sharing | Clean conversation flow, mode context, universal compatibility |
| **📊 JSON Data** | Analysis & Processing | Complete metadata, mode statistics, citation tracking |

### Markdown (.md)
Perfect for documentation and note-taking with full Grok feature support:
- Preserves Think Mode step-by-step reasoning structure
- Includes Fun Mode personality indicators and emoji context
- Maintains DeepSearch citations and X.com source links
- Compatible with GitHub, Notion, Obsidian, and other markdown editors

### Plain Text (.txt)
Simple, universal format optimized for Grok conversations:
- Clean conversation flow with clear mode transitions
- Preserves context while removing UI clutter
- Includes mode indicators for easy reference
- Compatible with any text editor or chat platform

### JSON (.json)
Structured data format with complete Grok conversation metadata:
- Full conversation analysis with mode distribution statistics
- Preserves X.com integration context and real-time data sources
- Perfect for data analysis, conversation research, and programmatic processing
- Complete conversation context with speaker identification and timestamps

## 🛠 Installation

1. **Install a userscript manager:**
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge) - Recommended
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. **Install the script:**
   - Click the userscript file or copy the code from GitHub
   - Your userscript manager will prompt you to install
   - Confirm installation and grant necessary permissions

3. **Start using:**
   - Visit [x.com/i/grok](https://x.com/i/grok) and start a conversation
   - The export button will appear automatically

## 🎯 Usage

1. **Start a conversation** with Grok on X.com
2. **Look for the 🤖 Export Grok button** in the bottom-right corner of the interface
3. **Click to open** the format selection menu
4. **Choose your preferred format:**
   - 📝 **Markdown** - For documentation, notes, and sharing with formatting
   - 📄 **Plain Text** - For simple text files and universal compatibility
   - 📊 **JSON Data** - For structured data analysis and programmatic processing

Your conversation will automatically download with a descriptive filename including message count and timestamp.

## 🐛 Known Issues & Fixes

For current bugs and their resolutions, see [BUGS.md](BUGS.md).

To report new bugs:
1. Check [existing issues](https://github.com/iikoshteruu/enhanced-grok-export/issues)
2. Use the "🔍 Debug Info" button for troubleshooting
3. [Create a new issue](https://github.com/iikoshteruu/enhanced-grok-export/issues/new) with details

## 🎭 Grok Mode Support

### 🤔 Think Mode
Grok's step-by-step reasoning mode for complex problems:
- **Preserves logical structure** - Maintains reasoning steps and analysis flow
- **Clear indicators** - Exports with visible Think Mode markers
- **Complete context** - Includes all intermediate thinking steps

### 😄 Fun Mode  
Grok's casual, humorous personality mode:
- **Personality preservation** - Maintains Grok's wit and humor in exports
- **Tone indicators** - Shows when Fun Mode was active
- **Context awareness** - Preserves casual interaction style

### 🔍 DeepSearch Mode
Real-time web search and X.com integration:
- **Citation tracking** - Maintains links to real-time data sources
- **X.com context** - Preserves social media integration and references
- **Source preservation** - Keeps external links and reference materials

## 🔧 Technical Details

### Robust Element Detection for X.com
The script uses multiple detection strategies optimized for X.com's React interface:

```javascript
// Grok conversation detection strategies
const selectors = [
    'div[class*="css-146c3p1"]',     // Message containers
    'span[class*="css-1jxf684"]',   // Text content
    'div[dir="ltr"]',               // Text direction containers
    'li[data-testid*="message"]'    // X.com message elements
];
```

### Auto-Scroll Technology
Handles X.com's dynamic loading system:
- **Intelligent scrolling** - Automatically loads complete conversation history
- **Progress tracking** - Shows loading status during auto-scroll
- **Memory management** - Processes conversations of any length efficiently
- **UI responsiveness** - Maintains interface usability during export

### File Naming Convention
Automatically generated descriptive filenames:
```
grok-FULL-conversation-156msgs-2025-05-26T14-30-45.md
grok-export-ThinkMode-42msgs-2025-05-26T15-45-22.json
```

## 🎨 Customization

Easily customize the script behavior by modifying the configuration:

```javascript
const CONFIG = {
    buttonText: '🤖 Export Grok',     // Custom button text
    formats: ['md', 'txt', 'json'],   // Available export formats
    defaultFormat: 'md',              // Default selection
    autoScroll: true,                 // Auto-load full conversation
    modeDetection: true,              // Enable mode detection
    debug: false                      // Debug logging (set to true for troubleshooting)
};
```

## 🐛 Troubleshooting

### Export button not appearing?
- ✅ Ensure your userscript manager is enabled and active
- ✅ Check that the script is running on x.com/i/grok
- ✅ Refresh the page and wait for the conversation interface to load
- ✅ Verify you're in an active Grok conversation

### Empty or incomplete exports?
- ✅ Try scrolling through the full conversation manually first
- ✅ Use auto-scroll feature and wait for complete loading
- ✅ Check browser console (F12) for detailed error messages
- ✅ Ensure your browser allows file downloads

### Mode detection not working?
- ✅ **Think Mode**: Ensure conversation includes step-by-step reasoning
- ✅ **Fun Mode**: Look for casual tone and emoji usage patterns
- ✅ **DeepSearch**: Verify real-time search results are present
- ✅ Enable debug mode in CONFIG for detailed mode detection logs

### Browser compatibility issues?
- ✅ Ensure you're using a supported userscript manager
- ✅ Try disabling other browser extensions temporarily
- ✅ Clear browser cache and cookies for x.com
- ✅ Update your userscript manager to the latest version

## 🆚 Why Enhanced Grok Export?

### 🥇 First-of-Its-Kind
- **Only comprehensive solution** - The first open-source Grok export tool
- **Built for Grok** - Specifically designed for X.com's Grok interface
- **No competition** - Unique in the open-source ecosystem

### 🎯 Grok-Optimized Features
Unlike generic chat exporters, this tool provides:
- **Mode preservation** - Maintains Think, Fun, and DeepSearch context
- **X.com integration** - Preserves social media context and citations
- **Real-time data** - Exports with live search results and references
- **React compatibility** - Works seamlessly with X.com's modern interface

### 🔒 Privacy-First Design
- **Local processing** - All operations happen in your browser
- **No external servers** - Zero data transmission to third parties
- **Complete privacy** - Your conversations never leave your device
- **Open source transparency** - Full code visibility and community auditing

### 🚀 Professional Quality
- **Enterprise features** - Multi-format export with rich metadata
- **Robust architecture** - Handles edge cases and UI changes
- **User experience** - Intuitive interface integrated into X.com
- **Continuous updates** - Active development and community support

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

1. **🍴 Fork the repository** on GitHub
2. **🌟 Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **✨ Make your changes** with proper testing
4. **🧪 Test thoroughly** with different Grok conversation types and modes
5. **📝 Document your changes** and update relevant documentation
6. **🚀 Submit a pull request** with a clear description

### 🎯 Areas for Contribution
- **🐛 Bug fixes** - Help improve stability and compatibility
- **✨ New features** - Add export formats or enhance existing functionality  
- **📚 Documentation** - Improve guides and troubleshooting resources
- **🧪 Testing** - Cross-browser and edge case testing
- **🌍 Localization** - Multi-language support for international users

## 🔮 Roadmap

### 🚀 Coming Soon (v1.1)
- **📄 PDF Export** - Professional report generation with jsPDF integration
- **🐦 Share to X** - Direct posting of conversation snippets to your timeline
- **🖼️ Image Support** - Export and preserve generated images and visual content
- **📊 Advanced Analytics** - Conversation insights, mode usage statistics, and trends

### 🌟 Future Features (v2.0+)
- **📦 Batch Export** - Export multiple conversations simultaneously
- **🎨 Custom Templates** - Personalized export formatting and styling options
- **☁️ Cloud Integration** - Direct export to Google Drive, Dropbox, OneDrive
- **🔍 Smart Filtering** - Export specific topics, dates, or conversation segments
- **🤖 AI Summaries** - Automatic conversation summarization and key points extraction
- **📱 Mobile Support** - Enhanced mobile browser compatibility

### 🔬 Research & Development
- **🧠 Conversation Analysis** - AI-powered conversation insights and patterns
- **🔗 API Integration** - Connect with other productivity tools and platforms
- **📈 Usage Analytics** - Anonymous usage statistics for feature prioritization
- **🌐 Multi-Platform** - Support for other AI chat platforms

## 📜 Credits

- **🎯 Enhanced Version**: [iikoshteruu](https://github.com/iikoshteruu) - Lead developer and maintainer
- **💡 Inspiration**: Success of Enhanced Claude Export and community feedback
- **🤝 Built for**: The growing X.com Grok community and AI conversation enthusiasts
- **🙏 Special Thanks**: Open source community and beta testers

## 📄 License

**MIT License** - Feel free to modify, distribute, and use in your own projects!

See the [LICENSE](LICENSE) file for full details.

## 🔗 Links

- **🤖 Grok AI**: [x.com/i/grok](https://x.com/i/grok)
- **🐦 X.com**: [x.com](https://x.com)
- **📚 Userscript Guide**: [Userscript Beginners HOWTO](https://openuserjs.org/about/Userscript-Beginners-HOWTO)
- **🔧 Tampermonkey**: [tampermonkey.net](https://www.tampermonkey.net/)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/iikoshteruu/enhanced-grok-export/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/iikoshteruu/enhanced-grok-export/discussions)

---

*Made with ❤️ for the X.com Grok community • Star ⭐ this repo if it helps you!*
