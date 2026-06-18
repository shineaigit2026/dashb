/* app.js - DYNAMIC EXCEL / CSV LOADING, VALIDATION & QUARTER VIEWS */
(function() {
  let activeMonth = 'All Q1';
  let activeQuarter = 'Q1';
  let detectedQuarters = ['Q1'];
  
  let availableMonths = {
    'Q1': ['January', 'February', 'March'],
    'Q2': ['April', 'May', 'June'],
    'Q3': ['July', 'August', 'September'],
    'Q4': ['October', 'November', 'December']
  };

  const KEY_MAPS = {
    leadsData: {
      month: ['month', 'period'],
      website: ['website', 'websiteleads', 'web'],
      call: ['call', 'callleads', 'calls'],
      whatsapp: ['whatsapp', 'whatsappleads', 'wa'],
      mail: ['mail', 'mailleads', 'email', 'emails'],
      tollFree: ['tollfree', 'tollfreeleads'],
      ecommerce: ['ecommerce', 'ecommerceleads', 'online'],
      facebook: ['facebook', 'facebookleads', 'fb', 'fbleads'],
      total: ['total', 'totalleads', 'leads']
    },
    pipelineData: {
      month: ['month', 'period'],
      conversions: ['conversions', 'conv', 'deals'],
      value: ['value', 'conversionvalue', 'revenue', 'amount'],
      followUp: ['followup', 'needfollowup', 'followups'],
      quoteGiven: ['quotegiven', 'quotesgiven', 'quote'],
      converted: ['converted', 'closed', 'won'],
      quoteLive: ['quotelive', 'quoteslive', 'livequotes'],
      quoteLost: ['quotelost', 'quoteslost', 'lostquotes'],
      saleLost: ['salelost', 'saleslost', 'lostsales'],
      noResponse: ['noresponse', 'noresponses'],
      coldEnquiry: ['coldenquiry', 'coldenquiries', 'cold']
    },
    seoData: {
      month: ['month', 'period'],
      clicks: ['clicks', 'seoclicks'],
      impressions: ['impressions', 'seoimpressions'],
      ctr: ['ctr', 'seoctr'],
      position: ['position', 'seoposition', 'avgposition']
    },
    metaAdsMonthly: {
      month: ['month', 'period'],
      spend: ['spend', 'metaspend', 'cost'],
      leads: ['leads', 'metaleads'],
      cpl: ['cpl', 'metacpl', 'costperlead']
    },
    regionalLeadsMonthly: {
      month: ['month', 'period'],
      south: ['south', 'southleads'],
      north: ['north', 'northleads'],
      west: ['west', 'westleads'],
      east: ['east', 'eastleads']
    },
    productEnquiriesMonthly: {
      month: ['month', 'period'],
      office: ['office', 'officeenquiries'],
      gantry: ['gantry', 'gantryenquiries'],
      hospital: ['hospital', 'hospitalenquiries'],
      education: ['education', 'educationenquiries'],
      allProds: ['allprods', 'allproducts'],
      chairs: ['chairs', 'chairsenquiries'],
      cafe: ['cafe', 'cafeenquiries', 'hotelcafe'],
      tables: ['tables', 'tablesenquiries']
    },
    customerTypeMonthly: {
      month: ['month', 'period'],
      healthcare: ['healthcare', 'health'],
      officeOrg: ['officeorg', 'office', 'corporate'],
      education: ['education', 'edu'],
      reseller: ['reseller', 'resellers'],
      individual: ['individual', 'individuals', 'retail'],
      others: ['others', 'other'],
      hotelCafe: ['hotelcafe', 'hotel', 'cafe'],
      architect: ['architect', 'architects']
    },
    channelConversionsMonthly: {
      month: ['month', 'period'],
      call: ['call', 'callconversions'],
      website: ['website', 'websiteconversions'],
      facebook: ['facebook', 'facebookconversions', 'fb'],
      whatsapp: ['whatsapp', 'whatsappconversions', 'wa'],
      ecommerce: ['ecommerce', 'ecommerceconversions']
    },
    googleCampaignsData: {
      name: ['name', 'campaign', 'campaignname'],
      spend: ['spend', 'cost', 'googlespend'],
      interactions: ['interactions', 'clicks', 'interact'],
      ctr: ['ctr', 'clickthroughrate'],
      cpc: ['cpc', 'costperclick'],
      conv: ['conv', 'conversions', 'googleconversions'],
      rating: ['rating', 'status']
    },
    citiesData: {
      city: ['city', 'location'],
      state: ['state', 'region'],
      month: ['month', 'period'],
      value: ['value', 'conversionvalue', 'revenue', 'amount']
    }
  };

  // ============================================
  // QUARTERS DETECTION & METADATA HELPERS
  // ============================================
  
  function detectQuarters() {
    const months = window.DashboardData.leadsData.map(d => d.month);
    const quarters = [];
    
    if (months.some(m => ['January', 'February', 'March'].includes(m))) {
      quarters.push('Q1');
    }
    if (months.some(m => ['April', 'May', 'June'].includes(m))) {
      quarters.push('Q2');
    }
    if (months.some(m => ['July', 'August', 'September'].includes(m))) {
      quarters.push('Q3');
    }
    if (months.some(m => ['October', 'November', 'December'].includes(m))) {
      quarters.push('Q4');
    }
    
    detectedQuarters = quarters.length > 0 ? quarters : ['Q1'];
    return detectedQuarters;
  }
  
  function getMonthsForQuarter(quarter) {
    const monthsInQuarter = availableMonths[quarter] || [];
    const dataObj = window.DashboardData;
    const availableMonthsInData = dataObj.leadsData.map(d => d.month);
    return monthsInQuarter.filter(m => availableMonthsInData.includes(m));
  }

  function normalizeMonth(monthStr) {
    if (!monthStr) return "";
    const clean = String(monthStr).trim().toLowerCase().substring(0, 3);
    const months = {
      'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
      'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
      'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
    };
    return months[clean] || "";
  }

  // ============================================
  // DYNAMIC FILTER TABS & DROPDOWN POPULATOR
  // ============================================

  function updateQuarterDropdown() {
    const dropdown = document.getElementById('quarterDropdown');
    if (!dropdown) return;
    
    const quarters = detectQuarters();
    dropdown.innerHTML = '';
    
    quarters.forEach(q => {
      const option = document.createElement('option');
      option.value = q;
      const monthsList = (availableMonths[q] || []).map(m => m.substring(0, 3)).join(' - ');
      option.textContent = `${q} (${monthsList})`;
      if (q === activeQuarter) option.selected = true;
      dropdown.appendChild(option);
    });
  }

  function updateFilterTabs() {
    const container = document.querySelector('.filter-tabs');
    if (!container) return;
    
    container.innerHTML = '';
    const monthsInQuarter = getMonthsForQuarter(activeQuarter);
    
    // All Quarter Tab
    const allQuarterBtn = document.createElement('button');
    allQuarterBtn.className = 'filter-tab active';
    allQuarterBtn.dataset.month = `All ${activeQuarter}`;
    allQuarterBtn.textContent = `All ${activeQuarter}`;
    allQuarterBtn.addEventListener('click', () => handleTabClick(allQuarterBtn));
    container.appendChild(allQuarterBtn);
    
    // Month Tab Buttons
    monthsInQuarter.forEach(month => {
      const btn = document.createElement('button');
      btn.className = 'filter-tab';
      btn.dataset.month = month;
      btn.textContent = month.substring(0, 3);
      btn.addEventListener('click', () => handleTabClick(btn));
      container.appendChild(btn);
    });
    
    activeMonth = `All ${activeQuarter}`;
  }
  
  function handleTabClick(tabElement) {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');
    activeMonth = tabElement.dataset.month;
    updateDashboard();
  }

  // ============================================
  // FORMATTING HELPERS
  // ============================================
  
  function formatCurrencyLakhs(val) {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)}Cr`;
    }
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
    if (otherLines !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherLines.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return '₹' + res + (x.length > 1 ? '.' + x[1].substring(0, 2) : '');
  }

  // ============================================
  // DOM UPDATERS (NO APPEARANCE CHANGE)
  // ============================================
  
  function updateKPIs(data, monthFilter) {
    document.getElementById('totalLeadsVal').innerText = formatNumber(data.totalLeads);
    document.getElementById('totalLeadsSub').innerText = `FB: ${formatNumber(data.fbLeads)} · Others: ${formatNumber(data.otherLeads)}`;
    document.getElementById('totalLeadsTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;

    document.getElementById('totalSpendVal').innerText =
      data.totalSpend < 100000
        ? formatCurrencyThousands(data.totalSpend)
        : formatCurrencyLakhs(data.totalSpend);
    document.getElementById('totalSpendSub').innerText =
      `Meta ${formatCurrencyThousands(data.metaSpend)} · Google ${formatCurrencyThousands(data.googleSpend)}`;
    document.getElementById('totalSpendTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;

    document.getElementById('conversionsVal').innerText = formatNumber(data.totalConversions);
    document.getElementById('conversionsSub').innerText = `Conv. rate: ${data.convRate.toFixed(2)}%`;
    document.getElementById('conversionsTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;

    document.getElementById('convValueVal').innerText = formatCurrencyLakhs(data.totalConvValue);
    document.getElementById('convValueSub').innerText = `ROAS: ${data.roas.toFixed(1)}x`;
    document.getElementById('convValueTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;

    const metaCpl = data.fbLeads > 0 ? Math.round(data.metaSpend / data.fbLeads) : 0;
    document.getElementById('metaCplVal').innerText = `₹${metaCpl}`;
    document.getElementById('metaCplSub').innerText = `Across Meta ads`;
    document.getElementById('metaCplTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;
    
    document.getElementById('organicClicksVal').innerText = formatNumber(data.totalSeoClicks);
    document.getElementById('organicClicksSub').innerText = `Avg CTR: ${data.avgSeoCtr.toFixed(1)}%`;
    document.getElementById('organicClicksTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;
    
    document.getElementById('costPerConvVal').innerText = `₹${Math.round(data.costPerConv)}`;
    document.getElementById('costPerConvSub').innerText = 'Across paid ads';
    document.getElementById('costPerConvTag').innerText = monthFilter.startsWith("All ") ? `${activeQuarter} combined` : monthFilter;
    
    const targetLabel = monthFilter.startsWith("All ") ? `${activeQuarter} vs Target` : `${monthFilter} vs Target`;
    const targetMonthsCount = monthFilter.startsWith("All ") ? getMonthsForQuarter(activeQuarter).length : 1;
    const targetVal = targetMonthsCount * 5000000;
    
    document.getElementById('targetLabel').innerText = targetLabel;
    document.getElementById('targetAchievedVal').innerText = `${Math.round(data.targetPct)}%`;
    document.getElementById('targetAchievedSub').innerText = `vs ${formatCurrencyLakhs(targetVal)} target`;
    
    const targetStatusText = document.getElementById('targetStatusText');
    if (data.targetPct >= 100) {
      targetStatusText.innerText = "Target Achieved";
      targetStatusText.style.color = "var(--accent-emerald)";
    } else {
      targetStatusText.innerText = "Below Target";
      targetStatusText.style.color = "var(--accent-rose)";
    }
  }

  function updateMonthlyTargets() {
    const dataObj = window.DashboardData;
    const monthsInQuarter = getMonthsForQuarter(activeQuarter);
    
    for (let i = 0; i < 3; i++) {
      const cardEl = document.getElementById(`targetCard${i}`);
      const titleEl = document.getElementById(`targetTitle${i}`);
      const pctEl = document.getElementById(`targetPct${i}`);
      const barEl = document.getElementById(`targetBar${i}`);
      const amountEl = document.getElementById(`targetAmount${i}`);
      
      if (!cardEl) continue;
      
      if (i < monthsInQuarter.length) {
        cardEl.style.display = 'flex';
        const month = monthsInQuarter[i];
        const monthShort = month.substring(0, 3);
        
        const pipe = dataObj.pipelineData.find(d => d.month === month);
        const val = pipe ? pipe.value : 0;
        const pct = (val / 5000000) * 100;
        
        titleEl.textContent = `${monthShort} – vs ₹50L target`;
        amountEl.textContent = formatCurrencyLakhs(val);
        pctEl.textContent = `${Math.round(pct)}%`;
        
        barEl.style.width = `${Math.min(pct, 100)}%`;
        
        if (pct >= 100) {
          pctEl.className = 'target-pct hit';
          barEl.className = 'progress-bar hit';
        } else {
          pctEl.className = 'target-pct miss';
          barEl.className = 'progress-bar miss';
        }
      } else {
        cardEl.style.display = 'none'; // Hide if month is not in the data
      }
    }
  }

  function updatePipelineFunnel(data) {
    const { funnel } = data;
    const stages = [
      { id: 'funnelLeads', val: funnel.totalLeads, pct: 100.0 },
      { id: 'funnelFollowUp', val: funnel.followUp, pct: funnel.totalLeads > 0 ? (funnel.followUp / funnel.totalLeads) * 100 : 0 },
      { id: 'funnelCold', val: funnel.coldEnquiry, pct: funnel.totalLeads > 0 ? (funnel.coldEnquiry / funnel.totalLeads) * 100 : 0 },
      { id: 'funnelQuoteGiven', val: funnel.quoteGiven, pct: funnel.totalLeads > 0 ? (funnel.quoteGiven / funnel.totalLeads) * 100 : 0 },
      { id: 'funnelQuoteLive', val: funnel.quoteLive, pct: funnel.totalLeads > 0 ? (funnel.quoteLive / funnel.totalLeads) * 100 : 0 },
      { id: 'funnelConverted', val: funnel.converted, pct: funnel.totalLeads > 0 ? (funnel.converted / funnel.totalLeads) * 100 : 0 },
      { id: 'funnelSaleLost', val: funnel.saleLost, pct: funnel.totalLeads > 0 ? (funnel.saleLost / funnel.totalLeads) * 100 : 0 }
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

  function updateGoogleCampaignsTable(monthFilter) {
    const tbody = document.getElementById('googleCampaignsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const dataObj = window.DashboardData;
    let campaigns = [];
    
    if (monthFilter.startsWith('All ')) {
      const campaignsMap = {};
      const monthsInQuarter = getMonthsForQuarter(activeQuarter);
      monthsInQuarter.forEach(m => {
        const monthlyList = dataObj.googleCampaignsData[m] || [];
        monthlyList.forEach(c => {
          if (!campaignsMap[c.name]) {
            campaignsMap[c.name] = { ...c, count: 1 };
          } else {
            campaignsMap[c.name].spend += c.spend;
            campaignsMap[c.name].interactions += c.interactions;
            campaignsMap[c.name].conv += c.conv;
            campaignsMap[c.name].ctr = (campaignsMap[c.name].ctr + c.ctr) / 2;
            campaignsMap[c.name].count += 1;
          }
        });
      });
      campaigns = Object.values(campaignsMap).map(c => {
        const cpc = c.interactions > 0 ? c.spend / c.interactions : 0;
        return {
          ...c,
          cpc,
          rating: c.conv > 30 ? "Top" : c.conv > 10 ? "Strong" : c.spend > 10000 && c.conv === 0 ? "Low ROI" : "Review"
        };
      });
    } else {
      campaigns = dataObj.googleCampaignsData[monthFilter] || [];
    }
    
    campaigns.sort((a, b) => b.conv - a.conv);
    campaigns.forEach(c => {
      const ratingClass = c.rating.toLowerCase().replace(' ', '-').replace('.', '');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${formatIndianCurrency(Math.round(c.spend))}</td>
        <td>${formatNumber(c.interactions)}</td>
        <td>${c.ctr.toFixed(1)}%</td>
        <td>₹${c.cpc.toFixed(1)}</td>
        <td>${c.conv}</td>
        <td><span class="badge ${ratingClass}">${c.rating}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  function updateCitiesTable(monthFilter) {
    const tbody = document.getElementById('citiesBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const dataObj = window.DashboardData;
    let cities = [];
    
    if (monthFilter.startsWith('All ')) {
      const monthsInQuarter = getMonthsForQuarter(activeQuarter);
      cities = dataObj.citiesData.filter(c => monthsInQuarter.includes(c.month));
    } else {
      cities = dataObj.citiesData.filter(c => c.month === monthFilter);
    }
    
    cities.sort((a, b) => b.value - a.value);
    cities.slice(0, 15).forEach(c => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.city}</td>
        <td>${c.state}</td>
        <td>${c.month.substring(0, 3)}</td>
        <td>${formatIndianCurrency(c.value)}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function updateRegionLeads(monthFilter) {
    const isQuarter = monthFilter.startsWith('All ');
    const dataObj = window.DashboardData;
    const monthsInQuarter = isQuarter ? getMonthsForQuarter(activeQuarter) : [monthFilter];
    
    let south = 0, north = 0, west = 0, east = 0;
    
    monthsInQuarter.forEach(m => {
      const d = dataObj.regionalLeadsMonthly.find(x => x.month === m);
      if (d) {
        south += d.south;
        north += d.north;
        west += d.west;
        east += d.east;
      }
    });
    
    const total = south + north + west + east || 1;
    const regions = [
      { name: 'South', leads: south, pct: (south / total) * 100, trend: 'down', icon: '↓' },
      { name: 'North', leads: north, pct: (north / total) * 100, trend: 'down', icon: '↓' },
      { name: 'West', leads: west, pct: (west / total) * 100, trend: 'up', icon: '↑' },
      { name: 'East', leads: east, pct: (east / total) * 100, trend: 'up', icon: '↑' }
    ];
    
    const listEl = document.getElementById('regionLeadsList');
    if (listEl) {
      listEl.innerHTML = regions.map(r => `
        <div class="region-item">
          <div class="region-header">
            <span class="region-name">${r.name} <span style="color: ${r.trend === 'up' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}">${r.icon}</span></span>
            <span class="region-leads">${Math.round(r.pct)}% of leads (${formatNumber(r.leads)})</span>
          </div>
          <div class="region-bar-container">
            <div class="region-bar" style="width: ${r.pct}%;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // ============================================
  // UPDATE ALL MODULES
  // ============================================

  function updateDashboard() {
    const dataObj = window.DashboardData;
    const data = dataObj.getFilteredData(activeMonth);
    
    // Update sub title text dynamically based on loaded data
    const subTitle = document.getElementById('dashboardSubTitle');
    const footerText = document.getElementById('footerText');
    const months = getMonthsForQuarter(activeQuarter);
    
    if (subTitle && months.length > 0) {
      const range = `${activeQuarter} ${months[0].substring(0, 3)} - ${months[months.length-1].substring(0, 3)}`;
      subTitle.textContent = `${range} · SVP & Internal Team`;
      if (footerText) footerText.textContent = `${activeQuarter} (${months[0].substring(0, 3)}–${months[months.length-1].substring(0, 3)})`;
    }
    
    updateKPIs(data, activeMonth);
    updateMonthlyTargets();
    updatePipelineFunnel(data);
    updateGoogleCampaignsTable(activeMonth);
    updateCitiesTable(activeMonth);
    updateRegionLeads(activeMonth);
    
    if (window.DashboardCharts) {
      window.DashboardCharts.updateAllCharts(activeMonth);
    }
    if (window.DashboardInsights) {
      window.DashboardInsights.updateInsights(activeMonth);
    }
  }

  // ============================================
  // SHEETS DATA PARSER & VALIDATOR (SHEETJS)
  // ============================================

  function mapRow(row, schema, warnings, rowIdx, sheetName) {
    const normalizedRow = {};
    Object.keys(row).forEach(k => {
      const normKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      normalizedRow[normKey] = row[k];
    });
    
    const mapped = {};
    let hasData = false;
    
    Object.keys(schema).forEach(prop => {
      const synonyms = schema[prop];
      let foundVal = undefined;
      
      for (let syn of synonyms) {
        const normSyn = syn.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalizedRow[normSyn] !== undefined) {
          foundVal = normalizedRow[normSyn];
          break;
        }
      }
      
      if (foundVal !== undefined) {
        hasData = true;
        if (prop === 'month') {
          const normM = normalizeMonth(foundVal);
          if (!normM) {
            warnings.push(`[${sheetName}] Row ${rowIdx}: Invalid month value "${foundVal}".`);
          }
          mapped[prop] = normM;
        } else if (prop === 'name' || prop === 'city' || prop === 'state' || prop === 'rating') {
          mapped[prop] = String(foundVal).trim();
        } else {
          const cleanVal = String(foundVal).replace(/[₹$,%\s]/g, '');
          const num = parseFloat(cleanVal);
          if (isNaN(num)) {
            warnings.push(`[${sheetName}] Row ${rowIdx}: Cannot parse number for "${prop}" (value: "${foundVal}"). Defaulted to 0.`);
            mapped[prop] = 0;
          } else if (num < 0) {
            warnings.push(`[${sheetName}] Row ${rowIdx}: Negative number found for "${prop}" (${num}).`);
            mapped[prop] = num;
          } else {
            mapped[prop] = num;
          }
        }
      } else {
        if (prop === 'month') {
          mapped[prop] = "";
        } else if (prop === 'name' || prop === 'city' || prop === 'state' || prop === 'rating') {
          mapped[prop] = "";
        } else {
          mapped[prop] = 0;
        }
      }
    });
    
    return { mapped, hasData };
  }

  function processExcelData(sheetsData) {
    const db = window.DashboardData;
    const warnings = [];
    let updatedTypesCount = 0;
    
    // 1. Leads Sheet
    const leadsSheetKey = Object.keys(sheetsData).find(s => s.toLowerCase() === 'leads');
    if (leadsSheetKey) {
      const parsed = [];
      sheetsData[leadsSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.leadsData, warnings, i + 2, 'Leads');
        if (hasData && mapped.month) {
          // Calculate total if missing
          if (mapped.total === 0) {
            mapped.total = mapped.website + mapped.call + mapped.whatsapp + mapped.mail + mapped.tollFree + mapped.ecommerce + mapped.facebook;
          }
          parsed.push(mapped);
        }
      });
      if (parsed.length > 0) {
        // Merge
        parsed.forEach(row => {
          const idx = db.leadsData.findIndex(x => x.month === row.month);
          if (idx >= 0) db.leadsData[idx] = row;
          else db.leadsData.push(row);
        });
        updatedTypesCount++;
      }
    }
    
    // 2. Funnel/Pipeline Sheet
    const pipeSheetKey = Object.keys(sheetsData).find(s => ['pipeline', 'funnel'].includes(s.toLowerCase()));
    if (pipeSheetKey) {
      const parsed = [];
      sheetsData[pipeSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.pipelineData, warnings, i + 2, 'Pipeline');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.pipelineData.findIndex(x => x.month === row.month);
          if (idx >= 0) db.pipelineData[idx] = row;
          else db.pipelineData.push(row);
        });
        updatedTypesCount++;
      }
    }
    
    // 3. SEO Sheet
    const seoSheetKey = Object.keys(sheetsData).find(s => s.toLowerCase() === 'seo');
    if (seoSheetKey) {
      const parsed = [];
      sheetsData[seoSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.seoData, warnings, i + 2, 'SEO');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.seoData.findIndex(x => x.month === row.month);
          if (idx >= 0) db.seoData[idx] = row;
          else db.seoData.push(row);
        });
        updatedTypesCount++;
      }
    }
    
    // 4. Meta Ads Sheet
    const metaSheetKey = Object.keys(sheetsData).find(s => ['meta', 'facebookads', 'metaads'].includes(s.toLowerCase()));
    if (metaSheetKey) {
      const parsed = [];
      sheetsData[metaSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.metaAdsMonthly, warnings, i + 2, 'Meta Ads');
        if (hasData && mapped.month) {
          if (mapped.cpl === 0 && mapped.leads > 0) {
            mapped.cpl = Math.round(mapped.spend / mapped.leads);
          }
          parsed.push(mapped);
        }
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.metaAdsMonthly.findIndex(x => x.month === row.month);
          if (idx >= 0) db.metaAdsMonthly[idx] = row;
          else db.metaAdsMonthly.push(row);
        });
        updatedTypesCount++;
      }
    }

    // 5. Google Campaigns Sheet
    const googleSheetKey = Object.keys(sheetsData).find(s => ['google', 'googlecampaigns', 'campaigns'].includes(s.toLowerCase()));
    if (googleSheetKey) {
      const grouped = {};
      sheetsData[googleSheetKey].forEach((row, i) => {
        // Detect month column or use activeMonth if missing
        let monthName = normalizeMonth(row.Month || row.month || row.Period || row.period);
        if (!monthName) {
          monthName = normalizeMonth(activeMonth.replace('All ', ''));
        }
        if (!monthName) monthName = "January"; // Ultimate fallback
        
        const { mapped, hasData } = mapRow(row, KEY_MAPS.googleCampaignsData, warnings, i + 2, 'Google Campaigns');
        if (hasData && mapped.name) {
          if (mapped.cpc === 0 && mapped.interactions > 0) {
            mapped.cpc = mapped.spend / mapped.interactions;
          }
          if (!mapped.rating) {
            mapped.rating = mapped.conv > 30 ? "Top" : mapped.conv > 10 ? "Strong" : mapped.spend > 10000 && mapped.conv === 0 ? "Low ROI" : "Review";
          }
          if (!grouped[monthName]) grouped[monthName] = [];
          grouped[monthName].push(mapped);
        }
      });
      Object.keys(grouped).forEach(m => {
        db.googleCampaignsData[m] = grouped[m];
      });
      updatedTypesCount++;
    }

    // 6. Cities Sheet
    const citiesSheetKey = Object.keys(sheetsData).find(s => ['cities', 'city', 'locations'].includes(s.toLowerCase()));
    if (citiesSheetKey) {
      const parsed = [];
      sheetsData[citiesSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.citiesData, warnings, i + 2, 'Cities');
        if (hasData && mapped.city && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        // Clear old cities data that match the loaded months to prevent double entries
        const monthsLoaded = [...new Set(parsed.map(x => x.month))];
        db.citiesData = db.citiesData.filter(x => !monthsLoaded.includes(x.month));
        db.citiesData.push(...parsed);
        updatedTypesCount++;
      }
    }

    // 7. Regional Leads Sheet
    const regionalSheetKey = Object.keys(sheetsData).find(s => ['regional', 'regions', 'regionalleads'].includes(s.toLowerCase()));
    if (regionalSheetKey) {
      const parsed = [];
      sheetsData[regionalSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.regionalLeadsMonthly, warnings, i + 2, 'Regional Leads');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.regionalLeadsMonthly.findIndex(x => x.month === row.month);
          if (idx >= 0) db.regionalLeadsMonthly[idx] = row;
          else db.regionalLeadsMonthly.push(row);
        });
        updatedTypesCount++;
      }
    }

    // 8. Products Sheet
    const prodSheetKey = Object.keys(sheetsData).find(s => ['products', 'productenquiries', 'enquiries'].includes(s.toLowerCase()));
    if (prodSheetKey) {
      const parsed = [];
      sheetsData[prodSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.productEnquiriesMonthly, warnings, i + 2, 'Product Enquiries');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.productEnquiriesMonthly.findIndex(x => x.month === row.month);
          if (idx >= 0) db.productEnquiriesMonthly[idx] = row;
          else db.productEnquiriesMonthly.push(row);
        });
        updatedTypesCount++;
      }
    }

    // 9. Customer Type Sheet
    const custSheetKey = Object.keys(sheetsData).find(s => ['customers', 'customertype', 'sectors'].includes(s.toLowerCase()));
    if (custSheetKey) {
      const parsed = [];
      sheetsData[custSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.customerTypeMonthly, warnings, i + 2, 'Customer Type');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.customerTypeMonthly.findIndex(x => x.month === row.month);
          if (idx >= 0) db.customerTypeMonthly[idx] = row;
          else db.customerTypeMonthly.push(row);
        });
        updatedTypesCount++;
      }
    }

    // 10. Channel Conversions Sheet
    const chanSheetKey = Object.keys(sheetsData).find(s => ['channels', 'channelconversions'].includes(s.toLowerCase()));
    if (chanSheetKey) {
      const parsed = [];
      sheetsData[chanSheetKey].forEach((row, i) => {
        const { mapped, hasData } = mapRow(row, KEY_MAPS.channelConversionsMonthly, warnings, i + 2, 'Channel Conversions');
        if (hasData && mapped.month) parsed.push(mapped);
      });
      if (parsed.length > 0) {
        parsed.forEach(row => {
          const idx = db.channelConversionsMonthly.findIndex(x => x.month === row.month);
          if (idx >= 0) db.channelConversionsMonthly[idx] = row;
          else db.channelConversionsMonthly.push(row);
        });
        updatedTypesCount++;
      }
    }
    
    // Post process
    detectQuarters();
    updateQuarterDropdown();
    updateFilterTabs();
    updateDashboard();
    
    return {
      updatedTypesCount,
      warnings
    };
  }

  // ============================================
  // CSV CUSTOM RAW ROW PARSER
  // ============================================

  function parseCSVRows(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i+1];
      
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push("");
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row.map(cell => cell.trim()));
        row = [""];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row.map(cell => cell.trim()));
    }
    return lines;
  }

  function processCSVData(text, filename) {
    const lines = parseCSVRows(text);
    if (lines.length < 2) {
      return { success: false, error: 'Empty or invalid CSV file structure.' };
    }
    
    const headers = lines[0].map(h => h.trim().toLowerCase());
    
    // Map headers to key-value objects
    const sheetsData = {};
    const sheetRows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = {};
      lines[i].forEach((val, idx) => {
        if (headers[idx]) {
          row[lines[0][idx]] = val; // Store original header casing
        }
      });
      sheetRows.push(row);
    }
    
    // Identify sheet category based on headers
    let targetSheet = 'Leads';
    if (headers.includes('conversions') || headers.includes('followup') || headers.includes('coldenquiry')) {
      targetSheet = 'Pipeline';
    } else if (headers.includes('clicks') || headers.includes('impressions')) {
      targetSheet = 'SEO';
    } else if (headers.includes('spend') && (headers.includes('leads') || headers.includes('cpl')) && !headers.includes('campaign')) {
      targetSheet = 'Meta';
    } else if (headers.includes('campaign') || headers.includes('avg. cost')) {
      targetSheet = 'Google';
    } else if (headers.includes('city') || headers.includes('cities')) {
      targetSheet = 'Cities';
    } else if (headers.includes('south') || headers.includes('north')) {
      targetSheet = 'Regional';
    } else if (headers.includes('office') && headers.includes('hospital') && headers.includes('chairs')) {
      targetSheet = 'Products';
    } else if (headers.includes('healthcare') || headers.includes('reseller') || headers.includes('individual')) {
      targetSheet = 'Customers';
    } else if (headers.includes('channel') || (headers.includes('call') && headers.includes('website') && headers.includes('ecommerce') && !headers.includes('leads'))) {
      targetSheet = 'Channels';
    }
    
    sheetsData[targetSheet] = sheetRows;
    return processExcelData(sheetsData);
  }

  // ============================================
  // AUTO FILE LOADER (HTTP SERVER METHOD)
  // ============================================

  function showStatusBanner(type, message, details = null) {
    const banner = document.getElementById('dataStatusBanner');
    const text = document.getElementById('dataStatusText');
    if (!banner || !text) return;
    
    banner.style.display = 'flex';
    if (type === 'success') {
      banner.style.backgroundColor = '#ecfdf5';
      banner.style.borderColor = '#10b981';
      text.style.color = '#065f46';
    } else if (type === 'warning') {
      banner.style.backgroundColor = '#fffbeb';
      banner.style.borderColor = '#fbbf24';
      text.style.color = '#92400e';
    } else {
      banner.style.backgroundColor = '#fef2f2';
      banner.style.borderColor = '#f87171';
      text.style.color = '#991b1b';
    }
    
    let detailHtml = '';
    if (details && details.length > 0) {
      window._dashboardWarnings = details;
      detailHtml = ` <a href="#" style="text-decoration: underline; color: inherit; font-weight: 700; margin-left: 6px;" onclick="alert('Validation Warnings:\\n\\n' + window._dashboardWarnings.join('\\n')); return false;">(details)</a>`;
    }
    text.innerHTML = message + detailHtml;
  }

  async function loadExcelData() {
    console.log('🔄 Attempting to fetch data.xlsx from repository path...');
    try {
      const response = await fetch('data.xlsx');
      if (!response.ok) throw new Error('data.xlsx file not found.');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      
      if (typeof XLSX === 'undefined') {
        throw new Error('SheetJS library is not loaded. Ensure you have internet access to fetch SheetJS CDN.');
      }
      
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetsData = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      });
      
      const res = processExcelData(sheetsData);
      if (res.warnings.length > 0) {
        showStatusBanner('warning', `✓ Loaded data.xlsx automatically from repository. Found ${res.warnings.length} data validation warnings.`, res.warnings);
      } else {
        showStatusBanner('success', `✓ Automatically loaded latest data from data.xlsx committed in the repository.`);
      }
    } catch (err) {
      console.warn('Could not auto-load data.xlsx:', err.message);
      // Fallback to data.csv
      loadCSVData();
    }
  }

  async function loadCSVData() {
    console.log('🔄 Attempting to fetch data.csv from repository path...');
    try {
      const response = await fetch('data.csv');
      if (!response.ok) throw new Error('data.csv file not found.');
      const text = await response.text();
      
      const res = processCSVData(text, 'data.csv');
      if (res.warnings && res.warnings.length > 0) {
        showStatusBanner('warning', `✓ Loaded data.csv automatically from repository. Found ${res.warnings.length} data validation warnings.`, res.warnings);
      } else {
        showStatusBanner('success', `✓ Automatically loaded latest data from data.csv committed in the repository.`);
      }
    } catch (err) {
      console.warn('Could not auto-load data.csv:', err.message);
      
      // If running locally on file:// protocol
      if (window.location.protocol === 'file:') {
        showStatusBanner('warning', `ℹ️ Dashboard is opened directly as a file. Browser security policies prevent auto-loading data.xlsx/data.csv via file://. Fallback data loaded. Host it on a local server or GitHub Pages for automatic sync.`);
      }
      
      // Fallback to default static data
      detectQuarters();
      updateQuarterDropdown();
      updateFilterTabs();
      updateDashboard();
    }
  }

  // ============================================
  // CONVENTIONAL SETUPS (EVENT LISTENERS)
  // ============================================
  
  function setupQuarterDropdown() {
    const dropdown = document.getElementById('quarterDropdown');
    if (!dropdown) return;
    
    dropdown.addEventListener('change', (e) => {
      activeQuarter = e.target.value;
      console.log(`🔄 Switched to quarter: ${activeQuarter}`);
      updateFilterTabs();
      updateDashboard();
    });
  }
  
  function setupCsvImporter() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('csvFileInput');
    if (!uploadBtn || !fileInput) return;
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      const filename = file.name;
      const isExcel = filename.endsWith('.xlsx') || filename.endsWith('.xls');
      
      reader.onload = function(evt) {
        try {
          if (isExcel) {
            if (typeof XLSX === 'undefined') {
              alert('SheetJS library is not loaded. Cannot parse Excel files (.xlsx).');
              return;
            }
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetsData = {};
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            });
            const res = processExcelData(sheetsData);
            if (res.warnings.length > 0) {
              showStatusBanner('warning', `Manual Excel Import: Loaded ${filename} with ${res.warnings.length} warnings.`, res.warnings);
            } else {
              showStatusBanner('success', `✓ Successfully imported and parsed Excel file: ${filename}`);
            }
          } else {
            // CSV
            const text = evt.target.result;
            const res = processCSVData(text, filename);
            if (res.warnings && res.warnings.length > 0) {
              showStatusBanner('warning', `Manual CSV Import: Loaded ${filename} with ${res.warnings.length} warnings.`, res.warnings);
            } else {
              showStatusBanner('success', `✓ Successfully imported and parsed CSV file: ${filename}`);
            }
          }
        } catch (ex) {
          console.error(ex);
          alert(`Error parsing import file: ${ex.message}`);
        }
      };
      
      if (isExcel) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }
  
  // ============================================
  // ENTRY POINT ON DOM LOADED
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initializing...');
    
    // Bind UI actions
    setupQuarterDropdown();
    setupCsvImporter();
    
    // Auto-load excel/csv from repo
    loadExcelData();
  });
})();
