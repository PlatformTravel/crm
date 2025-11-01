# 📊 Special Database - CSV Import Guide

## Overview

The Special Database now supports **CSV file import** for bulk uploading phone numbers! This feature makes it easy to import large lists of numbers from Excel, Google Sheets, or any other spreadsheet software.

## 🚀 Quick Start

### Method 1: Download and Use the Template

1. Open **Manager Portal** → **Special Database**
2. Click **"Upload Numbers"** button
3. Switch to the **"Import CSV"** tab
4. Click **"Template"** button to download the CSV template
5. Open the template in Excel or Google Sheets
6. Fill in your phone numbers and data
7. Save as CSV
8. Upload the CSV file

### Method 2: Create Your Own CSV

Create a CSV file with this structure:

```csv
Phone Number,Purpose,Notes
+234 801 234 5678,VIP Clients,Important customer
+234 802 345 6789,Event Invites,Conference attendees
+234 803 456 7890,Special Campaign,Promotional offer
```

## 📋 CSV Format Requirements

### Basic Requirements
- **First column** must contain phone numbers
- **CSV format** (.csv file extension)
- **One number per row**

### Optional Features
- ✅ **Headers supported** - First row can be headers (auto-detected and skipped)
- ✅ **Additional columns** - Extra columns are ignored (only first column is imported)
- ✅ **Quotes optional** - Phone numbers can be with or without quotes

### Supported Formats

✅ **With Headers:**
```csv
Phone Number,Name,Email
+234 801 234 5678,John Doe,john@example.com
+234 802 345 6789,Jane Smith,jane@example.com
```

✅ **Without Headers:**
```csv
+234 801 234 5678
+234 802 345 6789
+234 803 456 7890
```

✅ **With Quotes:**
```csv
"Phone Number","Purpose","Notes"
"+234 801 234 5678","VIP","Important"
"+234 802 345 6789","Event","Conference"
```

## 🎯 Step-by-Step Guide

### Step 1: Prepare Your Data

**In Excel or Google Sheets:**
1. Create a new spreadsheet
2. Put phone numbers in the **first column** (Column A)
3. Format: `+234 XXX XXX XXXX` (Nigerian format)
4. Add optional headers in row 1

**Example:**
| Phone Number        | Name      | Purpose     |
|---------------------|-----------|-------------|
| +234 801 234 5678   | John Doe  | VIP Client  |
| +234 802 345 6789   | Jane Smith| Event Invite|

### Step 2: Export as CSV

**From Excel:**
1. Click **File** → **Save As**
2. Choose **CSV (Comma delimited) (*.csv)**
3. Save the file

**From Google Sheets:**
1. Click **File** → **Download**
2. Choose **Comma Separated Values (.csv)**

### Step 3: Upload to Special Database

1. Open **Manager Portal** → **Special Database**
2. Click **"Upload Numbers"** button
3. Click the **"Import CSV"** tab
4. Click **"Choose File"** and select your CSV
5. Enter a **Purpose** (e.g., "VIP Clients", "Event Campaign")
6. Add optional **Notes**
7. Review the imported numbers in the preview
8. Click **"Upload X Numbers"**

## 🎨 Features

### ✅ Auto-Detection
- **Headers** are automatically detected and skipped
- **Phone number column** is identified from first column
- **Invalid rows** are filtered out

### ✅ Preview & Edit
- See all imported numbers before uploading
- Edit numbers directly in the preview
- Count shows total numbers to be imported

### ✅ Download Template
- Pre-formatted CSV template included
- Sample data for reference
- Correct formatting examples

## 📱 Phone Number Format

### Recommended Format
```
+234 XXX XXX XXXX
```

### Also Accepts
- `+234XXXXXXXXXX` (without spaces)
- `234XXXXXXXXXX` (without +)
- `0XXXXXXXXXX` (local format)

### Examples
✅ `+234 801 234 5678`  
✅ `+2348012345678`  
✅ `2348012345678`  
✅ `08012345678`

## 💡 Tips & Best Practices

### Data Preparation
1. **Clean your data** - Remove duplicates before import
2. **Consistent format** - Use the same phone number format
3. **Test small first** - Try with 5-10 numbers first
4. **Check preview** - Always review the preview before uploading

### Large Imports
- Import works well with **hundreds or thousands** of numbers
- No specific limit on CSV file size
- Browser will show progress for large files

### Error Prevention
- ✅ Ensure first column has phone numbers
- ✅ Save as .csv (not .xlsx or .xls)
- ✅ Check for empty rows
- ✅ Remove any merged cells

## 🔧 Troubleshooting

### "No phone numbers found in CSV file"
**Cause:** CSV is empty or phone numbers are in the wrong column  
**Solution:** 
- Make sure phone numbers are in the **first column** (Column A)
- Check that there's data in the file
- Remove any empty rows at the top

### "Please select a CSV file"
**Cause:** File is not in CSV format  
**Solution:** 
- Make sure you saved as **.csv** not .xlsx or .xls
- Re-export from Excel/Sheets as CSV

### Numbers not importing correctly
**Cause:** Incorrect format or special characters  
**Solution:**
- Download and use the template
- Check phone number format
- Remove any special characters except + and spaces

### CSV shows garbled text
**Cause:** Encoding issue  
**Solution:**
- Save CSV with UTF-8 encoding
- Use "CSV UTF-8 (Comma delimited)" option in Excel

## 📊 CSV Template

Download the template from the upload dialog or create one with this format:

```csv
Phone Number,Purpose,Notes
+234 801 234 5678,VIP Clients,Important customer
+234 802 345 6789,Event Invites,Conference attendees
+234 803 456 7890,Special Campaign,Promotional offer
+234 804 567 8901,Follow-up List,Requires callback
+234 805 678 9012,New Leads,From website form
```

## 🎯 Use Cases

### Marketing Campaigns
```csv
Phone Number,Campaign,Source
+234 801 XXX XXXX,Summer Sale 2024,Facebook Ads
+234 802 XXX XXXX,Summer Sale 2024,Instagram
```

### Event Management
```csv
Phone Number,Event,RSVP Status
+234 801 XXX XXXX,Annual Conference,Confirmed
+234 802 XXX XXXX,Annual Conference,Pending
```

### Customer Segments
```csv
Phone Number,Segment,Priority
+234 801 XXX XXXX,VIP Customers,High
+234 802 XXX XXXX,Regular Customers,Medium
```

## 🚀 Advanced Usage

### Combining Manual & CSV
1. Import CSV first
2. Switch to "Manual Entry" tab
3. Add more numbers manually
4. All numbers will be uploaded together

### Re-importing After Edit
1. Import CSV
2. Review and edit in preview
3. Copy edited numbers
4. Create new CSV with changes
5. Re-import if needed

### Batch Processing
1. Split large lists into multiple CSVs
2. Import each with different purposes
3. Easier to manage and track
4. Better organization by campaign/purpose

## ✅ Summary

The CSV import feature makes bulk uploading to the Special Database fast and efficient:

- 📥 **Import from Excel/Sheets** directly
- 🎯 **Auto-detect headers** and format
- 👀 **Preview before upload** to verify
- ✏️ **Edit after import** if needed
- 📋 **Download template** for reference
- 🚀 **Upload hundreds** of numbers at once

---

**Ready to import?** Head to Manager Portal → Special Database → Upload Numbers → Import CSV!
