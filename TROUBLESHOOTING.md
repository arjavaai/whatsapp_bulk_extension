# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Messages are typed but not sent

**Problem**: The extension opens the chat and types the message, but doesn't click the send button.

**Solutions**:

1. **Check WhatsApp Web Language**
   - The send button label changes based on your WhatsApp language
   - The extension now tries multiple selectors to find the send button
   - If it still fails, check the browser console (F12) for error messages

2. **Increase Wait Time**
   - WhatsApp Web might be loading slowly
   - The extension now waits 2 seconds for the message to populate
   - If you have a slow connection, you may need to increase this

3. **Check Browser Console**
   - Press F12 to open Developer Tools
   - Go to the Console tab
   - Look for any error messages from the extension
   - Share these errors for better debugging

4. **Reload the Extension**
   - Go to `chrome://extensions/`
   - Find "WhatsApp Message Automator"
   - Click the reload icon (circular arrow)
   - Refresh WhatsApp Web page
   - Try again

5. **Manual Test**
   - Try sending a message manually on WhatsApp Web
   - If manual sending works, the extension should work too
   - If manual sending fails, check your internet connection

### Issue: Extension not loading

**Solutions**:
- Enable Developer Mode in `chrome://extensions/`
- Make sure all files are in the WP AUTOMATE folder
- Check for error messages in the extensions page
- Try removing and re-adding the extension

### Issue: "Please open WhatsApp Web first" error

**Solutions**:
- Navigate to https://web.whatsapp.com
- Make sure you're logged in (scan QR code)
- Wait for WhatsApp to fully load
- Then click the extension icon

### Issue: Numbers not recognized

**Solutions**:
- Always include country code (e.g., +1, +91, +44)
- Remove any spaces or special characters
- Format: +1234567890 (no spaces, no dashes)
- One number per line

### Issue: Messages sending too fast

**Solutions**:
- Increase the time gap in the extension
- Recommended: 5-10 seconds between messages
- This helps avoid being flagged by WhatsApp

### Issue: Some messages fail to send

**Solutions**:
- Check if the phone number is valid
- Make sure the number has WhatsApp
- Check your internet connection
- The extension will continue with the next number even if one fails

## Debug Mode

To see detailed logs:

1. Open WhatsApp Web
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Click the extension and start sending
5. Watch for console messages showing:
   - Which selector found the send button
   - If the Enter key fallback was used
   - Any errors that occurred

## Updated Features (v1.0.1)

The extension now includes:

✅ **Multiple Send Button Selectors**
- Tries 4 different ways to find the send button
- Works with different WhatsApp Web versions
- Works with different languages

✅ **Enter Key Fallback**
- If send button is not found, uses Enter key
- More reliable message sending
- Works even if WhatsApp UI changes

✅ **Better Message Population**
- Checks if message was auto-populated
- Manually sets message if needed
- Triggers proper events for WhatsApp

✅ **Improved Error Handling**
- Better console logging
- More detailed error messages
- Continues even if one message fails

## Still Having Issues?

1. **Check the Console**
   - Open Developer Tools (F12)
   - Look for error messages
   - Note which selector is being used

2. **Test with One Number**
   - Try sending to just one number first
   - See if it works before bulk sending

3. **Update the Extension**
   - Make sure you have the latest version
   - Reload the extension from chrome://extensions/

4. **Check WhatsApp Status**
   - Make sure WhatsApp Web is working normally
   - Try sending a manual message first
   - Check if WhatsApp has any service issues

## Technical Details

### Send Button Selectors (in order of priority):

1. `button[aria-label*="Send"]` - Standard send button
2. `button[data-tab="11"]` - WhatsApp's data attribute
3. `span[data-icon="send"]` - Send icon span
4. `button span[data-icon="send"]` - Send icon inside button

### Fallback Method:

If none of the above work, the extension:
- Focuses on the message box
- Simulates pressing Enter key
- This works in most cases where the button isn't found

### Timing:

- Wait 2 seconds for message to populate
- Wait 1.5 seconds after sending
- These can be adjusted if needed

## Need More Help?

1. Check the README.md for general usage
2. Review the INSTALLATION.md for setup issues
3. Look at the code in content.js to understand how it works
4. Check browser console for detailed error messages

---

**Last Updated**: December 17, 2025 (v1.0.1)
