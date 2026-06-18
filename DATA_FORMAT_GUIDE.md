# Dashboard Data Format Guide

## Overview
The dashboard automatically reads data from **Excel (.xlsx)** or **CSV (.csv)** files. No more hardcoding!

### How It Works
1. **Manual Upload**: Click "Import Excel / CSV" button → select your file
2. **Auto-Load**: Dashboard looks for `data.xlsx` or `data.csv` in repository root
3. **Quarter Detection**: Automatically detects Q1/Q2/Q3/Q4 based on months in data
4. **Validation**: Checks data integrity and shows warnings if issues found

---

## Excel Sheet Structure

Your Excel file must have these **sheet names** (case-insensitive):

### 1. **Leads** Sheet
Track lead sources by month

| month | website | call | whatsapp | mail | tollFree | ecommerce | facebook | total |
|-------|---------|------|----------|------|----------|-----------|----------|-------|
| January | 66 | 118 | 23 | 5 | 5 | 1 | 626 | 845 |
| February | 20 | 139 | 41 | 3 | 7 | 0 | 629 | 841 |
| March | 36 | 142 | 49 | 1 | 9 | 1 | 568 | 806 |

**Notes:**
- `month` - Required (January, February, March, April, etc.)
- `total` - Optional (auto-calculated if missing)

---

### 2. **Pipeline** Sheet
Sales funnel and conversion data

| month | conversions | value | followUp | quoteGiven | converted | quoteLive | quoteLost | saleLost | noResponse | coldEnquiry |
|-------|-------------|-------|----------|-----------|-----------|-----------|-----------|----------|-----------|------------|
| January | 13 | 2708243 | 478 | 14 | 8 | 5 | 1 | 45 | 22 | 49 |
| February | 18 | 2553303 | 613 | 23 | 13 | 10 | 0 | 45 | 26 | 93 |
| March | 13 | 7985951 | 619 | 18 | 4 | 14 | 0 | 26 | 21 | 91 |

**Notes:**
- `value` - Conversion value in rupees (₹)
- All other fields = numbers (no decimals needed)

---

### 3. **SEO** Sheet
Google Search Console metrics

| month | clicks | impressions | ctr | position |
|-------|--------|-------------|-----|----------|
| January | 1280 | 48900 | 2.6 | 10.8 |
| February | 1130 | 53300 | 2.1 | 11.0 |
| March | 1220 | 70700 | 1.7 | 8.4 |

**Notes:**
- `ctr` - Click-through rate (2.6 = 2.6%)
- `position` - Average position in search results

---

### 4. **Meta** Sheet
Facebook + Instagram ads performance

| month | spend | leads | cpl |
|-------|-------|-------|-----|
| January | 45274.54 | 626 | 72 |
| February | 39677.04 | 629 | 58 |
| March | 40034.91 | 568 | 70 |

**Notes:**
- `spend` - Ad spend in rupees (can include ₹ symbol)
- `cpl` - Cost per lead (auto-calculated if missing)

---

### 5. **Google** Sheet
Google Ads campaigns (one row per campaign per month)

| month | name | spend | interactions | ctr | cpc | conv | rating |
|-------|------|-------|-------------|-----|-----|------|--------|
| January | School Furniture - S | 12944.72 | 326 | 9.86 | 39.71 | 17 | Strong |
| January | School Furniture - Search | 3959.72 | 222 | 8.21 | 17.84 | 34 | Top |
| February | Office series Campaign | 1382.38 | 2346 | 5.60 | 0.59 | 72 | Efficient |

**Notes:**
- `month` - Required (identifies which quarter data belongs to)
- `rating` - Options: "Top", "Strong", "Efficient", "Review", "Low ROI", "No conv."
- `cpc` - Cost per click (auto-calculated if missing)

---

### 6. **Regional** Sheet
Lead distribution by region

| month | south | north | west | east |
|-------|-------|-------|------|------|
| January | 380 | 200 | 160 | 105 |
| February | 390 | 180 | 170 | 101 |
| March | 347 | 182 | 98 | 9 |

**Notes:**
- Column names must be lowercase: `south`, `north`, `west`, `east`

---

### 7. **Products** Sheet
Enquiries by product type

| month | office | gantry | hospital | education | allProds | chairs | cafe | tables |
|-------|--------|--------|----------|-----------|----------|--------|------|--------|
| January | 215 | 245 | 190 | 135 | 12 | 21 | 5 | 1 |
| February | 205 | 200 | 240 | 115 | 35 | 25 | 10 | 2 |
| March | 180 | 200 | 238 | 110 | 40 | 35 | 2 | 1 |

