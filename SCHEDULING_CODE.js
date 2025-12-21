// Add after other global variables at top of popup.js:
let scheduledCampaigns = {}; // Store scheduled campaigns
let isScheduleMode = false;

// Add in DOMContentLoaded with other UI elements:
const scheduleToggle = document.getElementById('scheduleToggle');
const scheduleInputs = document.getElementById('scheduleInputs');
const scheduleDateInput = document.getElementById('scheduleDate');
const scheduleTimeInput = document.getElementById('scheduleTime');

// Load scheduled campaigns
chrome.storage.local.get(['scheduledCampaigns'], (data) => {
    if (data.scheduledCampaigns) {
        scheduledCampaigns = data.scheduledCampaigns;
        checkPendingSchedules(); // Check if any are due
    }
});

// Schedule Toggle Handler
scheduleToggle.addEventListener('change', () => {
    isScheduleMode = scheduleToggle.checked;
    scheduleInputs.style.display = isScheduleMode ? 'block' : 'none';

    // Update button text
    startBtn.textContent = isScheduleMode ? '📅 Schedule Campaign' : '▶ Start Now';

    // Set minimum date to today
    if (isScheduleMode) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        scheduleDateInput.min = today;
        scheduleDateInput.value = today;

        // Set default time to 1 hour from now
        const futureTime = new Date(now.getTime() + 60 * 60 * 1000);
        const timeString = futureTime.toTimeString().slice(0, 5);
        scheduleTimeInput.value = timeString;
    }
});

//==================================================================
// Modified Start Button Handler with Auto-Open and Scheduling
//==================================================================
startBtn.addEventListener('click', async () => {
    const rawLines = phoneNumbersInput.value.trim().split('\\n').filter(num => num.trim());
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

    // Validate schedule if enabled
    if (isScheduleMode) {
        const scheduleDate = scheduleDateInput.value;
        const scheduleTime = scheduleTimeInput.value;

        if (!scheduleDate || !scheduleTime) {
            showError('Please set date and time for scheduling');
            return;
        }

        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        const now = new Date();

        if (scheduledDateTime <= now) {
            showError('Scheduled time must be in the future!');
            return;
        }

        // Save scheduled campaign
        await saveScheduledCampaign(rawLines, message, minDelay, maxDelay, scheduledDateTime);
        return; // Don't send now, it's scheduled
    }

    // Parse data based on personalization mode
    let contactsData = [];
    if (isPersonalizationEnabled) {
        let variableNames = [];

        if (csvHeaders.length > 1) {
            variableNames = csvHeaders.slice(1);
        } else {
            const variableMatches = message.match(/\\{([^}]+)\\}/g);
            variableNames = variableMatches ? variableMatches.map(v => v.slice(1, -1)) : [];
        }

        for (const line of rawLines) {
            const parts = line.split(',').map(p => p.trim());
            const phoneNumber = parts[0];
            if (!phoneNumber) continue;

            const variables = {};
            if (csvHeaders.length > 1) {
                variableNames.forEach((varName, index) => {
                    variables[varName] = parts[index + 1] || '';
                });
            } else {
                variableNames.forEach((varName, index) => {
                    variables[varName] = parts[index + 1] || '';
                });
            }

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

    // AUTO-OPEN WHATSAPP WEB IF NOT OPEN
    const tabs = await chrome.tabs.query({});
    let whatsappTab = tabs.find(tab => tab.url && tab.url.includes('web.whatsapp.com'));

    if (!whatsappTab) {
        // No WhatsApp tab found - open it
        whatsappTab = await chrome.tabs.create({
            url: 'https://web.whatsapp.com',
            active: true
        });

        // Wait for page to load (give user time to scan QR if needed)
        showStatus();
        statusMessage.textContent = 'Opening WhatsApp Web... Please scan QR code if needed';
        hideError();

        // Wait 5 seconds for WhatsApp to load
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check if still not loaded, prompt user
        const checkTab = await chrome.tabs.get(whatsappTab.id);
        if (!checkTab.url.includes('web.whatsapp.com')) {
            showError('Please open WhatsApp Web and try again');
            resetUI();
            return;
        }
    } else {
        // WhatsApp tab exists - make it active
        await chrome.tabs.update(whatsappTab.id, { active: true });
        await chrome.windows.update(whatsappTab.windowId, { focused: true });
    }

    // Now send messages
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

//==================================================================
// Scheduled Campaign Functions
//==================================================================
async function saveScheduledCampaign(contacts, message, minDelay, maxDelay, scheduledTime) {
    const campaignId = Date.now().toString();

    const campaign = {
        id: campaignId,
        contacts: contacts,
        message: message,
        minDelay: minDelay,
        maxDelay: maxDelay,
        scheduledTime: scheduledTime.toISOString(),
        isPersonalized: isPersonalizationEnabled,
        csvHeaders: csvHeaders.length > 0 ? csvHeaders : null,
        created: new Date().toISOString(),
        status: 'pending'
    };

    scheduledCampaigns[campaignId] = campaign;
    await chrome.storage.local.set({ scheduledCampaigns });

    // Create alarm for this campaign
    await chrome.alarms.create(`campaign_${campaignId}`, {
        when: scheduledTime.getTime()
    });

    // Show success message
    const timeStr = scheduledTime.toLocaleString();
    alert(`✅ Campaign scheduled for ${timeStr}\\n\\nMessages will be sent automatically at the scheduled time.`);

    // Reset form
    phoneNumbersInput.value = '';
    messageInput.value = '';
    scheduleToggle.checked = false;
    isScheduleMode = false;
    scheduleInputs.style.display = 'none';
    startBtn.textContent = '▶ Start Now';

    hideError();
}

function checkPendingSchedules() {
    // Check if any scheduled campaigns are due now
    const now = new Date();

    Object.values(scheduledCampaigns).forEach(campaign => {
        if (campaign.status === 'pending') {
            const scheduledTime = new Date(campaign.scheduledTime);
            if (scheduledTime <= now) {
                // This campaign is due - trigger it
                executeCampaignNow(campaign.id);
            }
        }
    });
}

async function executeCampaignNow(campaignId) {
    const campaign = scheduledCampaigns[campaignId];
    if (!campaign) return;

    // Update status
    campaign.status = 'running';
    await chrome.storage.local.set({ scheduledCampaigns });

    // Notify background to execute
    chrome.runtime.sendMessage({
        action: 'executeScheduledCampaign',
        campaign: campaign
    });
}
