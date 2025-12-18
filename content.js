// OPTIMIZED: Paste number, detect results immediately, floating status panel
let isRunning = false;
let shouldStop = false;
let statusPanel = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSending') {
        shouldStop = false;
        isRunning = false;
        startSendingMessages(
            request.contactsData,
            request.messageTemplate,
            request.minDelay,
            request.maxDelay,
            request.isPersonalized
        );
        sendResponse({ status: 'started' });
    } else if (request.action === 'stopSending') {
        shouldStop = true;
        isRunning = false;
        updateStatusPanel('Stopped', 0, 0);
        sendResponse({ status: 'stopped' });
    }
    return true;
});

// Create floating status panel on WhatsApp
function createStatusPanel() {
    if (statusPanel) return;

    statusPanel = document.createElement('div');
    statusPanel.id = 'wa-auto-status';
    statusPanel.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #128C7E, #075E54);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 99999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 200px;
        ">
            <div style="font-weight: bold; margin-bottom: 8px;">📱 WA Automator</div>
            <div id="wa-auto-progress" style="margin-bottom: 8px;">Ready</div>
            <div style="background: rgba(255,255,255,0.2); border-radius: 4px; height: 6px; margin-bottom: 10px;">
                <div id="wa-auto-bar" style="background: #25D366; height: 100%; width: 0%; border-radius: 4px; transition: width 0.3s;"></div>
            </div>
            <button id="wa-auto-stop" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                width: 100%;
                font-weight: bold;
            ">⏹ Stop</button>
        </div>
    `;
    document.body.appendChild(statusPanel);

    document.getElementById('wa-auto-stop').addEventListener('click', () => {
        shouldStop = true;
        isRunning = false;
        updateStatusPanel('Stopped by user', 0, 0);
    });
}

function updateStatusPanel(message, current, total) {
    if (!statusPanel) createStatusPanel();

    const progressEl = document.getElementById('wa-auto-progress');
    const barEl = document.getElementById('wa-auto-bar');

    if (progressEl) {
        progressEl.textContent = total > 0 ? `${message} (${current}/${total})` : message;
    }
    if (barEl && total > 0) {
        barEl.style.width = `${(current / total) * 100}%`;
    }
}

function removeStatusPanel() {
    if (statusPanel) {
        statusPanel.remove();
        statusPanel = null;
    }
}

function sendMessageToPopup(action, data) {
    try { chrome.runtime.sendMessage({ action: action, ...data }); } catch (e) { }
}

function log(message) {
    console.log(`[WA] ${message}`);
    sendMessageToPopup('log', { message, type: 'info' });
}

// Paste text - using textContent (not execCommand to avoid double)
async function pasteText(element, text) {
    window.focus();
    element.focus();
    element.click();
    await sleep(100);

    // Simply set the text content directly
    element.textContent = text;

    // Move cursor to end
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Trigger input event so WhatsApp detects the change
    element.dispatchEvent(new InputEvent('input', {
        data: text,
        inputType: 'insertText',
        bubbles: true
    }));

    await sleep(100);
}

// Wait for search result to appear (FAST - check every 50ms)
async function waitForSearchResult(maxWait = 5000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        const results = document.querySelectorAll('[data-testid="cell-frame-container"]');
        if (results.length > 0) {
            return results[0]; // Found! Return immediately
        }
        await sleep(50); // Check every 50ms for instant detection
    }

    return null;
}


async function startSendingMessages(contactsData, messageTemplate, minDelay, maxDelay, isPersonalized) {
    if (isRunning) {
        isRunning = false;
        await sleep(500);
    }

    isRunning = true;
    createStatusPanel();

    const total = contactsData.length;
    let successCount = 0;

    for (let i = 0; i < contactsData.length; i++) {
        if (shouldStop) break;

        const contact = contactsData[i];
        const cleanNumber = contact.phoneNumber.trim().replace(/[^\d+]/g, '');

        // Personalize message if enabled
        let personalizedMessage = messageTemplate;
        if (isPersonalized && contact.variables) {
            // Replace all {varName} with actual values
            for (const [varName, value] of Object.entries(contact.variables)) {
                const regex = new RegExp(`\\{${varName}\\}`, 'g');
                personalizedMessage = personalizedMessage.replace(regex, value);
            }
        }

        updateStatusPanel(`Sending to ${cleanNumber}...`, i + 1, total);
        log(`${cleanNumber} (${i + 1}/${total})`);

        try {
            await sendToNumber(cleanNumber, personalizedMessage);
            successCount++;
            updateStatusPanel(`✓ Sent to ${cleanNumber}`, i + 1, total);

            if (i < contactsData.length - 1 && !shouldStop) {
                const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                updateStatusPanel(`Waiting ${Math.round(delay / 1000)}s...`, i + 1, total);
                await sleep(delay);
            }

        } catch (error) {
            log(`❌ ${error.message}`);
            updateStatusPanel(`✗ Failed: ${cleanNumber}`, i + 1, total);
            await sleep(2000);
        }
    }

    isRunning = false;
    shouldStop = false;
    updateStatusPanel(`Done! ${successCount}/${total} sent`, total, total);
    sendMessageToPopup('completed', { total: successCount });

    // Remove panel after 5 seconds
    setTimeout(removeStatusPanel, 5000);
}


async function sendToNumber(phoneNumber, message) {
    window.focus();

    // Reset
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    await sleep(200);

    // New Chat
    let newChatBtn = document.querySelector('span[data-icon="new-chat-outline"]') ||
        document.querySelector('[data-testid="menu-bar-new-chat"]');
    if (newChatBtn) {
        (newChatBtn.closest('div[role="button"]') || newChatBtn).click();
    }
    await sleep(300);

    // Find search box
    let searchBox = null;
    for (let i = 0; i < 15; i++) {
        searchBox = document.querySelector('[data-testid="chat-list-search"]') ||
            document.querySelector('div[contenteditable="true"][data-tab="3"]') ||
            document.querySelector('#side div[contenteditable="true"]');
        if (searchBox) break;
        await sleep(100);
    }
    if (!searchBox) throw new Error('Search box not found');

    // PASTE number directly (fast!)
    await pasteText(searchBox, phoneNumber);

    // Wait for result to appear (reactive, not fixed wait)
    const result = await waitForSearchResult(5000);

    if (result) {
        result.click();
    } else {
        // Try Enter as fallback
        searchBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    }
    await sleep(300);

    // Find message box
    let msgBox = null;
    for (let i = 0; i < 20; i++) {
        msgBox = document.querySelector('#main footer div[contenteditable="true"]') ||
            document.querySelector('div[contenteditable="true"][data-tab="10"]');
        if (msgBox) break;
        await sleep(100);
    }
    if (!msgBox) throw new Error('Message box not found');

    // Paste message
    await pasteText(msgBox, message);
    await sleep(100);

    // Send
    msgBox.focus();
    msgBox.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', keyCode: 13, bubbles: true, cancelable: true
    }));
    await sleep(300);

    // Verify
    const newBox = document.querySelector('#main footer div[contenteditable="true"]');
    if (newBox && newBox.textContent.trim() === '') return true;

    // Try button
    const sendBtn = document.querySelector('button[data-testid="send"]') ||
        document.querySelector('span[data-icon="send"]')?.closest('button');
    if (sendBtn) {
        sendBtn.click();
        await sleep(800);
        return true;
    }

    throw new Error('Send failed');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
