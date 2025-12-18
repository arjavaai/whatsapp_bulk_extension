# 🎯 Dynamic Personalization Guide

## What is Dynamic Personalization?

Dynamic Personalization allows you to send customized messages to each contact by inserting unique data (like names, order IDs, amounts, etc.) into a message template. Instead of sending the same generic message to everyone, each person receives a personalized version!

---

## How to Use

### Step 1: Enable Personalization Mode
1. Open the extension popup
2. Click the **"🎯 Personalize"** toggle switch
3. The help text will appear showing you the format

### Step 2: Prepare Your Data

Format your phone numbers with variables separated by commas:

```
+919876543210,John,101
+918765432109,Jane,102
+917654321098,Mike,103
```

**Format Structure:**
```
phoneNumber,variable1,variable2,variable3,...
```

### Step 3: Write Your Message Template

Use `{variableName}` to insert personalized data:

```
Hi {name}, your order #{orderId} is ready for pickup!
```

### Step 4: Send!

Click **Start** and watch as each contact receives their personalized message!

---

## Examples

### Example 1: Customer Orders

**Input Data:**
```
+919876543210,Rahul,12345
+918765432109,Priya,12346
+917654321098,Amit,12347
```

**Message Template:**
```
Hello {customerName}, your order #{orderNumber} has been dispatched and will arrive by tomorrow. Thank you for shopping with us!
```

**Result:**
- Rahul receives: "Hello Rahul, your order #12345 has been dispatched..."
- Priya receives: "Hello Priya, your order #12346 has been dispatched..."
- Amit receives: "Hello Amit, your order #12347 has been dispatched..."

---

### Example 2: Payment Reminders

**Input Data:**
```
+919876543210,Neha,₹5000,March 15
+918765432109,Vikram,₹3500,March 20
```

**Message Template:**
```
Dear {name}, this is a reminder that your payment of {amount} is due on {dueDate}. Please make the payment at your earliest convenience.
```

**Result:**
- Neha receives: "Dear Neha, this is a reminder that your payment of ₹5000 is due on March 15..."
- Vikram receives: "Dear Vikram, this is a reminder that your payment of ₹3500 is due on March 20..."

---

### Example 3: Event Invitations

**Input Data:**
```
+919876543210,Arjun,Table 5,7:00 PM
+918765432109,Kavya,Table 12,7:30 PM
```

**Message Template:**
```
Hi {guestName}! You're invited to our annual gala. Your seat is at {tableNumber} and the event starts at {time}. Looking forward to seeing you!
```

---

## Best Practices

### ✅ DO:
- Use meaningful variable names (e.g., `{name}`, `{orderId}`, `{amount}`)
- Keep variable names simple and easy to remember
- Test with 2-3 contacts first before sending to a large list
- Double-check your CSV data for accuracy

### ❌ DON'T:
- Use special characters in variable names (only letters, numbers)
- Forget to include the phone number as the first column
- Mix personalized and non-personalized data in the same batch

---

## Troubleshooting

**Q: My variables aren't being replaced!**
- Make sure you've enabled the "🎯 Personalize" toggle
- Check that your variable names in the message match exactly (case-sensitive)
- Ensure you're using curly braces: `{name}` not `(name)` or `[name]`

**Q: What if I have fewer variables than placeholders?**
- Empty placeholders will be replaced with blank text
- Example: If you use `{name}` but don't provide a name, it will show as blank

**Q: Can I use the same variable multiple times?**
- Yes! `Hi {name}, welcome back {name}!` works perfectly

**Q: What's the maximum number of variables I can use?**
- There's no hard limit, but we recommend keeping it under 10 for clarity

---

## 💾 Saving Personalized Contact Lists

**Great news!** You can save your personalized data as reusable contact lists!

### How to Save

1. **Click "📋 Contacts"** button
2. **Click "+ New List"**
3. **Enter a name** (e.g., "VIP Customers" or "March Orders")
4. **Add your personalized data:**
   ```
   +919876543210,John,101,Mumbai
   +918765432109,Jane,102,Delhi
   +917654321098,Mike,103,Bangalore
   ```
5. **Click "💾 Save List"**

### How to Reuse

1. **Click "📋 Contacts"**
2. **Click "Use"** next to your saved list
3. **Enable "🎯 Personalize"** toggle (important!)
4. **Write your message template** with variables
5. **Send!**

### Example Use Case

**Save this list as "Monthly Orders":**
```
+919876543210,Rahul,Order-001,₹1200
+918765432109,Priya,Order-002,₹850
+917654321098,Amit,Order-003,₹2100
```

**Next month, reuse it with:**
```
Hi {name}, your monthly statement for {orderId} (₹{amount}) is ready!
```

**Benefits:**
- ✅ No need to re-enter data every time
- ✅ Perfect for recurring campaigns
- ✅ Keep different customer segments organized
- ✅ Mix and match lists with different messages

---

## CSV Import Tip

You can prepare your data in Excel/Google Sheets:

| Phone | Name | OrderID | Amount |
|-------|------|---------|--------|
| +919876543210 | John | 101 | ₹500 |
| +918765432109 | Jane | 102 | ₹750 |

Then copy and paste the data directly into the extension (without headers).

---

## Advanced: Multiple Languages

Personalization works with ANY language:

**Hindi:**
```
नमस्ते {name}, आपका ऑर्डर {orderId} तैयार है!
```

**Spanish:**
```
Hola {name}, tu pedido {orderId} está listo!
```

---

**Happy Personalizing! 🎉**

For more help, check out the main [README.md](./README.md)
