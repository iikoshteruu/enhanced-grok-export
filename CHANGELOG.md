# Changelog

All notable changes to the Enhanced Grok Export Script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v1.0.0.html).

## [1.0.0] - 2025-05-26

### Added
- Auto-scroll functionality to load complete conversations
- Multiple detection strategies for robust element finding
- Progress notifications during export process
- Debug mode with detailed logging
- Message count in exported filenames
- Enhanced speaker detection using content patterns
- Support for very long conversations (500+ messages)
- Fallback methods when primary detection fails

### Changed
- Improved file naming: `grok-FULL-conversation-156msgs-2025-05-26.md`
- Button text changed to "📥 Export Full" to indicate enhanced functionality
- Better error handling and user feedback
- Enhanced UI with improved menu design and descriptions

### Fixed
- Fixed conversation truncation issues
- Resolved problems with n8n-style data processing
- Improved text visibility in export menu (white text on dark backgrounds)
- Better handling of grok.com UI changes

## [1.0.0] - 2025-05-25

### Added
- Multiple export formats (Markdown, Plain Text, JSON)
- Speaker identification between Human and Grok
- Metadata inclusion (timestamps, export date, message counts)
- Elegant dropdown menu interface
- Hover effects and improved styling
- JSON export with full conversation statistics
- Cross-browser compatibility improvements

### Changed
- Complete rewrite of conversation detection logic
- Improved UI design with gradient buttons and clean menus
- Enhanced error handling and validation

### Fixed
- Resolved element detection issues with grok.com updates
- Fixed export failures on long conversations
- Improved text cleaning and formatting

## [1.1.0] - Based on TheAlanK & SAPIENT

### Added
- Basic conversation export functionality
- Simple text file output
- Compact design for small screens
- Core element detection using `.col-start-2` selector

### Features
- Single-format export (plain text)
- Basic conversation capture
- Minimal UI footprint

---

## Version Schema

**Major.Minor.Patch** (e.g., 1.0.0)

- **Major**: Breaking changes or complete rewrites
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, small improvements

## Credits

- **v1.1**: Original script by [iikoshteruu](https://github.com/iikoshteruu)
 
