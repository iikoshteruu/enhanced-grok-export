// ==UserScript==
// @name         Enhanced Grok Export v1.0
// @description  Export Grok conversations with multiple formats, auto-scroll, and mode detection
// @version      1.0.0
// @author       iikoshteruu
// @grant        none
// @match        *://grok.com/*
// @match        *://x.com/*
// @license      MIT
// @namespace    https://github.com/iikoshteruu/enhanced-grok-export
// @homepageURL  https://github.com/iikoshteruu/enhanced-grok-export
// @supportURL   https://github.com/iikoshteruu/enhanced-grok-export/issues
// ==/UserScript==

(function() {
    'use strict';

    console.log('Enhanced Grok Export v1.0 starting...');

    // Configuration
    const CONFIG = {
        buttonText: 'Export Full',
        formats: ['txt', 'md', 'json'],
        defaultFormat: 'md',
        debug: true,
        autoScroll: true,
        scrollDelay: 1000,
        maxScrollAttempts: 50
    };

    let isExporting = false;

    function debugLog(message, data = null) {
        if (CONFIG.debug) {
            console.log('[Grok Export v1.0]', message, data || '');
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

                const currentScrollHeight = document.body.scrollHeight;
                debugLog(`Scroll attempt ${scrollAttempts + 1}, Height: ${currentScrollHeight}`);

                if (currentScrollHeight === lastScrollHeight) {
                    unchangedCount++;
                } else {
                    unchangedCount = 0;
                    lastScrollHeight = currentScrollHeight;
                }

                scrollAttempts++;

                if (scrollAttempts >= CONFIG.maxScrollAttempts || unchangedCount >= 3) {
                    clearInterval(scrollInterval);
                    debugLog(`Scroll complete. Total attempts: ${scrollAttempts}`);

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

    // Enhanced conversation detection for Grok
    function getConversationData() {
        debugLog('Starting Grok conversation data extraction...');
        const messages = [];

        // Multiple strategies to find Grok conversation elements based on actual DOM structure
        const strategies = [
            // Strategy 1: Look for the exact pattern we found - divs with css-146c3p1 class
            () => {
                const messageContainers = document.querySelectorAll('div[class*="css-146c3p1"]');
                debugLog(`Found ${messageContainers.length} containers with css-146c3p1`);
                return Array.from(messageContainers);
            },

            // Strategy 2: Look for spans with css-1jxf684 class (content containers)
            () => {
                const contentSpans = document.querySelectorAll('span[class*="css-1jxf684"]');
                debugLog(`Found ${contentSpans.length} content spans with css-1jxf684`);
                // Get the parent divs of these spans
                return Array.from(contentSpans).map(span => {
                    let parent = span.parentElement;
                    while (parent && !parent.classList.toString().includes('css-146c3p1')) {
                        parent = parent.parentElement;
                    }
                    return parent;
                }).filter(Boolean);
            },

            // Strategy 3: Look for divs with dir="ltr" attribute (message containers)
            () => {
                const ltrDivs = document.querySelectorAll('div[dir="ltr"]');
                debugLog(`Found ${ltrDivs.length} divs with dir='ltr'`);
                return Array.from(ltrDivs).filter(div => {
                    // Filter for ones that look like message containers
                    const text = div.textContent?.trim() || '';
                    return text.length > 10 && text.length < 50000;
                });
            },

            // Strategy 4: Fallback - look for any div with substantial text content
            () => {
                const allDivs = document.querySelectorAll('div');
                return Array.from(allDivs).filter(div => {
                    const text = div.textContent?.trim() || '';
                    const hasGoodClasses = div.className.includes('css-') || div.className.includes('r-');
                    return text.length > 50 && text.length < 20000 && hasGoodClasses &&
                           !div.querySelector('input, button, nav, header, footer');
                });
            }
        ];

        let messageElements = [];

        for (let i = 0; i < strategies.length; i++) {
            try {
                messageElements = strategies[i]();
                debugLog(`Strategy ${i + 1} found ${messageElements.length} elements`);

                if (messageElements.length > 0) {
                    // Filter out elements that are too small or likely UI elements
                    messageElements = messageElements.filter(el => {
                        const text = el.textContent?.trim() || '';
                        return text.length > 10 && text.length < 50000;
                    });

                    if (messageElements.length > 0) {
                        debugLog(`Using strategy ${i + 1} with ${messageElements.length} valid elements`);
                        break;
                    }
                }
            } catch (error) {
                debugLog(`Strategy ${i + 1} failed:`, error.message);
            }
        }

        if (messageElements.length === 0) {
            debugLog('No message elements found, trying fallback...');
            // Fallback: find any element with substantial text content
            const allElements = document.querySelectorAll('div, p, span');
            messageElements = Array.from(allElements).filter(el => {
                const text = el.textContent?.trim() || '';
                return text.length > 50 && text.length < 20000 &&
                       !el.querySelector('input, button, nav, header, footer');
            });
        }

        debugLog(`Processing ${messageElements.length} message elements...`);

        // Process found elements
        const processedTexts = new Set();

        messageElements.forEach((element, index) => {
            try {
                const clone = element.cloneNode(true);

                // Remove unwanted elements
                const unwanted = clone.querySelectorAll(
                    'svg, button, input, select, nav, header, footer, script, style, ' +
                    '[aria-hidden="true"], [class*="icon"], [class*="button"]'
                );
                unwanted.forEach(el => el.remove());

                const text = clone.textContent?.trim() || '';

                if (text && text.length > 10 && !processedTexts.has(text)) {
                    processedTexts.add(text);

                    // Detect speaker and Grok modes
                    const speakerInfo = detectGrokSpeaker(element, text, index);

                    messages.push({
                        speaker: speakerInfo.speaker,
                        content: text,
                        mode: speakerInfo.mode,
                        timestamp: new Date().toISOString(),
                        index: index,
                        length: text.length
                    });

                    debugLog(`Message ${index + 1}: ${speakerInfo.speaker} [${speakerInfo.mode}] (${text.length} chars)`);
                }
            } catch (error) {
                debugLog(`Error processing element ${index}:`, error.message);
            }
        });

        // Sort messages by their position in the DOM
        messages.sort((a, b) => a.index - b.index);

        debugLog(`Extracted ${messages.length} unique messages`);
        return messages;
    }

    // Grok-specific speaker and mode detection
    function detectGrokSpeaker(element, text, index) {
        const elementClasses = element.className?.toLowerCase() || '';
        const parentClasses = element.parentElement?.className?.toLowerCase() || '';

        // Mode detection for Grok
        let mode = 'standard';

        // Look for mode indicators in text or surrounding elements
        if (text.includes('🤔') || text.includes('Let me think') || text.includes('Step ')) {
            mode = 'think';
        } else if (text.includes('😄') || text.includes('😂') || text.includes('LOL')) {
            mode = 'fun';
        } else if (text.includes('According to') || text.includes('Based on recent')) {
            mode = 'deepsearch';
        }

        // Speaker detection patterns for Grok
        const humanPatterns = [
            /^(hi|hello|hey|can you|could you|please|help|i need|i want|how do|what is|why)/i,
            /\?$/,
            text.length < 200,
            /^(ok|okay|thanks|thank you|great|perfect|yes|no)/i
        ];

        const grokPatterns = [
            /^(i'll|i can|i'd be happy|here's|let me|i understand|certainly|absolutely)/i,
            /```/,
            text.length > 500,
            /^(looking at|based on|here are|to help you)/i,
            text.includes('🤖') || text.includes('🚀') || text.includes('✨'),
            mode !== 'standard' // If we detected a mode, likely Grok
        ];

        let humanScore = 0;
        let grokScore = 0;

        humanPatterns.forEach(pattern => {
            if (typeof pattern === 'boolean') {
                if (pattern) humanScore++;
            } else {
                if (pattern.test(text)) humanScore++;
            }
        });

        grokPatterns.forEach(pattern => {
            if (typeof pattern === 'boolean') {
                if (pattern) grokScore++;
            } else {
                if (pattern.test(text)) grokScore++;
            }
        });

        // Use alternating pattern if scores are tied
        const speaker = grokScore > humanScore ? 'Grok' :
                       humanScore > grokScore ? 'Human' :
                       (index % 2 === 0 ? 'Human' : 'Grok');

        return { speaker, mode };
    }

    // Format as plain text with Grok modes
    function formatAsText(messages) {
        if (messages.length === 0) return 'No conversation found.';

        let output = `Grok.ai COMPLETE Conversation Export\n`;
        output += `Exported: ${new Date().toLocaleString()}\n`;
        output += `Total Messages: ${messages.length}\n`;
        output += `URL: ${window.location.href}\n`;
        output += '='.repeat(80) + '\n\n';

        messages.forEach((msg, index) => {
            const modeIndicator = msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : '';
            output += `${msg.speaker}${modeIndicator}:\n`;
            output += `${msg.content}\n\n`;

            if (index < messages.length - 1) {
                output += '-'.repeat(50) + '\n\n';
            }
        });

        return output;
    }

    // Format as Markdown with Grok modes
    function formatAsMarkdown(messages) {
        if (messages.length === 0) return '# No conversation found';

        let md = `# Grok.ai Complete Conversation Export\n\n`;
        md += `**Exported:** ${new Date().toLocaleString()}  \n`;
        md += `**Total Messages:** ${messages.length}  \n`;
        md += `**URL:** ${window.location.href}  \n`;
        md += `**Export Method:** Enhanced Grok Export v1.0\n\n`;
        md += `---\n\n`;

        messages.forEach(msg => {
            const modeIndicator = msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : '';
            md += `## ${msg.speaker}${modeIndicator}\n\n`;
            md += `${msg.content}\n\n`;
        });

        return md;
    }

    // Format as JSON with Grok metadata
    function formatAsJSON(messages) {
        const exportData = {
            exportDate: new Date().toISOString(),
            exportTimestamp: Date.now(),
            exportVersion: '1.0.0',
            platform: 'grok',
            messageCount: messages.length,
            url: window.location.href,
            userAgent: navigator.userAgent,
            conversation: messages,
            statistics: {
                humanMessages: messages.filter(m => m.speaker === 'Human').length,
                grokMessages: messages.filter(m => m.speaker === 'Grok').length,
                totalCharacters: messages.reduce((sum, m) => sum + m.content.length, 0),
                averageMessageLength: Math.round(messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length),
                modes: {
                    standard: messages.filter(m => m.mode === 'standard').length,
                    think: messages.filter(m => m.mode === 'think').length,
                    fun: messages.filter(m => m.mode === 'fun').length,
                    deepsearch: messages.filter(m => m.mode === 'deepsearch').length
                }
            }
        };
        return JSON.stringify(exportData, null, 2);
    }

    // Download file
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
            debugLog(`Starting Grok export in ${format} format...`);

            showNotification('🔄 Loading full conversation...', 0);

            if (CONFIG.autoScroll) {
                await loadFullConversation();
                showNotification('📝 Extracting messages...', 3000);
            }

            const messages = getConversationData();

            if (messages.length === 0) {
                alert('No conversation content found! This might be a new chat or there could be a technical issue. Check the browser console for details.');
                return;
            }

            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `grok-FULL-conversation-${messages.length}msgs-${timestamp}.${format}`;

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

    // Show notification
    function showNotification(message, duration = 3000) {
        const existing = document.getElementById('grok-export-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'grok-export-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1DA1F2;
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

    // Create export menu
    function createExportMenu() {
        const menu = document.createElement('div');
        menu.id = 'grok-export-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 10px;
            background: #ffffff;
            border: 2px solid #1DA1F2;
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
        title.textContent = 'Export Grok Conversation';
        title.style.cssText = `
            font-weight: 600;
            color: #1DA1F2 !important;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        `;
        menu.appendChild(title);

        const formats = [
            { ext: 'md', name: 'Markdown', icon: '📝', desc: 'Rich formatting' },
            { ext: 'txt', name: 'Plain Text', icon: '📄', desc: 'Universal format' },
            { ext: 'json', name: 'JSON Data', icon: '📊', desc: 'Structured data' }
        ];

        formats.forEach(format => {
            const button = document.createElement('button');
            button.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 16px; margin-right: 8px;">${format.icon}</span>
                    <div>
                        <div style="font-weight: 500; color: #333333 !important;">${format.name}</div>
                        <div style="font-size: 11px; color: #666 !important;">${format.desc}</div>
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
            };
            button.onmouseout = () => {
                button.style.background = 'transparent';
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
                console.log('Grok Debug Info:', {
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
        const menu = document.getElementById('grok-export-menu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    function hideMenu() {
        const menu = document.getElementById('grok-export-menu');
        if (menu) menu.style.display = 'none';
    }

    // Create main export button
    function createExportButton() {
        const button = document.createElement('button');
        button.innerHTML = `🤖 Export Grok`;
        button.id = 'grok-export-button';
        button.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #1DA1F2 0%, #0084b4 100%);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            text-align: center;
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 30px;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(29,161,242,0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        button.onmouseover = () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(29,161,242,0.4)';
        };

        button.onmouseout = () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(29,161,242,0.3)';
        };

        button.onclick = toggleMenu;

        return button;
    }

    // Initialize the script
    function init() {
        debugLog('Initializing Enhanced Grok Export v1.0...');

        // Remove existing elements
        const existingButton = document.getElementById('grok-export-button');
        const existingMenu = document.getElementById('grok-export-menu');
        if (existingButton) existingButton.remove();
        if (existingMenu) existingMenu.remove();

        // Create UI elements
        const button = createExportButton();
        const menu = createExportMenu();

        document.body.appendChild(button);
        document.body.appendChild(menu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#grok-export-menu') &&
                !e.target.closest('#grok-export-button')) {
                hideMenu();
            }
        });

        debugLog('Enhanced Grok Export v1.0 initialized successfully!');
        console.log('%c✅ Enhanced Grok Export v1.0 Ready!', 'color: green; font-weight: bold;');
        console.log('%cThis version detects Grok modes and preserves conversation context.', 'color: blue;');
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