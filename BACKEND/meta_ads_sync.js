/**
 * 🚀 Krutanic Meta Ads Sync Script
 * ---------------------------------------
 */

const API_URL = "https://krutanic-main.vercel.app/api/adv-leads/add-adv-lead"; 

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Sync to CRM')
      .addItem('Sync All Leads', 'syncAllLeads')
      .addItem('Sync Selected Row', 'syncSelectedRow')
      .addToUi();
}

/**
 * Syncs all leads from the active sheet to the backend CRM.
 */
function syncAllLeads() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headersRaw = data[0];
  const headers = headersRaw.map(function(h) { return h.toString().toLowerCase().trim(); });
  let successCount = 0;
  let errorCount = 0;
  let lastError = "";

  const idxFullName = headers.indexOf('full_name');
  const idxPhone = headers.indexOf('phone');
  const idxEmail = headers.indexOf('email');
  const idxStatus = headers.indexOf('lead_status');

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip empty rows
    if (!row[idxFullName] && !row[idxPhone]) continue;

    const payload = {};
    headersRaw.forEach(function(header, index) {
      payload[header] = row[index];
    });

    // --- Hardcoded & Custom Mappings ---
    payload.source = "meta_ads";
    
    // Core Field Mappings
    if (idxFullName !== -1) payload.full_name = String(row[idxFullName]);
    if (idxPhone !== -1 && row[idxPhone]) {
      payload.phone_number = String(row[idxPhone]).replace(/^p:/i, '').replace(/\s+/g, '');
    }
    if (idxEmail !== -1) payload.email = String(row[idxEmail]);

    // Domain Mapping: use ad_name or campaign_name
    const idxAdName = headers.indexOf('ad_name');
    if (idxAdName !== -1) payload.ad_name = String(row[idxAdName]);
    const idxCampaignName = headers.indexOf('campaign_name');
    if (idxCampaignName !== -1) payload.campaign_name = String(row[idxCampaignName]);

    // Special Survey Mappings (Planning to Start & Language)
    const timeframeCol = headersRaw.find(function(h) { return h.toLowerCase().indexOf('planning_to_start') !== -1; });
    if (timeframeCol) payload.start_timeframe = String(payload[timeframeCol]);

    const langCol = headersRaw.find(function(h) { return h.toLowerCase().indexOf('language') !== -1; });
    if (langCol) payload.language = String(payload[langCol]);

    const result = sendLeadToBackend(payload);
    if (result.success) {
        successCount++;
        if (idxStatus !== -1) sheet.getRange(i + 1, idxStatus + 1).setValue('SYNCED');
    } else {
        errorCount++;
        lastError = result.message;
        if (idxStatus !== -1) sheet.getRange(i + 1, idxStatus + 1).setValue('ERROR: ' + lastError);
    }
  }

  var summaryMessage = "Sync Complete!\n✅ Success: " + successCount + "\n❌ Failed: " + errorCount;
  if (errorCount > 0) {
    summaryMessage = summaryMessage + "\n\nLast Error: " + lastError;
  }
  SpreadsheetApp.getUi().alert(summaryMessage);
}

/**
 * Syncs only the active (selected) row to the backend CRM.
 */
function syncSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRowIndex = sheet.getActiveCell().getRowIndex();
  
  if (activeRowIndex <= 1) {
    SpreadsheetApp.getUi().alert("Please select a lead row (not the header).");
    return;
  }

  const headersRaw = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headers = headersRaw.map(function(h) { return h.toString().toLowerCase().trim(); });
  const rowData = sheet.getRange(activeRowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const payload = {};
  headersRaw.forEach(function(header, index) {
    payload[header] = rowData[index];
  });

  payload.source = "meta_ads";
  const idxPhone = headers.indexOf('phone');
  if (idxPhone !== -1 && rowData[idxPhone]) {
    payload.phone_number = String(rowData[idxPhone]).replace(/^p:/i, '').replace(/\s+/g, '');
  }

  const result = sendLeadToBackend(payload);
  if (result.success) {
    const idxStatus = headers.indexOf('lead_status');
    if (idxStatus !== -1) sheet.getRange(activeRowIndex, idxStatus + 1).setValue('SYNCED');
    SpreadsheetApp.getUi().alert("✅ Lead synced successfully!");
  } else {
    SpreadsheetApp.getUi().alert("❌ Failed to sync lead: " + result.message);
  }
}

/**
 * Internal function to send the lead payload via POST request.
 */
function sendLeadToBackend(payload) {
  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(API_URL, options);
    const code = response.getResponseCode();
    const responseText = response.getContentText();
    var responseJson = {};
    try { responseJson = JSON.parse(responseText); } catch(e) {}

    if (code === 200 || code === 201) return { success: true };
    
    return { 
      success: false, 
      message: responseJson.message || responseText || "Unknown Error"
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}
