// Wrap in a global namespace to avoid CORS errors when opened via file:// protocol
window.DashboardData = {
  leadsData: [
    { month: "January", website: 66, call: 118, whatsapp: 23, mail: 5, tollFree: 5, ecommerce: 1, facebook: 626, total: 845 },
    { month: "February", website: 20, call: 139, whatsapp: 41, mail: 3, tollFree: 7, ecommerce: 0, facebook: 629, total: 841 },
    { month: "March", website: 36, call: 142, whatsapp: 49, mail: 1, tollFree: 9, ecommerce: 1, facebook: 568, total: 806 }
  ],
  pipelineData: [
    {
      month: "January",
      conversions: 13,
      value: 2708243.00,
      followUp: 478,
      quoteGiven: 14,
      converted: 8,
      quoteLive: 5,
      quoteLost: 1,
      saleLost: 45,
      noResponse: 22,
      coldEnquiry: 49
    },
    {
      month: "February",
      conversions: 18,
      value: 2553303.00,
      followUp: 613,
      quoteGiven: 23,
      converted: 13,
      quoteLive: 10,
      quoteLost: 0,
      saleLost: 45,
      noResponse: 26,
      coldEnquiry: 93
    },
    {
      month: "March",
      conversions: 13,
      value: 7985951.00,
      followUp: 619,
      quoteGiven: 18,
      converted: 4,
      quoteLive: 14,
      quoteLost: 0,
      saleLost: 26,
      noResponse: 21,
      coldEnquiry: 91
    }
  ],
  seoData: [
    { month: "January", clicks: 1280, impressions: 48900, ctr: 2.60, position: 10.8 },
    { month: "February", clicks: 1130, impressions: 53300, ctr: 2.10, position: 11.0 },
    { month: "March", clicks: 1220, impressions: 70700, ctr: 1.70, position: 8.4 }
  ],
  regionalLeadsMonthly: [
    { month: "January", south: 380, north: 200, west: 160, east: 105 },
    { month: "February", south: 390, north: 180, west: 170, east: 101 },
    { month: "March", south: 347, north: 182, west: 98, east: 9 }
  ],
  productEnquiriesMonthly: [
    { month: "January", office: 215, gantry: 245, hospital: 190, education: 135, allProds: 12, chairs: 21, cafe: 5, tables: 1 },
    { month: "February", office: 205, gantry: 200, hospital: 240, education: 115, allProds: 35, chairs: 25, cafe: 10, tables: 2 },
    { month: "March", office: 180, gantry: 200, hospital: 238, education: 110, allProds: 40, chairs: 35, cafe: 2, tables: 1 }
  ],
  customerTypeMonthly: [
    { month: "January", healthcare: 390, officeOrg: 188, education: 100, reseller: 45, individual: 50, others: 65, hotelCafe: 5, architect: 1 },
    { month: "February", healthcare: 420, officeOrg: 185, education: 115, reseller: 55, individual: 38, others: 10, hotelCafe: 10, architect: 2 },
    { month: "March", healthcare: 350, officeOrg: 198, education: 118, reseller: 60, individual: 48, others: 32, hotelCafe: 5, architect: 3 }
  ],
  channelConversionsMonthly: [
    { month: "January", call: 5, website: 1, facebook: 2, whatsapp: 2, ecommerce: 3 },
    { month: "February", call: 7, website: 2, facebook: 2, whatsapp: 3, ecommerce: 4 },
    { month: "March", call: 5, website: 2, facebook: 1, whatsapp: 2, ecommerce: 4 }
  ],
  googleCampaignsData: {
    January: [
      { name: "School Furniture - S", spend: 12944.72, interactions: 326, ctr: 9.86, cpc: 39.71, conv: 17, rating: "Strong" },
      { name: "School Furniture - Search", spend: 3959.72, interactions: 222, ctr: 8.21, cpc: 17.84, conv: 34, rating: "Top" },
      { name: "Performance Max-14- Shop Ad", spend: 6059.52, interactions: 1446, ctr: 1.64, cpc: 4.19, conv: 0, rating: "Low ROI" },
      { name: "Display Intent Ads- WFH", spend: 2775.46, interactions: 350, ctr: 5.42, cpc: 12.99, conv: 3, rating: "Review" }
    ],
    February: [
      { name: "School Furniture - S", spend: 12794.27, interactions: 370, ctr: 8.74, cpc: 34.58, conv: 41, rating: "Top" },
      { name: "School Furniture - Search", spend: 3827.57, interactions: 218, ctr: 7.24, cpc: 17.56, conv: 31, rating: "Top" },
      { name: "Performance Max-14- Shop Ad", spend: 3186.53, interactions: 1659, ctr: 2.05, cpc: 1.92, conv: 0, rating: "Low ROI" },
      { name: "Intent Display Ads", spend: 3065.76, interactions: 487, ctr: 8.51, cpc: 6.30, conv: 0, rating: "No conv." },
      { name: "Display Intent Ads- WFH", spend: 3040.57, interactions: 2247, ctr: 6.90, cpc: 1.35, conv: 0, rating: "No conv." },
      { name: "Office series Campaign", spend: 1382.38, interactions: 2346, ctr: 5.60, cpc: 0.59, conv: 72, rating: "Efficient" }
    ],
    March: [
      { name: "AI-Ad-Leads-Search-59", spend: 14400.29, interactions: 1626, ctr: 5.85, cpc: 8.86, conv: 6, rating: "Review" },
      { name: "Fans-Leads-Search-61", spend: 13996.20, interactions: 1291, ctr: 1.34, cpc: 10.84, conv: 0, rating: "No conv." },
      { name: "School Furniture - S", spend: 6169.69, interactions: 161, ctr: 12.33, cpc: 38.32, conv: 13, rating: "Strong" },
      { name: "Performance Max-14- Shop Ad", spend: 4309.61, interactions: 2272, ctr: 1.95, cpc: 1.90, conv: 1, rating: "Low ROI" },
      { name: "Waiting-Chair-Leads-Search-62", spend: 3954.72, interactions: 395, ctr: 4.00, cpc: 10.01, conv: 0, rating: "No conv." },
      { name: "School Furniture - Search", spend: 3672.95, interactions: 222, ctr: 7.86, cpc: 16.54, conv: 40, rating: "Top" },
      { name: "Display Intent Ads- WFH", spend: 3048.13, interactions: 1339, ctr: 13.77, cpc: 2.28, conv: 0, rating: "No conv." },
      { name: "Intent Display Ads", spend: 3040.32, interactions: 536, ctr: 15.95, cpc: 5.67, conv: 0, rating: "No conv." },
      { name: "Office series Campaign", spend: 380.89, interactions: 524, ctr: 7.73, cpc: 0.73, conv: 17, rating: "Efficient" },
      { name: "Hyderabad - School Furniture 2022", spend: 82.93, interactions: 33, fill: "", ctr: 1.73, cpc: 2.51, conv: 0, rating: "No conv." },
      { name: "Chennai - Hospital Chairs 2022", spend: 35.58, interactions: 5, ctr: 2.76, cpc: 7.12, conv: 0, rating: "No conv." }
    ]
  },
  metaAdsMonthly: [
    { month: "January", spend: 45274.54, leads: 626, cpl: 72 },
    { month: "February", spend: 39677.04, leads: 629, cpl: 58 },
    { month: "March", spend: 40034.91, leads: 568, cpl: 70 }
  ],
  citiesData: [
    { city: "Kondapur, Hyderabad", state: "Telangana", month: "March", value: 1508276 },
    { city: "Chinnasalem", state: "Tamil Nadu", month: "January", value: 1022369 },
    { city: "Chennai (multiple)", state: "Tamil Nadu", month: "March", value: 976328 },
    { city: "Marathahalli, Bengaluru", state: "Karnataka", month: "March", value: 649376 },
    { city: "Coimbatore", state: "Tamil Nadu", month: "March", value: 633250 },
    { city: "Virar (West)", state: "Maharashtra", month: "March", value: 541474 },
    { city: "Viman Nagar, Pune", state: "Maharashtra", month: "March", value: 460718 },
    { city: "Waidhan, Singrauli", state: "Madhya Pradesh", month: "January", value: 465510 },
    { city: "Koramangala/Indira Nagar", state: "Karnataka", month: "March", value: 374640 },
    { city: "Sarjapur, Bengaluru", state: "Karnataka", month: "March", value: 479760 },
    { city: "Coimbatore", state: "Tamil Nadu", month: "February", value: 231959 },
    { city: "Sivakasi", state: "Tamil Nadu", month: "January", value: 211183 },
    { city: "Madurai", state: "Tamil Nadu", month: "January", value: 208194 },
    { city: "Kottayam", state: "Kerala", month: "February", value: 202852 },
    { city: "Indore", state: "Madhya Pradesh", month: "March", value: 301630 }
  ],
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