---

### 8. **Customers** Sheet
Customer type breakdown

| month | healthcare | officeOrg | education | reseller | individual | others | hotelCafe | architect |
|-------|-----------|-----------|-----------|----------|-----------|--------|-----------|-----------|
| January | 390 | 188 | 100 | 45 | 50 | 65 | 5 | 1 |
| February | 420 | 185 | 115 | 55 | 38 | 10 | 10 | 2 |
| March | 350 | 198 | 118 | 60 | 48 | 32 | 5 | 3 |

**Notes:**
- Use camelCase for column names: `officeOrg`, `hotelCafe`

---

### 9. **Channels** Sheet
Conversions by channel

| month | call | website | facebook | whatsapp | ecommerce |
|-------|------|---------|----------|----------|-----------|
| January | 5 | 1 | 2 | 2 | 3 |
| February | 7 | 2 | 2 | 3 | 4 |
| March | 5 | 2 | 1 | 2 | 4 |

---

### 10. **Cities** Sheet
Top cities by conversion value

| city | state | month | value |
|------|-------|-------|-------|
| Kondapur, Hyderabad | Telangana | March | 1508276 |
| Chinnasalem | Tamil Nadu | January | 1022369 |
| Chennai (multiple) | Tamil Nadu | March | 976328 |

**Notes:**
- `month` - Required
- `value` - Conversion value (can include ₹ symbol)

---

## Data Validation Rules

### ✅ **What's Allowed**
```
Month:           January, February, March, April, May, June, July, August, September, October, November, December (case-insensitive)
Numbers:         1000, 1000.5, 50% formatted as 50
Currency:        ₹50000 or 50000 (both work)
Empty cells:     OK → defaults to 0 for numbers
Decimals:        Use period (.) → 123.45 ✓
```

### ❌ **What's NOT Allowed**
```
Month:           2024-01-01, 1 (numbers), abbreviations (Jan instead of January)
Numbers:         Commas in numbers (1,000 ✗), text mixed (25abc ✗)
Decimals:        Comma separator (1.000,50 ✗)
Empty month:     Rows without month are skipped
```

---

## How to Add New Quarters

### Example: Adding Q2 (April, May, June)

1. **Open your Excel file**
2. **Add rows to each sheet** with months: April, May, June
3. **Save the file**
4. **Upload to dashboard** or commit to repository
5. ✅ **Dashboard auto-detects Q2** and adds dropdown option

```
BEFORE:  Dropdown shows: Q1 (Jan - Mar)
AFTER:   Dropdown shows: Q1 (Jan - Mar)
                        Q2 (Apr - Jun)  ← New!
```

---

## Validation Warnings

The dashboard checks your data and shows warnings like:

```
⚠️ [Leads] Row 5: Invalid month value "January-02".
⚠️ [Pipeline] Row 3: Cannot parse number for "value" (value: "abc"). Defaulted to 0.
⚠️ [Meta] Row 2: Negative number found for "spend" (-1000).
```

**What to do:**
- Check browser console (F12 DevTools) for full warnings
- Fix the issues in Excel
- Re-upload the file

---

## Tips

| ✅ DO | ❌ DON'T |
|------|---------|
| Use full month names | Use abbreviations (Jan) or numbers (1) |
| Leave empty cells as blank | Leave as "N/A" or "-" |
| Use ₹ symbol optionally | Include commas in numbers (1,000) |
| One row per month per sheet | Multiple rows for same month (merge them) |
| Include all months for a quarter | Skip months (Q1 needs Jan, Feb, Mar) |
| Test with one sheet first | Upload incomplete file |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Dashboard shows no data after upload | Check month column - must be valid month name |
| Numbers showing as 0 | Ensure no text/symbols in number fields |
| Dashboard doesn't auto-load data.xlsx | File must be in repository root (not in subdirectory) |
| Quarter dropdown not updating | Missing month data in one of the sheets |
| See many validation warnings | Check Excel for typos, especially in month names |

---

## Example File Format

Download template or create manually:
- Save as `.xlsx` (Excel) or `.csv` (Comma-Separated)
- Match sheet/column names exactly (case-insensitive)
- Include all required columns for each sheet

**For CSV:** Create separate CSV files or use one CSV with headers to identify sheet type.
