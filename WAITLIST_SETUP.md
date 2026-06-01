# Speaki Waitlist Form Setup Guide

## Problem Status
The waitlist form is currently showing a success message but emails are **not being saved** to Google Sheets.

This document provides the steps to fix this.

---

## Quick Fix (5 minutes)

### Step 1: Set Up Formspree (Reliable Email Collection Service)

1. Visit **https://formspree.io**
2. Sign up with your Google account (free tier available)
3. Click **"New Form"**
4. Name it: `Speaki Waitlist`
5. Go to your form dashboard
6. Copy your **Form Endpoint** (should look like: `https://formspree.io/f/abc123def`)
7. Open `script.js` in your editor
8. Find this line (around line 198):
   ```javascript
   'https://formspree.io/f/xqkvnvzo',
   ```
9. Replace `xqkvnvzo` with your actual form ID
10. Save the file

### Step 2: Test the Form

1. Open your landing page
2. Scroll to "We're Building Something Great" section
3. Enter: `test@speaki.co`
4. Click **"Get Early Access"**
5. Check browser console (F12 → Console tab)
6. Look for logs starting with `[Speaki Waitlist]`
7. Verify you see: `"Formspree response status: 200"`

### Step 3: Verify Email Was Received

1. Check your email inbox for Formspree notification
2. Or log into Formspree dashboard to see submissions

---

## Advanced Setup (Recommended for Better Control)

### Option A: Google Apps Script (Direct to Google Sheets)

This is the **most powerful** option - emails go directly into your Google Sheet.

**Steps:**

1. Open **https://script.google.com**
2. Create a **new project**
3. Name it: `Speaki Waitlist API`
4. Delete the default code
5. Paste this code:

```javascript
function doPost(e) {
  try {
    const email = e.parameter.email;
    
    // Get the active Google Sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add new row with timestamp and email
    sheet.appendRow([new Date(), email]);
    
    // Log for debugging
    Logger.log('Email added: ' + email);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      email: email
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. Click **Save**
7. Click **Deploy** → **New Deployment**
8. Select type: **Web app**
9. Execute as: Your email
10. Who has access: **Anyone**
11. Click **Deploy**
12. Copy the **Deployment URL** (should look like: `https://script.googleapis.com/macros/d/XXXXX/usercontent`)
13. Open `script.js`
14. Find the Google Apps Script section (around line 200)
15. Add this code after line 199:

```javascript
// Also try Google Apps Script if available
const appsScriptUrl = 'YOUR_DEPLOYMENT_URL_HERE';
if (appsScriptUrl && appsScriptUrl.includes('script.googleapis.com')) {
  try {
    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      mode: 'cors',
      body: new URLSearchParams({ email: email })
    });
    console.log('[Speaki Waitlist] Apps Script response:', appsScriptResponse);
  } catch (e) {
    console.log('[Speaki Waitlist] Apps Script request sent (may fail due to CORS but data still stored)');
  }
}
```

16. Save the file
17. Test the form again

---

## Debug the Current Issue

### Check if submissions are being sent:

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Click "Get Early Access" with a test email
4. Look for messages starting with `[Speaki Waitlist]`

You should see:
```
[Speaki Waitlist] Starting submission for email: test@speaki.co
[Speaki Waitlist] Attempting Google Forms submission...
[Speaki Waitlist] Attempting Formspree backup submission...
[Speaki Waitlist] Formspree response status: 200
[Speaki Waitlist] Formspree submission successful!
[Speaki Waitlist] Success message displayed
```

### If something goes wrong:

- **Error message in red**: Read the exact error
- **No [Speaki Waitlist] messages**: The form handler isn't being triggered
- **Status 0 from Google Forms**: Expected (no-cors mode limitation)
- **Status 400+ from Formspree**: Check your form endpoint URL

---

## Finding the Correct Google Forms Entry ID (Optional)

If you want to make Google Forms work directly:

1. Open your Google Form: https://docs.google.com/forms/d/e/1FAIpQLSc2-Bq9JzHPeoszkP4CINXCt0SnXgl94jUjY_izXN4UdQOhDA/viewform
2. Right-click the email input field
3. Select **"Inspect"** (or Inspect Element)
4. Look for: `<input name="entry.XXXXXXXXX" ...>`
5. Copy that `entry.XXXXXXXXX` number
6. In `script.js`, around line 187, replace:
   ```javascript
   googleFormData.append('entry.1968208621', email);
   ```
   with:
   ```javascript
   googleFormData.append('entry.YOUR_ACTUAL_ID', email);
   ```

However, **Google Forms alone may not work** due to CORS restrictions, which is why we recommend the Formspree + Google Apps Script approach.

---

## Testing Checklist

- [ ] Formspree account created
- [ ] Form endpoint copied and added to `script.js`
- [ ] Website form submitted with test email
- [ ] Console shows `[Speaki Waitlist]` logs
- [ ] Email appears in Formspree dashboard or inbox
- [ ] Success message displays on the website

---

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify URLs are copied correctly (no extra spaces)
3. Make sure you're using the correct form endpoint
4. Test with a simple email like `test@example.com`

---

## Next Steps (After Testing)

Once submissions are working:

1. Remove test emails from your Sheet
2. Formspree or Apps Script will start collecting real emails
3. You can export data from Formspree or Google Sheet anytime
4. Consider adding email verification or welcome email automation
