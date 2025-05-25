// ==UserScript==
// @name     Enhanced Claude.Ai Export v2.1
// @description Export Claude conversations with multiple formats, better structure, and robust element detection
// @version  2.0
// @author   Original: TheAlanK & SAPIENT | Enhanced by:iikoshteruu 
// @grant    none
// @match    *://claude.ai/*
// @namespace https://github.com/iikoshteruu/enhanced-claude-export
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('Enhanced Claude Export v2.1 starting...');

    // Configuration
    const CONFIG = {
        buttonText: 'Export Full',
        formats: ['txt', 'md', 'json'],
        defaultFormat: 'md',
        debug: true,
        autoScroll: true,
        scrollDelay: 1000, // Wait time between scroll attempts
        maxScrollAttempts: 50 // Maximum scroll attempts to prevent infinite loops
    };

    let isExporting = false;

    function debugLog(message, data = null) {
        if (CONFIG.debug) {
            console.log('[Claude Export v2.1]', message, data || '');
        }
    }

    // Auto-scroll to load all conversation content
    async function loadFullConversation() {
        debugLog('Starting full conversation loading...');

        return new Promise((resolve) => {
            let scrollAttempts = 0;
            let lastScrollHeight = 0;
            let unchangedCount = 0;

            const scrollInterval = setInterval(() => {
                // Scroll to top to load older messages
                window.scrollTo(0, 0);

                // Get current scroll height
                const currentScrollHeight = document.body.scrollHeight;

                debugLog(`Scroll attempt ${scrollAttempts + 1}, Height: ${currentScrollHeight}`);

                // Check if height changed (new content loaded)
                if (currentScrollHeight === lastScrollHeight) {
                    unchangedCount++;
                } else {
                    unchangedCount = 0;
                    lastScrollHeight = currentScrollHeight;
                }

                scrollAttempts++;

                // Stop if we've tried enough times or height hasn't changed for a while
                if (scrollAttempts >= CONFIG.maxScrollAttempts || unchangedCount >= 3) {
                    clearInterval(scrollInterval);
                    debugLog(`Scroll complete. Total attempts: ${scrollAttempts}`);

                    // Scroll through entire conversation to make sure everything is loaded
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                        setTimeout(() => {
                            window.scrollTo(0, document.body.scrollHeight);
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        }, 500);
                    }, 500);
                }
            }, CONFIG.scrollDelay);
        });
    }

    // Enhanced conversation detection with multiple strategies
    function getConversationData() {
        debugLog('Starting enhanced conversation data extraction...');
        const messages = [];
        let allTextContent = [];

        // Strategy 1: Try to find main conversation container
        const conversationContainer = document.querySelector('main') ||
                                    document.querySelector('[data-testid="conversation"]') ||
                                    document.querySelector('.conversation') ||
                                    document.body;

        debugLog('Using container:', conversationContainer.tagName);

        // Strategy 2: Multiple selector approaches
        const selectors = [
            // Look for message containers
            'div[class*="col-start-2"]',
            'div[class*="message"]',
            'div[data-testid*="message"]',
            '[role="presentation"] > div',
            // Look for content areas
            'div[class*="prose"]',
            'div[class*="markdown"]',
            'div[class*="content"]',
            // Look for any div with substantial text content
            'div'
        ];

        let messageElements = [];

        for (const selector of selectors) {
            try {
                const elements = Array.from(conversationContainer.querySelectorAll(selector));
                const validElements = elements.filter(el => {
                    const text = el.textContent?.trim() || '';
                    // Must have substantial text content
                    return text.length > 20 &&
                           text.length < 50000 &&
                           // Exclude navigation, buttons, etc.
                           !el.closest('nav, header, footer, button, input, select') &&
                           // Exclude elements that are likely UI components
                           !text.includes('Export') &&
                           !text.includes('New chat') &&
                           !text.includes('Settings');
                });

                debugLog(`Selector "${selector}" found ${validElements.length} valid elements`);

                if (validElements.length > 0) {
                    messageElements = validElements;
                    break;
                }
            } catch (error) {
                debugLog(`Selector "${selector}" failed:`, error.message);
            }
        }

        // Strategy 3: If no good elements found, try a different approach
        if (messageElements.length === 0) {
            debugLog('No elements found, trying fallback approach...');

            // Get all divs and filter by text content patterns
            const allDivs = Array.from(document.querySelectorAll('div'));
            messageElements = allDivs.filter(div => {
                const text = div.textContent?.trim() || '';
                return text.length > 50 &&
                       text.length < 20000 &&
                       !div.querySelector('input, button, nav, header, footer') &&
                       // Look for conversation-like patterns
                       (text.includes('Claude') ||
                        text.includes('Human') ||
                        text.includes('I ') ||
                        text.includes('You ') ||
                        text.match(/^(Hi|Hello|Can you|Could you|Please|What|How|Why)/i));
            });
        }

        debugLog(`Processing ${messageElements.length} message elements...`);

        // Process found elements
        const processedTexts = new Set(); // Avoid duplicates

        messageElements.forEach((element, index) => {
            try {
                const clone = element.cloneNode(true);

                // Remove unwanted elements more aggressively
                const unwanted = clone.querySelectorAll(
                    'svg, button, input, select, nav, header, footer, script, style, ' +
                    '[aria-hidden="true"], [class*="icon"], [class*="button"], ' +
                    '[class*="menu"], [class*="toolbar"], [class*="nav"]'
                );
                unwanted.forEach(el => el.remove());

                const text = clone.textContent?.trim() || '';

                if (text && text.length > 10 && !processedTexts.has(text)) {
                    processedTexts.add(text);

                    // Better speaker detection
                    const speaker = detectSpeaker(element, text, index, messageElements.length);

                    messages.push({
                        speaker: speaker,
                        content: text,
                        timestamp: new Date().toISOString(),
                        index: index,
                        length: text.length
                    });

                    debugLog(`Message ${index + 1}: ${speaker} (${text.length} chars)`);
                }
            } catch (error) {
                debugLog(`Error processing element ${index}:`, error.message);
            }
        });

        // Sort messages by their position in the DOM (top to bottom)
        messages.sort((a, b) => a.index - b.index);

        debugLog(`Extracted ${messages.length} unique messages`);
        return messages;
    }

    // Improved speaker detection
    function detectSpeaker(element, text, index, totalMessages) {
        // Check element classes and attributes
        const classes = element.className?.toLowerCase() || '';
        const parentClasses = element.parentElement?.className?.toLowerCase() || '';
        const testId = element.getAttribute('data-testid') || '';

        // Explicit indicators
        if (classes.includes('user') || parentClasses.includes('user') || testId.includes('user')) {
            return 'Human';
        }
        if (classes.includes('assistant') || parentClasses.includes('assistant') || testId.includes('assistant')) {
            return 'Claude';
        }

        // Content-based detection
        const humanPatterns = [
            /^(hi|hello|hey|can you|could you|please|help me|i need|i want|how do|what is|why)/i,
            /\?$/, // Questions often end with ?
            text.length < 200, // Humans often write shorter messages
            /^(ok|okay|thanks|thank you|great|perfect)/i
        ];

        const claudePatterns = [
            /^(i'll|i can|i'd be happy|here's|let me|i understand|certainly|of course|absolutely)/i,
            /```/, // Code blocks
            text.length > 500, // Claude often writes longer responses
            /^(looking at|based on|here are|to help you)/i,
            text.includes('🎯') || text.includes('📝') || text.includes('🔧') // Emojis often used by Claude
        ];

        let humanScore = 0;
        let claudeScore = 0;

        humanPatterns.forEach(pattern => {
            if (typeof pattern === 'boolean') {
                if (pattern) humanScore++;
            } else {
                if (pattern.test(text)) humanScore++;
            }
        });

        claudePatterns.forEach(pattern => {
            if (typeof pattern === 'boolean') {
                if (pattern) claudeScore++;
            } else {
                if (pattern.test(text)) claudeScore++;
            }
        });

        // If scores are tied, use alternating pattern (assuming conversation starts with human)
        if (humanScore === claudeScore) {
            return index % 2 === 0 ? 'Human' : 'Claude';
        }

        return humanScore > claudeScore ? 'Human' : 'Claude';
    }

    // Format as plain text with better structure
    function formatAsText(messages) {
        if (messages.length === 0) return 'No conversation found.';

        let output = `Claude.ai COMPLETE Conversation Export\n`;
        output += `Exported: ${new Date().toLocaleString()}\n`;
        output += `Total Messages: ${messages.length}\n`;
        output += `URL: ${window.location.href}\n`;
        output += '='.repeat(80) + '\n\n';

        messages.forEach((msg, index) => {
            output += `${msg.speaker}:\n`;
            output += `${msg.content}\n\n`;

            if (index < messages.length - 1) {
                output += '-'.repeat(50) + '\n\n';
            }
        });

        return output;
    }

    // Format as Markdown with better structure
    function formatAsMarkdown(messages) {
        if (messages.length === 0) return '# No conversation found';

        let md = `# Claude.ai Complete Conversation Export\n\n`;
        md += `**Exported:** ${new Date().toLocaleString()}  \n`;
        md += `**Total Messages:** ${messages.length}  \n`;
        md += `**URL:** ${window.location.href}  \n`;
        md += `**Export Method:** Enhanced Auto-Scroll v2.1\n\n`;
        md += `---\n\n`;

        messages.forEach(msg => {
            md += `## ${msg.speaker}\n\n`;
            md += `${msg.content}\n\n`;
        });

        return md;
    }

    // Format as JSON with full metadata
    function formatAsJSON(messages) {
        const exportData = {
            exportDate: new Date().toISOString(),
            exportTimestamp: Date.now(),
            exportVersion: '2.1',
            messageCount: messages.length,
            url: window.location.href,
            userAgent: navigator.userAgent,
            conversation: messages,
            statistics: {
                humanMessages: messages.filter(m => m.speaker === 'Human').length,
                claudeMessages: messages.filter(m => m.speaker === 'Claude').length,
                totalCharacters: messages.reduce((sum, m) => sum + m.content.length, 0),
                averageMessageLength: Math.round(messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length)
            }
        };
        return JSON.stringify(exportData, null, 2);
    }

    // Download file with better error handling
    function downloadFile(content, filename, type = 'text/plain') {
        try {
            debugLog(`Downloading: ${filename} (${content.length} chars)`);

            const blob = new Blob([content], { type: type + ';charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.download = filename;
            link.href = url;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);

            debugLog('Download completed successfully');
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            alert(`Download failed: ${error.message}`);
            return false;
        }
    }

    // Export conversation with full loading
    async function exportConversation(format) {
        if (isExporting) {
            alert('Export already in progress. Please wait...');
            return;
        }

        isExporting = true;

        try {
            debugLog(`Starting FULL export in ${format} format...`);

            // Show loading indicator
            showNotification('🔄 Loading full conversation...', 0);

            // Load full conversation first
            if (CONFIG.autoScroll) {
                await loadFullConversation();
                showNotification('📝 Extracting messages...', 3000);
            }

            // Extract messages
            const messages = getConversationData();

            if (messages.length === 0) {
                alert('No conversation content found! This might be a new chat or there could be a technical issue. Check the browser console for details.');
                return;
            }

            // Generate filename with message count
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `claude-FULL-conversation-${messages.length}msgs-${timestamp}.${format}`;

            let content, mimeType;

            switch (format) {
                case 'md':
                    content = formatAsMarkdown(messages);
                    mimeType = 'text/markdown';
                    break;
                case 'json':
                    content = formatAsJSON(messages);
                    mimeType = 'application/json';
                    break;
                default:
                    content = formatAsText(messages);
                    mimeType = 'text/plain';
            }

            const success = downloadFile(content, filename, mimeType);
            if (success) {
                hideMenu();
                showNotification(`✅ Exported ${messages.length} messages as ${format.toUpperCase()}`, 5000);
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error.message}\n\nCheck the browser console for more details.`);
        } finally {
            isExporting = false;
        }
    }

    // Show notification with auto-hide
    function showNotification(message, duration = 3000) {
        // Remove existing notification
        const existing = document.getElementById('claude-export-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'claude-export-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, duration);
        }
    }

    // Create export menu with better styling
    function createExportMenu() {
        const menu = document.createElement('div');
        menu.id = 'claude-export-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 10px;
            background: #ffffff;
            border: 2px solid #667eea;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            padding: 12px;
            z-index: 1000;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-width: 200px;
            color: #333333 !important;
        `;

        // Add title
        const title = document.createElement('div');
        title.textContent = 'Export Full Conversation';
        title.style.cssText = `
            font-weight: 600;
            color: #667eea !important;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        `;
        menu.appendChild(title);

        const formats = [
            { ext: 'md', name: 'Markdown', icon: '📝', desc: 'Great for docs' },
            { ext: 'txt', name: 'Plain Text', icon: '📄', desc: 'Universal format' },
            { ext: 'json', name: 'JSON Data', icon: '📊', desc: 'Structured data' }
        ];

        formats.forEach(format => {
            const button = document.createElement('button');
            button.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 16px; margin-right: 8px;">${format.icon}</span>
                    <div>
                        <div style="font-weight: 500;">${format.name}</div>
                        <div style="font-size: 11px; color: #666;">${format.desc}</div>
                    </div>
                </div>
            `;
            button.style.cssText = `
                display: block;
                width: 100%;
                padding: 10px;
                margin: 4px 0;
                border: none;
                background: transparent;
                text-align: left;
                cursor: pointer;
                border-radius: 6px;
                font-size: 14px;
                color: #333333 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                transition: background-color 0.2s;
            `;

            button.onmouseover = () => {
                button.style.background = '#f8f9ff';
                button.style.color = '#000000 !important';
            };
            button.onmouseout = () => {
                button.style.background = 'transparent';
                button.style.color = '#333333 !important';
            };

            button.onclick = () => exportConversation(format.ext);
            menu.appendChild(button);
        });

        // Debug button
        if (CONFIG.debug) {
            const debugButton = document.createElement('button');
            debugButton.innerHTML = '🔍 Debug Info';
            debugButton.style.cssText = `
                display: block;
                width: 100%;
                padding: 8px 12px;
                margin: 8px 0 4px 0;
                border: none;
                background: transparent;
                text-align: left;
                cursor: pointer;
                border-radius: 4px;
                font-size: 13px;
                border-top: 1px solid #eee;
                color: #666 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            `;

            debugButton.onclick = () => {
                const messages = getConversationData();
                console.log('Debug Info:', {
                    messagesFound: messages.length,
                    url: window.location.href,
                    sampleMessages: messages.slice(0, 3)
                });
                alert(`Found ${messages.length} messages. Check console for details.`);
                hideMenu();
            };
            menu.appendChild(debugButton);
        }

        return menu;
    }

    // Show/hide menu
    function toggleMenu() {
        const menu = document.getElementById('claude-export-menu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    function hideMenu() {
        const menu = document.getElementById('claude-export-menu');
        if (menu) menu.style.display = 'none';
    }

    // Create enhanced export button
    function createExportButton() {
        const button = document.createElement('button');
        button.innerHTML = `📥 Export Full`;
        button.id = 'claude-export-button';
        button.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            text-align: center;
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 30px;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        button.onmouseover = () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        };

        button.onmouseout = () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };

        button.onclick = toggleMenu;

        return button;
    }

    // Initialize the script
    function init() {
        debugLog('Initializing Enhanced Claude Export v2.1...');

        // Remove existing elements
        const existingButton = document.getElementById('claude-export-button');
        const existingMenu = document.getElementById('claude-export-menu');
        if (existingButton) existingButton.remove();
        if (existingMenu) existingMenu.remove();

        // Create UI elements
        const button = createExportButton();
        const menu = createExportMenu();

        document.body.appendChild(button);
        document.body.appendChild(menu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#claude-export-menu') &&
                !e.target.closest('#claude-export-button')) {
                hideMenu();
            }
        });

        debugLog('Enhanced Claude Export v2.1 initialized successfully!');
        console.log('%c✅ Enhanced Claude Export v2.1 Ready!', 'color: green; font-weight: bold;');
        console.log('%cThis version will auto-scroll to load your FULL conversation before export.', 'color: blue;');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    // Re-initialize on navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

})();
