# Changelog

All notable changes to the WhatsApp Message Automator extension will be documented in this file.

## [1.0.8] - 2025-12-17

### ⚡ Performance & Logic Fix
- **Removed Wait Times**: Removed the 2.5s wait for text population. Checks and insertion now happen immediately.
- **Immediate Sending**: The script now attempts to send the message the *instant* the message box is detected, preventing execution stalls.
- **Safe Messaging**: Added error handling for `chrome.runtime.sendMessage` to prevent "Extension context invalidated" errors from polluting logs.

## [1.0.7] - 2025-12-17

### 🔄 Critical Fix - Stale Element Handling
- **Dynamic DOM Querying**: Implemented a `getMessageBox()` helper that searches for the message box *every time* it's needed, rather than storing a reference.
  - Fixes the issue where the execution stuck after "Message box found" without sending.
  - Solves React "Stale Element" issues where the footer re-renders after page load.
- **Verbose Logging**: Added detailed logs for "Re-verifying message box" and text content checks to pinpoint exactly where/if the script stalls.

## [1.0.6] - 2025-12-17

### 🐛 Bug Fix
- **Message Box Detection**: Updated the message box selector logic to be multi-strategy.
  - Previous versions relied on `[data-tab="10"]` which seems to be failing for some users.
  - Now searches for `#main footer div[contenteditable="true"]` (most specific), `footer div[contenteditable="true"]`, and `div[contenteditable="true"]` generically.
  - Logs which selector successfully found the box.

## [1.0.5] - 2025-12-17

### 🔍 Debug Console & Robustness Update
- **Debug Console**: Added a hidden "Show Debug Log" terminal in the popup UI to track exactly what the extension is doing in real-time.
- **Strategy 4 (Fallback)**: Added legacy `UIEvent` simulation for Enter key press.
- **Improved Selectors**: Added `[data-testid="send"]` selector (common in testing environments).
- **Manual Text Insertion**: Using `document.execCommand('insertText')` as a robust fallback for message population if automatic URL param fails.
- **Error Visibility**: Errors are now bubbled up to the user interface instead of burying them in the console.

## [1.0.4] - 2025-12-17

### 🚀 MEGA Fix - The "Nuclear Option"
- **Comprehensive Send Strategy**: Implemented "Strategy 1-2-3" approach to guarantee message sending
  - **Strategy 1**: `insertParagraph` Input Event (Simulates native rich-text Enter)
  - **Strategy 2**: Full Keyboard Sequence (`keydown` → `keypress` → `keyup`)
  - **Strategy 3**: Aggressive Button Clicking (Targets inner icons, adds visual feedback, uses multiple click event types)
- **Aggressive Focus**: Ensures message box is strictly focused before attempting any send actions
- **Visual Feedback**: Send button flashes red briefly when clicked programmatically (helps with debugging)
- **Robustness**: Tries all strategies sequentially until one works

### 🔧 Technical Details
- Changed from single-attempt events to multi-stage fallbacks
- Added `InputEvent` simulation which bypasses some React event blockers
- Improved inner-element targeting for button clicks (specifically finding the SVG/Span)

## [1.0.3] - 2025-12-17

### 🎯 CRITICAL CHANGE - New Sending Strategy
- **Enter Key as Primary Method**: Switched from button click to Enter key for sending messages
  - More reliable and natural (simulates what real users do)
  - Keyboard events are harder for WhatsApp to block
  - Faster and simpler than button click methods
  - Button click now used only as fallback if Enter key fails

### ✨ Improvements
- **Message Verification**: Checks if message box is empty after sending to confirm success
- **Better Logging**: Shows which method successfully sent the message
- **Increased Wait Time**: 2 seconds after Enter key to ensure message is sent
- **Fallback Logic**: If Enter doesn't work, automatically tries button click

### 🔍 Why This Change?
- Button clicks were being blocked or not working properly on WhatsApp Web
- Enter key is the natural way users send messages
- More resistant to WhatsApp's anti-automation measures
- Simpler and more reliable code

## [1.0.2] - 2025-12-17

### 🎯 Critical Fix
- **Exact Send Button Selectors**: Updated selectors based on actual WhatsApp Web HTML structure
  - Added `button[data-tab="11"][aria-label="Send"]` as primary selector
  - Added `span[data-icon="wds-ic-send-filled"]` for new WhatsApp icon
  - Now tries 7 different selectors in priority order
  - Improved logic to find button element from span icons

