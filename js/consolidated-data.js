/**
 * CONSOLIDATED DATA LOADER
 * Supports both multi-sheet and single consolidated table formats
 * Auto-detects format and aggregates data intelligently
 */

class ConsolidatedDataLoader {
  constructor() {
    this.data = null;
    this.format = null; // 'multi-sheet' or 'consolidated'
    this.metrics = {};
    this.monthlyData = {};
  }

  /**
   * Load and parse Excel data from workbook
   */
  async loadFromWorkbook(workbook) {
    try {
      // Try consolidated format first (faster)
      if (workbook.SheetNames.includes('KPI_Metrics') || 
          workbook.SheetNames.includes('Summary') ||
          workbook.SheetNames.includes('Consolidated')) {
        
        this.format = 'consolidated';
        return this.parseConsolidatedFormat(workbook);
      }
      
      // Fall back to multi-sheet format
      this.format = 'multi-sheet';
      return this.parseMultiSheetFormat(workbook);
    } catch (error) {
      console.error('Error loading consolidated data:', error);
      throw error;
    }
  }

  /**
   * Parse single consolidated table (KPI_Metrics sheet)
   * Expected columns: Month, Leads, Spend, Conversions, Value, CPL, CPC, TargetHit
   */
  parseConsolidatedFormat(workbook) {
    const summarySheetName = workbook.SheetNames.find(name => 
      ['KPI_Metrics', 'Summary', 'Consolidated', 'Dashboard'].includes(name)
    );
    
    if (!summarySheetName) throw new Error('Consolidated sheet not found');

    const sheet = workbook.Sheets[summarySheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    this.monthlyData = {};
    
    data.forEach(row => {
      const month = row['Month'] || row['month'];
      if (!month) return;

      this.monthlyData[month] = {
        month: month,
        leads: parseFloat(row['Leads'] || 0),
        spend: parseFloat(row['Spend'] || row['Total Spend'] || 0),
        conversions: parseFloat(row['Conversions'] || 0),
        value: parseFloat(row['Value'] || row['Conversion Value'] || 0),
        cpl: parseFloat(row['CPL'] || row['Cost Per Lead'] || 0),
        cpc: parseFloat(row['CPC'] || row['Cost Per Click'] || 0),
        targetHit: row['Target Hit'] || row['TargetHit'] || '-'
      };
    });

    return this.aggregateMetrics();
  }

  /**
   * Parse multi-sheet format (original dashboard format)
   * Uses existing Leads, Pipeline, Meta, Google sheets
   */
  parseMultiSheetFormat(workbook) {
    const leadsData = this.parseLeadsSheet(workbook);
    const pipelineData = this.parsePipelineSheet(workbook);
    const metaData = this.parseMetaSheet(workbook);

    this.monthlyData = {};
    
    // Merge all data by month
    const months = new Set([
      ...Object.keys(leadsData),
      ...Object.keys(pipelineData),
      ...Object.keys(metaData)
    ]);

    months.forEach(month => {
      this.monthlyData[month] = {
        month: month,
        leads: leadsData[month]?.total || 0,
        spend: (metaData[month]?.spend || 0) + (this.googleSpend?.[month] || 0),
        conversions: pipelineData[month]?.conversions || 0,
        value: pipelineData[month]?.value || 0,
        cpl: metaData[month]?.cpl || 0,
        cpc: this.calculateCPC(month, pipelineData, metaData),
        targetHit: this.calculateTargetHit(pipelineData[month]?.value)
      };
    });

    return this.aggregateMetrics();
  }

  /**
   * Parse Leads sheet
   */
  parseLeadsSheet(workbook) {
    const sheet = this.findSheet(workbook, ['Leads']);
    if (!sheet) return {};

    const data = XLSX.utils.sheet_to_json(sheet);
    const result = {};

    data.forEach(row => {
      const month = row['Month'] || row['month'];
      if (month) {
        const total = Object.values(row).reduce((sum, val) => {
          const num = parseFloat(val);
          return sum + (isNaN(num) ? 0 : num);
        }, 0);
        result[month] = { total };
      }
    });

    return result;
  }

  /**
   * Parse Pipeline sheet
   */
  parsePipelineSheet(workbook) {
    const sheet = this.findSheet(workbook, ['Pipeline', 'Funnel']);
    if (!sheet) return {};

    const data = XLSX.utils.sheet_to_json(sheet);
    const result = {};

    data.forEach(row => {
      const month = row['Month'] || row['month'];
      if (month) {
        result[month] = {
          conversions: parseFloat(row['Conversions'] || row['conversions'] || 0),
          value: parseFloat(row['Value'] || row['value'] || 0)
        };
      }
    });

    return result;
  }

  /**
   * Parse Meta sheet
   */
  parseMetaSheet(workbook) {
    const sheet = this.findSheet(workbook, ['Meta', 'Meta Ads', 'Facebook']);
    if (!sheet) return {};

    const data = XLSX.utils.sheet_to_json(sheet);
    const result = {};

    data.forEach(row => {
      const month = row['Month'] || row['month'];
      if (month) {
        result[month] = {
          spend: parseFloat(row['Spend'] || row['spend'] || 0),
          leads: parseFloat(row['Leads'] || row['leads'] || 0),
          cpl: parseFloat(row['CPL'] || row['cpl'] || 0)
        };
      }
    });

    return result;
  }

  /**
   * Helper: Find sheet by possible names
   */
  findSheet(workbook, possibleNames) {
    const found = workbook.SheetNames.find(name => 
      possibleNames.some(p => name.toLowerCase().includes(p.toLowerCase()))
    );
    return found ? workbook.Sheets[found] : null;
  }

  /**
   * Calculate CPC (Cost Per Conversion)
   */
  calculateCPC(month, pipelineData, metaData) {
    const conversions = pipelineData[month]?.conversions || 1;
    const spend = (metaData[month]?.spend || 0) + (this.googleSpend?.[month] || 0);
    return conversions > 0 ? spend / conversions : 0;
  }

  /**
   * Calculate Target Hit Percentage
   */
  calculateTargetHit(value, monthlyTarget = 5000000) {
    if (!value) return '0%';
    const percentage = Math.round((value / monthlyTarget) * 100);
    return `${percentage}%`;
  }

  /**
   * Aggregate quarterly and overall metrics
   */
  aggregateMetrics() {
    const months = Object.keys(this.monthlyData);
    
    if (months.length === 0) {
      return { monthlyData: this.monthlyData, quarterlyMetrics: {} };
    }

    // Calculate totals
    const totals = {
      leads: 0,
      spend: 0,
      conversions: 0,
      value: 0,
      avgCPL: 0,
      avgCPC: 0
    };

    months.forEach(month => {
      const m = this.monthlyData[month];
      totals.leads += m.leads;
      totals.spend += m.spend;
      totals.conversions += m.conversions;
      totals.value += m.value;
    });

    totals.avgCPL = totals.leads > 0 ? totals.spend / totals.leads : 0;
    totals.avgCPC = totals.conversions > 0 ? totals.spend / totals.conversions : 0;

    return {
      monthlyData: this.monthlyData,
      quarterlyMetrics: totals,
      format: this.format
    };
  }

  /**
   * Get data for specific month or quarter
   */
  getMonthData(month) {
    return this.monthlyData[month] || null;
  }

  /**
   * Get all quarterly data as array (for table rendering)
   */
  getTableData() {
    return Object.values(this.monthlyData).map(m => ({
      Month: m.month,
      'Total Leads': m.leads,
      'Total Spend': `₹${m.spend.toLocaleString('en-IN')}`,
      'Conversions': m.conversions,
      'Conversion Value': `₹${m.value.toLocaleString('en-IN')}`,
      'Cost Per Lead': `₹${m.cpl.toFixed(2)}`,
      'Cost Per Conv.': `₹${m.cpc.toFixed(2)}`,
      'Target Hit': m.targetHit
    }));
  }

  /**
   * Export data as CSV
   */
  exportAsCSV() {
    const tableData = this.getTableData();
    const headers = Object.keys(tableData[0]);
    
    let csv = headers.join(',') + '\n';
    tableData.forEach(row => {
      csv += headers.map(h => `"${row[h]}"`).join(',') + '\n';
    });

    return csv;
  }
}

// Export for use in app
window.ConsolidatedDataLoader = ConsolidatedDataLoader;
