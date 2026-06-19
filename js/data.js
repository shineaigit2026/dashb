// data.js - UPDATED TO LOAD FROM SERVER
// This replaces your hardcoded data with dynamic loading

window.DashboardData = {
  leadsData: [],
  pipelineData: [],
  seoData: [],
  metaAdsMonthly: [],
  regionalLeadsMonthly: [],
  productEnquiriesMonthly: [],
  customerTypeMonthly: [],
  channelConversionsMonthly: [],
  googleCampaignsData: {},
  citiesData: [],
  
  // Load data from server
  async loadFromServer() {
    try {
      const response = await fetch('http://localhost:3000/api/data');
      if (response.ok) {
        const data = await response.json();
        
        // Merge server data with this object
        this.leadsData = data.leadsData || [];
        this.pipelineData = data.pipelineData || [];
        this.seoData = data.seoData || [];
        this.metaAdsMonthly = data.metaAdsMonthly || [];
        
        console.log('✓ Data loaded from server');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Could not load from server, using fallback');
      return false;
    }
  },
  
  // Fallback: Your existing hardcoded data
  // KEEP YOUR ORIGINAL DATA HERE as fallback
  leadsData: [ /* your original hardcoded data */ ],
  pipelineData: [ /* your original hardcoded data */ ],
  // ... rest of your data
  
  getFilteredData: function(monthFilter) {
    // Your existing getFilteredData function - NO CHANGES
    // ... keep your original implementation
  }
};

// Load from server on startup (with fallback to hardcoded)
document.addEventListener('DOMContentLoaded', async () => {
  const serverAvailable = await window.DashboardData.loadFromServer();
  
  if (!serverAvailable) {
    console.log('Using fallback hardcoded data');
    // Your dashboard will use the hardcoded data as before
  }
  
  // Rest of your dashboard initialization continues as normal
});
