/**
 * EXCEL DATA VALIDATION & PROCESSING SERVER
 * Validates Excel files, hardcodes validated data into a JSON file
 * Serves both dashboard and validated data endpoints
 */

const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS & Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File upload config
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ============================================
// DATA VALIDATION SCHEMAS
// ============================================

const VALIDATION_RULES = {
  leadsData: {
    month: { type: 'string', required: true, pattern: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ },
    website: { type: 'number', required: false, min: 0 },
    call: { type: 'number', required: false, min: 0 },
    whatsapp: { type: 'number', required: false, min: 0 },
    mail: { type: 'number', required: false, min: 0 },
    tollFree: { type: 'number', required: false, min: 0 },
    ecommerce: { type: 'number', required: false, min: 0 },
    facebook: { type: 'number', required: false, min: 0 },
    total: { type: 'number', required: false, min: 0 }
  },
  pipelineData: {
    month: { type: 'string', required: true, pattern: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ },
    conversions: { type: 'number', required: false, min: 0 },
    value: { type: 'number', required: false, min: 0 },
    followUp: { type: 'number', required: false, min: 0 },
    quoteGiven: { type: 'number', required: false, min: 0 },
    converted: { type: 'number', required: false, min: 0 },
    quoteLive: { type: 'number', required: false, min: 0 },
    quoteLost: { type: 'number', required: false, min: 0 },
    saleLost: { type: 'number', required: false, min: 0 },
    noResponse: { type: 'number', required: false, min: 0 },
    coldEnquiry: { type: 'number', required: false, min: 0 }
  },
  seoData: {
    month: { type: 'string', required: true, pattern: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ },
    clicks: { type: 'number', required: false, min: 0 },
    impressions: { type: 'number', required: false, min: 0 },
    ctr: { type: 'number', required: false, min: 0, max: 100 },
    position: { type: 'number', required: false, min: 0 }
  },
  metaAdsMonthly: {
    month: { type: 'string', required: true, pattern: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ },
    spend: { type: 'number', required: false, min: 0 },
    leads: { type: 'number', required: false, min: 0 },
    cpl: { type: 'number', required: false, min: 0 }
  }
};

// ============================================
// KEY MAPPING (FLEXIBLE COLUMN NAMES)
// ============================================

