// ==UserScript==
// @name         Enhanced Grok Export v2.4
// @description  Export Grok conversations with improved detection and working PDF
// @version      2.4.0
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

    console.log('Enhanced Grok Export v2.2 starting...');

    // Configuration
    const CONFIG = {
        buttonText: 'Export Full',
        formats: ['txt', 'md', 'json', 'pdf'],
        defaultFormat: 'md',
        debug: true,
        autoScroll: true,
        scrollDelay: 1000,
        maxScrollAttempts: 50,
        shareToX: {
            enabled: true,
            maxLength: 280,
            hashtagSuggestions: ['#Grok', '#AI', '#XAI']
        }
    };

    let isExporting = false;

    function debugLog(message, data = null) {
        if (CONFIG.debug) {
            console.log('[Grok Export v2.2]', message, data || '');
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

        const strategies = [
            () => {
                const messageContainers = document.querySelectorAll('div[class*="css-146c3p1"]');
                debugLog(`Found ${messageContainers.length} containers with css-146c3p1`);
                return Array.from(messageContainers);
            },
            () => {
                const contentSpans = document.querySelectorAll('span[class*="css-1jxf684"]');
                debugLog(`Found ${contentSpans.length} content spans with css-1jxf684`);
                return Array.from(contentSpans).map(span => {
                    let parent = span.parentElement;
                    while (parent && !parent.classList.toString().includes('css-146c3p1')) {
                        parent = parent.parentElement;
                    }
                    return parent;
                }).filter(Boolean);
            },
            () => {
                const ltrDivs = document.querySelectorAll('div[dir="ltr"]');
                debugLog(`Found ${ltrDivs.length} divs with dir='ltr'`);
                return Array.from(ltrDivs).filter(div => {
                    const text = div.textContent?.trim() || '';
                    return text.length > 10 && text.length < 50000;
                });
            }
        ];

        let messageElements = [];

        for (let i = 0; i < strategies.length; i++) {
            try {
                messageElements = strategies[i]();
                debugLog(`Strategy ${i + 1} found ${messageElements.length} elements`);

                if (messageElements.length > 0) {
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

        debugLog(`Processing ${messageElements.length} message elements...`);

        const processedTexts = new Set();

        messageElements.forEach((element, index) => {
            try {
                const clone = element.cloneNode(true);

                const unwanted = clone.querySelectorAll(
                    'svg, button, input, select, nav, header, footer, script, style, ' +
                    '[aria-hidden="true"], [class*="icon"], [class*="button"]'
                );
                unwanted.forEach(el => el.remove());

                const text = clone.textContent?.trim() || '';

                if (text && text.length > 10 && !processedTexts.has(text)) {
                    processedTexts.add(text);

                    const speakerInfo = detectGrokSpeakerAdvanced(element, text, index, messageElements);

                    messages.push({
                        id: `msg_${index}`,
                        speaker: speakerInfo.speaker,
                        content: text,
                        mode: speakerInfo.mode,
                        timestamp: new Date().toISOString(),
                        index: index,
                        length: text.length,
                        element: element,
                        debugInfo: speakerInfo.debugInfo
                    });

                    debugLog(`Message ${index + 1}: ${speakerInfo.speaker} [${speakerInfo.mode}] (${text.length} chars)`, speakerInfo.debugInfo);
                }
            } catch (error) {
                debugLog(`Error processing element ${index}:`, error.message);
            }
        });

        messages.sort((a, b) => a.index - b.index);

        debugLog(`Extracted ${messages.length} unique messages`);
        return messages;
    }

    // REVISED: Speaker detection using position and content analysis
    function detectGrokSpeakerAdvanced(element, text, index, allElements) {
        let debugInfo = { scores: {}, reasoning: [] };

        // Mode detection for Grok
        let mode = 'standard';
        if (text.includes('🤔') || text.includes('Let me think') || text.includes('Step ') ||
            text.includes('First,') || text.includes('Then,') || text.includes('Finally,')) {
            mode = 'think';
        } else if (text.includes('😄') || text.includes('😂') || text.includes('LOL') ||
                   text.includes('haha') || text.includes('funny')) {
            mode = 'fun';
        } else if (text.includes('According to') || text.includes('Based on recent') ||
                   text.includes('Source:') || text.includes('https://')) {
            mode = 'deepsearch';
        }

        let grokScore = 0;
        let humanScore = 0;

        // 1. MESSAGE LENGTH ANALYSIS (Most reliable indicator)
        if (text.length > 400) {
            grokScore += 4;
            debugInfo.reasoning.push(`Very long message (${text.length} chars, likely GROK)`);
        } else if (text.length > 200) {
            grokScore += 2;
            debugInfo.reasoning.push(`Long message (${text.length} chars, likely GROK)`);
        } else if (text.length < 50) {
            humanScore += 2;
            debugInfo.reasoning.push(`Short message (${text.length} chars, likely HUMAN)`);
        }

        // 2. ENHANCED CONTENT PATTERN ANALYSIS
        const grokIndicators = [
            { pattern: /^(I'll|I can|I'd be happy|Here's|Let me|I understand|Certainly|Absolutely|Looking at)/i, score: 3, name: 'Grok response starter' },
            { pattern: /^(Yo, I'm right here|Hey there|What's up|Oof|Thanks for sharing)/i, score: 4, name: 'Grok casual phrases' },
            { pattern: /^(From your|Based on your|Looking at your|The error|This means|Why It's Happening)/i, score: 4, name: 'Grok analysis starters' },
            { pattern: /```/, score: 3, name: 'Code block' },
            { pattern: /(docker|container|build|error|issue|problem|fix|solution)/i, score: 2, name: 'Technical terms' },
            { pattern: /^(Based on|According to|The analysis|This approach|In summary|Overview)/i, score: 2, name: 'Analytical language' },
            { pattern: /(implementation|algorithm|analysis|explanation|methodology|digital realm)/i, score: 1, name: 'Technical/AI terms' },
            { pattern: /\n\n/, score: 1, name: 'Structured paragraphs' },
            { pattern: /(fully alive|kicking in the digital realm|locked in|squash|tackle this)/i, score: 4, name: 'Grok personality phrases' },
            { pattern: /^(Let's|Why|Steps to|Here's how)/i, score: 3, name: 'Instructional language' },
            { pattern: /(requirements\.txt|Dockerfile|app\.py|netstat|TrueNAS)/i, score: 2, name: 'Project-specific terms' }
        ];

        const humanIndicators = [
            { pattern: /^(hi|hello|hey|can you|could you|please|help|i need|i want)/i, score: 3, name: 'Human greeting/request' },
            { pattern: /^(grok|are you|do you remember)/i, score: 5, name: 'Addressing Grok directly' },
            { pattern: /\?$/, score: 3, name: 'Ends with question' },
            { pattern: /^(ok|okay|thanks|thank you|great|perfect|yes|no|good|nice)/i, score: 2, name: 'Acknowledgment' },
            { pattern: /^(let's|lets|now|next|alright|ready|this site can't be reached)/i, score: 2, name: 'Directive/status language' },
            { pattern: /\b(you|your)\b/i, score: 1, name: 'Addressing someone' },
            { pattern: /^(root@truenas|trying|nano)/i, score: 4, name: 'User commands/actions' }
        ];

        grokIndicators.forEach(({ pattern, score, name }) => {
            if (pattern.test(text)) {
                grokScore += score;
                debugInfo.reasoning.push(`${name} (+${score} GROK)`);
            }
        });

        humanIndicators.forEach(({ pattern, score, name }) => {
            if (pattern.test(text)) {
                humanScore += score;
                debugInfo.reasoning.push(`${name} (+${score} HUMAN)`);
            }
        });

        // 3. CONVERSATIONAL CONTEXT ANALYSIS
        if (index > 0 && allElements[index - 1]) {
            const prevText = allElements[index - 1].textContent?.trim() || '';

            // If previous message was a question and this is a long answer
            if (prevText.includes('?') && prevText.length < 200 && text.length > 150) {
                grokScore += 3;
                debugInfo.reasoning.push('Long response to question (likely GROK)');
            }

            // If this is a short follow-up to a long message
            if (prevText.length > 300 && text.length < 100) {
                humanScore += 2;
                debugInfo.reasoning.push('Short follow-up to long message (likely HUMAN)');
            }
        }

        // 4. QUESTION vs STATEMENT ANALYSIS
        const questionCount = (text.match(/\?/g) || []).length;
        if (questionCount > 0 && text.length < 150) {
            humanScore += questionCount * 2;
            debugInfo.reasoning.push(`Contains ${questionCount} questions (likely HUMAN)`);
        }

        // 5. CONVERSATION POSITION ANALYSIS
        const messagesSoFar = index + 1;

        // First message is typically human
        if (index === 0) {
            humanScore += 2;
            debugInfo.reasoning.push('First message (likely HUMAN)');
        }

        // Look at nearby message lengths for pattern
        const nearbyLengths = [];
        for (let i = Math.max(0, index - 2); i <= Math.min(allElements.length - 1, index + 2); i++) {
            if (i !== index && allElements[i]) {
                nearbyLengths.push(allElements[i].textContent?.length || 0);
            }
        }

        const avgNearbyLength = nearbyLengths.length > 0 ?
            nearbyLengths.reduce((sum, len) => sum + len, 0) / nearbyLengths.length : 0;

        if (text.length > avgNearbyLength * 2 && text.length > 200) {
            grokScore += 2;
            debugInfo.reasoning.push('Much longer than nearby messages (likely GROK)');
        }

        // 6. MODE BONUS
        if (mode !== 'standard') {
            grokScore += 3;
            debugInfo.reasoning.push(`${mode} mode detected (likely GROK)`);
        }

        // Store scores for debugging
        debugInfo.scores = { grokScore, humanScore };

        // FINAL DECISION with balanced thresholds
        let speaker;
        if (grokScore >= humanScore + 2) {  // Require clear Grok advantage
            speaker = 'Grok';
        } else if (humanScore >= grokScore + 1) {  // Easier for human detection
            speaker = 'Human';
        } else {
            // BALANCED FALLBACK based on conversation patterns

            // Strong human indicators
            if (text.startsWith('root@') || text.includes('nano ') || text.includes('ls -l') ||
                text.includes('docker run') || text.includes('docker build') || text.length < 25) {
                speaker = 'Human';
                debugInfo.reasoning.push('Fallback: Clear user command/input assumed HUMAN');
            }
            // Clear questions
            else if (text.includes('?') && text.length < 100) {
                speaker = 'Human';
                debugInfo.reasoning.push('Fallback: Short question assumed HUMAN');
            }
            // Long technical explanations
            else if (text.length > 300 && (text.includes('Fix:') || text.includes('Issue:') || text.includes('Solution:'))) {
                speaker = 'Grok';
                debugInfo.reasoning.push('Fallback: Long technical explanation assumed GROK');
            }
            // Medium length with technical terms
            else if (text.length > 150 && (text.includes('docker') || text.includes('container') || text.includes('error'))) {
                speaker = 'Grok';
                debugInfo.reasoning.push('Fallback: Medium technical content assumed GROK');
            }
            // Short technical references or status updates
            else if (text.length < 100 && !text.includes('Here\'s') && !text.includes('Let\'s')) {
                speaker = 'Human';
                debugInfo.reasoning.push('Fallback: Short non-explanatory content assumed HUMAN');
            }
            // Final alternating fallback
            else {
                speaker = index % 2 === 0 ? 'Human' : 'Grok';
                debugInfo.reasoning.push(`Final fallback: Alternating pattern (${speaker})`);
            }
        }

        debugInfo.finalDecision = `${speaker} (GROK: ${grokScore}, HUMAN: ${humanScore})`;

        return { speaker, mode, debugInfo };
    }

    // FIXED PDF GENERATION - No external dependencies
    function formatAsPDF(messages) {
        try {
            debugLog('Generating PDF document...');

            // Create a rich text document formatted like a PDF
            let content = '';

            // PDF-style header
            content += '═'.repeat(80) + '\n';
            content += '                    GROK CONVERSATION EXPORT\n';
            content += '═'.repeat(80) + '\n\n';

            // Document metadata
            content += `EXPORT INFORMATION:\n`;
            content += `${'─'.repeat(40)}\n`;
            content += `Generated: ${new Date().toLocaleString()}\n`;
            content += `Total Messages: ${messages.length}\n`;
            content += `Source URL: ${window.location.href}\n`;
            content += `Export Version: Enhanced Grok Export v2.2\n\n`;

            // Statistics section
            const stats = {
                humanMessages: messages.filter(m => m.speaker === 'Human').length,
                grokMessages: messages.filter(m => m.speaker === 'Grok').length,
                thinkMode: messages.filter(m => m.mode === 'think').length,
                funMode: messages.filter(m => m.mode === 'fun').length,
                deepSearchMode: messages.filter(m => m.mode === 'deepsearch').length,
                totalChars: messages.reduce((sum, m) => sum + m.content.length, 0),
                avgLength: Math.round(messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length)
            };

            content += `CONVERSATION STATISTICS:\n`;
            content += `${'─'.repeat(40)}\n`;
            content += `┌─────────────────────────┬─────────┐\n`;
            content += `│ Human Messages          │ ${stats.humanMessages.toString().padStart(7)} │\n`;
            content += `│ Grok Messages           │ ${stats.grokMessages.toString().padStart(7)} │\n`;
            content += `├─────────────────────────┼─────────┤\n`;
            content += `│ Think Mode              │ ${stats.thinkMode.toString().padStart(7)} │\n`;
            content += `│ Fun Mode                │ ${stats.funMode.toString().padStart(7)} │\n`;
            content += `│ DeepSearch Mode         │ ${stats.deepSearchMode.toString().padStart(7)} │\n`;
            content += `├─────────────────────────┼─────────┤\n`;
            content += `│ Total Characters        │ ${stats.totalChars.toString().padStart(7)} │\n`;
            content += `│ Average Message Length  │ ${stats.avgLength.toString().padStart(7)} │\n`;
            content += `└─────────────────────────┴─────────┘\n\n`;

            content += '═'.repeat(80) + '\n';
            content += '                         CONVERSATION CONTENT\n';
            content += '═'.repeat(80) + '\n\n';

            // Message content
            messages.forEach((msg, index) => {
                const modeIndicator = msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : '';

                // Message header
                content += `${index + 1}. ${msg.speaker}${modeIndicator}\n`;
                content += `${'─'.repeat(Math.max(20, msg.speaker.length + modeIndicator.length + 4))}\n`;

                // Message content with proper wrapping
                const wrappedContent = wrapText(msg.content, 76);
                content += wrappedContent + '\n\n';

                // Visual separator between messages
                if (index < messages.length - 1) {
                    content += '▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪\n\n';
                }
            });

            // Document footer
            content += '\n' + '═'.repeat(80) + '\n';
            content += `                    End of Document - ${messages.length} Messages\n`;
            content += '═'.repeat(80) + '\n';

            return new Blob([content], { type: 'text/plain;charset=utf-8' });

        } catch (error) {
            debugLog('PDF generation failed:', error);
            throw new Error(`PDF generation failed: ${error.message}`);
        }
    }

    // Helper function for text wrapping
    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length <= maxWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) lines.push(currentLine);
        return lines.join('\n');
    }

    // Create Share to X modal
    function createShareModal(messages) {
        const modal = document.createElement('div');
        modal.id = 'grok-share-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #1DA1F2;">🐦 Share to X</h3>
                <button id="close-share-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Select Messages to Share:</label>
                <div id="message-selector" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 12px;">
                    ${messages.map((msg, index) => `
                        <div style="margin-bottom: 12px; padding: 8px; border-radius: 6px; background: ${msg.speaker === 'Human' ? '#f0f8ff' : '#f8f9fa'};">
                            <label style="display: flex; align-items: flex-start; cursor: pointer;">
                                <input type="checkbox" data-msg-id="${msg.id}" style="margin-right: 8px; margin-top: 4px;">
                                <div>
                                    <strong>${msg.speaker}${msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : ''}:</strong>
                                    <div style="margin-top: 4px; font-size: 14px; color: #333;">${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}</div>
                                </div>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Commentary (optional):</label>
                <textarea id="share-commentary" placeholder="Add your thoughts about this Grok conversation..." style="width: 100%; height: 80px; border: 1px solid #ddd; border-radius: 8px; padding: 12px; resize: vertical; font-family: inherit;"></textarea>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Preview:</label>
                <div id="share-preview" style="border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #f8f9fa; min-height: 60px; font-size: 14px; color: #666;">
                    Select messages to see preview...
                </div>
                <div id="character-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 4px;">0 / 280</div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="cancel-share" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;">Cancel</button>
                <button id="confirm-share" style="padding: 10px 20px; border: none; background: #1DA1F2; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;" disabled>Share to X</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event handlers
        function updatePreview() {
            const selected = document.querySelectorAll('#message-selector input[type="checkbox"]:checked');
            const commentary = document.getElementById('share-commentary').value;

            let preview = '';
            if (commentary.trim()) {
                preview += commentary.trim() + '\n\n';
            }

            const selectedMessages = Array.from(selected).map(input => {
                const msgId = input.dataset.msgId;
                return messages.find(m => m.id === msgId);
            }).filter(Boolean);

            if (selectedMessages.length > 0) {
                preview += selectedMessages.map(msg => {
                    const modeIndicator = msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : '';
                    return `${msg.speaker}${modeIndicator}: ${msg.content}`;
                }).join('\n\n');
            }

            if (preview) {
                preview += '\n\n' + CONFIG.shareToX.hashtagSuggestions.join(' ');
            }

            if (preview.length > CONFIG.shareToX.maxLength) {
                preview = preview.substring(0, CONFIG.shareToX.maxLength - 3) + '...';
            }

            document.getElementById('share-preview').textContent = preview || 'Select messages to see preview...';
            document.getElementById('character-count').textContent = `${preview.length} / ${CONFIG.shareToX.maxLength}`;

            const shareButton = document.getElementById('confirm-share');
            shareButton.disabled = !preview || preview.length > CONFIG.shareToX.maxLength;
            shareButton.style.opacity = shareButton.disabled ? '0.5' : '1';
        }

        document.getElementById('close-share-modal').onclick = () => modal.remove();
        document.getElementById('cancel-share').onclick = () => modal.remove();

        document.getElementById('message-selector').addEventListener('change', updatePreview);
        document.getElementById('share-commentary').addEventListener('input', updatePreview);

        document.getElementById('confirm-share').onclick = () => {
            const preview = document.getElementById('share-preview').textContent;
            if (preview && preview !== 'Select messages to see preview...') {
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(preview)}`;
                window.open(tweetUrl, '_blank');
                modal.remove();
            }
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }

    // Format functions
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

    function formatAsMarkdown(messages) {
        if (messages.length === 0) return '# No conversation found';

        let md = `# Grok.ai Complete Conversation Export\n\n`;
        md += `**Exported:** ${new Date().toLocaleString()}  \n`;
        md += `**Total Messages:** ${messages.length}  \n`;
        md += `**URL:** ${window.location.href}  \n`;
        md += `**Export Method:** Enhanced Grok Export v2.2\n\n`;
        md += `---\n\n`;

        messages.forEach(msg => {
            const modeIndicator = msg.mode !== 'standard' ? ` [${msg.mode.toUpperCase()}]` : '';
            md += `## ${msg.speaker}${modeIndicator}\n\n`;
            md += `${msg.content}\n\n`;
        });

        return md;
    }

    function formatAsJSON(messages) {
        const exportData = {
            exportDate: new Date().toISOString(),
            exportTimestamp: Date.now(),
            exportVersion: '2.2.0',
            platform: 'grok',
            messageCount: messages.length,
            url: window.location.href,
            userAgent: navigator.userAgent,
            conversation: messages.map(msg => ({
                id: msg.id,
                speaker: msg.speaker,
                content: msg.content,
                mode: msg.mode,
                timestamp: msg.timestamp,
                length: msg.length,
                debugInfo: msg.debugInfo
            })),
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
            debugLog(`Downloading: ${filename} (${content instanceof Blob ? 'Blob' : content.length + ' chars'})`);

            let blob;
            if (content instanceof Blob) {
                blob = content;
            } else {
                blob = new Blob([content], { type: type + ';charset=utf-8' });
            }

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

            if (format === 'share') {
                createShareModal(messages);
                hideMenu();
                return;
            }

            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            let filename, content, mimeType;

            switch (format) {
                case 'md':
                    content = formatAsMarkdown(messages);
                    mimeType = 'text/markdown';
                    filename = `grok-FULL-conversation-${messages.length}msgs-${timestamp}.md`;
                    break;
                case 'json':
                    content = formatAsJSON(messages);
                    mimeType = 'application/json';
                    filename = `grok-FULL-conversation-${messages.length}msgs-${timestamp}.json`;
                    break;
                case 'pdf':
                    showNotification('📄 Generating document...', 0);
                    content = await formatAsPDF(messages);
                    mimeType = 'text/plain';
                    filename = `grok-FULL-conversation-${messages.length}msgs-${timestamp}.txt`;
                    break;
                default:
                    content = formatAsText(messages);
                    mimeType = 'text/plain';
                    filename = `grok-FULL-conversation-${messages.length}msgs-${timestamp}.txt`;
            }

            const success = downloadFile(content, filename, mimeType);
            if (success) {
                hideMenu();
                const formatName = format === 'pdf' ? 'Document' : format.toUpperCase();
                showNotification(`✅ Exported ${messages.length} messages as ${formatName}`, 5000);
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
            min-width: 220px;
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
            { ext: 'json', name: 'JSON Data', icon: '📊', desc: 'Structured data' },
            { ext: 'pdf', name: 'Document', icon: '📋', desc: 'Formatted text file' },
            { ext: 'share', name: 'Share to X', icon: '🐦', desc: 'Post snippets to X' }
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
                button.style.background = format.ext === 'pdf' ? '#fff3cd' :
                                        format.ext === 'share' ? '#e3f2fd' : '#f8f9ff';
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
                const speakerStats = {
                    human: messages.filter(m => m.speaker === 'Human').length,
                    grok: messages.filter(m => m.speaker === 'Grok').length
                };
                console.log('Grok Debug Info:', {
                    messagesFound: messages.length,
                    speakerDistribution: speakerStats,
                    url: window.location.href,
                    sampleMessages: messages.slice(0, 5).map(m => ({
                        speaker: m.speaker,
                        length: m.length,
                        preview: m.content.substring(0, 50) + '...',
                        debugInfo: m.debugInfo
                    }))
                });
                alert(`Found ${messages.length} messages\nHuman: ${speakerStats.human}, Grok: ${speakerStats.grok}\nCheck console for details.`);
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
        debugLog('Initializing Enhanced Grok Export v2.2...');

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

        debugLog('Enhanced Grok Export v2.2 initialized successfully!');
        console.log('%c✅ Enhanced Grok Export v2.2 Ready!', 'color: green; font-weight: bold;');
        console.log('%c🔧 Fixed: Content-Based Speaker Detection & PDF Export', 'color: blue; font-weight: bold;');
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