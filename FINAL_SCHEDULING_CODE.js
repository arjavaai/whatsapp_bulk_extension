// ===================================================================
// SCHEDULING & AUTO-OPEN HELPER FUNCTIONS
// Add these BEFORE the "Start Sending" event listener
// ===================================================================

/**
 * Auto-open WhatsApp Web or switch to existing tab
 * Returns the WhatsApp tab
 */
async function ensureWhatsAppWebOpen() {
    const tabs = await chrome.tabs.query({});
    let whatsappTab = tabs.find(tab => tab.url && tab.url.includes('web.whatsapp.com'));

    if (!whatsappTab) {
        // No WhatsApp tab found - create new one
        whatsappTab = await chrome.tabs.create({
            url: 'https://web.whatsapp.com',
            active: true
        });

        showStatus();
        statusMessage.textContent = '🌐 Opening WhatsApp Web... (Scan QR if needed)';

        // Wait 8 seconds for page load
        await new Promise(resolve => setTimeout(resolve, 8000));
    } else {
        // WhatsApp tab exists - make it active
        await chrome.tabs.update(whatsappTab.id, { active: true });
        await chrome.windows.update(whatsappTab.windowId, { focused: true });
    }

    return whatsappTab;
}

/**
 * Start countdown timer for scheduled sending
 */
function startScheduledCountdown(scheduledDateTime, onComplete) {
    if (scheduleTimer) {
        clearInterval(scheduleTimer);
    }

    scheduleTimer = setInterval(() => {
        const remaining = scheduledDateTime.getTime() - Date.now();

        if (remaining <= 0) {
            clearInterval(scheduleTimer);
            scheduleTimer = null;
            onComplete(); // Trigger actual sending
            return;
        }

        // Format time remaining
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        statusMessage.textContent = `⏰ Scheduled - Starting in: ${hours}h ${minutes}m ${seconds}s`;
        progressFill.style.width = '0%';
    }, 1000);
}

// ===================================================================
// NOW UPDATE THE START BUTTON HANDLER
// Find: startBtn.addEventListener('click', async () => {
// Replace entire function with this:
// ===================================================================

startBtn.addEventListener('click', async () => {
    const rawLines = phoneNumbersInput.value.trim().split('\n').filter(num => num.trim());
    const message = messageInput.value.trim();
    const minDelay = parseInt(minDelayInput.value);
    const maxDelay = parseInt(maxDelayInput.value);

    // Validation
    if (rawLines.length === 0) {
        showError('Please enter at least one phone number');
        return;
    }
    if (!message) {
        showError('Please enter a message');
        return;
    }
    if (minDelay < 1 || maxDelay < 1) {
        showError('Delay must be at least 1 second');
        return;
    }
    if (minDelay > maxDelay) {
        showError('Min delay cannot exceed max delay');
        return;
    }

    // ==== SCHEDULE MODE ====
    if (isScheduleMode) {
        const scheduleDate = scheduleDateInput.value;
        const scheduleTime = scheduleTimeInput.value;

        if (!scheduleDate || !scheduleTime) {
            showError('Please set date and time');
            return;
        }

        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        const now = new Date();

        if (scheduledDateTime <= now) {
            showError('Scheduled time must be in the future!');
            return;
        }

        // Setup UI for scheduled mode
        showStatus();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        hideError();

        // Start countdown
        startScheduledCountdown(scheduledDateTime, () => {
            // When countdown completes, send messages
            isScheduleMode = false; // Switch off schedule mode
            scheduleToggle.checked = false;
            scheduleInputs.style.display = 'none';
            startBtn.textContent = '▶ Start Now';

            // Trigger send by clicking button again
            startBtn.click();
        });

        const timeStr = scheduledDateTime.toLocaleString();
        alert(`✅ Campaign scheduled for ${timeStr}\n\n⚠️ Keep this popup open!`);
        return; // Don't send now
    }

    // ==== PARSE DATA ====
    let contactsData = [];
    if (isPersonalizationEnabled) {
        let variableNames = [];

        if (csvHeaders.length > 1) {
            variableNames = csvHeaders.slice(1);
        } else {
            const variableMatches = message.match(/\{([^}]+)\}/g);
            variableNames = variableMatches ? variableMatches.map(v => v.slice(1, -1)) : [];
        }

        for (const line of rawLines) {
            const parts = line.split(',').map(p => p.trim());
            const phoneNumber = parts[0];
            if (!phoneNumber) continue;

            const variables = {};
            variableNames.forEach((varName, index) => {
                variables[varName] = parts[index + 1] || '';
            });

            contactsData.push({
                phoneNumber: phoneNumber,
                variables: variables
            });
        }
    } else {
        contactsData = rawLines.map(line => ({
            phoneNumber: line.trim(),
            variables: {}
        }));
    }

    // ==== AUTO-OPEN WHATSAPP WEB ====
    const whatsappTab = await ensureWhatsAppWebOpen();

    // ==== SEND MESSAGES ====
    hideError();
    showStatus();
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    try {
        await chrome.tabs.sendMessage(whatsappTab.id, {
            action: 'startSending',
            contactsData: contactsData,
            messageTemplate: message,
            minDelay: minDelay * 1000,
            maxDelay: maxDelay * 1000,
            isPersonalized: isPersonalizationEnabled
        });
        setTimeout(() => window.close(), 500);
    } catch (error) {
        showError('Error: Please refresh WhatsApp Web');
        resetUI();
    }
});

// ===================================================================
// UPDATE STOP BUTTON HANDLER
// Find the existing stopBtn.addEventListener and ADD this at the beginning:
// ===================================================================

stopBtn.addEventListener('click', async () => {
    // Cancel scheduled countdown
    if (scheduleTimer) {
        clearInterval(scheduleTimer);
        scheduleTimer = null;
    }

    // Rest of existing stop logic below...
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'stopSending' });
    }
    resetUI();
    statusMessage.textContent = 'Stopped';
});
