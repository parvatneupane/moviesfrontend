 
     // adminLogin.js
// JavaScript for MovieTalk Admin Login - Professional Implementation

// Wait for DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminLogin();
});

/**
 * Main initialization function
 * Sets up all event listeners and initial state for the Admin Login page
 */
function initializeAdminLogin() {
    // Initialize form validation
    initFormValidation();
    
    // Initialize password visibility toggle
    initPasswordToggle();
    
    // Initialize enter key submission
    initEnterKeySubmission();
    
    // Initialize security features
    initSecurityFeatures();
    
    // Check for existing cookies and auto-fill if present
    checkRememberMe();
}

/**
 * Form validation
 * Validates inputs before form submission
 */
function initFormValidation() {
    const loginForm = document.querySelector('.adminpro-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Prevent form submission for validation
            event.preventDefault();
            
            // Get form inputs
            const usernameInput = document.querySelector('input[name="username"]');
            const passwordInput = document.querySelector('input[name="password"]');
            let isValid = true;
            
            // Reset previous error states
            clearErrorStates();
            
            // Validate username
            if (!usernameInput.value.trim()) {
                showInputError(usernameInput, 'Username is required');
                isValid = false;
            } else if (usernameInput.value.trim().length < 3) {
                showInputError(usernameInput, 'Username must be at least 3 characters');
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value) {
                showInputError(passwordInput, 'Password is required');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                showInputError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // If valid, submit the form
            if (isValid) {
                // In a real application, you might hash the password here
                // before submitting to the server
                
                // Show loading state
                const submitButton = document.querySelector('.login-button');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Logging in...';
                submitButton.disabled = true;
                
                // Simulate network request (remove in production)
                simulateLoginRequest()
                    .then(() => {
                        // Actually submit the form in a real application
                        loginForm.submit();
                    })
                    .catch(error => {
                        showNotification('Login failed: ' + error, 'error');
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
            }
        });
    }
}

/**
 * Password visibility toggle
 * Allows users to show/hide their password
 */
function initPasswordToggle() {
    const passwordInput = document.querySelector('input[name="password"]');
    const passwordIcon = document.querySelector('.fa-lock');
    
    if (passwordInput && passwordIcon) {
        // Change the lock icon to an eye icon when interacting with password field
        passwordInput.addEventListener('focus', function() {
            passwordIcon.classList.remove('fa-lock');
            passwordIcon.classList.add('fa-eye');
        });
        
        passwordInput.addEventListener('blur', function() {
            if (!passwordInput.value) {
                passwordIcon.classList.remove('fa-eye');
                passwordIcon.classList.add('fa-lock');
            }
        });
        
        // Add click event to toggle password visibility
        passwordIcon.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.classList.remove('fa-eye');
                passwordIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                passwordIcon.classList.remove('fa-eye-slash');
                passwordIcon.classList.add('fa-eye');
            }
        });
    }
}

/**
 * Enter key submission
 * Allows users to submit the form by pressing Enter
 */
function initEnterKeySubmission() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.querySelector('.adminpro-form').dispatchEvent(new Event('submit'));
            }
        });
    });
}

/**
 * Security features
 * Implements basic security measures
 */
function initSecurityFeatures() {
    // Prevent pasting in username field (optional security measure)
    const usernameInput = document.querySelector('input[name="username"]');
    
    if (usernameInput) {
        usernameInput.addEventListener('paste', function(event) {
            // Allow pasting but clean the input
            setTimeout(() => {
                usernameInput.value = usernameInput.value.replace(/\s+/g, '');
            }, 10);
        });
    }
    
    // Add timeout for multiple failed attempts (basic implementation)
    let failedAttempts = 0;
    const loginForm = document.querySelector('.adminpro-form');
    
    if (loginForm) {
        loginForm.addEventListener('form-error', function() {
            failedAttempts++;
            
            if (failedAttempts >= 3) {
                // Implement timeout after 3 failed attempts
                const submitButton = document.querySelector('.login-button');
                submitButton.disabled = true;
                
                showNotification('Too many failed attempts. Please wait 30 seconds.', 'error');
                
                setTimeout(() => {
                    submitButton.disabled = false;
                    failedAttempts = 0;
                }, 30000); // 30 second timeout
            }
        });
    }
}

/**
 * Check remember me functionality
 * Additional client-side handling for remember me feature
 */
function checkRememberMe() {
    const rememberCheckbox = document.getElementById('remember');
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    
    // If inputs are pre-filled from cookies, check the remember me box
    if (usernameInput.value && passwordInput.value && rememberCheckbox) {
        rememberCheckbox.checked = true;
    }
    
    // Add change event to update cookie preferences
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                // In a real application, you might want to clear the cookies
                // when the user unchecks remember me
                console.log('Remember me disabled');
            }
        });
    }
}

/**
 * Show input error state
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
    // Add error class to input
    input.classList.add('error');
    
    // Create or show error message
    let errorElement = input.parentNode.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Dispatch form error event for security features
    const form = input.closest('form');
    if (form) {
        form.dispatchEvent(new Event('form-error'));
    }
}

/**
 * Clear all error states
 */
function clearErrorStates() {
    // Remove error classes
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}

/**
 * Show notification to user
 * @param {string} message - The notification message
 * @param {string} type - The type of notification (success, error, warning)
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        font-family: inherit;
        max-width: 300px;
    `;
    
    // Style based on type
    if (type === 'error') {
        notification.style.background = '#ff4757';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = '#ffa502';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#2ed573';
        notification.style.color = 'white';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Simulate login request (for demonstration only)
 * In a real application, this would be an actual API call
 */
function simulateLoginRequest() {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Randomly fail to simulate network issues
            if (Math.random() < 0.2) { // 20% chance of failure
                reject('Network error. Please try again.');
            } else {
                resolve();
            }
        }, 1500);
    });
}

// Make functions available globally if needed
window.movieTalkAdmin = {
    init: initializeAdminLogin,
    showNotification
}; 
      
   