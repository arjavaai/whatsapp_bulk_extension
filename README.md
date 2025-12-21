# WhatsApp Message Automator

A Chrome extension to automate sending WhatsApp messages to multiple contacts with customizable time delays and dynamic personalization.

## Features

✨ **Easy to Use**: Simple and intuitive interface  
📱 **Multiple Contacts**: Send messages to multiple phone numbers  
⏰ **Message Scheduling**: Schedule campaigns for future sending with countdown timer (NEW in v3.5!)  
🌐 **Auto-Open WhatsApp Web**: Automatically opens WhatsApp Web if not already open (NEW in v3.5!)  
📝 **Message Templates**: Save and reuse frequently used messages  
📂 **CSV Import with Auto-Variables**: Upload CSV, column names become `{variables}`  
🎯 **Dynamic Personalization**: Send customized messages with variables  
📋 **Contact Lists**: Save and reuse contact groups  
⏱️ **Custom Delays**: Set random time gaps between messages (e.g., 2-5 seconds)  
📊 **Progress Tracking**: Real-time progress updates with visual indicators  
🎨 **Modern UI**: Beautiful, WhatsApp-themed interface  
💾 **Auto-Save**: Automatically saves your inputs for next time  

## Installation

1. **Download the Extension**
   - Download or clone this repository to your computer

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `WP AUTOMATE` folder
   - The extension icon should appear in your Chrome toolbar

## How to Use

### Basic Mode

