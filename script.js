/**
 * Aura Authentication Platform - Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Element Selectors
  // --------------------------------------------------------------------------
  const body = document.body;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const demoAccountBtn = document.getElementById('demoAccountBtn');

  // Tabs
  const tabSwitcher = document.querySelector('.tab-switcher');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');

  // Forms
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');

  // Sign In inputs
  const signinEmail = document.getElementById('signinEmail');
  const signinPassword = document.getElementById('signinPassword');
  const toggleSigninPassword = document.getElementById('toggleSigninPassword');
  const signinSubmitBtn = document.getElementById('signinSubmitBtn');

  // Sign Up inputs
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const toggleSignupPassword = document.getElementById('toggleSignupPassword');
  const agreeTerms = document.getElementById('agreeTerms');
  const signupSubmitBtn = document.getElementById('signupSubmitBtn');

  // Strength Meter elements
  const strengthBar = document.getElementById('strengthBar');
  const strengthStatus = document.getElementById('strengthStatus');
  const critLength = document.getElementById('critLength');
  const critNumber = document.getElementById('critNumber');
  const critUpper = document.getElementById('critUpper');
  const critSpecial = document.getElementById('critSpecial');

  // Forgot Password Modal
  const forgotPassBtn = document.getElementById('forgotPassBtn');
  const forgotModal = document.getElementById('forgotModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const forgotForm = document.getElementById('forgotForm');
  const forgotEmail = document.getElementById('forgotEmail');
  const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const sentTargetEmail = document.getElementById('sentTargetEmail');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  // Social Buttons
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const githubLoginBtn = document.getElementById('githubLoginBtn');
  const appleLoginBtn = document.getElementById('appleLoginBtn');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // --------------------------------------------------------------------------
  // 2. Theme Management (Dark / Light)
  // --------------------------------------------------------------------------
  const initTheme = () => {
    const savedTheme = localStorage.getItem('aura_theme');
    if (savedTheme) {
      body.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('aura_theme', newTheme);
    showToast('Theme Changed', `Switched to ${newTheme} mode`, 'info');
  };

  themeToggleBtn.addEventListener('click', toggleTheme);
  initTheme();

  // --------------------------------------------------------------------------
  // 3. Tab Switching (Sign In vs Sign Up)
  // --------------------------------------------------------------------------
  const switchTab = (mode) => {
    if (mode === 'signup') {
      tabSwitcher.classList.add('register-active');
      tabSignIn.classList.remove('active');
      tabSignUp.classList.add('active');
      tabSignIn.setAttribute('aria-selected', 'false');
      tabSignUp.setAttribute('aria-selected', 'true');

      signInForm.classList.remove('active');
      signUpForm.classList.add('active');

      formTitle.textContent = 'Create your account';
      formSubtitle.textContent = 'Join thousands of professionals already on Aura';
    } else {
      tabSwitcher.classList.remove('register-active');
      tabSignUp.classList.remove('active');
      tabSignIn.classList.add('active');
      tabSignUp.setAttribute('aria-selected', 'false');
      tabSignIn.setAttribute('aria-selected', 'true');

      signUpForm.classList.remove('active');
      signInForm.classList.add('active');

      formTitle.textContent = 'Welcome back';
      formSubtitle.textContent = 'Enter your credentials to access your account';
    }
    clearAllErrors();
  };

  tabSignIn.addEventListener('click', () => switchTab('signin'));
  tabSignUp.addEventListener('click', () => switchTab('signup'));

  // --------------------------------------------------------------------------
  // 4. Password Visibility Toggling
  // --------------------------------------------------------------------------
  const setupPasswordToggle = (toggleBtn, passwordInput) => {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.classList.toggle('revealed', isPassword);
    });
  };

  setupPasswordToggle(toggleSigninPassword, signinPassword);
  setupPasswordToggle(toggleSignupPassword, signupPassword);

  // --------------------------------------------------------------------------
  // 5. Real-time Password Strength Meter
  // --------------------------------------------------------------------------
  const updateCriteria = (element, isMet) => {
    element.classList.toggle('met', isMet);
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) {
      strengthBar.style.width = '0%';
      strengthStatus.textContent = 'Too short';
      strengthStatus.style.color = 'var(--text-tertiary)';
      [critLength, critNumber, critUpper, critSpecial].forEach(el => updateCriteria(el, false));
      return 0;
    }

    const hasLength = pass.length >= 8;
    const hasNumber = /[0-9]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    updateCriteria(critLength, hasLength);
    updateCriteria(critNumber, hasNumber);
    updateCriteria(critUpper, hasUpper);
    updateCriteria(critSpecial, hasSpecial);

    const score = [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;

    let width = '0%';
    let statusText = 'Very Weak';
    let color = 'var(--color-error)';

    switch (score) {
      case 1:
        width = '25%';
        statusText = 'Weak';
        color = 'var(--color-error)';
        break;
      case 2:
        width = '50%';
        statusText = 'Fair';
        color = 'var(--color-warning)';
        break;
      case 3:
        width = '75%';
        statusText = 'Good';
        color = 'var(--accent-primary)';
        break;
      case 4:
        width = '100%';
        statusText = 'Strong';
        color = 'var(--color-success)';
        break;
      default:
        width = '10%';
        statusText = 'Very Weak';
        color = 'var(--color-error)';
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthStatus.textContent = statusText;
    strengthStatus.style.color = color;

    return score;
  };

  signupPassword.addEventListener('input', (e) => {
    calculatePasswordStrength(e.target.value);
  });

  // --------------------------------------------------------------------------
  // 6. Form Validation Helpers
  // --------------------------------------------------------------------------
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setFieldError = (inputEl, errorEl, message) => {
    const wrapper = inputEl.closest('.input-wrapper');
    if (wrapper) {
      wrapper.classList.add('error');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  };

  const clearFieldError = (inputEl, errorEl) => {
    const wrapper = inputEl ? inputEl.closest('.input-wrapper') : null;
    if (wrapper) {
      wrapper.classList.remove('error');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  };

  const clearAllErrors = () => {
    document.querySelectorAll('.input-wrapper.error').forEach(w => w.classList.remove('error'));
    document.querySelectorAll('.field-error-msg.visible').forEach(msg => {
      msg.textContent = '';
      msg.classList.remove('visible');
    });
  };

  // Attach live clear on input
  [signinEmail, signinPassword, signupName, signupEmail, signupPassword, forgotEmail].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      const errorEl = document.getElementById(`${input.id}Error`);
      clearFieldError(input, errorEl);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // --------------------------------------------------------------------------
  const showToast = (title, message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === 'error') {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  };

  // --------------------------------------------------------------------------
  // 8. Demo Credentials Quick Fill
  // --------------------------------------------------------------------------
  demoAccountBtn.addEventListener('click', () => {
    switchTab('signin');
    signinEmail.value = 'alex.developer@auraos.io';
    signinPassword.value = 'SecurePass2026!';
    clearAllErrors();

    // Pulse effect
    signinEmail.closest('.input-wrapper').style.borderColor = 'var(--accent-primary)';
    signinPassword.closest('.input-wrapper').style.borderColor = 'var(--accent-primary)';

    setTimeout(() => {
      signinEmail.closest('.input-wrapper').style.borderColor = '';
      signinPassword.closest('.input-wrapper').style.borderColor = '';
    }, 1000);

    showToast('Demo Account Loaded', 'Prefilled with test credentials. Click Sign In to continue.', 'info');
  });

  // --------------------------------------------------------------------------
  // 9. Sign In Submission Flow
  // --------------------------------------------------------------------------
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    let hasErrors = false;
    const emailVal = signinEmail.value.trim();
    const passVal = signinPassword.value;

    if (!emailVal) {
      setFieldError(signinEmail, document.getElementById('signinEmailError'), 'Email address is required');
      hasErrors = true;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(signinEmail, document.getElementById('signinEmailError'), 'Please enter a valid email address');
      hasErrors = true;
    }

    if (!passVal) {
      setFieldError(signinPassword, document.getElementById('signinPasswordError'), 'Password is required');
      hasErrors = true;
    } else if (passVal.length < 6) {
      setFieldError(signinPassword, document.getElementById('signinPasswordError'), 'Password must be at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Simulate authentication API request
    signinSubmitBtn.classList.add('loading');

    setTimeout(() => {
      signinSubmitBtn.classList.remove('loading');
      showToast('Authentication Successful', `Welcome back, ${emailVal.split('@')[0]}!`, 'success');
    }, 1300);
  });

  // --------------------------------------------------------------------------
  // 10. Sign Up Submission Flow
  // --------------------------------------------------------------------------
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    let hasErrors = false;
    const nameVal = signupName.value.trim();
    const emailVal = signupEmail.value.trim();
    const passVal = signupPassword.value;
    const termsAccepted = agreeTerms.checked;

    if (!nameVal) {
      setFieldError(signupName, document.getElementById('signupNameError'), 'Full name is required');
      hasErrors = true;
    }

    if (!emailVal) {
      setFieldError(signupEmail, document.getElementById('signupEmailError'), 'Email address is required');
      hasErrors = true;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(signupEmail, document.getElementById('signupEmailError'), 'Please enter a valid email address');
      hasErrors = true;
    }

    const strengthScore = calculatePasswordStrength(passVal);
    if (!passVal) {
      setFieldError(signupPassword, document.getElementById('signupPasswordError'), 'Password is required');
      hasErrors = true;
    } else if (strengthScore < 3) {
      setFieldError(signupPassword, document.getElementById('signupPasswordError'), 'Please create a stronger password meeting the criteria');
      hasErrors = true;
    }

    if (!termsAccepted) {
      const termsError = document.getElementById('signupTermsError');
      termsError.textContent = 'You must accept the Terms of Service to continue';
      termsError.classList.add('visible');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Simulate account registration
    signupSubmitBtn.classList.add('loading');

    setTimeout(() => {
      signupSubmitBtn.classList.remove('loading');
      showToast('Account Created!', `Welcome to Aura, ${nameVal}. Please check your email to verify.`, 'success');
      signUpForm.reset();
      calculatePasswordStrength('');
      setTimeout(() => switchTab('signin'), 1500);
    }, 1400);
  });

  // --------------------------------------------------------------------------
  // 11. Social Authentication Simulation
  // --------------------------------------------------------------------------
  const handleSocialLogin = (provider) => {
    showToast(`${provider} Login`, `Initiating secure handshake with ${provider}...`, 'info');
    setTimeout(() => {
      showToast('Connected!', `Successfully authenticated via ${provider}.`, 'success');
    }, 1200);
  };

  googleLoginBtn.addEventListener('click', () => handleSocialLogin('Google'));
  githubLoginBtn.addEventListener('click', () => handleSocialLogin('GitHub'));
  appleLoginBtn.addEventListener('click', () => handleSocialLogin('Apple'));

  // --------------------------------------------------------------------------
  // 12. Forgot Password Modal Workflow
  // --------------------------------------------------------------------------
  const openModal = () => {
    forgotModal.classList.add('active');
    forgotModal.setAttribute('aria-hidden', 'false');
    forgotForm.style.display = 'block';
    modalSuccessState.classList.remove('active');
    forgotEmail.value = signinEmail.value || '';
    clearFieldError(forgotEmail, document.getElementById('forgotEmailError'));
    setTimeout(() => forgotEmail.focus(), 150);
  };

  const closeModal = () => {
    forgotModal.classList.remove('active');
    forgotModal.setAttribute('aria-hidden', 'true');
  };

  forgotPassBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalDoneBtn.addEventListener('click', closeModal);

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotModal.classList.contains('active')) {
      closeModal();
    }
  });

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = forgotEmail.value.trim();
    const emailError = document.getElementById('forgotEmailError');
    clearFieldError(forgotEmail, emailError);

    if (!emailVal) {
      setFieldError(forgotEmail, emailError, 'Email address is required');
      return;
    }
    if (!isValidEmail(emailVal)) {
      setFieldError(forgotEmail, emailError, 'Please enter a valid email address');
      return;
    }

    forgotSubmitBtn.classList.add('loading');

    setTimeout(() => {
      forgotSubmitBtn.classList.remove('loading');
      forgotForm.style.display = 'none';
      sentTargetEmail.textContent = emailVal;
      modalSuccessState.classList.add('active');
      showToast('Reset Link Sent', `Password recovery link dispatched to ${emailVal}`, 'success');
    }, 1100);
  });
});
