/* excel-reader.js - Read Excel files directly (Master Table Approach) */
/* 
   This reads your master Excel file directly without needing CSV export
   Just keep adding columns in Excel for new months - dashboard auto-updates!
*/

window.ExcelReader = {
  
  // Read Excel file
  async readExcelFile(filePath) {
    try {
      console.log(`📂 Reading Excel file: ${filePath}`);
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      
      // Use SheetJS library (XLSX)
      if (!window.XLSX) {
        throw new Error('SheetJS library not loaded. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"></script>');
      }
      
      const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
      console.log('✓ Excel file loaded');
      return workbook;
    } catch (error) {
      console.error('❌ Error reading Excel:', error);
      return null;
    }
  },
  
  // Extract sheet data
  getSheetData(workbook, sheetName) {
    try {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        console.warn(`⚠️ Sheet "${sheetName}" not found`);
        return [];
      }
      
      const data = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(`✓ Extracted from "${sheetName}": ${data.length} rows`);
      return data;
    } catch (error) {
      console.error(`Error reading sheet ${sheetName}:`, error);
      return [];
    }
  },
  
  // Parse master leads table
  parseLeadsTable(rawData) {
    console.log('📊 Parsing Leads table...');
    
    if (rawData.length < 2) return [];
    
    const headers = rawData[0]; // First row has headers
    const monthIndices = {};
    
    // Find which columns are months (Jan, Feb, Mar, Apr, etc.)
    headers.forEach((header, index) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (monthNames.includes(header) || monthShorts.includes(header)) {
        monthIndices[header] = index;
      }
    });
    
    console.log(`✓ Found months: ${Object.keys(monthIndices).join(', ')}`);
    
    // Extract data for each month
    const leadsData = [];
    const channelNames = ['Website', 'Call', 'Whatsapp', 'Mail', 'TollFree', 'Ecommerce', 'Facebook'];
    
    // Row 0 is total leads for the month
    // Rows 1+ are individual channels
    
    for (const [month, colIndex] of Object.entries(monthIndices)) {
      const monthData = {
        month: this.normalizeMonthName(month),
        total: rawData[0][colIndex] || 0,
        website: 0,
        call: 0,
        whatsapp: 0,
        mail: 0,
        tollFree: 0,
        ecommerce: 0,
        facebook: 0
      };
      
      // Find channel rows
      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header
        
        const channelLabel = row[0]?.toString().toLowerCase() || '';
        const value = parseFloat(row[colIndex]) || 0;
        
        if (channelLabel.includes('website')) monthData.website = value;
        if (channelLabel.includes('call')) monthData.call = value;
        if (channelLabel.includes('whatsapp')) monthData.whatsapp = value;
        if (channelLabel.includes('mail')) monthData.mail = value;
        if (channelLabel.includes('toll') || channelLabel.includes('tollfree')) monthData.tollFree = value;
        if (channelLabel.includes('ecommerce')) monthData.ecommerce = value;
        if (channelLabel.includes('facebook')) monthData.facebook = value;
      });
      
      leadsData.push(monthData);
    }
    
    return leadsData;
  },
  
  // Parse conversion/pipeline table
  parsePipelineTable(rawData) {
    console.log('📈 Parsing Pipeline table...');
    
    if (rawData.length < 2) return [];
    
    const headers = rawData[0];
    const monthIndices = {};
    
    // Find month columns
    headers.forEach((header, index) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.includes(header)) {
        monthIndices[header] = index;
      }
    });
    
    const pipelineData = [];
    
    for (const [month, colIndex] of Object.entries(monthIndices)) {
      const monthData = {
        month: this.normalizeMonthName(month),
        conversions: 0,
        value: 0,
        followUp: 0,
        quoteGiven: 0,
        converted: 0,
        quoteLive: 0,
        quoteLost: 0,
        saleLost: 0,
        noResponse: 0,
        coldEnquiry: 0
      };
      
      // Extract metrics for this month
      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        
        const metricLabel = row[0]?.toString().toLowerCase() || '';
        const value = parseFloat(row[colIndex]) || 0;
        
        if (metricLabel.includes('conversion') && !metricLabel.includes('value')) monthData.conversions = value;
        if (metricLabel.includes('conversion value') || metricLabel.includes('value')) monthData.value = value;
        if (metricLabel.includes('follow')) monthData.followUp = value;
        if (metricLabel.includes('quote given')) monthData.quoteGiven = value;
        if (metricLabel.includes('converted') && !metricLabel.includes('quote')) monthData.converted = value;
        if (metricLabel.includes('quote live')) monthData.quoteLive = value;
        if (metricLabel.includes('quote lost')) monthData.quoteLost = value;
        if (metricLabel.includes('sale lost')) monthData.saleLost = value;
        if (metricLabel.includes('no response')) monthData.noResponse = value;
        if (metricLabel.includes('cold')) monthData.coldEnquiry = value;
      });
      
      pipelineData.push(monthData);
    }
    
    return pipelineData;
  },
  
  // Parse Google Ads campaigns
  parseGoogleAdsTable(rawData) {
    console.log('🔍 Parsing Google Ads table...');
    
    if (rawData.length < 2) return {};
    
    const headers = rawData[0];
    const monthIndices = {};
    
    // Find month columns
    headers.forEach((header, index) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.includes(header)) {
        monthIndices[header] = index;
      }
    });
    
    const googleCampaigns = {};
    
    for (const [month, colIndex] of Object.entries(monthIndices)) {
      const normalizedMonth = this.normalizeMonthName(month);
      googleCampaigns[normalizedMonth] = [];
      
      // Extract campaign data
      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0 || !row[0]) return;
        
        const campaignName = row[0]?.toString().trim();
        const spend = parseFloat(row[colIndex]) || 0;
        
        // Assuming columns in order: Campaign, Spend, Interactions, CTR, CPC, Conversions
        const interactions = parseFloat(row[colIndex + 1]) || 0;
        const ctr = parseFloat(row[colIndex + 2]) || 0;
        const cpc = parseFloat(row[colIndex + 3]) || 0;
        const conversions = parseFloat(row[colIndex + 4]) || 0;
        
        if (spend > 0) {
          googleCampaigns[normalizedMonth].push({
            name: campaignName,
            spend: spend,
            interactions: interactions,
            ctr: ctr,
            cpc: cpc,
            conv: conversions
          });
        }
      });
    }
    
    return googleCampaigns;
  },
  
  // Parse Meta Ads (Facebook/Instagram)
  parseMetaAdsTable(rawData) {
    console.log('📱 Parsing Meta Ads table...');
    
    if (rawData.length < 2) return [];
    
    const headers = rawData[0];
    const monthIndices = {};
    
    headers.forEach((header, index) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.includes(header)) {
        monthIndices[header] = index;
      }
    });
    
    const metaData = [];
    
    for (const [month, colIndex] of Object.entries(monthIndices)) {
      const monthData = {
        month: this.normalizeMonthName(month),
        spend: 0,
        leads: 0,
        cpl: 0
      };
      
      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        
        const metricLabel = row[0]?.toString().toLowerCase() || '';
        const value = parseFloat(row[colIndex]) || 0;
        
        if (metricLabel.includes('spend')) monthData.spend = value;
        if (metricLabel.includes('leads')) monthData.leads = value;
        if (metricLabel.includes('cpl')) monthData.cpl = value;
      });
      
      metaData.push(monthData);
    }
    
    return metaData;
  },
  
  // Parse SEO data
  parseSEOTable(rawData) {
    console.log('🔎 Parsing SEO table...');
    
    if (rawData.length < 2) return [];
    
    const headers = rawData[0];
    const monthIndices = {};
    
    headers.forEach((header, index) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.includes(header)) {
        monthIndices[header] = index;
      }
    });
    
    const seoData = [];
    
    for (const [month, colIndex] of Object.entries(monthIndices)) {
      const monthData = {
        month: this.normalizeMonthName(month),
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0
      };
      
      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        
        const metricLabel = row[0]?.toString().toLowerCase() || '';
        const value = parseFloat(row[colIndex]) || 0;
        
        if (metricLabel.includes('click')) monthData.clicks = value;
        if (metricLabel.includes('impression')) monthData.impressions = value;
        if (metricLabel.includes('ctr')) monthData.ctr = value;
        if (metricLabel.includes('position')) monthData.position = value;
      });
      
      seoData.push(monthData);
    }
    
    return seoData;
  },
  
  // Normalize month names
  normalizeMonthName(month) {
    const monthMap = {
      'jan': 'January', 'january': 'January',
      'feb': 'February', 'february': 'February',
      'mar': 'March', 'march': 'March',
      'apr': 'April', 'april': 'April',
      'may': 'May',
      'jun': 'June', 'june': 'June',
      'jul': 'July', 'july': 'July',
      'aug': 'August', 'august': 'August',
      'sep': 'September', 'september': 'September',
      'oct': 'October', 'october': 'October',
      'nov': 'November', 'november': 'November',
      'dec': 'December', 'december': 'December'
    };
    
    return monthMap[month.toLowerCase()] || month;
  },
  
  // Main function: Load all data from Excel
  async loadFromExcel(excelFilePath, sheetConfig) {
    console.log('🚀 Loading dashboard data from Excel master file...');
    
    const workbook = await this.readExcelFile(excelFilePath);
    if (!workbook) return null;
    
    // Extract each sheet
    const leadsRaw = this.getSheetData(workbook, sheetConfig.leadsSheet || 'DM Leads');
    const pipelineRaw = this.getSheetData(workbook, sheetConfig.pipelineSheet || 'Pipeline');
    const googleRaw = this.getSheetData(workbook, sheetConfig.googleSheet || 'Google Ads');
    const metaRaw = this.getSheetData(workbook, sheetConfig.metaSheet || 'Meta');
    const seoRaw = this.getSheetData(workbook, sheetConfig.seoSheet || 'SEO');
    
    // Parse all data
    const leadsData = this.parseLeadsTable(leadsRaw);
    const pipelineData = this.parsePipelineTable(pipelineRaw);
    const googleCampaignsData = this.parseGoogleAdsTable(googleRaw);
    const metaAdsMonthly = this.parseMetaAdsTable(metaRaw);
    const seoData = this.parseSEOTable(seoRaw);
    
    console.log(`✓ Loaded data for months: ${leadsData.map(d => d.month).join(', ')}`);
    
    // Build dashboard data object
    return {
      leadsData,
      pipelineData,
      googleCampaignsData,
      metaAdsMonthly,
      seoData,
      citiesData: [],
      MONTHLY_TARGET: 5000000,
      
      getFilteredData: function(monthFilter) {
        const isQuarter = monthFilter.startsWith("All ");
        const quarter = isQuarter ? monthFilter.replace("All ", "") : "";
        
        const availableMonths = {
          'Q1': ['January', 'February', 'March'],
          'Q2': ['April', 'May', 'June'],
          'Q3': ['July', 'August', 'September'],
          'Q4': ['October', 'November', 'December']
        };
        const monthsInQuarter = isQuarter ? (availableMonths[quarter] || []) : [monthFilter];
        
        const leads = this.leadsData.filter(d => monthsInQuarter.includes(d.month));
        const totalLeads = leads.reduce((acc, curr) => acc + curr.total, 0);
        const fbLeads = leads.reduce((acc, curr) => acc + curr.facebook, 0);
        const otherLeads = totalLeads - fbLeads;
        
        const pipeline = this.pipelineData.filter(d => monthsInQuarter.includes(d.month));
        const totalConversions = pipeline.reduce((acc, curr) => acc + curr.conversions, 0);
        const totalConvValue = pipeline.reduce((acc, curr) => acc + curr.value, 0);
        const totalFollowUp = pipeline.reduce((acc, curr) => acc + curr.followUp, 0);
        const totalQuoteGiven = pipeline.reduce((acc, curr) => acc + curr.quoteGiven, 0);
        const totalConverted = pipeline.reduce((acc, curr) => acc + curr.converted, 0);
        const totalQuoteLive = pipeline.reduce((acc, curr) => acc + curr.quoteLive, 0);
        const totalQuoteLost = pipeline.reduce((acc, curr) => acc + curr.quoteLost, 0);
        const totalSaleLost = pipeline.reduce((acc, curr) => acc + curr.saleLost, 0);
        const totalNoResponse = pipeline.reduce((acc, curr) => acc + curr.noResponse, 0);
        const totalColdEnquiry = pipeline.reduce((acc, curr) => acc + curr.coldEnquiry, 0);
        
        let googleSpend = 0;
        monthsInQuarter.forEach(m => {
          const campaigns = this.googleCampaignsData[m] || [];
          googleSpend += campaigns.reduce((acc, c) => acc + c.spend, 0);
        });
        
        const meta = this.metaAdsMonthly.filter(d => monthsInQuarter.includes(d.month));
        const metaSpend = meta.reduce((acc, curr) => acc + curr.spend, 0);
        const totalSpend = googleSpend + metaSpend;
        
        const roas = totalSpend > 0 ? (totalConvValue / totalSpend) : 0;
        const convRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
        const costPerConv = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
        
        const seo = this.seoData.filter(d => monthsInQuarter.includes(d.month));
        const totalSeoClicks = seo.reduce((acc, curr) => acc + curr.clicks, 0);
        const avgSeoCtr = seo.length > 0 ? (seo.reduce((acc, curr) => acc + curr.ctr, 0) / seo.length) : 0;
        
        const targetToCompare = this.MONTHLY_TARGET * monthsInQuarter.length;
        const targetPct = targetToCompare > 0 ? (totalConvValue / targetToCompare) * 100 : 0;
        
        return {
          totalLeads,
          fbLeads,
          otherLeads,
          totalSpend,
          googleSpend,
          metaSpend,
          totalConversions,
          totalConvValue,
          roas,
          convRate,
          costPerConv,
          totalSeoClicks,
          avgSeoCtr,
          targetPct,
          funnel: {
            totalLeads,
            followUp: totalFollowUp,
            coldEnquiry: totalColdEnquiry,
            quoteGiven: totalQuoteGiven,
            quoteLive: totalQuoteLive,
            converted: totalConverted,
            saleLost: totalSaleLost,
            noResponse: totalNoResponse
          }
        };
      }
    };
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 Dashboard initializing from Excel...');
  
  try {
    // Load data from Excel file
    window.DashboardData = await window.ExcelReader.loadFromExcel(
      './Dm_Dashboard_-_Data_s_copy.xls',
      {
        leadsSheet: 'DM Leads',
        pipelineSheet: 'Pipeline',
        googleSheet: 'Google Ads',
        metaSheet: 'Meta',
        seoSheet: 'SEO'
      }
    );
    
    if (window.DashboardData) {
      console.log('✓ Dashboard data loaded from Excel');
      
      // Initialize your app
      if (window.DashboardApp) {
        window.DashboardApp.initialize();
      }
    }
  } catch (error) {
    console.error('❌ Error loading dashboard:', error);
  }
});
