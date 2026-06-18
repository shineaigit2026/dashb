window.DashboardInsights = {
  insightsData: {
    "All Q1": {
      findings: [
        {
          icon: "📈",
          iconClass: "icon-emerald",
          title: "March hit the ₹50L target",
          text: "₹79.8L conversion value in March — 159.8% of target. Driven by Hyderabad (₹15L), Bengaluru (₹30L+) and Pune clusters."
        },
        {
          icon: "⚠️",
          iconClass: "icon-rose",
          title: "Jan & Feb missed target",
          text: "Jan: ₹27.1L (54%) and Feb: ₹25.5L (51%). Both months below the ₹50L monthly target, dragging Q1 average."
        },
        {
          icon: "🏆",
          iconClass: "icon-purple",
          title: "Office Series — highest ROI campaign",
          text: "₹1,382 spend -> 72 conversions -> ₹19 cost per conversion. Massively underallocated budget given performance."
        },
        {
          icon: "📍",
          iconClass: "icon-blue",
          title: "South leads but West is growing",
          text: "South dominates at 1,117 leads (45%) but West grew Jan–Mar: 124–172 (+39%). Bengaluru cluster in March alone = ₹30L+ value."
        }
      ],
      priorities: [
        {
          icon: "🚀",
          iconClass: "icon-emerald",
          title: "Scale Office Series & School Furniture",
          text: "Combined 102 Google conversions in Q1. Increase budget 40-50%. These are the most cost-efficient campaigns."
        },
        {
          icon: "🛑",
          iconClass: "icon-rose",
          title: "Pause Performance Max & AI-Leads",
          text: "Spent ₹18.7K in March, 7 conversions total. Reallocate to Hospital Series or Waiting Chair campaigns with better landing pages."
        },
        {
          icon: "🗺️",
          iconClass: "icon-blue",
          title: "Target Bengaluru, Hyderabad & Pune",
          text: "March city data shows these 3 cities = ₹45L+ in conversion value. Run geo-targeted campaigns for these clusters."
        },
        {
          icon: "⏳",
          iconClass: "icon-amber",
          title: "Fix follow-up to quote conversion",
          text: "1,728 in follow-up, only 74 quotes given (4.3%). A structured sales script and faster TAT could add 20-30 more conversions."
        }
      ]
    },
    "January": {
      findings: [
        {
          icon: "⚠️",
          iconClass: "icon-rose",
          title: "January missed monthly target",
          text: "Revenue of ₹27.08L hit only 54% of the ₹50L monthly target, showing slow post-holiday market pickup."
        },
        {
          icon: "📊",
          iconClass: "icon-blue",
          title: "Facebook Leads dominate top-funnel",
          text: "Facebook generated 626 leads (74% of total). Average Meta CPL was ₹72, which is higher than Q1 average."
        },
        {
          icon: "🎯",
          iconClass: "icon-emerald",
          title: "School Furniture Search starts strong",
          text: "Campaign generated 34 conversions with ₹3,960 spend. Excellent efficiency profile."
        }
      ],
      priorities: [
        {
          icon: "💡",
          iconClass: "icon-amber",
          title: "Optimize Meta Ads budget placement",
          text: "CPL of ₹72 is high. Review target audiences and refresh creative banners to drop CPL closer to the ₹60 target."
        },
        {
          icon: "✔️",
          iconClass: "icon-emerald",
          title: "Shift Google Ads budget to Search campaigns",
          text: "School Furniture search campaigns are outperforming Performance Max. Shift 20% budget away from PMax."
        }
      ]
    },
    "February": {
      findings: [
        {
          icon: "⚠️",
          iconClass: "icon-rose",
          title: "February missed monthly target by 49%",
          text: "Value reached ₹25.53L. Flat performance compared to January, despite a CPL drop on Meta Ads."
        },
        {
          icon: "💸",
          iconClass: "icon-emerald",
          title: "Meta CPL dropped to lowest (₹58)",
          text: "Improved ad creatives on Instagram and Facebook resulted in best-in-quarter CPL, generating 629 leads."
        },
        {
          icon: "🎖️",
          iconClass: "icon-purple",
          title: "Office Series campaign explodes",
          text: "Generated 72 conversions at a cost of only ₹1,382 (₹19 per conversion). Extremely cost-efficient."
        }
      ],
      priorities: [
        {
          icon: "🚀",
          iconClass: "icon-emerald",
          title: "Immediately increase Office Series spend",
          text: "Office Series is highly underallocated at ₹1.3K. Allocate an additional ₹10K from PMax to scale conversions."
        },
        {
          icon: "🤝",
          iconClass: "icon-blue",
          title: "Train sales team on Follow-ups",
          text: "Follow-up leads list grew to 613, but only 23 quotes were given (3.7% rate). Pipeline bottleneck detected."
        }
      ]
    },
    "March": {
      findings: [
        {
          icon: "🎉",
          iconClass: "icon-emerald",
          title: "March exceeded target by 60%!",
          text: "Revenue jumped to ₹79.86L (159.8% of ₹50L target), fueled by key institutional orders."
        },
        {
          icon: "📍",
          iconClass: "icon-blue",
          title: "Kondapur & Chennai drive massive volume",
          text: "Kondapur (Hyderabad) order contributed ₹15.1L and Chennai contributed ₹9.8L in closed value."
        },
        {
          icon: "📈",
          iconClass: "icon-purple",
          title: "Search campaigns drive conversions",
          text: "School Furniture Search generated 40 conversions, and School Furniture - S generated 13 conversions."
        }
      ],
      priorities: [
        {
          icon: "🔒",
          iconClass: "icon-blue",
          title: "Lock-in geographic campaigns",
          text: "Run regional targeted campaigns specifically focusing on Telangana and Tamil Nadu tech hubs."
        },
        {
          icon: "⚠️",
          iconClass: "icon-rose",
          title: "Audit AI-Ad-Leads campaign",
          text: "Spent ₹14.4K in March but drove only 6 conversions. Review keywords and negative exclusions."
        }
      ]
    }
  },
  updateInsights: function(monthFilter) {
    const isQuarter = monthFilter.startsWith("All ");
    const key = isQuarter ? `All ${monthFilter.replace("All ", "")}` : monthFilter;
    
    // Graceful fallback to Q1 insights if data doesn't exist for the key
    const data = this.insightsData[key] || this.insightsData["All Q1"];
    
    const findingsContainer = document.getElementById('keyFindingsList');
    if (findingsContainer) {
      findingsContainer.innerHTML = data.findings.map(f => `
        <div class="insight-card">
          <div class="insight-icon ${f.iconClass}">${f.icon}</div>
          <div class="insight-details">
            <strong>${f.title}</strong>
            <p>${f.text}</p>
          </div>
        </div>
      `).join('');
    }
    
    const prioritiesContainer = document.getElementById('q2PrioritiesList');
    if (prioritiesContainer) {
      prioritiesContainer.innerHTML = data.priorities.map(p => `
        <div class="insight-card">
          <div class="insight-icon ${p.iconClass}">${p.icon}</div>
          <div class="insight-details">
            <strong>${p.title}</strong>
            <p>${p.text}</p>
          </div>
        </div>
      `).join('');
    }
    
    // Update header of priorities dynamically based on quarter
    const prioritiesTitle = document.getElementById('insightsPrioritiesTitle');
    if (prioritiesTitle) {
      const q = isQuarter ? monthFilter.replace("All ", "") : "Q1";
      prioritiesTitle.textContent = `${q} action priorities`;
    }
  }
};
