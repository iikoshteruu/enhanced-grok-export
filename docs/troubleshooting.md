# Troubleshooting Guide

This guide helps resolve common issues with Enhanced Grok Export. Follow the step-by-step solutions to get your export functionality working smoothly.

## 🚨 Quick Diagnostics

### Is the Script Working?
**Quick Check List:**
- [ ] Export button (📥 Export Full) visible in bottom-right corner
- [ ] Clicking button shows dropdown menu with 3 format options
- [ ] Menu text is readable (not white on white)
- [ ] Debug Info button appears in menu (if debug mode enabled)

**If any item fails, jump to the relevant section below.**

## 🔍 Common Issues

### 1. Export Button Not Appearing

**Symptoms:**
- No export button visible on x.com/i/grok
- Button appears then disappears
- Button only shows on some pages

**Solutions:**

**Step 1: Check Userscript Manager**
```
1. Open your userscript manager (Tampermonkey/Greasemonkey)
2. Verify "Enhanced Grok Export" is installed and enabled
3. Check that it's set to run on x.com/i/grok
4. Look for any error indicators (red icons)
```

**Step 2: Verify URL Match**
```
1. Ensure you're on a x.com/i/grok conversation page
2. URL should be: https://x.com/i/grok/chat/[conversation-id]
3. Script doesn't run on x.com/i/grok homepage or settings pages
4. Try refreshing the page after navigating to a conversation
```

**Step 3: Check Browser Console**
```
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for errors containing "Grok Export"
4. Common errors and solutions below
```

**Step 4: Clear Browser Cache**
```
1. Clear browser cache and cookies for x.com/i/grok
2. Disable other browser extensions temporarily
3. Try in incognito/private browsing mode
4. Restart browser and try again
```

### 2. Export Menu Not Readable (White Text Issue)

**Symptoms:**
- Export button appears but menu text is invisible
- Can see format icons but not text descriptions
- Menu appears but content looks blank

**Solutions:**

**Step 1: Update Script Version**
```
1. Check if you have the latest version (v2.1 or higher)
2. Latest version fixed white text visibility issues
3. Uninstall old version and reinstall from GitHub
4. Clear userscript manager cache
```

**Step 2: Check Browser Compatibility**
```
1. Try in different browser (Chrome, Firefox, Safari, Edge)
2. Ensure browser is up to date
3. Disable dark mode extensions temporarily
4. Try different browser theme/appearance settings
```

**Step 3: Manual Fix (Advanced)**
```javascript
// If you're comfortable editing the script:
// Find this line in the script and ensure it exists:
button.style.color = '#333333 !important';
```

### 3. Incomplete or Empty Exports

**Symptoms:**
- Export completes but file is empty or very short
- Missing messages from conversation
- Only recent messages included
- Export shows "No conversation found"

**Solutions:**

**Step 1: Enable Auto-Scroll**
```
1. Ensure auto-scroll is enabled in script configuration
2. Manually scroll through entire conversation first
3. Wait for all messages to load before exporting
4. Try exporting smaller conversation sections
```

**Step 2: Check Conversation Loading**
```
1. Scroll to top of conversation manually
2. Scroll slowly to bottom, waiting for messages to load
3. Look for "loading" indicators in x.com/i/grok interface
4. Try refreshing page if conversation seems incomplete
```

**Step 3: Use Debug Mode**
```
1. Click "Debug Info" button in export menu
2. Check console output for detected message count
3. Compare with actual conversation length
4. Look for element detection errors
```

**Step 4: Try Different Export Format**
```
1. If Markdown fails, try Plain Text
2. If Plain Text fails, try JSON
3. JSON format often works when others fail
4. Different formats use slightly different detection methods
```

### 4. x.com/i/grok Interface Changes

**Symptoms:**
- Script worked before but stopped working
- Export button appears but doesn't function
- Error messages about elements not found

**Solutions:**

**Step 1: Check for Script Updates**
```
1. Visit GitHub repository for latest version
2. Check if there are recent updates for UI changes
3. Update to latest version if available
4. Check changelog for UI compatibility fixes
```

**Step 2: Report Interface Changes**
```
1. Take screenshot of current x.com/i/grok interface
2. Note what changed (button locations, element styling, etc.)
3. Create GitHub issue with details
4. Include browser and script version information
```

**Step 3: Temporary Workarounds**
```
1. Try copying conversation text manually as backup
2. Use browser's built-in "Save As" feature
3. Take screenshots for important conversations
4. Wait for script update to support new interface
```

### 5. Large Conversation Issues

**Symptoms:**
- Browser becomes slow or unresponsive during export
- Export times out or fails partway through
- "Out of memory" errors in browser
- Very long conversations (500+ messages) won't export

**Solutions:**

**Step 1: Optimize Browser Performance**
```
1. Close other browser tabs and applications
2. Clear browser cache and restart browser
3. Ensure sufficient system memory available
4. Try in fresh browser profile
```