const KEY_MAPS = {
  leadsData: {
    month: ['month', 'period', 'monthname'],
    website: ['website', 'websiteleads', 'web'],
    call: ['call', 'callleads', 'calls'],
    whatsapp: ['whatsapp', 'whatsappleads', 'wa'],
    mail: ['mail', 'mailleads', 'email', 'emails'],
    tollFree: ['tollfree', 'tollfreeleads', 'toll'],
    ecommerce: ['ecommerce', 'ecommerceleads', 'online'],
    facebook: ['facebook', 'facebookleads', 'fb', 'fbleads'],
    total: ['total', 'totalleads', 'leads']
  },
  pipelineData: {
    month: ['month', 'period', 'monthname'],
    conversions: ['conversions', 'conv', 'deals'],
    value: ['value', 'conversionvalue', 'revenue', 'amount', 'conv_value'],
    followUp: ['followup', 'needfollowup', 'followups', 'follow_up'],
    quoteGiven: ['quotegiven', 'quotesgiven', 'quote', 'quote_given'],
    converted: ['converted', 'closed', 'won'],
    quoteLive: ['quotelive', 'quoteslive', 'livequotes', 'quote_live'],
    quoteLost: ['quotelost', 'quoteslost', 'lostquotes', 'quote_lost'],
    saleLost: ['salelost', 'saleslost', 'lostsales', 'sale_lost'],
    noResponse: ['noresponse', 'noresponses', 'no_response'],
    coldEnquiry: ['coldenquiry', 'coldenquiries', 'cold']
  },
  seoData: {
    month: ['month', 'period', 'monthname'],
    clicks: ['clicks', 'seoclicks'],
    impressions: ['impressions', 'seoimpressions'],
    ctr: ['ctr', 'seoctr', 'click_through_rate'],
    position: ['position', 'seoposition', 'avgposition', 'avg_position']
  },
  metaAdsMonthly: {
    month: ['month', 'period', 'monthname'],
    spend: ['spend', 'metaspend', 'cost', 'meta_spend'],
    leads: ['leads', 'metaleads', 'meta_leads'],
    cpl: ['cpl', 'metacpl', 'costperlead', 'cost_per_lead']
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

function normalizeKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseNumber(val) {
  if (val === null || val === undefined || val === '') return 0;
  const clean = String(val).replace(/[₹$,%\s]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : Math.max(0, num); // No negative values
}

function findMatchingKey(rowObj, synonyms) {
  const normalizedRow = {};
  Object.keys(rowObj).forEach(k => {
    normalizedRow[normalizeKey(k)] = rowObj[k];
  });
  
  for (let syn of synonyms) {
    const normSyn = normalizeKey(syn);
    if (normalizedRow[normSyn] !== undefined && normalizedRow[normSyn] !== null && normalizedRow[normSyn] !== '') {
      return normalizedRow[normSyn];
    }
  }
  return undefined;
}

function mapRow(row, schema, warnings, rowIdx, sheetName) {
  const mapped = {};
  let hasData = false;
  
  Object.keys(schema).forEach(prop => {
    const synonyms = KEY_MAPS[sheetName] ? KEY_MAPS[sheetName][prop] : [];
    let foundVal = findMatchingKey(row, synonyms || []);
    
    if (foundVal !== undefined) {
      hasData = true;
      
      if (prop === 'month') {
        const normM = normalizeMonth(foundVal);
        if (!normM) {
          warnings.push(`⚠️ Row ${rowIdx} [${sheetName}]: Invalid month "${foundVal}"`);
        }
        mapped[prop] = normM;
      } else if (typeof schema[prop].type === 'number' || schema[prop].type === 'number') {
        mapped[prop] = parseNumber(foundVal);
      } else {
        mapped[prop] = String(foundVal).trim();
      }
    } else {
      // Default values
      mapped[prop] = schema[prop].type === 'number' ? 0 : "";
    }
  });
  
  return { mapped, hasData };
}

function validateRow(row, rules, warnings, rowIdx, sheetName) {
  const errors = [];
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const val = row[field];
    
    if (rule.required && (!val || val === 0)) {
      errors.push(`${field} is required`);
    }
    
    if (rule.type === 'number' && typeof val === 'number') {
      if (rule.min !== undefined && val < rule.min) {
        errors.push(`${field} must be >= ${rule.min}`);
      }
      if (rule.max !== undefined && val > rule.max) {
        errors.push(`${field} must be <= ${rule.max}`);
      }
    }
    
    if (rule.pattern && typeof val === 'string' && !rule.pattern.test(val)) {
      errors.push(`${field} format invalid`);
    }
  });
  
  if (errors.length > 0) {
    warnings.push(`❌ Row ${rowIdx} [${sheetName}]: ${errors.join(', ')}`);
  }
  
  return errors.length === 0;
}

// ============================================
// EXCEL PROCESSOR
// ============================================

function processExcelFile(filePath) {
  const warnings = [];
  const results = {
    leadsData: [],
    pipelineData: [],
    seoData: [],
    metaAdsMonthly: []
  };
  
  try {
    const workbook = XLSX.readFile(filePath);
    
    // Process each sheet
    Object.keys(results).forEach(dataType => {
      // Find matching sheet name (case-insensitive)
      const sheetName = workbook.SheetNames.find(s => 
        s.toLowerCase().includes(dataType.replace('Data', '').replace('Monthly', '').toLowerCase())
      );
      
      if (!sheetName) {
        warnings.push(`⏭️  Sheet not found for "${dataType}"`);
        return;
      }
      
      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      
      const schema = VALIDATION_RULES[dataType];
      
      data.forEach((row, idx) => {
        const { mapped, hasData } = mapRow(row, schema, warnings, idx + 2, dataType);
        
        if (hasData && mapped.month) {
          if (validateRow(mapped, schema, warnings, idx + 2, dataType)) {
            // Auto-calculate total if missing for leads
            if (dataType === 'leadsData' && mapped.total === 0) {
              mapped.total = mapped.website + mapped.call + mapped.whatsapp + 
                            mapped.mail + mapped.tollFree + mapped.ecommerce + mapped.facebook;
            }
            
            // Auto-calculate CPL if missing for meta ads
            if (dataType === 'metaAdsMonthly' && mapped.cpl === 0 && mapped.leads > 0) {
              mapped.cpl = Math.round(mapped.spend / mapped.leads);
            }
            
            results[dataType].push(mapped);
          }
        }
      });
    });
    
    return { success: true, data: results, warnings };
    
  } catch (error) {
    return { success: false, error: error.message, warnings };
  }
}

// ============================================
// DATA PERSISTENCE
// ============================================

const DATA_FILE = path.join(__dirname, 'validated_data.json');

function loadExistingData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing data file or corrupted');
  }
  return {
    leadsData: [],
    pipelineData: [],
    seoData: [],
    metaAdsMonthly: [],
    lastUpdated: null,
    uploadHistory: []
  };
}