1. **Open WhatsApp Web**
   - Go to [web.whatsapp.com](https://web.whatsapp.com)
   - Scan the QR code to log in

2. **Click the Extension Icon**
   - Click the WhatsApp Automator icon in your Chrome toolbar
   - The popup will open

3. **Enter Details**
   - **Phone Numbers**: Enter phone numbers (one per line) with country code
     ```
     +919876543210
     +918765432109
     +917654321098
     ```
   - **Message**: Type the message you want to send
   - **Time Gap**: Set the delay range (e.g., Min: 2, Max: 5 seconds)

4. **Start Sending**
   - Click "▶ Start"
   - Watch the progress in real-time
   - You can stop at any time by clicking "⏹ Stop"

### 📂 CSV Import with Auto-Variables (EASIEST WAY!)

The fastest way to send personalized messages - just upload a CSV file!

1. **Prepare CSV File** (in Excel or Google Sheets)
   
   | Phone | Name | OrderID | Amount |
   |-------|------|---------|--------|
   | +919876543210 | Rahul | 101 | ₹1500 |
   | +918765432109 | Priya | 102 | ₹2200 |

2. **Click "📂 Import CSV"**
   - Select your CSV file
   - Column names automatically become `{variables}`!
   - No manual typing needed ✨

3. **Write Message Using Column Names**
   ```
   Hi {Name}, your order #{OrderID} of {Amount} is ready!
   ```

4. **Send!**
   - Rahul: "Hi Rahul, your order #101 of ₹1500 is ready!"
   - Priya: "Hi Priya, your order #102 of ₹2200 is ready!"

📖 **[Complete CSV Import Guide](./CSV_IMPORT_GUIDE.md)** for templates and examples.

### 🎯 Personalization Mode (Manual Entry)

Send customized messages with unique data for each contact!

1. **Enable Personalization**
   - Toggle the "🎯 Personalize" switch

2. **Format Your Data**
   - Add variables after each phone number, separated by commas:
     ```
     +919876543210,John,101
     +918765432109,Jane,102
     +917654321098,Mike,103
     ```

3. **Use Variables in Your Message**
   - Write your message using `{variableName}` placeholders:
     ```
     Hi {name}, your order #{orderId} is ready for pickup!
     ```

4. **Send!**
   - Each contact will receive a personalized message
   - John: "Hi John, your order #101 is ready for pickup!"
   - Jane: "Hi Jane, your order #102 is ready for pickup!"

📖 **[Read the Complete Personalization Guide](./PERSONALIZATION_GUIDE.md)** for detailed examples and best practices.

### 📋 Contact Lists

Save frequently used contact groups for quick access!

1. **Click "📋 Contacts"**
   - A panel will appear showing your saved lists

2. **Create a New List**
   - Click "+ New List"
   - Enter a name (e.g., "Team", "Clients", "Family")
   - Add phone numbers (one per line)
   - **Pro Tip:** You can save personalized data too!
     ```
     +919876543210,John,101
     +918765432109,Jane,102
     ```
   - Click "💾 Save List"

3. **Use a Saved List**
   - Click "Use" next to any saved list
   - Numbers (and personalized data) will be automatically filled in
   - If you saved personalized data, remember to enable "🎯 Personalize" toggle!

4. **Delete a List**
   - Click the "×" button next to any list

**✨ Best Practice:** Create separate lists for different campaigns:
- "Regular Customers" (simple phone numbers)
- "VIP Clients" (with names and order history)
- "Event Attendees" (with table numbers and times)

### 📝 Message Templates

Save frequently used messages and never type the same thing twice!

1. **Click "📝 Templates"**
   - A panel will appear showing your saved templates

2. **Create a New Template**
   - Click "+ New Template"
   - Enter a name (e.g., "Order Confirmation", "Event Invite", "Follow-up")
   - Write your message (can include {variables}!)
   ```
   Hi {name}, your order #{orderId} is confirmed! Expected delivery: {date}
   ```
   - Click "💾 Save Template"

3. **Use a Saved Template**
   - Click "Use" next to any template
   - Message will be automatically filled
   - Works perfectly with personalization!

4. **Delete a Template**
   - Click the "×" button next to any template

**💡 Pro Tips:**
- Create templates for different campaigns (orders, events, reminders)
- Use {variables} in templates for maximum flexibility
- Templates work seamlessly with Contact Lists and CSV Import


## Important Notes

⚠️ **Requirements**:
- You must be logged into WhatsApp Web
- Phone numbers must include country code (e.g., +91 for India, +1 for USA)
- Keep the WhatsApp Web tab active while sending

⚠️ **Best Practices**:
- Don't send too many messages at once to avoid being flagged
- Use reasonable time delays (recommended: 3-10 seconds)
- Test with 1-2 numbers first
- Make sure numbers are correct before sending
- Start with small batches (10-20 messages) and increase gradually

⚠️ **Limitations**:
- Works only on WhatsApp Web
- Requires active internet connection
- Numbers must be valid WhatsApp numbers

## Troubleshooting

**Extension not working?**
- Make sure you're on web.whatsapp.com
- Refresh the WhatsApp Web page
- Check if you're logged in
- Reload the extension from chrome://extensions/

**Messages not sending?**
- Verify phone numbers have country codes
- Check your internet connection
- Make sure WhatsApp Web is fully loaded
- Try increasing the time delay

**Personalization not working?**
- Ensure "🎯 Personalize" toggle is enabled
- Check variable names match in both data and message
- Use curly braces: `{name}` not `(name)` or `[name]`
- See [PERSONALIZATION_GUIDE.md](./PERSONALIZATION_GUIDE.md) for help

**Error messages?**
- Read the error message carefully
- Make sure all fields are filled correctly
- Check the Debug Log for detailed information

## Privacy & Security

🔒 **Your Data is Safe**:
- All data is stored locally on your device
- No data is sent to external servers
- The extension only accesses WhatsApp Web
- Open source - you can review the code

## Version History

**Current Version**: 3.5.0

### v3.5.0 (Latest)
- ⏰ NEW: Message Scheduling with countdown timer
- 📅 Schedule campaigns for future sending
- 🌐 Auto-Open WhatsApp Web if not already open
- ⏲️ Real-time countdown display
- 🛑 Cancel scheduled sends anytime
- 💡 Smart validation prevents past scheduling

### v3.4.0
- 📝 NEW: Message Templates
- 💾 Save and reuse frequently used messages
- 🔄 Templates work with personalization variables
- 📋 Quick access via "📝 Templates" button
- ✨ Preview snippets in templates list

### v3.3.0
- 📂 NEW: CSV Import with Auto-Variable Detection
- 🎯 Column names automatically become `{variables}`
- 📊 Visual CSV info display with stats
- 🔧 Enhanced CSV parsing (handles quotes, commas)
- 📝 Comprehensive CSV import guide

### v3.2.0
- ✨ NEW: Dynamic Personalization with variables
- 📝 Complete personalization guide
- 🎨 Enhanced UI with toggle switches
- 🐛 Bug fixes and improvements

### v3.1.0
- 📋 Contact Lists feature
- 💾 Save and reuse contact groups
- 🎨 Improved UI/UX

### v3.0.0
- 🚀 Complete rewrite for reliability
- ⚡ Faster message sending
- 📊 Floating status panel on WhatsApp
- 🐛 Major bug fixes

## Additional Resources

- [📖 Personalization Guide](./PERSONALIZATION_GUIDE.md) - Complete guide with examples
- [📋 Installation Guide](./INSTALLATION.md) - Detailed installation steps
- [🔧 Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [📝 Changelog](./CHANGELOG.md) - Full version history

## License

This project is for educational purposes. Use responsibly and in accordance with WhatsApp's Terms of Service.

---

**Disclaimer**: This extension is not affiliated with, endorsed by, or connected to WhatsApp or Meta. Use at your own risk and ensure compliance with WhatsApp's terms of service.