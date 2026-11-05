/**
 * Ongo Weight Loss — Clean Offline Scraper CLI Wrapper
 * Usage:
 *   node scrape_clean_offline.js
 *   node scrape_clean_offline.js --url https://ongoweightloss.com/pricing
 *   node scrape_clean_offline.js --input urls.txt
 */
const path = require('path');

// Ensure module resolution points to audit-tool/node_modules
const auditNodeModules = path.join(__dirname, 'audit-tool', 'node_modules');
if (!process.env.NODE_PATH) {
  process.env.NODE_PATH = auditNodeModules;
} else {
  process.env.NODE_PATH = `${auditNodeModules}${path.delimiter}${process.env.NODE_PATH}`;
}
require('module').Module._initPaths();

// Forward to audit-tool script
require('./audit-tool/scripts/scrape_clean_offline.js');

