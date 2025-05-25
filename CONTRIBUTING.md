# Contributing to Enhanced Grok Export

Thank you for your interest in contributing to the Enhanced Grok Export Script! This document provides guidelines and information for contributors.

## 🚀 How to Contribute

### Reporting Bugs
1. Check existing [issues](https://github.com/iikoshteruu/enhanced-Grok-export/issues) first
2. Use the bug report template when creating new issues
3. Include your browser, userscript manager, and grok.com URL
4. Provide steps to reproduce the problem

### Suggesting Features
1. Check existing feature requests in [issues](https://github.com/iikoshteruu/enhanced-Grok-export/issues)
2. Use the feature request template
3. Explain the use case and expected behavior
4. Consider backward compatibility

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly with different conversation types
5. Submit a pull request

## 🛠 Development Setup

### Prerequisites
- A userscript manager (Tampermonkey, Greasemonkey, etc.)
- Access to grok.com
- Basic JavaScript knowledge

### Testing Your Changes
1. Install your modified script in your userscript manager
2. Test with conversations of various lengths:
   - Short conversations (2-5 messages)
   - Medium conversations (20-50 messages)
   - Long conversations (100+ messages)
3. Test all export formats (Markdown, Plain Text, JSON)
4. Verify speaker detection accuracy
5. Test auto-scroll functionality

### Code Style Guidelines
- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions focused and single-purpose
- Use ES6+ features when appropriate

## 🎯 Priority Areas for Contribution

### High Impact
- **UI Improvements**: Better visual design, animations, accessibility
- **Export Formats**: Additional formats (PDF, CSV, etc.)
- **Performance**: Optimization for very long conversations
- **Compatibility**: Support for grok.com UI changes

### Medium Impact
- **Features**: Custom export templates, filtering options
- **Quality**: Better speaker detection algorithms
- **Documentation**: Video tutorials, advanced usage guides

### Low Impact but Welcome
- **Code Quality**: Refactoring, optimization
- **Testing**: Automated testing frameworks
- **Localization**: Multi-language support

## 🐛 Bug Report Requirements

When reporting bugs, please include:

```
**Environment:**
- Browser: Chrome 91.0.4472.124
- Userscript Manager: Tampermonkey 4.13
- grok.com URL: https://grok.com/chat/...

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Steps to Reproduce:**
1. Go to grok.com
2. Start a conversation
3. Click export...

**Console Output:**
Any error messages in browser console

**Additional Context:**
Conversation length, export format attempted, etc.
```

## 🌟 Feature Request Guidelines

Good feature requests include:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Use Cases**: When would people use this?
- **Alternatives**: Other ways to solve the problem
- **Implementation Ideas**: Technical approach (if applicable)

## 📝 Documentation Contributions

Help improve documentation by:
- Fixing typos and grammar
- Adding missing information
- Creating tutorials and guides
- Improving code comments
- Translating documentation

## 🔧 Code Review Process

1. **Automated Checks**: GitHub Actions will run validation
2. **Manual Review**: Maintainers will review code quality
3. **Testing**: Changes must not break existing functionality
4. **Documentation**: Update relevant docs if needed

## 🎨 UI/UX Contributions

When improving the user interface:
- Maintain compatibility with grok.com's design
- Ensure accessibility (contrast, keyboard navigation)
- Test on different screen sizes
- Consider user workflow and efficiency
- Preserve existing functionality

## 📋 Pull Request Checklist

Before submitting a pull request:
- [ ] Code follows existing style guidelines
- [ ] Changes have been tested thoroughly
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Given credit in code comments (for significant contributions)

## 📞 Getting Help

- Open an [issue](https://github.com/iikoshteruu/enhanced-Grok-export/issues) for questions
- Tag maintainers (@iikoshteruu) for urgent matters
- Be patient and respectful in all interactions

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Respect different viewpoints and experiences

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Spam or irrelevant contributions
- Disruptive or unconstructive criticism

## 🎯 Roadmap

Future planned features:
- **Advanced Filtering**: Export specific date ranges or topics
- **Batch Export**: Export multiple conversations at once
- **Cloud Storage**: Direct export to Google Drive, Dropbox
- **Templates**: Customizable export templates
- **Analytics**: Conversation statistics and insights

---

Thank you for contributing to Enhanced Grok Export! 🚀
