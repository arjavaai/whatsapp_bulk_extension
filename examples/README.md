# 📂 CSV Template Examples

This folder contains ready-to-use CSV templates for different scenarios. Download, edit with your data, and import into the extension!

## Available Templates

### 1. **basic_template.csv**
Simple template for basic orders/messages.

**Columns:** Phone, Name, OrderID

**Sample Message:**
```
Hi {Name}, your order #{OrderID} is ready!
```

---

### 2. **ecommerce_template.csv**
Full e-commerce order notifications.

**Columns:** Phone, CustomerName, OrderNumber, Product, Price, DeliveryDate

**Sample Message:**
```
Dear {CustomerName}, your order {OrderNumber} for {Product} (₹{Price}) will be delivered on {DeliveryDate}. Thank you!
```

---

### 3. **event_template.csv**
Event invitations and seating arrangements.

**Columns:** Phone, GuestName, TableNumber, ArrivalTime, MealPreference

**Sample Message:**
```
Hi {GuestName}! You're seated at {TableNumber}. Please arrive by {ArrivalTime}. Meal: {MealPreference}
```

---

## How to Use

1. **Download** the template you need
2. **Open** in Excel or Google Sheets
3. **Replace** sample data with your actual data
4. **Save** as CSV
5. **Import** into extension via "📂 Import CSV"

## Creating Your Own

Want to create a custom CSV? Follow this structure:

```csv
Phone,Variable1,Variable2,Variable3
+91XXXXXXXXXX,Value1,Value2,Value3
+91XXXXXXXXXX,Value1,Value2,Value3
```

**Rules:**
- First row = Column headers (these become {variables})
- First column = Phone numbers (with country code)
- Remaining columns = Your custom data

---

**Need more help?** Check [CSV_IMPORT_GUIDE.md](../CSV_IMPORT_GUIDE.md) in the main folder.
