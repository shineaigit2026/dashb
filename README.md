# Digital Market Dashboard

A powerful dashboard application that transforms Excel data into actionable market insights. This tool helps you analyze digital market trends, performance metrics, and key indicators in an intuitive, interactive interface.

## 🎯 Overview

The Digital Market Dashboard processes Excel inputs and converts raw data into meaningful visualizations and insights. Whether you're tracking market trends, monitoring performance KPIs, or analyzing competitive data, this dashboard provides real-time insights at your fingertips.

## ✨ Features

- **Excel Integration** - Automatically reads `data.xlsx` or `data.csv` directly from the repository.
- **Data Validation** - Automate error checking for months and numeric values.
- **Quarterly View** - Filter data by quarters (Q1, Q2, Q3, Q4) and individual months.
- **Interactive Dashboards** - Real-time visualizations and Chart.js charts.
- **Market Insights** - Generates action priorities and findings dynamically.

---

## 🚀 Quick Start

### 1. Run the Dashboard locally
Due to browser security regulations (Same-Origin Policy), modern browsers block fetching local files (like `data.xlsx` or `data.csv`) when opening the HTML file directly via double-clicking (`file://` protocol). 

To load Excel/CSV files automatically:
1. Host the project directory on a local web server, or
2. Use an editor extension like VS Code's **Live Server** to run it.
3. Open it on `http://localhost:...`.

*Note: If opened directly via `file://`, the dashboard will display a warning banner and gracefully fallback to default embedded data in `js/data.js` to prevent crashes.*

### 2. Update Dashboard Data
You do not need to manually upload files through the dashboard UI. Simply add or update your Excel workbook (`data.xlsx`) or CSV (`data.csv`) at the root of the repository, commit, and push it. The dashboard will automatically read the committed file and refresh all charts and target metrics.

---

## 📊 Excel File Format Specification

For the dashboard to automatically load and parse your Excel sheet (`data.xlsx`), structure your workbook with the following sheets and column headers:

### Sheet 1: `Leads`
Contains monthly lead counts by channel.
- **Columns**: `Month`, `Website`, `Call`, `WhatsApp`, `Mail`, `Toll Free`, `Ecommerce`, `Facebook`, `Total`
- **Example**: `January | 66 | 118 | 23 | 5 | 5 | 1 | 626 | 845`

### Sheet 2: `Pipeline` (or `Funnel`)
Contains CRM stage counts and closed deal values.
- **Columns**: `Month`, `Conversions`, `Value`, `Follow Up`, `Quote Given`, `Converted`, `Quote Live`, `Quote Lost`, `Sale Lost`, `No Response`, `Cold Enquiry`
- **Example**: `January | 13 | 2708243 | 478 | 14 | 8 | 5 | 1 | 45 | 22 | 49`

### Sheet 3: `SEO`
Contains Google Search Console impressions and clicks.
- **Columns**: `Month`, `Clicks`, `Impressions`, `CTR`, `Position`

### Sheet 4: `Meta` (or `Meta Ads`)
Contains Facebook and Instagram monthly spend and CPL.
- **Columns**: `Month`, `Spend`, `Leads`, `CPL`

### Sheet 5: `Google` (or `Google Campaigns`)
Contains Google Ads campaigns metrics.
- **Columns**: `Month`, `Campaign`, `Spend`, `Interactions`, `CTR`, `CPC`, `Conversions`

### Sheet 6: `Cities`
Contains city-wise conversion values.
- **Columns**: `City`, `State`, `Month`, `Value`

### Sheet 7: `Regional`
Contains regional lead distribution.
- **Columns**: `Month`, `South`, `North`, `West`, `East`

### Sheet 8: `Products`
Contains product inquiries counts.
- **Columns**: `Month`, `Office`, `Gantry`, `Hospital`, `Education`, `All Prods`, `Chairs`, `Café`, `Tables`

### Sheet 9: `Customers`
Contains customer type sectors.
- **Columns**: `Month`, `Healthcare`, `Office/Org`, `Education`, `Reseller`, `Individual`, `Others`, `Hotel/Café`, `Architect`

### Sheet 10: `Channels`
Contains channel conversions counts.
- **Columns**: `Month`, `Call`, `Website`, `Facebook`, `WhatsApp`, `Ecommerce`

---

## 🛠️ Technology Stack

- **Frontend** - Vanilla HTML5, CSS3, ES6 JavaScript.
- **Charts** - Chart.js (CDN).
- **Excel Parser** - SheetJS (CDN).
