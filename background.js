// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('WhatsApp Message Automator installed');
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Forward messages between popup and content script
    if (request.action === 'updateStatus' || request.action === 'completed' || request.action === 'error') {
        // This will be received by the popup
        chrome.runtime.sendMessage(request);
    }
    return true;
});
