# 📂 CSV Import Guide - Auto-Variable Detection

## Overview

The **CSV Import** feature makes personalization incredibly easy! Simply upload a CSV file with column headers, and those headers automatically become your `{variables}`. No need to manually type data or remember variable names!

---

## How It Works

### The Magic: Column Names = Variable Names

When you import a CSV file:
1. **First row** = Column headers → Become variable names
2. **Remaining rows** = Data → Gets inserted into messages
3. **Variables** = Auto-detected from column names

**Example CSV File:**

```csv
Phone,Name,OrderID,Amount,City
+919876543210,Rahul,101,₹1500,Mumbai
+918765432109,Priya,102,₹2200,Delhi
+917654321098,Amit,103,₹1800,Bangalore
```

**Auto-Generated Variables:**
- `{Phone}` `{Name}` `{OrderID}` `{Amount}` `{City}`

---

## Step-by-Step Guide

### Step 1: Prepare Your CSV File

Create a CSV file in Excel, Google Sheets, or any spreadsheet tool:

| Phone | Name | OrderID | Amount | City |
|-------|------|---------|--------|------|
| +919876543210 | Rahul | 101 | ₹1500 | Mumbai |
| +918765432109 | Priya | 102 | ₹2200 | Delhi |
| +917654321098 | Amit | 103 | ₹1800 | Bangalore |

**Important:**
- ✅ First column MUST be phone numbers (with country code)
- ✅ First row MUST be column headers
- ✅ Save as `.csv` format

### Step 2: Import into Extension

1. Open the extension popup
2. Click **"📂 Import CSV"** button
3. Select your CSV file
4. Done! 🎉

### Step 3: Write Your Message

The extension shows you available variables. Use them in your message:

```
Hi {Name}, your order #{OrderID} of {Amount} is ready for pickup in {City}!
```

### Step 4: Send!

Click **Start** and watch personalized messages go out!

**Result:**
- Rahul: "Hi Rahul, your order #101 of ₹1500 is ready for pickup in Mumbai!"
- Priya: "Hi Priya, your order #102 of ₹2200 is ready for pickup in Delhi!"
- Amit: "Hi Amit, your order #103 of ₹1800 is ready for pickup in Bangalore!"

---

## CSV Format Examples

### Example 1: E-Commerce Orders

**customers.csv:**
```csv
Phone,CustomerName,OrderNumber,Product,Price,DeliveryDate
+919876543210,Arjun,ORD-2025-001,Laptop,₹45000,March 20
+918765432109,Kavya,ORD-2025-002,Phone,₹25000,March 21
+917654321098,Vikram,ORD-2025-003,Tablet,₹18000,March 22
```

**Message:**
```
Dear {CustomerName}, your order {OrderNumber} for {Product} (₹{Price}) will be delivered on {DeliveryDate}. Thank you for shopping with us!
```

---

### Example 2: Event Invitations

**event-guests.csv:**
```csv
Phone,GuestName,TableNumber,ArrivalTime,MealPreference
+919876543210,Neha,Table-5,7:00 PM,Vegetarian
+918765432109,Rohit,Table-12,7:30 PM,Non-Veg
+917654321098,Priya,Table-8,7:15 PM,Vegan
```

**Message:**
```
Hi {GuestName}! Welcome to our annual gala. You're seated at {TableNumber}. Please arrive by {ArrivalTime}. Meal: {MealPreference}. See you there!
```

---

### Example 3: Appointment Reminders

**appointments.csv:**
```csv
Phone,PatientName,DoctorName,Date,Time,RoomNumber
+919876543210,Amit,Dr. Sharma,March 15,10:00 AM,Room-301
+918765432109,Sunita,Dr. Patel,March 15,11:30 AM,Room-205
+917654321098,Rajesh,Dr. Kumar,March 16,09:00 AM,Room-412
```

**Message:**
```
Dear {PatientName}, reminder: Your appointment with {DoctorName} is on {Date} at {Time} in {RoomNumber}. Please arrive 10 mins early.
```

---

### Example 4: Class Schedules

**students.csv:**
```csv
Phone,StudentName,Subject,Room,Professor,Time
+919876543210,Arjun,Mathematics,Room-101,Prof. Singh,10:00 AM
+918765432109,Meera,Physics,Room-205,Prof. Reddy,11:30 AM
+917654321098,Karan,Chemistry,Lab-3,Prof. Verma,02:00 PM
```

**Message:**
```
Hi {StudentName}, your {Subject} class with {Professor} is in {Room} at {Time} today. Don't be late!
```

---

## Advanced Tips

### Tip 1: Column Names Matter!

Use clear, descriptive column names:

✅ **Good:**
- `Name`, `FirstName`, `CustomerName`
- `OrderID`, `OrderNumber`, `InvoiceNo`
- `Amount`, `TotalCost`, `Price`

❌ **Avoid:**
- `Col1`, `Col2`, `Data3` (not descriptive)
- `First Name` (spaces work but harder to read)
- Special characters like `$`, `@`, `#`

