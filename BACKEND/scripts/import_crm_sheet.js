/**
 * 🚀 Krutanic Meta Ads Sync Script (Automated Version)
 * ---------------------------------------
 */

const API_URL = "https://krutanic-main.vercel.app/api/adv-leads/add-adv-lead"; 

/**
 * 1. AUTOMATIC TRIGGER: This runs every time a form is submitted.
 */
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = e.values; // Data from the form submission
  
  const payload = {};
  headers.forEach(function(header, index) {
    // Map incoming form values to headers
    payload[header] = rowData[index];
  });

  // Hardcoded Mapping
  payload.source = "Email_marketing";
  
  // Basic Normalization (matches your manual sync logic)
  const headersLower = headers.map(h => h.toString().toLowerCase().trim());
  const idxPhone = headersLower.indexOf('phone');
  if (idxPhone !== -1 && rowData[idxPhone]) {
    payload.phone_number = String(rowData[idxPhone]).replace(/^p:/i, '').replace(/\s+/g, '');
  }

  const result = sendLeadToBackend(payload);
  
  // Log result in the sheet so you can track it
  const lastRow = sheet.getLastRow();
  const idxStatus = headersLower.indexOf('lead_status');
  if (idxStatus !== -1) {
    sheet.getRange(lastRow, idxStatus + 1).setValue(result.success ? 'SYNCED_AUTO' : 'ERROR: ' + result.message);
  }
}

/**
 * 2. MANUAL MENU: For manual syncs of old data.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Sync to CRM')
      .addItem('Sync All Leads', 'syncAllLeads')
      .addItem('Sync Selected Row', 'syncSelectedRow')
      .addToUi();
}

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
    if (!row[idxFullName] && !row[idxPhone]) continue;
    const payload = {};
    headersRaw.forEach(function(header, index) { payload[header] = row[index]; });
    payload.source = "Email_marketing";
    
    if (idxFullName !== -1) payload.full_name = String(row[idxFullName]);
    if (idxPhone !== -1 && row[idxPhone]) {
      payload.phone_number = String(row[idxPhone]).replace(/^p:/i, '').replace(/\s+/g, '');
    }
    if (idxEmail !== -1) payload.email = String(row[idxEmail]);

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
  SpreadsheetApp.getUi().alert("Sync Complete!\n✅ Success: " + successCount + "\n❌ Failed: " + errorCount);
}

function syncSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRowIndex = sheet.getActiveCell().getRowIndex();
  if (activeRowIndex <= 1) return;
  const headersRaw = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(activeRowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const payload = {};
  headersRaw.forEach(function(header, index) { payload[header] = rowData[index]; });
  payload.source = "Email_marketing";
  const result = sendLeadToBackend(payload);
  if (result.success) {
    SpreadsheetApp.getUi().alert("✅ Lead synced successfully!");
  } else {
    SpreadsheetApp.getUi().alert("❌ Failed: " + result.message);
  }
}

/**
 * Common Backend Sender
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
    return { success: (code === 200 || code === 201), message: response.getContentText() };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}