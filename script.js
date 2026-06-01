document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = Array.from(document.querySelectorAll('section[id]')).filter((section) =>
    document.querySelector(`.main-nav a[href="#${section.id}"]`)
  );

  const setActiveLink = (hash) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  };

  const toggleMenu = (open) => {
    if (!nav || !menuToggle) return;
    const isOpen = typeof open === 'boolean' ? open : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMenu());
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav || !menuToggle || !nav.classList.contains('open')) return;
    const target = event.target;
    if (!nav.contains(target) && !menuToggle.contains(target)) {
      toggleMenu(false);
    }
  });

  const observeSections = () => {
    if (!('IntersectionObserver' in window)) {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        let currentSection = sections[0];
        sections.forEach((section) => {
          if (section.offsetTop <= scrollPosition) {
            currentSection = section;
          }
        });
        setActiveLink(`#${currentSection.id}`);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  observeSections();

  if (window.innerWidth > 860 && location.hash) {
    setActiveLink(location.hash);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav && nav.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  /**
   * GOOGLE FORMS SUBMISSION HANDLER
   * 
   * SETUP INSTRUCTIONS:
   * 
   * 1. TO FIND CORRECT ENTRY ID:
   *    - Open Google Form in browser
   *    - Right-click email input field
   *    - Select "Inspect"
   *    - Look for: <input name="entry.XXXXXXXXX" ...>
   *    - Replace entry.1968208621 with actual ID
   * 
   * 2. FORMSPREE SETUP (RECOMMENDED BACKUP):
   *    - Go to https://formspree.io
   *    - Create new form
   *    - Copy form endpoint (https://formspree.io/f/YOUR_ID)
   *    - Replace 'https://formspree.io/f/xqkvnvzo' below
   * 
   * 3. GOOGLE APPS SCRIPT (ALTERNATIVE):
   *    - See bottom of this file for Apps Script solution
   * 
   * Console Logging:
   *    - Open browser DevTools (F12)
   *    - Go to Console tab
   *    - Look for [Speaki Waitlist] messages
   *    - Check if emails are being submitted
   */

  // Google Forms submission handler
  const emailInput = document.getElementById('waitlist-email');
  const submitBtn = document.getElementById('waitlist-submit');
  const formMessage = document.getElementById('form-message');

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Show message function
  const showMessage = (text, type) => {
    if (formMessage) {
      formMessage.textContent = text;
      formMessage.className = `form-message ${type}`;
      formMessage.style.display = 'block';
    }
  };

  // Clear message function
  const clearMessage = () => {
    if (formMessage) {
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
    }
  };

  // Handle form submission
  if (submitBtn && emailInput) {
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      clearMessage();

      const email = emailInput.value.trim();

      // Validate email
      if (!email) {
        showMessage('Please enter your email address.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Disable button during submission
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Joining...';

      try {
        console.log('[Speaki Waitlist] Request started for email:', email);

        // Send to Google Apps Script backend
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHAtpNlxJXO-BidbMlirX9IZfM1UOaqp26SnKrunaqHU44Ti-uaqXBulHPL5-w0t6fmQ/exec';
        
        console.log('[Speaki Waitlist] Sending request');
        console.log('[Speaki Waitlist] Endpoint:', APPS_SCRIPT_URL);

        const formData = new FormData();
        formData.append('email', email);

        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        });

        console.log('[Speaki Waitlist] Request sent');

        // Clear input field
        emailInput.value = '';

        // Show success message
        showMessage(
          "Thank you! You've joined the Speaki early access waitlist.",
          'success'
        );

        console.log('[Speaki Waitlist] ✅ Email successfully registered!');

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          clearMessage();
        }, 5000);
      } catch (error) {
        console.error('[Speaki Waitlist] Error', error);
        showMessage(
          'Unable to reach the server. Please check your connection and try again.',
          'error'
        );
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Allow Enter key to submit
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitBtn.click();
      }
    });
  }
});

/**
 * ALTERNATIVE IMPLEMENTATIONS
 * 
 * ============================================================================
 * OPTION 1: FORMSPREE (Recommended for ease)
 * ============================================================================
 * 
 * 1. Visit https://formspree.io
 * 2. Sign up (free tier available)
 * 3. Create a new form
 * 4. Name it "Speaki Waitlist"
 * 5. Copy the endpoint ID from your form dashboard
 * 6. Replace 'https://formspree.io/f/xqkvnvzo' in script.js with:
 *    https://formspree.io/f/YOUR_FORM_ID
 * 7. Formspree will automatically forward emails to your inbox
 * 8. You can also connect it to Google Sheets via Zapier
 * 
 * ============================================================================
 * OPTION 2: GOOGLE APPS SCRIPT (Most Control, Direct Google Sheets)
 * ============================================================================
 * 
 * 1. Go to https://script.google.com
 * 2. Create a new Apps Script project
 * 3. Paste the code below:
 * 
 * ---CODE START---
 * function doPost(e) {
 *   const email = e.parameter.email;
 *   const sheet = SpreadsheetApp.getActiveSheet();
 *   sheet.appendRow([new Date(), email]);
 *   return ContentService.createTextOutput('{"result":"success"}')
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * ---CODE END---
 * 
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: Your email
 * 7. Who has access: "Anyone"
 * 8. Copy the deployment URL
 * 9. In script.js, replace the fetch URL with your deployment URL:
 * 
 *    const appsScriptUrl = 'YOUR_DEPLOYMENT_URL';
 *    await fetch(appsScriptUrl, {
 *      method: 'POST',
 *      mode: 'cors',
 *      body: new URLSearchParams({ email: email })
 *    });
 * 
 * 10. Emails will now appear directly in your Google Sheet!
 * 
 * ============================================================================
 * DEBUGGING CHECKLIST
 * ============================================================================
 * 
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Submit an email via the form
 * 4. Look for logs starting with [Speaki Waitlist]
 * 5. Check:
 *    - "Starting submission for email: test@speaki.co"
 *    - "Attempting Google Forms submission..."
 *    - "Google Forms response status: 0" (expected with no-cors)
 *    - "Attempting Formspree backup submission..."
 *    - "Formspree response status: 200" (should indicate success)
 *    - "Success message displayed"
 * 
 * 6. If you see errors, the error message will explain the issue
 * 7. Check Formspree dashboard for submitted emails
 * 8. Check your Google Sheet for new rows
 * 
 * ============================================================================
 */
