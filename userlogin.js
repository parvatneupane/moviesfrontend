 
      // ========== MAIN APPLICATION INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('MovieTalks Login - Initializing...');
    
    // Initialize all components
    initMobileNavigation();
    initFormValidation();
    initSocialLogin();
    initForgotPassword();
    initRememberMe();
    
    console.log('MovieTalks Login initialization complete!');
});

// ========== MOBILE NAVIGATION ==========
function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========== FORM VALIDATION ==========
function initFormValidation() {
    const loginForm = document.querySelector('.login-box form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!loginForm || !emailInput || !passwordInput) return;
    
    // Check if there are saved credentials
    checkRememberedCredentials();
    
    // Add input validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate inputs
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isEmailValid && isPasswordValid) {
            // Show loading state
            const loginButton = document.querySelector('.login-button');
            const originalText = loginButton.textContent;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            loginButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Process login
                processLogin({
                    email: emailInput.value,
                    password: passwordInput.value,
                    remember: document.querySelector('input[type="checkbox"]').checked
                });
                
                // Restore button
                loginButton.textContent = originalText;
                loginButton.disabled = false;
            }, 1500);
        }
    });
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showInputError(emailInput, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showInputError(emailInput, 'Please enter a valid email address');
        return false;
    } else {
        clearInputError(emailInput);
        return true;
    }
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();
    
    if (!password) {
        showInputError(passwordInput, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showInputError(passwordInput, 'Password must be at least 6 characters');
        return false;
    } else {
        clearInputError(passwordInput);
        return true;
    }
}

function showInputError(input, message) {
    clearInputError(input);
    
    // Add error class
    input.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff3860;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    // Insert after input
    input.parentNode.appendChild(errorDiv);
}

function clearInputError(input) {
    // Remove error class
    input.classList.remove('error');
    
    // Remove existing error message
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ========== LOGIN PROCESSING ==========
function processLogin(credentials) {
    // In a real application, this would be an API call
    console.log('Processing login:', credentials.email);
    
    // Save to localStorage if "Remember me" is checked
    if (credentials.remember) {
        localStorage.setItem('movietalks_remembered_email', credentials.email);
    } else {
        localStorage.removeItem('movietalks_remembered_email');
    }
    
    // Simulate successful login
    showNotification('Login successful! Redirecting...');
    
    // Redirect to homepage after a delay
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 2000);
}

function checkRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('movietalks_remembered_email');
    const rememberCheckbox = document.querySelector('input[type="checkbox"]');
    
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
}

// ========== SOCIAL LOGIN ==========
function initSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let provider;
            if (this.querySelector('.fa-google')) {
                provider = 'Google';
            } else if (this.querySelector('.fa-facebook-f')) {
                provider = 'Facebook';
            } else if (this.querySelector('.fa-twitter')) {
                provider = 'Twitter';
            }
            
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate social login
            setTimeout(() => {
                this.innerHTML = originalHTML;
                showNotification(`Signing in with ${provider}...`);
            }, 1500);
        });
    });
}

// ========== FORGOT PASSWORD ==========
function initForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (!forgotPasswordLink) return;
    
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create forgot password modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Reset Password</h3>
                <p>Enter your email address and we'll send you instructions to reset your password.</p>
                <div class="input-group">
                    <input type="email" id="reset-email" placeholder="Enter your email">
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary" id="cancel-reset">Cancel</button>
                    <button class="btn-primary" id="send-reset">Send Instructions</button>
                </div>
            </div>
        `;
        
        // Style the modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('cancel-reset').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        document.getElementById('send-reset').addEventListener('click', function() {
            const email = document.getElementById('reset-email').value;
            if (validateEmailAddress(email)) {
                // Simulate sending reset instructions
                document.body.removeChild(modal);
                showNotification('Password reset instructions sent to your email');
            } else {
                alert('Please enter a valid email address');
            }
        });
        
        // Close modal on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });
}

function validateEmailAddress(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== REMEMBER ME FUNCTIONALITY ==========
function initRememberMe() {
    const rememberCheckbox = document.querySelector('input[type="checkbox"]');
    
    if (!rememberCheckbox) return;
    
    rememberCheckbox.addEventListener('change', function() {
        if (this.checked) {
            const email = document.getElementById('email').value;
            if (email) {
                localStorage.setItem('movietalks_remembered_email', email);
            }
        } else {
            localStorage.removeItem('movietalks_remembered_email');
        }
    });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
    