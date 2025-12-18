// Popup script with Contact Lists feature
let isRunning = false;
let contactLists = {};

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

    // Load saved data
    chrome.storage.local.get(['phoneNumbers', 'message', 'minDelay', 'maxDelay', 'contactLists'], (data) => {
        if (data.phoneNumbers) phoneNumbersInput.value = data.phoneNumbers;
        if (data.message) messageInput.value = data.message;
        if (data.minDelay) minDelayInput.value = data.minDelay;
        if (data.maxDelay) maxDelayInput.value = data.maxDelay;
        if (data.contactLists) {
            contactLists = data.contactLists;
            renderContactsList();
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
        const phoneNumbers = phoneNumbersInput.value.trim().split('\n').filter(num => num.trim());
        const message = messageInput.value.trim();
        const minDelay = parseInt(minDelayInput.value);
        const maxDelay = parseInt(maxDelayInput.value);

        if (phoneNumbers.length === 0) {
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
                phoneNumbers: phoneNumbers,
                message: message,
                minDelay: minDelay * 1000,
                maxDelay: maxDelay * 1000
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