### Tip 2: Quoted Values for Commas

If your data contains commas, use quotes:

```csv
Phone,Name,Address,City
+919876543210,Rahul,"123, MG Road, Pune",Mumbai
```

The extension handles this automatically!

### Tip 3: Empty Values

Empty cells are replaced with blank text:

```csv
Phone,Name,SecondName,OrderID
+919876543210,Rahul,,101
+918765432109,Priya,Singh,102
```

Message: `Hi {Name} {SecondName}, order {OrderID}`

Results:
- "Hi Rahul , order 101" (extra space)
- "Hi Priya Singh, order 102" (perfect)

**Pro fix:** Use conditional formatting in your message or clean data beforehand.

### Tip 4: Reuse CSV Data

After importing, the data stays in the textarea. You can:
- ✅ Edit it manually
- ✅ Save it as a Contact List
- ✅ Import a different CSV to replace it

### Tip 5: Excel/Sheets Export

**From Excel:**
1. File → Save As
2. Choose "CSV (Comma delimited) (*.csv)"
3. Save

**From Google Sheets:**
1. File → Download
2. Choose "Comma Separated Values (.csv)"

---

## Troubleshooting

### Problem: "CSV must have at least a header row and one data row"

**Solution:** Your CSV is empty or has only headers. Add at least one data row.

---

### Problem: Variables showing as `{undefined}`

**Cause:** Column name in message doesn't match CSV header.

**Solution:** Check spelling and case. If CSV has `Name`, use `{Name}` not `{name}`.

---

### Problem: Phone numbers not formatted correctly

**Cause:** Phone numbers missing country code or have extra characters.

**Solution:** Format in CSV as:
```csv
Phone
+919876543210
+918765432109
```

Not:
```csv
Phone
9876543210
(+91) 9876543210
```

---

### Problem: Data has weird characters after import

**Cause:** CSV encoding issue.

**Solution:**
1. Open CSV in Notepad
2. Save As → Choose "UTF-8" encoding
3. Re-import

---

## CSV Info Box

After importing, you'll see a blue info box:

```
📊 CSV Imported! 15 contacts
Available variables: {Name} {OrderID} {Amount} {City}
```

This confirms:
- ✅ How many contacts were imported
- ✅ Which variables you can use in your message

---

## Comparison: Manual vs CSV Import

| Task | Manual Method | CSV Import |
|------|---------------|------------|
| **Data Entry** | Type each line manually | One-click import |
| **Variable Names** | Remember and type | Auto-detected |
| **100 Contacts** | ~30 minutes | ~10 seconds |
| **Error Rate** | High (typos) | Low (validated) |
| **Scalability** | Difficult | Unlimited |
| **Reusability** | Copy-paste | Load file |

---

## Best Practices

1. **Keep Headers Simple** - `Name` is better than `Customer_First_Name_2025`
2. **Test First** - Import 2-3 rows first, test, then import full file
3. **Backup Your CSV** - Keep original file safe
4. **Use Templates** - Create CSV templates for recurring campaigns
5. **Clean Data** - Remove empty rows/columns before importing

---

## Example CSV Templates

### Template 1: Basic Customer Orders
```csv
Phone,Name,OrderID
+91XXXXXXXXXX,CustomerName,12345
```

### Template 2: E-Commerce Full
```csv
Phone,Name,OrderID,Product,Amount,Date,Status
+91XXXXXXXXXX,Name,ID,ProductName,Price,Date,Shipped
```

### Template 3: Event Management
```csv
Phone,Guest,Table,Time,Meal
+91XXXXXXXXXX,GuestName,TableNo,ArrivalTime,MealType
```

### Template 4: Appointments
```csv
Phone,Patient,Doctor,Date,Time,Room
+91XXXXXXXXXX,PatientName,DoctorName,AppDate,AppTime,RoomNo
```

---

## FAQ

**Q: Can I import Excel files?**
A: No, convert to CSV first (File → Save As → CSV).

**Q: Maximum number of rows?**
A: No hard limit, but recommend < 500 for performance.

**Q: Can I edit CSV data after import?**
A: Yes! It's in the textarea - edit freely.

**Q: Do column names need to match exactly?**
A: Yes! `{Name}` ≠ `{name}`. Case-sensitive.

**Q: Can I import multiple CSVs?**
A: Yes, but each import **replaces** previous data.

**Q: Can I save imported data as Contact List?**
A: Yes! After import, click "📋 Contacts" → "+ New List".

---

## Video Tutorial

[Create a quick demo video showing:]
1. Creating CSV in Excel
2. Clicking "Import CSV"
3. Auto-variable detection
4. Writing message with variables
5. Sending personalized messages

---

**Happy Importing! 📂✨**

For more help, check:
- [README.md](./README.md) - Main documentation
- [PERSONALIZATION_GUIDE.md](./PERSONALIZATION_GUIDE.md) - Personalization basics
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Copy-paste templates
