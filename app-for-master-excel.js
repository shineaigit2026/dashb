/* app.js - Works with Master Excel File (excel-reader.js) */
/* This is your dashboard app that reads from the Excel master file */

(function() {
  let activeMonth = 'All Q1';
  let activeQuarter = 'Q1';
  let detectedQuarters = [];
  
  window.DashboardApp = {
    initialize: function() {
      console.log('🎯 Initializing dashboard...');
      detectQuarters();
      updateQuarterDropdown();
      updateFilterTabs();
      setupQuarterDropdown();
      setupFilters();
      updateDashboard();
      console.log('✓ Dashboard ready');
    }
  };
  
  // ============================================
  // DETECT QUARTERS
  // ============================================
  
  function detectQuarters() {
    if (!window.DashboardData || !window.DashboardData.leadsData) {
      console.warn('⚠️ Dashboard data not loaded yet');
      return [];
    }
    
    const months = window.DashboardData.leadsData.map(d => d.month);
    const quarters = [];
    
    console.log('📅 Available months:', months);
    
    if (months.some(m => ['January', 'February', 'March'].includes(m))) quarters.push('Q1');
    if (months.some(m => ['April', 'May', 'June'].includes(m))) quarters.push('Q2');
    if (months.some(m => ['July', 'August', 'September'].includes(m))) quarters.push('Q3');
    if (months.some(m => ['October', 'November', 'December'].includes(m))) quarters.push('Q4');
    
    detectedQuarters = quarters;
    console.log(`✓ Detected quarters: ${quarters.join(', ')}`);
    return quarters;
  }
  
  function getMonthsForQuarter(quarter) {
    const availableMonths = {
      'Q1': ['January', 'February', 'March'],
      'Q2': ['April', 'May', 'June'],
      'Q3': ['July', 'August', 'September'],
      'Q4': ['October', 'November', 'December']
    };
    
    const monthsInQuarter = availableMonths[quarter] || [];
    const dataMonths = window.DashboardData?.leadsData?.map(d => d.month) || [];
    
    return monthsInQuarter.filter(m => dataMonths.includes(m));
  }
  
  // ============================================
  // UPDATE FILTER TABS
  // ============================================
  
  function updateFilterTabs() {
    const container = document.querySelector('.filter-tabs');
    if (!container) {
      console.warn('⚠️ .filter-tabs container not found in HTML');
      return;
    }
    
    container.innerHTML = '';
    const monthsInQuarter = getMonthsForQuarter(activeQuarter);
    
    if (monthsInQuarter.length === 0) {
      console.warn(`⚠️ No data found for ${activeQuarter}`);
      return;
    }
    
    // Add "All Quarter" button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-tab active';
    allBtn.dataset.month = `All ${activeQuarter}`;
    allBtn.textContent = `All ${activeQuarter}`;
    allBtn.addEventListener('click', () => handleTabClick(allBtn));
    container.appendChild(allBtn);
    
    // Add month buttons
    monthsInQuarter.forEach(month => {
      const btn = document.createElement('button');
      btn.className = 'filter-tab';
      btn.dataset.month = month;
      btn.textContent = month.substring(0, 3);
      btn.addEventListener('click', () => handleTabClick(btn));
      container.appendChild(btn);
    });
    
    activeMonth = `All ${activeQuarter}`;
    console.log(`📊 Updated tabs for ${activeQuarter}: ${monthsInQuarter.join(', ')}`);
  }
  
  function handleTabClick(tabElement) {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');
    activeMonth = tabElement.dataset.month;
    updateDashboard();
  }
  
  // ============================================
  // UPDATE QUARTER DROPDOWN
  // ============================================
  
  function updateQuarterDropdown() {
    const dropdown = document.getElementById('quarterDropdown');
    if (!dropdown) {
      console.warn('⚠️ quarterDropdown element not found');
      return;
    }
    
    const quarters = detectQuarters();
    dropdown.innerHTML = '';
    
    quarters.forEach(q => {
      const option = document.createElement('option');
      option.value = q;
      const monthText = {
        'Q1': 'Jan - Mar',
        'Q2': 'Apr - Jun',
        'Q3': 'Jul - Sep',
        'Q4': 'Oct - Dec'
      }[q] || '';
      option.textContent = `${q} (${monthText})`;
      if (q === activeQuarter) option.selected = true;
      dropdown.appendChild(option);
    });
  }
  
  // ============================================
  // FORMAT FUNCTIONS
  // ============================================
  
  function formatCurrencyLakhs(val) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    return `₹${(val / 100000).toFixed(2)}L`;
  }
  
  function formatCurrencyThousands(val) {
    return `₹${(val / 1000).toFixed(1)}K`;
  }
  
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function formatIndianCurrency(num) {
    const x = num.toString().split('.');
    let lastThree = x[0].substring(x[0].length - 3);
    const otherLines = x[0].substring(0, x[0].length - 3);
    if (otherLines !== '') lastThree = ',' + lastThree;
    const res = otherLines.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return '₹' + res + (x.length > 1 ? '.' + x[1].substring(0, 2) : '');
  }
  
  // ============================================
  // UPDATE DASHBOARD
  // ============================================
  
  function updateKPIs(data) {
    const safeSetText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };
    
    safeSetText('totalLeadsVal', formatNumber(data.totalLeads));
    safeSetText('totalLeadsSub', `FB: ${formatNumber(data.fbLeads)} · Others: ${formatNumber(data.otherLeads)}`);
    
    safeSetText('totalSpendVal', 
      data.totalSpend < 100000
        ? formatCurrencyThousands(data.totalSpend)
        : formatCurrencyLakhs(data.totalSpend)
    );
    
    safeSetText('totalSpendSub', `Meta ${formatCurrencyThousands(data.metaSpend)} · Google ${formatCurrencyThousands(data.googleSpend)}`);
    
    safeSetText('conversionsVal', formatNumber(data.totalConversions));
    safeSetText('conversionsSub', `Conv. rate: ${data.convRate.toFixed(2)}%`);
    
    safeSetText('convValueVal', formatCurrencyLakhs(data.totalConvValue));
    safeSetText('convValueSub', `ROAS: ${data.roas.toFixed(1)}x`);
    
    const metaCpl = data.fbLeads > 0 ? Math.round(data.metaSpend / data.fbLeads) : 0;
    safeSetText('metaCplVal', `₹${metaCpl}`);
    safeSetText('metaCplSub', activeMonth.includes('All ') ? 'Avg CPL' : 'Active Month CPL');
    
    safeSetText('organicClicksVal', formatNumber(data.totalSeoClicks));
    safeSetText('organicClicksSub', `Avg CTR: ${data.avgSeoCtr.toFixed(1)}%`);
    
    safeSetText('costPerConvVal', `₹${Math.round(data.costPerConv)}`);
    safeSetText('costPerConvSub', 'Across all channels');
    
    const monthsInQuarter = getMonthsForQuarter(activeQuarter).length;
    const targetAmount = monthsInQuarter * 5000000;
    const targetLabel = activeMonth.includes('All ') ? `₹${formatCurrencyLakhs(targetAmount)} target` : '₹50L target';
    safeSetText('targetAchievedVal', `${Math.round(data.targetPct)}%`);
    safeSetText('targetAchievedSub', `vs ${targetLabel}`);
    
    const targetStatusEl = document.getElementById('targetStatusText');
    if (targetStatusEl) {
      if (data.targetPct >= 100) {
        targetStatusEl.innerText = "Exceeded target";
        targetStatusEl.style.color = "var(--accent-emerald)";
      } else {
        targetStatusEl.innerText = "Below target";
        targetStatusEl.style.color = "var(--accent-rose)";
      }
    }
  }
  
  function updatePipelineFunnel(data) {
    const { funnel } = data;
    const stages = [
      { id: 'funnelLeads', val: funnel.totalLeads, pct: 100.0 },
      { id: 'funnelFollowUp', val: funnel.followUp, pct: (funnel.followUp / (funnel.totalLeads || 1)) * 100 },
      { id: 'funnelCold', val: funnel.coldEnquiry, pct: (funnel.coldEnquiry / (funnel.totalLeads || 1)) * 100 },
      { id: 'funnelQuoteGiven', val: funnel.quoteGiven, pct: (funnel.quoteGiven / (funnel.totalLeads || 1)) * 100 },
      { id: 'funnelQuoteLive', val: funnel.quoteLive, pct: (funnel.quoteLive / (funnel.totalLeads || 1)) * 100 },
      { id: 'funnelConverted', val: funnel.converted, pct: (funnel.converted / (funnel.totalLeads || 1)) * 100 },
      { id: 'funnelSaleLost', val: funnel.saleLost, pct: (funnel.saleLost / (funnel.totalLeads || 1)) * 100 }
    ];
    
    stages.forEach(stage => {
      const barEl = document.getElementById(`${stage.id}Bar`);
      const valEl = document.getElementById(`${stage.id}Val`);
      if (barEl && valEl) {
        barEl.style.width = `${stage.pct}%`;
        valEl.innerHTML = `${formatNumber(stage.val)} <span>${stage.pct.toFixed(1)}%</span>`;
      }
    });
  }
  
  function updateGoogleCampaignsTable() {
    const tbody = document.getElementById('googleCampaignsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const dataObj = window.DashboardData;
    let campaigns = [];
    
    if (activeMonth.includes('All ')) {
      const campaignsMap = {};
      const monthsInQuarter = getMonthsForQuarter(activeQuarter);
      
      monthsInQuarter.forEach(m => {
        const monthlyCampaigns = dataObj.googleCampaignsData[m] || [];
        monthlyCampaigns.forEach(c => {
          if (!campaignsMap[c.name]) {
            campaignsMap[c.name] = { ...c };
          } else {
            campaignsMap[c.name].spend += c.spend;
            campaignsMap[c.name].interactions += c.interactions;
            campaignsMap[c.name].conv += c.conv;
          }
        });
      });
      campaigns = Object.values(campaignsMap);
    } else {
      campaigns = dataObj.googleCampaignsData[activeMonth] || [];
    }
    
    campaigns.sort((a, b) => b.conv - a.conv);
    campaigns.slice(0, 10).forEach(c => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${formatIndianCurrency(Math.round(c.spend))}</td>
        <td>${formatNumber(c.interactions)}</td>
        <td>${c.ctr.toFixed(1)}%</td>
        <td>₹${c.cpc.toFixed(1)}</td>
        <td>${c.conv}</td>
        <td><span class="badge">${c.conv > 10 ? 'Good' : 'Review'}</span></td>
      `;
      tbody.appendChild(row);
    });
  }
  
  function updateDashboard() {
    const dataObj = window.DashboardData;
    if (!dataObj) {
      console.warn('⚠️ Dashboard data not available');
      return;
    }
    
    const data = dataObj.getFilteredData(activeMonth);
    updateKPIs(data);
    updatePipelineFunnel(data);
    updateGoogleCampaignsTable();
    
    // Call chart/insight updates if they exist
    if (window.DashboardCharts?.updateAllCharts) {
      window.DashboardCharts.updateAllCharts(activeMonth);
    }
    if (window.DashboardInsights?.updateInsights) {
      window.DashboardInsights.updateInsights(activeMonth);
    }
  }
  
  function setupQuarterDropdown() {
    const dropdown = document.getElementById('quarterDropdown');
    if (!dropdown) return;
    
    dropdown.addEventListener('change', (e) => {
      activeQuarter = e.target.value;
      console.log(`🔄 Switched to ${activeQuarter}`);
      updateFilterTabs();
      updateDashboard();
    });
  }
  
  function setupFilters() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-tab')) {
        handleTabClick(e.target);
      }
    });
  }
};

// Initialize when data is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure excel-reader.js loaded data
  setTimeout(() => {
    if (window.DashboardData) {
      window.DashboardApp.initialize();
    } else {
      console.warn('⚠️ Waiting for Excel data...');
      // Try again after 1 second
      setTimeout(() => {
        if (window.DashboardData) {
          window.DashboardApp.initialize();
        } else {
          console.error('❌ Dashboard data failed to load');
        }
      }, 1000);
    }
  }, 100);
});
