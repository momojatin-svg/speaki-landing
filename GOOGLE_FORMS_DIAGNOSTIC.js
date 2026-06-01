/**
 * GOOGLE FORMS FIELD ID DIAGNOSTIC TOOL
 * 
 * Run this in your browser console to extract the actual entry ID
 * 
 * INSTRUCTIONS:
 * 1. Open the Google Form: https://docs.google.com/forms/d/e/1FAIpQLSc2-Bq9JzHPeoszkP4CINXCt0SnXgl94jUjY_izXN4UdQOhDA/viewform
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste the code below
 * 5. Press Enter
 * 6. Look for the entry ID in the output
 */

function findGoogleFormFieldIds() {
  console.log('🔍 Scanning Google Form for entry IDs...\n');
  
  const results = {};
  
  // Method 1: Look for input elements with name attribute
  console.log('Method 1: Scanning input elements...');
  const inputs = document.querySelectorAll('input[name^="entry."]');
  console.log(`Found ${inputs.length} input fields with entry.xxx pattern`);
  
  inputs.forEach((input, index) => {
    const name = input.getAttribute('name');
    const placeholder = input.getAttribute('placeholder');
    const type = input.getAttribute('type');
    
    console.log(`  [${index}] ${name}`);
    console.log(`       Type: ${type || 'text'}`);
    console.log(`       Placeholder: ${placeholder || 'N/A'}`);
    console.log(`       Element: <input type="${type}" name="${name}">`);
    console.log('');
    
    results[name] = { placeholder, type };
  });
  
  // Method 2: Look for textareas
  console.log('\nMethod 2: Scanning textarea elements...');
  const textareas = document.querySelectorAll('textarea[name^="entry."]');
  console.log(`Found ${textareas.length} textarea fields`);
  
  textareas.forEach((textarea, index) => {
    const name = textarea.getAttribute('name');
    const placeholder = textarea.getAttribute('placeholder');
    
    console.log(`  [${index}] ${name}`);
    console.log(`       Placeholder: ${placeholder || 'N/A'}`);
    console.log('');
    
    results[name] = { placeholder, type: 'textarea' };
  });
  
  // Method 3: Check for any data attributes that might hint at field purpose
  console.log('\nMethod 3: Looking for field labels...');
  const labels = document.querySelectorAll('[role="heading"]');
  labels.forEach((label) => {
    const text = label.textContent.trim();
    if (text && text.length < 100) {
      console.log(`  Label: "${text}"`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log('Entry IDs found:', Object.keys(results));
  console.log('\nFor Email Address field, use the entry ID most likely to be email.');
  console.log('\nIf only one entry found:');
  console.log(`  Entry ID = ${Object.keys(results)[0]}`);
  console.log('\nUpdate script.js line 187:');
  console.log(`  googleFormData.append('${Object.keys(results)[0]}', email);`);
  
  return results;
}

// Run the diagnostic
const fieldIds = findGoogleFormFieldIds();

// Also check what the form structure looks like
console.log('\n' + '='.repeat(60));
console.log('FORM STRUCTURE');
console.log('='.repeat(60));
console.log('Form ID: 1FAIpQLSc2-Bq9JzHPeoszkP4CINXCt0SnXgl94jUjY_izXN4UdQOhDA');
console.log('FormResponse endpoint: https://docs.google.com/forms/d/e/1FAIpQLSc2-Bq9JzHPeoszkP4CINXCt0SnXgl94jUjY_izXN4UdQOhDA/formResponse');
console.log('\nTo test submission manually, run:');
console.log(`
const testData = new FormData();
testData.append('entry.XXXXX', 'test@speaki.co'); // Replace XXXXX with entry ID
fetch('https://docs.google.com/forms/d/e/1FAIpQLSc2-Bq9JzHPeoszkP4CINXCt0SnXgl94jUjY_izXN4UdQOhDA/formResponse', {
  method: 'POST',
  mode: 'no-cors',
  body: testData
}).then(r => console.log('Request sent, status:', r.status));
`);