**Step 2: Export in Sections**
```
1. Break large conversations into smaller parts
2. Export recent messages first (scroll partway up)
3. Export older sections separately
4. Combine exported files manually if needed
```

**Step 3: Use JSON Format**
```
1. JSON format is most memory-efficient
2. Processes data faster than Markdown
3. Can handle larger conversations
4. Convert to other formats later if needed
```

**Step 4: Adjust Script Settings**
```javascript
// Advanced users can modify these settings:
CONFIG.scrollDelay = 2000;  // Increase delay between scrolls
CONFIG.maxScrollAttempts = 30;  // Reduce maximum scroll attempts
```

### 6. Download Issues

**Symptoms:**
- Export process completes but no file downloads
- File downloads but is corrupted or empty
- Browser blocks download
- Wrong file extension

**Solutions:**

**Step 1: Check Browser Download Settings**
```
1. Verify downloads are enabled in browser settings
2. Check if download location has sufficient space
3. Disable download blocking extensions
4. Try different download folder
```

**Step 2: Browser Permission Issues**
```
1. Grant file download permissions to x.com/i/grok
2. Add x.com/i/grok to trusted sites list
3. Disable popup blockers for x.com/i/grok
4. Try in incognito mode to bypass restrictions
```

**Step 3: File Association Problems**
```
1. Right-click downloaded file → "Open with"
2. Choose appropriate application (text editor, markdown viewer)
3. Change file extension manually if needed (.txt, .md, .json)
4. Try opening in different applications
```

## 🛠️ Advanced Troubleshooting

### Console Error Messages

**"Cannot read property 'length' of undefined"**
- Solution: Conversation not fully loaded, try manual scrolling first

**"Failed to execute 'click' on 'HTMLElement'"**
- Solution: x.com/i/grok UI changed, check for script updates

**"Script error: Network timeout"**
- Solution: Slow internet connection, increase timeout values

**"TypeError: Cannot read property 'textContent'"**
- Solution: Element detection failed, try refreshing page

### Performance Optimization

**For Large Conversations:**
```javascript
// Modify these values in script for better performance:
const CONFIG = {
    scrollDelay: 1500,      // Increase for slower loading
    maxScrollAttempts: 25,  // Reduce for timeout prevention
    debug: false            // Disable debug logging
};
```

**Memory Management:**
1. Export conversations regularly (don't let them get too long)
2. Close other browser tabs during large exports
3. Use JSON format for efficiency
4. Clear browser cache regularly

### Script Conflicts

**Other Userscripts:**
1. Disable other x.com/i/grok related scripts temporarily
2. Check for CSS/JavaScript conflicts
3. Test with only Enhanced Grok Export enabled
4. Report specific script conflicts as GitHub issues

**Browser Extensions:**
1. Ad blockers may interfere with element detection
2. Privacy extensions might block script functionality
3. Developer tools extensions can cause conflicts
4. Try disabling extensions one by one to isolate issues

## 📞 Getting Help

### Before Reporting Issues

**Gather This Information:**
```
- Browser name and version
- Userscript manager and version
- Script version
- x.com/i/grok URL where issue occurs
- Console error messages (if any)
- Steps to reproduce the problem
- Screenshots of the issue
```

### Where to Get Help

1. **GitHub Issues**: [Report bugs and request features](https://github.com/iikoshteruu/enhanced-Grok-export/issues)
2. **Documentation**: Check other docs in this folder
3. **Community**: Search existing issues for solutions
4. **Updates**: Follow repository for announcements

### Creating Effective Bug Reports

**Use This Template:**
```markdown
**Environment:**
- Browser: Chrome 120.0.6099.129
- Userscript Manager: Tampermonkey 5.0.1
- Script Version: 1.0.0
- OS: Windows 11

**Problem:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to x.com/i/grok
2. Start conversation about [topic]
3. Click export button
4. Select [format]
5. Error occurs

**Expected vs Actual:**
Expected: Conversation downloads as MD file
Actual: Nothing happens, no error message

**Console Output:**
[Paste any error messages from browser console]

**Additional Info:**
- Conversation length: ~50 messages
- Tried multiple formats: Yes/No
- Worked before: Yes/No
```

## 🔄 Regular Maintenance

### Keep Script Updated
- Check for updates monthly
- Follow GitHub repository for announcements
- Update userscript manager regularly
- Clear userscript cache occasionally

### Browser Maintenance
- Keep browser updated to latest version
- Clear cache and cookies periodically
- Restart browser regularly
- Monitor extension conflicts

### Backup Important Conversations
- Export conversations regularly
- Don't rely solely on x.com/i/grok storage
- Organize exports in dated folders
- Test exports periodically to ensure they work

---

**Still having issues?** Create a [GitHub issue](https://github.com/iikoshteruu/enhanced-grok-export/issues) with detailed information about your problem.
