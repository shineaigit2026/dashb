window.DashboardCharts = {
  chartInstances: {},
  getQuarterMap: function () {

 const months =
 [...new Set(window.DashboardData.leadsData.map(x => x.month))];

 const result={};

 months.forEach(month=>{

   const monthIndex=new Date(`${month} 1, 2026`).getMonth();

   const q=`Q${Math.floor(monthIndex/3)+1}`;

   if(!result[q])
      result[q]=[];

   result[q].push(month);

 });

 return result;
},

getMonthsForQuarter:function(){

 const dropdown=document.getElementById('quarterDropdown');

 const quarter=dropdown ? dropdown.value : 'Q1';

 const quarterMap=this.getQuarterMap();

 return quarterMap[quarter] || [];

},
  resetCanvas: function(canvasId) {
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
      delete this.chartInstances[canvasId];
    }
  },
  
  getActiveQuarterMonths:function(){

 return this.getMonthsForQuarter();

},

  drawLeadSourcesChart: function(monthFilter) {
    const canvasId = 'leadSourcesChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    
    const months = this.getActiveQuarterMonths();
    const labels = months.map(m => m.substring(0, 3));
    
    const fbData = months.map(m => {
      const d = dataObj.leadsData.find(x => x.month === m);
      return d ? d.facebook : 0;
    });
    const callData = months.map(m => {
      const d = dataObj.leadsData.find(x => x.month === m);
      return d ? d.call : 0;
    });
    const webData = months.map(m => {
      const d = dataObj.leadsData.find(x => x.month === m);
      return d ? d.website : 0;
    });
    const waData = months.map(m => {
      const d = dataObj.leadsData.find(x => x.month === m);
      return d ? d.whatsapp : 0;
    });
    const otherData = months.map(m => {
      const d = dataObj.leadsData.find(x => x.month === m);
      return d ? (d.mail + d.tollFree + d.ecommerce) : 0;
    });

    const getOpacities = (index) => {
      if (monthFilter.startsWith('All ')) return 1.0;
      return months[index] === monthFilter ? 1.0 : 0.35;
    };
    const createBackground = (baseColor) => {
      return months.map((_, i) => {
        const opacity = getOpacities(i);
        return baseColor.replace('1)', `${opacity})`);
      });
    };

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Facebook', data: fbData, backgroundColor: createBackground('rgba(37, 99, 235, 1)'), stack: 'Stack 0' },
          { label: 'Call', data: callData, backgroundColor: createBackground('rgba(124, 58, 237, 1)'), stack: 'Stack 0' },
          { label: 'Website', data: webData, backgroundColor: createBackground('rgba(16, 185, 129, 1)'), stack: 'Stack 0' },
          { label: 'WhatsApp', data: waData, backgroundColor: createBackground('rgba(217, 119, 6, 1)'), stack: 'Stack 0' },
          { label: 'Others', data: otherData, backgroundColor: createBackground('rgba(148, 163, 184, 1)'), stack: 'Stack 0' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { family: 'Outfit', size: 11 } } },
          tooltip: { callbacks: { label: (context) => ` ${context.dataset.label}: ${context.raw} leads` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  },

  drawSpendValueChart: function(monthFilter) {
    const canvasId = 'spendValueChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    
    const months = this.getActiveQuarterMonths();
    const labels = months.map(m => m.substring(0, 3));

    const spendData = months.map(m => {
      const campaigns = dataObj.googleCampaignsData[m] || [];
      const gSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
      const mSpendObj = dataObj.metaAdsMonthly.find(x => x.month === m);
      const mSpend = mSpendObj ? mSpendObj.spend : 0;
      return Math.round((gSpend + mSpend) / 1000);
    });
    const valueData = months.map(m => {
      const pipe = dataObj.pipelineData.find(x => x.month === m);
      const val = pipe ? pipe.value : 0;
      return val / 100000;
    });

    const getOpacities = (index) => {
      if (monthFilter.startsWith('All ')) return 1.0;
      return months[index] === monthFilter ? 1.0 : 0.35;
    };
    const bgSpendColors = months.map((_, i) => `rgba(37, 99, 235, ${getOpacities(i)})`);
    const bgLineColors = months.map((_, i) => `rgba(16, 185, 129, ${getOpacities(i)})`);

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Spend (₹K)',
            data: spendData,
            backgroundColor: bgSpendColors,
            yAxisID: 'y',
            order: 2,
            barThickness: 36
          },
          {
            label: 'Conv Value (₹L)',
            data: valueData,
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 3,
            pointBackgroundColor: bgLineColors,
            pointBorderColor: 'rgba(16, 185, 129, 1)',
            pointHoverRadius: 6,
            pointRadius: 4,
            type: 'line',
            yAxisID: 'y1',
            order: 1,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { family: 'Outfit', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { 
            position: 'left',
            title: { display: true, text: 'Spend (₹ Thousands)', font: { family: 'Outfit', size: 10 } },
            grid: { color: '#f1f5f9' },
            ticks: { font: { family: 'Outfit' } } 
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'Conversion Value (₹ Lakhs)', font: { family: 'Outfit', size: 10 } },
            grid: { display: false },
            ticks: { font: { family: 'Outfit' } }
          }
        }
      }
    });
  },

  drawModelEnquiriesChart: function(monthFilter) {
    const canvasId = 'modelEnquiriesChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    const labels = ['Office', 'Gantry', 'Hospital', 'Education', 'All Prods', 'Chairs', 'Café', 'Tables'];
    
    let data = [];
    if (monthFilter.startsWith('All ')) {
      const quarter = monthFilter.replace("All ", "");
      const monthsInQuarter =
this.getQuarterMap()[quarter] || [];
      const dataObjList = dataObj.productEnquiriesMonthly.filter(d => monthsInQuarter.includes(d.month));
      
      labels.forEach(lbl => {
        const prop = lbl === 'All Prods' ? 'allProds' : lbl === 'Café' ? 'cafe' : lbl.toLowerCase();
        const sum = dataObjList.reduce((acc, curr) => acc + (curr[prop] || 0), 0);
        data.push(sum);
      });
    } else {
      const monthly = dataObj.productEnquiriesMonthly.find(x => x.month === monthFilter);
      labels.forEach(lbl => {
        const prop = lbl === 'All Prods' ? 'allProds' : lbl === 'Café' ? 'cafe' : lbl.toLowerCase();
        data.push(monthly ? (monthly[prop] || 0) : 0);
      });
    }

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Enquiries',
          data: data,
          backgroundColor: 'rgba(37, 99, 235, 0.85)',
          hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  },

  drawCustomerTypeChart: function(monthFilter) {
    const canvasId = 'customerTypeChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    const labels = ['Healthcare', 'Office/Org', 'Education', 'Reseller', 'Individual', 'Others', 'Hotel/Café', 'Architect'];
    
    let data = [];
    if (monthFilter.startsWith('All ')) {
      const quarter = monthFilter.replace("All ", "");
     const monthsInQuarter =
this.getQuarterMap()[quarter] || [];
      const dataObjList = dataObj.customerTypeMonthly.filter(d => monthsInQuarter.includes(d.month));
      
      labels.forEach(lbl => {
        const prop = lbl === 'Office/Org' ? 'officeOrg' : lbl === 'Hotel/Café' ? 'hotelCafe' : lbl.toLowerCase();
        const sum = dataObjList.reduce((acc, curr) => acc + (curr[prop] || 0), 0);
        data.push(sum);
      });
    } else {
      const monthly = dataObj.customerTypeMonthly.find(x => x.month === monthFilter);
      labels.forEach(lbl => {
        const prop = lbl === 'Office/Org' ? 'officeOrg' : lbl === 'Hotel/Café' ? 'hotelCafe' : lbl.toLowerCase();
        data.push(monthly ? (monthly[prop] || 0) : 0);
      });
    }

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Customers',
          data: data,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  },

  drawChannelConversionsChart: function(monthFilter) {
    const canvasId = 'channelConversionsChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    const labels = ['Call', 'Website', 'Facebook', 'WhatsApp', 'Ecommerce'];
    
    let data = [];
    if (monthFilter.startsWith('All ')) {
      const quarter = monthFilter.replace("All ", "");
      const monthsInQuarter =
this.getQuarterMap()[quarter] || [];
      const dataObjList = dataObj.channelConversionsMonthly.filter(d => monthsInQuarter.includes(d.month));
      
      labels.forEach(lbl => {
        const prop = lbl.toLowerCase();
        const sum = dataObjList.reduce((acc, curr) => acc + (curr[prop] || 0), 0);
        data.push(sum);
      });
    } else {
      const monthly = dataObj.channelConversionsMonthly.find(x => x.month === monthFilter);
      labels.forEach(lbl => {
        const prop = lbl.toLowerCase();
        data.push(monthly ? (monthly[prop] || 0) : 0);
      });
    }

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(37, 99, 235, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(244, 63, 94, 0.85)',
            'rgba(217, 119, 6, 0.85)',
            'rgba(124, 58, 237, 0.85)'
          ],
          hoverOffset: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'right', labels: { boxWidth: 12, font: { family: 'Outfit', size: 11 } } }
        },
        cutout: '65%'
      }
    });
  },

  drawRegionLeadsChart: function(monthFilter) {
    const canvasId = 'regionLeadsChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    
    const months = this.getActiveQuarterMonths();
    const labels = months.map(m => m.substring(0, 3));
    
    const southData = months.map(m => {
      const d = dataObj.regionalLeadsMonthly.find(x => x.month === m);
      return d ? d.south : 0;
    });
    const northData = months.map(m => {
      const d = dataObj.regionalLeadsMonthly.find(x => x.month === m);
      return d ? d.north : 0;
    });
    const westData = months.map(m => {
      const d = dataObj.regionalLeadsMonthly.find(x => x.month === m);
      return d ? d.west : 0;
    });
    const eastData = months.map(m => {
      const d = dataObj.regionalLeadsMonthly.find(x => x.month === m);
      return d ? d.east : 0;
    });

    const getOpacities = (index) => {
      if (monthFilter.startsWith('All ')) return 1.0;
      return months[index] === monthFilter ? 1.0 : 0.35;
    };
    const createBackground = (baseColor) => {
      return months.map((_, i) => baseColor.replace('1)', `${getOpacities(i)})`));
    };

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'South', data: southData, backgroundColor: createBackground('rgba(124, 58, 237, 1)'), stack: 'Stack 0' },
          { label: 'North', data: northData, backgroundColor: createBackground('rgba(37, 99, 235, 1)'), stack: 'Stack 0' },
          { label: 'West', data: westData, backgroundColor: createBackground('rgba(16, 185, 129, 1)'), stack: 'Stack 0' },
          { label: 'East', data: eastData, backgroundColor: createBackground('rgba(217, 119, 6, 1)'), stack: 'Stack 0' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { family: 'Outfit', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Outfit' } } }
        }
      }
    });
  },

  drawSeoChart: function(monthFilter) {
    const canvasId = 'seoChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    
    const months = this.getActiveQuarterMonths();
    const labels = months.map(m => m.substring(0, 3));
    
    const clicks = months.map(m => {
      const d = dataObj.seoData.find(x => x.month === m);
      return d ? d.clicks : 0;
    });
    const positions = months.map(m => {
      const d = dataObj.seoData.find(x => x.month === m);
      return d ? d.position : 0;
    });

    const getOpacities = (index) => {
      if (monthFilter.startsWith('All ')) return 1.0;
      return months[index] === monthFilter ? 1.0 : 0.35;
    };
    const createBackground = (baseColor) => {
      return months.map((_, i) => baseColor.replace('1)', `${getOpacities(i)})`));
    };

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Clicks',
            data: clicks,
            backgroundColor: createBackground('rgba(124, 58, 237, 0.85)'),
            yAxisID: 'y',
            order: 2,
            barThickness: 24
          },
          {
            label: 'Avg Position',
            data: positions,
            borderColor: 'rgba(217, 119, 6, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(217, 119, 6, 1)',
            pointHoverRadius: 6,
            pointRadius: 4,
            type: 'line',
            yAxisID: 'y1',
            order: 1,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { family: 'Outfit', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { 
            position: 'left',
            title: { display: true, text: 'Clicks', font: { family: 'Outfit', size: 10 } },
            grid: { color: '#f1f5f9' },
            ticks: { font: { family: 'Outfit' } } 
          },
          y1: {
            position: 'right',
            reverse: true,
            title: { display: true, text: 'Avg Position', font: { family: 'Outfit', size: 10 } },
            grid: { display: false },
            ticks: { font: { family: 'Outfit' } }
          }
        }
      }
    });
  },

  drawMetaAdsChart: function(monthFilter) {
    const canvasId = 'metaAdsChart';
    this.resetCanvas(canvasId);
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const dataObj = window.DashboardData;
    
    const months = this.getActiveQuarterMonths();
    const labels = months.map(m => m.substring(0, 3));
    
    const spend = months.map(m => {
      const d = dataObj.metaAdsMonthly.find(x => x.month === m);
      return d ? d.spend / 1000 : 0;
    });
    const cpl = months.map(m => {
      const d = dataObj.metaAdsMonthly.find(x => x.month === m);
      return d ? d.cpl : 0;
    });

    const getOpacities = (index) => {
      if (monthFilter.startsWith('All ')) return 1.0;
      return months[index] === monthFilter ? 1.0 : 0.35;
    };
    const createBackground = (baseColor) => {
      return months.map((_, i) => baseColor.replace('1)', `${getOpacities(i)})`));
    };

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Spend (₹K)',
            data: spend,
            backgroundColor: createBackground('rgba(236, 72, 153, 0.8)'),
            yAxisID: 'y',
            order: 2,
            barThickness: 40
          },
          {
            label: 'CPL (₹)',
            data: cpl,
            borderColor: 'rgba(236, 72, 153, 1)',
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: 'rgba(236, 72, 153, 1)',
            pointHoverRadius: 6,
            pointRadius: 4,
            type: 'line',
            yAxisID: 'y1',
            order: 1,
            tension: 0.15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { family: 'Outfit', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit' } } },
          y: { 
            position: 'left',
            title: { display: true, text: 'Spend (₹K)', font: { family: 'Outfit', size: 10 } },
            grid: { color: '#f1f5f9' },
            ticks: { font: { family: 'Outfit' } } 
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'CPL (₹)', font: { family: 'Outfit', size: 10 } },
            grid: { display: false },
            ticks: { font: { family: 'Outfit' } }
          }
        }
      }
    });
  },

  updateAllCharts: function(monthFilter) {
    this.drawLeadSourcesChart(monthFilter);
    this.drawSpendValueChart(monthFilter);
    this.drawModelEnquiriesChart(monthFilter);
    this.drawCustomerTypeChart(monthFilter);
    this.drawChannelConversionsChart(monthFilter);
    this.drawRegionLeadsChart(monthFilter);
    this.drawSeoChart(monthFilter);
    this.drawMetaAdsChart(monthFilter);
  }
};
