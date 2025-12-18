# 🎯 Personalization Quick Reference

## Quick Start (30 seconds)

1. **Enable:** Toggle "🎯 Personalize" ON
2. **Format Data:**
   ```
   +919876543210,John,101
   +918765432109,Jane,102
   ```
3. **Write Message:**
   ```
   Hi {name}, order #{orderId} ready!
   ```
4. **Send!** ✅

---

## Syntax

### Variable Placeholder
```
{variableName}
```
✅ Use: `{name}` `{orderId}` `{amount}`  
❌ Don't use: `(name)` `[name]` `<name>`

### Data Format
```
phoneNumber,variable1,variable2,variable3
```
**Example:**
```
+919876543210,John,101,Mumbai
```

---

## Common Patterns

### 📦 Order Confirmation
```
Data: +91XXX,CustomerName,OrderID
Msg:  Hi {CustomerName}, order #{OrderID} confirmed!
```

### 💰 Payment Reminder
```
Data: +91XXX,Name,Amount,Date
Msg:  Dear {Name}, {Amount} due on {Date}
```

### 🎉 Event Invite
```
Data: +91XXX,Name,TableNo,Time
Msg:  Hi {Name}! Table {TableNo} at {Time}
```

### 📚 Class Schedule
```
Data: +91XXX,Student,Subject,Room
Msg:  {Student}: {Subject} in {Room}
```

---

## Rules

✅ **DO:**
- Use country code (+91, +1, etc.)
- Separate with commas
- Use curly braces `{}`
- Test with 2-3 contacts first

❌ **DON'T:**
- Forget the phone number
- Use spaces in variable names
- Send 100+ at once
- Skip the toggle switch

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Variables not replaced | Enable 🎯 Personalize toggle |
| Showing `{name}` literally | Check variable name spelling |
| Blank values | Add data after phone number |
| Not working at all | Refresh WhatsApp Web |

---

## Examples Library

Copy & paste these templates:

### 1. Welcome Message
```
Data: +91XXX,FirstName
Msg:  Welcome {FirstName}! Thanks for joining us.
```

### 2. Delivery Update
```
Data: +91XXX,Name,TrackingNo,ETA
Msg:  Hi {Name}, package {TrackingNo} arrives {ETA}
```

### 3. Appointment Reminder
```
Data: +91XXX,Patient,Date,Time,Doctor
Msg:  Dear {Patient}, appointment with Dr.{Doctor} on {Date} at {Time}
```

### 4. Birthday Wish
```
Data: +91XXX,Name,Age
Msg:  Happy {Age}th Birthday {Name}! 🎂🎉
```

### 5. Feedback Request
```
Data: +91XXX,Customer,Product,OrderDate
Msg:  Hi {Customer}, how was your {Product} from {OrderDate}? Rate us!
```

---

## Variable Naming Tips

✅ **Good Names:**
- `{name}` `{firstName}` `{lastName}`
- `{orderId}` `{orderNumber}` `{trackingId}`
- `{amount}` `{price}` `{total}`
- `{date}` `{time}` `{datetime}`

❌ **Bad Names:**
- `{first name}` (has space)
- `{order-id}` (has hyphen)
- `{$amount}` (has special char)
- `{1}` `{2}` (numbers only - use descriptive names)

---

## Pro Tips 💡

1. **Excel/Sheets:** Prepare data there, copy/paste directly
2. **Test First:** Send to yourself before bulk sending
3. **Keep Simple:** Max 5-7 variables per message
4. **Save Lists:** Use "📋 Contacts" to save personalized data too!
   - Example: Save `+91XXX,John,101` as "VIP Customers"
   - Reuse anytime by clicking "Use"
5. **Delays:** Use 5-10 sec delays for natural-looking sends

---

**Need more examples?** → Check [PERSONALIZATION_GUIDE.md](./PERSONALIZATION_GUIDE.md)

**Having issues?** → See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
