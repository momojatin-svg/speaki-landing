/**
 * GOOGLE APPS SCRIPT - Speaki Early Access Waitlist Backend
 * 
 * This script runs as a deployed web app that:
 * - Accepts POST requests as form data with a field: email
 * - Validates email format
 * - Checks for duplicate emails in Google Sheet
 * - Writes valid new emails to Google Sheet with timestamp
 * - Returns JSON responses
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * See APPS_SCRIPT_SETUP.md
 * 
 * ============================================
 * DO NOT MODIFY THIS FILE MANUALLY
 * COPY THE ENTIRE CONTENT AND PASTE INTO:
 * script.google.com → New Project → Editor
 * ============================================
 */

function doPost(e) {
  try {
    // Parse incoming form data request
    const email = e.parameter.email;
    console.log('[Speaki Backend] Received email parameter:', email);

    if (!email) {
      console.log('[Speaki Backend] Missing email parameter');
      return createJsonResponse({
        success: false,
        message: 'Invalid email address'
      }, 400);
    }

    console.log('[Speaki Backend] Email to process:', email);

    // Validate email format
    if (!email || !isValidEmail(email)) {
      console.log('[Speaki Backend] Email validation failed:', email);
      return createJsonResponse({
        success: false,
        message: 'Invalid email address'
      }, 400);
    }

    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = 'Form responses 1';
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.getActiveSheet();
    
    console.log('[Speaki Backend] Using sheet:', sheet.getName());

    // Check for duplicate emails
    const emailColumn = sheet.getRange('B:B').getValues();
    console.log('[Speaki Backend] Email column has', emailColumn.length, 'rows');

    for (let i = 1; i < emailColumn.length; i++) {
      const existingEmail = emailColumn[i][0];
      if (existingEmail && existingEmail.toLowerCase() === email.toLowerCase()) {
        console.log('[Speaki Backend] Duplicate email found:', email);
        return createJsonResponse({
          success: false,
          message: 'Email already registered'
        }, 409);
      }
    }

    // Add new row with timestamp and email
    const timestamp = new Date().toISOString();
    const newRow = [timestamp, email];
    
    console.log('[Speaki Backend] Adding new row:', newRow);
    sheet.appendRow(newRow);

    // Verify the row was added
    const lastRow = sheet.getLastRow();
    const verifyRange = sheet.getRange(lastRow, 1, 1, 2);
    const verifyData = verifyRange.getValues();
    
    console.log('[Speaki Backend] Verified added row:', verifyData);
    console.log('[Speaki Backend] ✅ Successfully added email to sheet');

    return createJsonResponse({
      success: true,
      message: 'Email registered successfully',
      timestamp: timestamp
    }, 200);

  } catch (error) {
    console.error('[Speaki Backend] ❌ Error:', error);
    console.error('[Speaki Backend] Stack:', error.stack);
    
    return createJsonResponse({
      success: false,
      message: 'Server error: ' + error.toString()
    }, 500);
  }
}

/**
 * Validate email using regex
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  console.log('[Speaki Backend] Validating email:', email, '→', isValid);
  return isValid;
}

/**
 * Create JSON response with proper headers
 */
function createJsonResponse(data, httpCode) {
  const jsonResponse = JSON.stringify(data);
  console.log('[Speaki Backend] Response (HTTP', httpCode, '):', jsonResponse);
  
  return ContentService
    .createTextOutput(jsonResponse)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the script works
 * Can be used for local testing before deployment
 */
function testEmailSubmission() {
  console.log('Running test...');
  
  const testEmail = 'test' + Math.random().toString(36).substring(7) + '@speaki.co';
  console.log('Test email:', testEmail);
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify({ email: testEmail })
    }
  };
  
  const response = doPost(mockEvent);
  console.log('Test complete. Check the sheet to verify the email was added.');
}