### 🔍 Debugging Improvements
- **Console Logging**: Added detailed console logs to track automation flow
  - Shows which selector successfully found the send button
  - Logs each step: message box found, button found, message sent
  - Helps identify issues quickly via browser console (F12)

### ✨ Better Element Detection
- Improved logic to handle both BUTTON and SPAN elements
- Properly traverses DOM to find parent button from icon spans
- Reduced timeout per selector to 2 seconds for faster fallback

## [1.0.1] - 2025-12-17

### 🐛 Bug Fixes
- **Fixed Send Button Detection**: Messages are now properly sent after being typed
  - Added multiple selector strategies to find the send button
  - Implemented Enter key fallback if button is not found
  - Improved message population verification
  - Better handling of different WhatsApp Web versions and languages

### ✨ Improvements
- **Enhanced Reliability**: Multiple methods to ensure messages are sent
  - Tries 4 different selectors for the send button
  - Automatically uses Enter key if button not found
  - Verifies message is populated before sending
  - Better error logging in console

### 📝 Documentation
- Added TROUBLESHOOTING.md with detailed solutions
- Improved error messages for debugging
- Added console logging for better diagnostics

## [1.0.0] - 2025-12-17

### 🎉 Initial Release

#### ✨ Features
- **Multi-Contact Messaging**: Send messages to multiple phone numbers automatically
- **Customizable Time Delays**: Set random time gaps between messages (e.g., 2-5 seconds)
- **Real-Time Progress Tracking**: Visual progress bar and status updates
- **Auto-Save Functionality**: Automatically saves user inputs for convenience
- **Modern UI Design**: Beautiful WhatsApp-themed interface with smooth animations
- **Error Handling**: Clear error messages and validation
- **Stop/Pause Feature**: Ability to stop the automation at any time

#### 🎨 Design
- WhatsApp green gradient theme (#25D366 to #128C7E)
- Smooth animations and transitions
- Responsive layout optimized for extension popup
- Clear visual feedback for all actions
- Progress indicators with percentage display

#### 🔧 Technical
- Built with Manifest V3 (latest Chrome extension format)
- Vanilla JavaScript (no external dependencies)
- Local storage for user preferences
- Content script injection for WhatsApp Web automation
- Service worker for background tasks

#### 📦 Files Included
- `manifest.json` - Extension configuration
- `popup.html` - Main UI interface
- `popup.css` - Styling and animations
- `popup.js` - UI logic and validation
- `content.js` - WhatsApp Web automation
- `background.js` - Service worker
- `icons/` - Extension icons (16px, 48px, 128px)
- `README.md` - Full documentation
- `INSTALLATION.md` - Quick setup guide
- `OVERVIEW.md` - Feature overview

#### 🔒 Security & Privacy
- All data stored locally
- No external server communication
- No data collection or tracking
- Open source code

#### ⚠️ Known Limitations
- Requires active WhatsApp Web session
- Works only on web.whatsapp.com
- Phone numbers must include country codes
- Requires manual QR code login to WhatsApp Web

---

## Future Enhancements (Planned)

### Version 1.1.0 (Planned)
- [ ] Import contacts from CSV file
- [ ] Message templates library
- [ ] Scheduling feature (send at specific time)
- [ ] Message personalization (use contact name)
- [ ] Send images/media files
- [ ] Export send history/logs

### Version 1.2.0 (Planned)
- [ ] Dark mode toggle
- [ ] Multiple message templates
- [ ] Contact groups management
- [ ] Retry failed messages
- [ ] Statistics and analytics
- [ ] Custom delay patterns

### Version 2.0.0 (Future)
- [ ] Support for WhatsApp Business API
- [ ] Advanced scheduling options
- [ ] Message queue management
- [ ] Multi-language support
- [ ] Cloud sync for settings
- [ ] Browser notification improvements

---

## Bug Fixes & Improvements

### Version 1.0.0
- Initial stable release
- No bugs reported yet

---

## Notes

- This extension is for educational purposes
- Use responsibly and comply with WhatsApp's Terms of Service
- Not affiliated with WhatsApp or Meta
- Report issues and suggestions for future versions

---

**Last Updated**: December 17, 2025