function saveValidatedData(newData, filename) {
  const existing = loadExistingData();
  
  // Merge data (replace by month to avoid duplicates)
  Object.keys(newData).forEach(key => {
    if (Array.isArray(newData[key])) {
      const monthsLoaded = new Set(newData[key].map(x => x.month).filter(m => m));
      
      // Remove existing records for same months
      existing[key] = existing[key].filter(item => !monthsLoaded.has(item.month));
      
      // Add new data
      existing[key].push(...newData[key]);
      
      // Sort by month
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      existing[key].sort((a, b) => {
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
    }
  });
  
  // Update metadata
  existing.lastUpdated = new Date().toISOString();
  if (!existing.uploadHistory) existing.uploadHistory = [];
  existing.uploadHistory.push({
    timestamp: new Date().toISOString(),
    filename,
    recordsAdded: Object.values(newData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
  });
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
  return existing;
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Upload and validate Excel file
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  const isExcel = req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls');
  
  if (!isExcel) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, error: 'Only Excel files (.xlsx, .xls) supported' });
  }
  
  try {
    const result = processExcelFile(req.file.path);
    
    if (!result.success) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: result.error, warnings: result.warnings });
    }
    
    // Save validated data
    const savedData = saveValidatedData(result.data, req.file.originalname);
    
    // Clean up temp file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      message: `✓ File uploaded and validated successfully`,
      filename: req.file.originalname,
      recordsProcessed: {
        leads: result.data.leadsData.length,
        pipeline: result.data.pipelineData.length,
        seo: result.data.seoData.length,
        metaAds: result.data.metaAdsMonthly.length
      },
      warnings: result.warnings,
      lastUpdated: savedData.lastUpdated
    });
  } catch (error) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get all validated data
 */
app.get('/api/data', (req, res) => {
  const data = loadExistingData();
  res.json(data);
});

/**
 * Get data for specific month
 */
app.get('/api/data/:month', (req, res) => {
  const month = normalizeMonth(req.params.month) || req.params.month;
  const existing = loadExistingData();
  
  const filtered = {};
  Object.keys(existing).forEach(key => {
    if (Array.isArray(existing[key])) {
      filtered[key] = existing[key].filter(item => !item.month || item.month === month);
    } else {
      filtered[key] = existing[key];
    }
  });
  
  res.json(filtered);
});

/**
 * Get upload history
 */
app.get('/api/history', (req, res) => {
  const data = loadExistingData();
  res.json({
    lastUpdated: data.lastUpdated,
    uploadHistory: data.uploadHistory || []
  });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  const data = loadExistingData();
  res.json({
    status: 'ok',
    dataLoaded: {
      leadsData: data.leadsData.length,
      pipelineData: data.pipelineData.length,
      seoData: data.seoData.length,
      metaAdsMonthly: data.metaAdsMonthly.length
    },
    lastUpdated: data.lastUpdated
  });
});

/**
 * Serve dashboard HTML
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   📊 DASHBOARD SERVER WITH EXCEL VALIDATION          ║
║   Running at http://localhost:${PORT}                ║
║   Upload Excel files at /api/upload                  ║
║   Access data at http://localhost:${PORT}/api/data    ║
╚══════════════════════════════════════════════════════╝
  `);
  
  // Load initial data
  const data = loadExistingData();
  console.log(`✓ Loaded ${data.leadsData.length} leads records`);
});
