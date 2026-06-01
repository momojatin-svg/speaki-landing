# Speaki Waitlist - Google Apps Script Integration

## Quick Reference

**Status:** Google Forms replaced with Google Apps Script backend  
**Architecture:** Website → Apps Script Web App → Google Sheet  
**Files Modified:**
- `script.js` - Updated to use Apps Script endpoint
- `APPS_SCRIPT_CODE.js` - New backend code
- `APPS_SCRIPT_SETUP.md` - Detailed deployment instructions

---

## What You Need to Do (5 Steps)

### 1. Prepare Google Sheet
Create a Google Sheet named "Speaki Early Access" with columns:
- **Column A:** Timestamp
- **Column B:** Email

### 2. Deploy Apps Script Backend
- Go to [script.google.com](https://script.google.com)
- Create new project
- Copy entire code from `APPS_SCRIPT_CODE.js` and paste into editor
- Deploy as Web App (Execute as: Your email, Who has access: Anyone)
- **Copy the deployment URL**

### 3. Update Website Code
In `script.js`, find this line (around line 171):
```javascript
const APPS_SCRIPT_URL = 'https://script.googleapis.com/macros/d/REPLACE_WITH_YOUR_SCRIPT_ID/usercallback';
```

Replace `REPLACE_WITH_YOUR_SCRIPT_ID` with your actual script ID from the deployment URL.

**Example:**
```javascript
const APPS_SCRIPT_URL = 'https://script.googleapis.com/macros/d/AKfycbwXxxx_xxxxxxxxxx/usercallback';
```

### 4. Test in Browser
- Open your website locally
- Submit a test email via the waitlist form
- Check console (F12) for `✅ Email successfully registered!`
- Check your Google Sheet - email should appear instantly
- Try submitting the same email again - should see "Email already registered"

### 5. Test Duplicate Detection
- Submit same email twice
- Second attempt should show: "Email already registered"
- Google Sheet should only have one entry for that email

---

## Success Indicators

✅ **First-time email:**
- Success message appears
- Email added to Google Sheet
- Console shows `✅ Email successfully registered!`

✅ **Duplicate email:**
- Error message appears: "Email already registered"
- No new row added to Sheet
- Console shows error details

✅ **Invalid email:**
- Error message appears: "Invalid email address"
- No row added to Sheet

---

## If Something Goes Wrong

**Problem:** "REPLACE_WITH_YOUR_SCRIPT_ID still in the code"  
**Fix:** Paste your actual script ID from the deployment URL

**Problem:** "Email not appearing in Sheet after 10 seconds"  
1. Check browser console for errors
2. Open Apps Script → Executions tab
3. Look for failed execution and error message
4. Check that Sheet name is exactly "Speaki Early Access"

**Problem:** "Cannot reach the server" message  
- Verify deployment URL is correct and public
- Check that Apps Script is deployed (not just saved)
- Try re-deploying with "New deployment"

**Problem:** "Response is not JSON"  
- Verify you copied entire APPS_SCRIPT_CODE.js
- Verify you didn't modify the `createJsonResponse` function
- Try running `testEmailSubmission` function in Apps Script console

---

## Architecture

```
Browser
  ↓ (fetch POST with JSON)
Google Apps Script Web App
  ↓ (validates email, checks duplicates, writes to sheet)
Google Sheets API
  ↓ (appends row)
Google Sheet
  ├─ Timestamp
  └─ Email
```

## Benefits Over Google Forms

✅ Direct sheet writing (no form submission layer)  
✅ Instant duplication detection  
✅ Real API responses (success/error/duplicate)  
✅ Custom validation logic  
✅ No CORS issues  
✅ Reliable and secure  

---

## Detailed Instructions

See `APPS_SCRIPT_SETUP.md` for step-by-step deployment guide with screenshots and troubleshooting.

