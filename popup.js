// Popup script with Contact Lists feature
let isRunning = false;
let contactLists = {};
let isPersonalizationEnabled = false;
let csvHeaders = []; // Store column names from CSV


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

    // Load saved data
    chrome.storage.local.get(['phoneNumbers', 'message', 'minDelay', 'maxDelay', 'contactLists', 'personalizationEnabled'], (data) => {
        if (data.phoneNumbers) phoneNumbersInput.value = data.phoneNumbers;
        if (data.message) messageInput.value = data.message;
        if (data.minDelay) minDelayInput.value = data.minDelay;
        if (data.maxDelay) maxDelayInput.value = data.maxDelay;
        if (data.contactLists) {
            contactLists = data.contactLists;
            renderContactsList();
        }
        if (data.personalizationEnabled) {
            personalizeToggle.checked = true;
            isPersonalizationEnabled = true;
            personalizeHelp.style.display = 'block';
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

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url || !tab.url.includes('web.whatsapp.com')) {
            showError('Please open WhatsApp Web first');
            chrome.tabs.create({ url: 'https://web.whatsapp.com' });
            return;
        }

        hideError();
        showStatus();
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            await chrome.tabs.sendMessage(tab.id, {
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

    // Stop
    stopBtn.addEventListener('click', async () => {
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
