// Popup script with Contact Lists feature
let isRunning = false;
let contactLists = {};
let messageTemplates = {}; // Store message templates
let blacklist = []; // Store blacklisted phone numbers
let isPersonalizationEnabled = false;
let csvHeaders = []; // Store column names from CSV
let isScheduleMode = false;
let scheduleTimer = null;


document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const phoneNumbersInput = document.getElementById('phoneNumbers');
    const messageInput = document.getElementById('message');
    const minDelayInput = document.getElementById('minDelay');
    const maxDelayInput = document.getElementById('maxDelay');
    const statusContainer = document.getElementById('status');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const statusMessage = document.getElementById('statusMessage');
    const statusCount = document.getElementById('statusCount');
    const progressFill = document.getElementById('progressFill');

    // Contact List Elements
    const contactsBtn = document.getElementById('contactsBtn');
    const contactsPanel = document.getElementById('contactsPanel');
    const contactsList = document.getElementById('contactsList');
    const addContactBtn = document.getElementById('addContactBtn');
    const addContactModal = document.getElementById('addContactModal');
    const closeModal = document.getElementById('closeModal');
    const listNameInput = document.getElementById('listName');
    const listNumbersInput = document.getElementById('listNumbers');
    const saveListBtn = document.getElementById('saveListBtn');

    // Personalization Elements
    const personalizeToggle = document.getElementById('personalizeToggle');
    const personalizeHelp = document.getElementById('personalizeHelp');

    // CSV Import Elements
    const csvFileInput = document.getElementById('csvFileInput');
    const importCsvBtn = document.getElementById('importCsvBtn');
    const csvInfo = document.getElementById('csvInfo');
    const csvStats = document.getElementById('csvStats');
    const csvVariables = document.getElementById('csvVariables');

    // Template Elements
    const templatesBtn = document.getElementById('templatesBtn');
    const templatesPanel = document.getElementById('templatesPanel');
    const templatesList = document.getElementById('templatesList');
    const addTemplateBtn = document.getElementById('addTemplateBtn');
    const addTemplateModal = document.getElementById('addTemplateModal');
    const closeTemplateModal = document.getElementById('closeTemplateModal');
    const templateNameInput = document.getElementById('templateName');
    const templateMessageInput = document.getElementById('templateMessage');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');

    // Schedule Elements
    const scheduleToggle = document.getElementById('scheduleToggle');
    const scheduleInputs = document.getElementById('scheduleInputs');
    const scheduleDateInput = document.getElementById('scheduleDate');
    const scheduleTimeInput = document.getElementById('scheduleTime');

    // Blacklist Elements
    const blacklistBtn = document.getElementById('blacklistBtn');
    const blacklistPanel = document.getElementById('blacklistPanel');
    const blacklistList = document.getElementById('blacklistList');
    const addBlacklistBtn = document.getElementById('addBlacklistBtn');
    const addBlacklistModal = document.getElementById('addBlacklistModal');
    const closeBlacklistModal = document.getElementById('closeBlacklistModal');
    const blacklistNumbersInput = document.getElementById('blacklistNumbers');
    const saveBlacklistBtn = document.getElementById('saveBlacklistBtn');

    // Load saved data
    chrome.storage.local.get(['phoneNumbers', 'message', 'minDelay', 'maxDelay', 'contactLists', 'messageTemplates', 'personalizationEnabled', 'blacklist'], (data) => {
        if (data.phoneNumbers) phoneNumbersInput.value = data.phoneNumbers;
        if (data.message) messageInput.value = data.message;
        if (data.minDelay) minDelayInput.value = data.minDelay;
        if (data.maxDelay) maxDelayInput.value = data.maxDelay;
        if (data.contactLists) {
            contactLists = data.contactLists;
            renderContactsList();
        }
        if (data.messageTemplates) {
            messageTemplates = data.messageTemplates;
            renderTemplatesList();
        }
        if (data.personalizationEnabled) {
            personalizeToggle.checked = true;
            isPersonalizationEnabled = true;
            personalizeHelp.style.display = 'block';
        }
        if (data.blacklist) {
            blacklist = data.blacklist;
            renderBlacklistList();
        }
    });

    // Auto-save inputs
    phoneNumbersInput.addEventListener('input', () => {
        chrome.storage.local.set({ phoneNumbers: phoneNumbersInput.value });
    });
    messageInput.addEventListener('input', () => {
        chrome.storage.local.set({ message: messageInput.value });
    });
    minDelayInput.addEventListener('input', () => {
        chrome.storage.local.set({ minDelay: minDelayInput.value });
    });
    maxDelayInput.addEventListener('input', () => {
        chrome.storage.local.set({ maxDelay: maxDelayInput.value });
    });

    // Personalization Toggle
    personalizeToggle.addEventListener('change', () => {
        isPersonalizationEnabled = personalizeToggle.checked;
        personalizeHelp.style.display = isPersonalizationEnabled ? 'block' : 'none';
        chrome.storage.local.set({ personalizationEnabled: isPersonalizationEnabled });

        // Update placeholder based on mode
        if (isPersonalizationEnabled) {
            phoneNumbersInput.placeholder = '+919876543210,John,101\n+918765432109,Jane,102';
        } else {
            phoneNumbersInput.placeholder = '+919876543210\n+918765432109';
        }
    });

    // Schedule Toggle
    scheduleToggle.addEventListener('change', () => {
        isScheduleMode = scheduleToggle.checked;
        scheduleInputs.style.display = isScheduleMode ? 'block' : 'none';

        // Update button text
        startBtn.textContent = isScheduleMode ? '📅 Schedule Campaign' : '▶ Start Now';

        // Set minimum date to today and default time
        if (isScheduleMode) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            scheduleDateInput.min = today;
            scheduleDateInput.value = today;

            // Set default time to 1 hour from now
            const futureTime = new Date(now.getTime() + 60 * 60 * 1000);
            const hours = String(futureTime.getHours()).padStart(2, '0');
            const minutes = String(futureTime.getMinutes()).padStart(2, '0');
            scheduleTimeInput.value = `${hours}:${minutes}`;
        }
    });

    // CSV Import
    importCsvBtn.addEventListener('click', () => {
        csvFileInput.click();
    });

    csvFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text.trim().split('\n');

            if (lines.length < 2) {
                alert('CSV must have at least a header row and one data row!');
                return;
            }

            // Parse header (first row)
            const headerRow = lines[0].trim();
            csvHeaders = parseCSVLine(headerRow);

            // Parse data rows
            const dataRows = [];
            for (let i = 1; i < lines.length; i++) {
                const row = parseCSVLine(lines[i].trim());
                if (row.length > 0 && row[0]) { // Ensure phone number exists
                    dataRows.push(row.join(','));
                }
            }

            // Fill textarea with data (without headers)
            phoneNumbersInput.value = dataRows.join('\n');

            // Auto-enable personalization
            personalizeToggle.checked = true;
            isPersonalizationEnabled = true;
            personalizeHelp.style.display = 'block';
            chrome.storage.local.set({ personalizationEnabled: true });

            // Show CSV info
            csvStats.textContent = `${dataRows.length} contacts`;
            const variableNames = csvHeaders.slice(1).map(h => `{${h}}`).join(', ');
            csvVariables.innerHTML = variableNames.split(', ').map(v =>
                `<code>${v}</code>`
            ).join(' ');
            csvInfo.style.display = 'block';

            // Save data
            chrome.storage.local.set({ phoneNumbers: phoneNumbersInput.value });

        } catch (error) {
            alert('Error reading CSV file. Please check the format!');
            console.error(error);
        }

        // Clear file input for re-import
        csvFileInput.value = '';
    });

    // Helper function to parse CSV line (handles commas in quotes)
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    // Contacts Panel Toggle
    contactsBtn.addEventListener('click', () => {
        contactsPanel.style.display = contactsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Add Contact Modal
    addContactBtn.addEventListener('click', () => {
        addContactModal.style.display = 'flex';
        listNameInput.value = '';
        listNumbersInput.value = '';
    });

    closeModal.addEventListener('click', () => {
        addContactModal.style.display = 'none';
    });

    // Save Contact List
    saveListBtn.addEventListener('click', () => {
        const name = listNameInput.value.trim();
        const numbers = listNumbersInput.value.trim();

        if (!name) {
            alert('Please enter a list name');
            return;
        }
        if (!numbers) {
            alert('Please enter at least one phone number');
            return;
        }

        contactLists[name] = numbers.split('\n').filter(n => n.trim());
        chrome.storage.local.set({ contactLists });
        renderContactsList();
        addContactModal.style.display = 'none';
    });

    // Render Contacts List
    function renderContactsList() {
        const names = Object.keys(contactLists);

        if (names.length === 0) {
            contactsList.innerHTML = '<div class="no-contacts">No saved contacts yet</div>';
            return;
        }

        contactsList.innerHTML = names.map(name => {
            const count = contactLists[name].length;
            return `
                <div class="contact-item">
                    <div>
                        <span class="contact-name">${name}</span>
                        <span class="contact-count">(${count} numbers)</span>
                    </div>
                    <div class="contact-actions">
                        <button class="btn-use" data-name="${name}">Use</button>
                        <button class="btn-delete" data-name="${name}">×</button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners
        contactsList.querySelectorAll('.btn-use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                phoneNumbersInput.value = contactLists[name].join('\n');
                chrome.storage.local.set({ phoneNumbers: phoneNumbersInput.value });
                contactsPanel.style.display = 'none';
            });
        });

        contactsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                if (confirm(`Delete "${name}" list?`)) {
                    delete contactLists[name];
                    chrome.storage.local.set({ contactLists });
                    renderContactsList();
                }
            });
        });
    }

    // Templates Panel Toggle
    templatesBtn.addEventListener('click', () => {
        templatesPanel.style.display = templatesPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Add Template Modal
    addTemplateBtn.addEventListener('click', () => {
        addTemplateModal.style.display = 'flex';
        templateNameInput.value = '';
        templateMessageInput.value = '';
    });

    closeTemplateModal.addEventListener('click', () => {
        addTemplateModal.style.display = 'none';
    });

    // Save Message Template
    saveTemplateBtn.addEventListener('click', () => {
        const name = templateNameInput.value.trim();
        const templateMsg = templateMessageInput.value.trim();

        if (!name) {
            alert('Please enter a template name');
            return;
        }
        if (!templateMsg) {
            alert('Please enter a message');
            return;
        }

        messageTemplates[name] = templateMsg;
        chrome.storage.local.set({ messageTemplates });
        renderTemplatesList();
        addTemplateModal.style.display = 'none';
    });

    // Render Templates List
    function renderTemplatesList() {
        const names = Object.keys(messageTemplates);

        if (names.length === 0) {
            templatesList.innerHTML = '<div class="no-contacts">No saved templates yet</div>';
            return;
        }

        templatesList.innerHTML = names.map(name => {
            const preview = messageTemplates[name].substring(0, 30) + (messageTemplates[name].length > 30 ? '...' : '');
            return `
                <div class="contact-item">
                    <div>
                        <span class="contact-name">${name}</span>
                        <div class="template-preview">${preview}</div>
                    </div>
                    <div class="contact-actions">
                        <button class="btn-use" data-name="${name}">Use</button>
                        <button class="btn-delete" data-name="${name}">×</button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners
        templatesList.querySelectorAll('.btn-use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                messageInput.value = messageTemplates[name];
                chrome.storage.local.set({ message: messageInput.value });
                templatesPanel.style.display = 'none';
            });
        });

        templatesList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                if (confirm(`Delete "${name}" template?`)) {
                    delete messageTemplates[name];
                    chrome.storage.local.set({ messageTemplates });
                    renderTemplatesList();
                }
            });
        });
    }

    // Blacklist Panel Toggle
    blacklistBtn.addEventListener('click', () => {
        blacklistPanel.style.display = blacklistPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Add to Blacklist Modal
    addBlacklistBtn.addEventListener('click', () => {
        addBlacklistModal.style.display = 'flex';
        blacklistNumbersInput.value = '';
    });

    closeBlacklistModal.addEventListener('click', () => {
        addBlacklistModal.style.display = 'none';
    });

    // Save to Blacklist
    saveBlacklistBtn.addEventListener('click', () => {
        const numbers = blacklistNumbersInput.value.trim();

        if (!numbers) {
            alert('Please enter at least one phone number');
            return;
        }

        // Parse and normalize numbers
        const newNumbers = numbers.split('\n')
            .map(n => normalizePhoneNumber(n.trim()))
            .filter(n => n && !blacklist.includes(n));

        if (newNumbers.length === 0) {
            alert('No new numbers to add (might already be blacklisted)');
            return;
        }

        blacklist = [...blacklist, ...newNumbers];
        chrome.storage.local.set({ blacklist });
        renderBlacklistList();
        addBlacklistModal.style.display = 'none';

        alert(`✅ Added ${newNumbers.length} number(s) to blacklist`);
    });

    // Normalize phone number (remove ALL non-digit characters for comparison)
    function normalizePhoneNumber(phone) {
        if (!phone) return '';
        // First, get just the phone number part (before any comma for CSV data)
        const phoneOnly = phone.split(',')[0].trim();
        // Remove ALL non-digit characters for consistent comparison
        return phoneOnly.replace(/\D/g, '');
    }

    // Check if a phone number is blacklisted
    function isBlacklisted(phone) {
        if (!phone || blacklist.length === 0) return false;

        const normalizedPhone = normalizePhoneNumber(phone);
        console.log('[Blacklist] Checking:', phone, '→ normalized:', normalizedPhone);

        const result = blacklist.some(blacklistedNum => {
            const normalizedBlacklisted = normalizePhoneNumber(blacklistedNum);

            // Direct match
            if (normalizedPhone === normalizedBlacklisted) {
                console.log('[Blacklist] MATCH (exact):', normalizedPhone, '===', normalizedBlacklisted);
                return true;
            }

            // One ends with the other (handles country code differences)
            // e.g., "919876543210" ends with "9876543210"
            if (normalizedPhone.length >= 10 && normalizedBlacklisted.length >= 10) {
                const last10Phone = normalizedPhone.slice(-10);
                const last10Blacklisted = normalizedBlacklisted.slice(-10);
                if (last10Phone === last10Blacklisted) {
                    console.log('[Blacklist] MATCH (last 10 digits):', last10Phone, '===', last10Blacklisted);
                    return true;
                }
            }

            return false;
        });

        console.log('[Blacklist] Result for', phone, ':', result ? 'BLOCKED' : 'allowed');
        return result;
    }

    // Render Blacklist
    function renderBlacklistList() {
        if (blacklist.length === 0) {
            blacklistList.innerHTML = '<div class="no-contacts">No blacklisted numbers yet</div>';
            return;
        }

        blacklistList.innerHTML = blacklist.map((number, index) => `
            <div class="blacklist-item">
                <span class="blacklist-number">${number}</span>
                <button class="btn-remove-blacklist" data-index="${index}">Remove</button>
            </div>
        `).join('');

        // Attach event listeners for remove buttons
        blacklistList.querySelectorAll('.btn-remove-blacklist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const number = blacklist[index];
                if (confirm(`Remove ${number} from blacklist?`)) {
                    blacklist.splice(index, 1);
                    chrome.storage.local.set({ blacklist });
                    renderBlacklistList();
                }
            });
        });
    }

    // Helper Functions for Scheduling
    async function ensureWhatsAppWebOpen() {
        console.log('[ensureWhatsAppWebOpen] Starting...');

        try {
            const tabs = await chrome.tabs.query({});
            console.log('[ensureWhatsAppWebOpen] Found', tabs.length, 'tabs');

            let whatsappTab = tabs.find(tab => tab.url && tab.url.includes('web.whatsapp.com'));

            if (!whatsappTab) {
                console.log('[ensureWhatsAppWebOpen] No WhatsApp tab found, creating new one...');
                whatsappTab = await chrome.tabs.create({
                    url: 'https://web.whatsapp.com',
                    active: true
                });

                showStatus();
                statusMessage.textContent = '🌐 Opening WhatsApp Web... (Scan QR if needed)';

                // Wait for page to load
                await new Promise(resolve => setTimeout(resolve, 8000));

                // Refresh tab info after waiting
                const updatedTabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
                if (updatedTabs.length > 0) {
                    whatsappTab = updatedTabs[0];
                }
            } else {
                console.log('[ensureWhatsAppWebOpen] Found existing WhatsApp tab:', whatsappTab.id);
                await chrome.tabs.update(whatsappTab.id, { active: true });
                await chrome.windows.update(whatsappTab.windowId, { focused: true });
            }

            console.log('[ensureWhatsAppWebOpen] Returning tab:', whatsappTab?.id);
            return whatsappTab;
        } catch (error) {
            console.error('[ensureWhatsAppWebOpen] Error:', error);
            throw error;
        }
    }

    function startScheduledCountdown(scheduledDateTime, onComplete) {
        if (scheduleTimer) {
            clearInterval(scheduleTimer);
        }

        scheduleTimer = setInterval(() => {
            const remaining = scheduledDateTime.getTime() - Date.now();

            if (remaining <= 0) {
                clearInterval(scheduleTimer);
                scheduleTimer = null;
                onComplete();
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            statusMessage.textContent = `⏰ Scheduled - Starting in: ${hours}h ${minutes}m ${seconds}s`;
            progressFill.style.width = '0%';
        }, 1000);
    }

    // Start Sending
    startBtn.addEventListener('click', async () => {
        const rawLines = phoneNumbersInput.value.trim().split('\n').filter(num => num.trim());
        const message = messageInput.value.trim();
        const minDelay = parseInt(minDelayInput.value);
        const maxDelay = parseInt(maxDelayInput.value);

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

        // Schedule Mode - Set up countdown
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
                // When countdown completes, reset and trigger send
                isScheduleMode = false;
                scheduleToggle.checked = false;
                scheduleInputs.style.display = 'none';
                startBtn.textContent = '▶ Start Now';

                // Re-enable button before clicking
                startBtn.disabled = false;
                stopBtn.disabled = true;

                // Trigger actual sending
                startBtn.click();
            });

            const timeStr = scheduledDateTime.toLocaleString();
            alert(`✅ Campaign scheduled for ${timeStr}\n\n⚠️ Keep this popup open!`);
            return; // Don't send now
        }

        // Parse data based on personalization mode
        let contactsData = [];
        if (isPersonalizationEnabled) {
            // If CSV was imported, use CSV headers as variable names
            // Otherwise, extract variable names from message
            let variableNames = [];

            if (csvHeaders.length > 1) {
                // Use CSV headers (skip first column which is phone number)
                variableNames = csvHeaders.slice(1);
            } else {
                // Extract from message template
                const variableMatches = message.match(/\{([^}]+)\}/g);
                variableNames = variableMatches ? variableMatches.map(v => v.slice(1, -1)) : [];
            }

            for (const line of rawLines) {
                const parts = line.split(',').map(p => p.trim());
                const phoneNumber = parts[0];

                if (!phoneNumber) continue;

                // Build variables object using CSV headers or template variables
                const variables = {};
                if (csvHeaders.length > 1) {
                    // Map data to CSV column names
                    variableNames.forEach((varName, index) => {
                        variables[varName] = parts[index + 1] || '';
                    });
                } else {
                    // Old method: extract from message and match by position
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
            // Simple mode - just phone numbers
            contactsData = rawLines.map(line => ({
                phoneNumber: line.trim(),
                variables: {}
            }));
        }

        // Filter out blacklisted numbers
        console.log('[Blacklist] Current blacklist:', blacklist);
        console.log('[Blacklist] Contacts to check:', contactsData.map(c => c.phoneNumber));

        const originalCount = contactsData.length;
        const filteredContactsData = contactsData.filter(contact => !isBlacklisted(contact.phoneNumber));
        const skippedCount = originalCount - filteredContactsData.length;

        console.log('[Blacklist] Filtered result:', filteredContactsData.length, 'remaining,', skippedCount, 'skipped');

        if (filteredContactsData.length === 0) {
            showError('All contacts are blacklisted! No messages to send.');
            return;
        }

        // Log if some contacts were skipped (no blocking confirmation)
        if (skippedCount > 0) {
            console.log(`[Blacklist] Skipping ${skippedCount} blacklisted number(s), sending to ${filteredContactsData.length} contact(s)`);
            // Show in debug log instead of blocking popup
            addLog(`🚫 Skipping ${skippedCount} blacklisted number(s)`, 'info');
        }

        try {
            console.log('[Sending] Opening WhatsApp Web...');

            // Auto-open WhatsApp Web if needed
            const tab = await ensureWhatsAppWebOpen();

            console.log('[Sending] Tab obtained:', tab);

            if (!tab || !tab.id) {
                showError('Error: Could not open WhatsApp Web tab');
                console.error('[Sending] No tab returned from ensureWhatsAppWebOpen');
                return;
            }

            hideError();
            showStatus();
            isRunning = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;

            // Log skipped contacts info
            if (skippedCount > 0) {
                addLog(`🚫 Skipped ${skippedCount} blacklisted number(s)`, 'info');
            }

            console.log('[Sending] Sending message to content script...');
            addLog('Starting to send messages...', 'info');

            await chrome.tabs.sendMessage(tab.id, {
                action: 'startSending',
                contactsData: filteredContactsData,
                messageTemplate: message,
                minDelay: minDelay * 1000,
                maxDelay: maxDelay * 1000,
                isPersonalized: isPersonalizationEnabled
            });

            console.log('[Sending] Message sent to content script successfully');

            // Close popup after a short delay
            setTimeout(() => window.close(), 500);

        } catch (error) {
            console.error('[Sending] Error:', error);
            showError('Error: Please refresh WhatsApp Web and try again');
            addLog('Error: ' + error.message, 'error');
            resetUI();
        }
    });

    // Stop
    stopBtn.addEventListener('click', async () => {
        // Cancel scheduled countdown if running
        if (scheduleTimer) {
            clearInterval(scheduleTimer);
            scheduleTimer = null;
        }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
            chrome.tabs.sendMessage(tab.id, { action: 'stopSending' });
        }
        resetUI();
        statusMessage.textContent = 'Stopped';
    });

    // Listen for messages
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateStatus') {
            updateStatus(request.current, request.total, request.message);
        } else if (request.action === 'completed') {
            resetUI();
            statusMessage.textContent = `✓ Sent ${request.total} messages`;
            addLog('Completed!', 'success');
        } else if (request.action === 'log') {
            addLog(request.message, request.type);
        }
    });

    // Debug
    const debugLog = document.getElementById('debugLog');
    const toggleDebugBtn = document.getElementById('toggleDebug');

    toggleDebugBtn.addEventListener('click', () => {
        debugLog.style.display = debugLog.style.display === 'none' ? 'block' : 'none';
    });

    function addLog(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        debugLog.appendChild(entry);
        debugLog.scrollTop = debugLog.scrollHeight;
    }

    function showStatus() {
        statusContainer.style.display = 'block';
        statusMessage.textContent = 'Starting...';
        statusCount.textContent = '0/0';
        progressFill.style.width = '0%';
    }

    function updateStatus(current, total, message) {
        statusCount.textContent = `${current}/${total}`;
        statusMessage.textContent = message;
        progressFill.style.width = `${(current / total) * 100}%`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'flex';
    }

    function hideError() {
        errorContainer.style.display = 'none';
    }

    function resetUI() {
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
});
