# Testing Checklist for Dynamic Personalization Feature

## Pre-Launch Testing

### ✅ Basic Functionality
- [ ] Extension loads without errors in Chrome
- [ ] Popup opens correctly
- [ ] All UI elements are visible and styled properly

### ✅ Personalization Toggle
- [ ] Toggle switch works (can turn on/off)
- [ ] Help text appears when toggle is ON
- [ ] Help text disappears when toggle is OFF
- [ ] Placeholder text changes based on toggle state
- [ ] Toggle state is saved and persists after closing popup

### ✅ Data Parsing
- [ ] Single variable works: `+919876543210,John`
- [ ] Multiple variables work: `+919876543210,John,101,Delhi`
- [ ] Variable replacement works in message template
- [ ] Empty variables don't break functionality
- [ ] Special characters in variables work correctly

### ✅ Message Sending (Normal Mode)
- [ ] Sends to single number
- [ ] Sends to multiple numbers
- [ ] Delay works correctly
- [ ] Progress bar updates
- [ ] Status panel appears on WhatsApp
- [ ] Can stop mid-execution

### ✅ Message Sending (Personalization Mode)
- [ ] Variables are correctly replaced
- [ ] Each contact receives personalized message
- [ ] Messages with multiple variables work
- [ ] Messages with same variable used multiple times work
- [ ] Empty variables don't crash the extension

### ✅ Edge Cases
- [ ] What if user forgets to add comma separator?
- [ ] What if variable name has typo in message?
- [ ] What if more variables in message than in data?
- [ ] What if more data columns than variables in message?
- [ ] What if phone number is missing?

### ✅ Contact Lists Integration
- [ ] Contact lists still work in normal mode
- [ ] Contact lists work in personalization mode
- [ ] Can save personalized contact data
- [ ] Can reuse personalized contact data

### ✅ UI/UX
- [ ] Toggle animation is smooth
- [ ] Help text is readable and helpful
- [ ] Code examples are clear
- [ ] All colors match WhatsApp theme

## Test Scenarios

### Scenario 1: Simple Personalization
**Input:**
```
+919876543210,Rahul
+918765432109,Priya
```
**Message:**
```
Hello {name}, welcome!
```
**Expected Result:**
- Rahul receives: "Hello Rahul, welcome!"
- Priya receives: "Hello Priya, welcome!"

---

### Scenario 2: Multiple Variables
**Input:**
```
+919876543210,Rahul,101,Mumbai
+918765432109,Priya,102,Delhi
```
**Message:**
```
Hi {name}, order #{id} will be delivered to {city}
```
**Expected Result:**
- Rahul: "Hi Rahul, order #101 will be delivered to Mumbai"
- Priya: "Hi Priya, order #102 will be delivered to Delhi"

---

### Scenario 3: Repeated Variable
**Input:**
```
+919876543210,John
```
**Message:**
```
Hi {name}, nice to meet you {name}!
```
**Expected Result:**
- "Hi John, nice to meet you John!"

---

### Scenario 4: Missing Variable Data
**Input:**
```
+919876543210,John
```
**Message:**
```
Hi {name}, your order {orderId} is ready
```
**Expected Result:**
- "Hi John, your order  is ready" (blank space where orderId should be)

---

## Manual Testing Steps

1. **Load Extension:**
   ```
   1. Go to chrome://extensions/
   2. Enable Developer Mode
   3. Load unpacked extension
   4. Verify no errors in console
   ```

2. **Test Toggle:**
   ```
   1. Open popup
   2. Click personalization toggle
   3. Verify help text appears
   4. Close and reopen popup
   5. Verify toggle state is saved
   ```

3. **Test Basic Send:**
   ```
   1. Open WhatsApp Web
   2. Disable personalization
   3. Add 2 test numbers (your own)
   4. Add simple message
   5. Click Start
   6. Verify messages sent
   ```

4. **Test Personalized Send:**
   ```
   1. Enable personalization
   2. Add: +YourNumber,YourName,123
   3. Message: "Hi {name}, order {id}"
   4. Click Start
   5. Verify personalized message received
   ```

## Known Issues to Watch For

- [ ] WhatsApp Web UI changes breaking selectors
- [ ] Rate limiting from WhatsApp
- [ ] Special characters causing issues
- [ ] Long variable values breaking layout
- [ ] Very long messages being truncated

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Brave (if applicable)

## Performance Testing

- [ ] Test with 5 contacts
- [ ] Test with 20 contacts
- [ ] Test with 50 contacts
- [ ] Monitor memory usage
- [ ] Check for memory leaks

## Final Checks Before Release

- [ ] Version bumped to 3.2.0
- [ ] README updated
- [ ] PERSONALIZATION_GUIDE.md created
- [ ] All documentation is accurate
- [ ] No console errors or warnings
- [ ] Extension icon loads properly
- [ ] All files committed to Git

---

**Testing Date:** _____________

**Tested By:** _____________

**Status:** [ ] PASS  [ ] FAIL

**Notes:**
