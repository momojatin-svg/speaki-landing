# Google Apps Script Deployment Guide

## Overview
This guide walks you through deploying the Speaki waitlist backend as a Google Apps Script web app.

---

## Step 1: Prepare Your Google Sheet

1. **Open or create a Google Sheet** for "Speaki Early Access"
2. **Create these column headers** (if they don't exist):
   - **Column A:** `Timestamp`
   - **Column B:** `Email`

Your sheet should look like:
```
| Timestamp                | Email               |
|--------------------------|---------------------|
| 2026-06-01T10:30:00.000Z | user1@example.com   |
| 2026-06-01T11:45:30.000Z | user2@example.com   |
```

3. **Keep your sheet open** - you'll need the Sheet ID in next steps

---

## Step 2: Create Apps Script Project

1. Go to **[script.google.com](https://script.google.com)**
2. Click **"New Project"** (top left)
3. Name it: `Speaki Waitlist Backend`
4. Click **Create**

---

## Step 3: Link the Apps Script to Your Sheet

1. In the Apps Script editor, click **"Project Settings"** (gear icon, left sidebar)
2. Find **"GCP Project ID"** - note this value for later
3. Click **"Editor"** in left sidebar to go back to code
4. Click **→ (Show more)** icon at the top
5. Select **"Project Settings"** 
6. Look for the line that says `"associateSheets": []`
7. Add your Google Sheet ID:
   - Open your Google Sheet in another tab
   - Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - In Apps Script settings, paste it

**OR** (Simpler method):
1. In the Apps Script editor, click **"Resources"** → **"Apps Script"** properties
2. Add property: `SHEET_ID` with value from your Sheet URL

---

## Step 4: Copy the Backend Code

1. Open the file: `APPS_SCRIPT_CODE.js` in this folder
2. Copy **ALL the code**
3. In your Apps Script editor:
   - Delete any existing code
   - Click in the main editor area
   - Paste the entire code
4. Press **Ctrl+S** to save

You should see: `✓ Saved` confirmation

---

## Step 5: Deploy as Web App

1. In Apps Script editor, click **"Deploy"** (top right)
2. Click **"New deployment"**
3. In "Select type", click the dropdown
4. Choose **"Web app"**
5. Configure:
   - **Execute as:** Your email (the account that owns the Sheet)
   - **Who has access:** `Anyone`
6. Click **"Deploy"**
7. A dialog will appear asking for permissions
8. Review and click **"Grant access"**
9. **COPY THE DEPLOYMENT URL** - it looks like:
   ```
   https://script.googleapis.com/macros/d/[SCRIPT_ID]/usercallback
   ```
   **Save this URL - you'll paste it into script.js**

---

## Step 6: Update Your Website Code

1. Open `/Users/priyamkumar/Desktop/Speaki website/script.js`
2. Find this line (around line 187):
   ```javascript
   const GOOGLE_FORM_EMAIL_ENTRY_ID = 'entry.1968208621';
   ```
3. Replace it with your Apps Script URL:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.googleapis.com/macros/d/[YOUR_SCRIPT_ID]/usercallback';
   ```

**Example:**
```javascript
const APPS_SCRIPT_URL = 'https://script.googleapis.com/macros/d/AKfycbwBxxx_xxx_xxxxxxxxxx/usercallback';
```

---

## Step 7: Test the Integration

1. **Test via Apps Script Console:**
   - Go back to your Apps Script editor
   - Click **"Run"** next to the `testEmailSubmission` function
   - Check your Google Sheet - you should see a new email added

2. **Test via Website:**
   - Open your Speaki website locally
   - Enter an email in the waitlist form
   - Click "Get Early Access"
   - Check the browser console (F12):
     - You should see `[Speaki Waitlist] ✅ Success!`
   - Check your Google Sheet - the email should appear within 2-3 seconds

3. **Test Duplicate Detection:**
   - Try submitting the same email again
   - You should see: "Email already registered"

---

## Troubleshooting

### "Permission denied" error
- Make sure the Apps Script is deployed with "Execute as: Your email"
- Make sure "Who has access" is set to "Anyone"
- Re-deploy if you changed settings

### Email not appearing in Sheet
- Check browser console (F12) for error messages
- Check Apps Script execution logs:
  - In Apps Script editor, click **"Executions"** (left sidebar)
  - Look for failed executions and error details
- Verify your Deployment URL is correct in script.js

### "Invalid email" error
- Make sure the email format is correct: `user@domain.com`
- Check that your regex in Apps Script matches the frontend regex

### CORS errors
- Apps Script handles CORS automatically when deployed as a web app
- If you still see errors, verify the URL is correct (https:// not http://)

---

## Important Notes

- **Deployment URL:** Keep this secret! It allows anyone to submit to your sheet
- **Sheet Security:** Only people with access to the Google Sheet can see the emails
- **Timestamps:** All times are in UTC ISO format (`2026-06-01T10:30:00.000Z`)
- **Email Validation:** Invalid emails are rejected at the backend
- **Duplicates:** Same email cannot be submitted twice

---

## Advanced: Making Changes

If you need to modify the backend logic:

1. Edit the code in `APPS_SCRIPT_CODE.js`
2. Update your Apps Script editor with the new code
3. **Click "Deploy" → "Manage deployments"**
4. Click the pencil icon next to the current deployment
5. Click **"Deploy"** again
6. The URL stays the same, but the code is updated

---

## Support

If deployment fails:
1. Check the Apps Script **"Executions"** log for errors
2. Verify the Sheet ID is correct
3. Verify you have edit access to the Sheet
4. Check that the code was fully copied (no truncation)

