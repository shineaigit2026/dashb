// Wrap in a global namespace to avoid CORS errors when opened via file:// protocol
window.DashboardData = {
  // ============================================
  // EMPTY DATA STRUCTURES - AUTO-POPULATED FROM EXCEL/CSV
  // ============================================
  
  leadsData: [],
  pipelineData: [],
  seoData: [],
  regionalLeadsMonthly: [],
  productEnquiriesMonthly: [],
  customerTypeMonthly: [],
  channelConversionsMonthly: [],
  googleCampaignsData: {},
  metaAdsMonthly: [],
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
