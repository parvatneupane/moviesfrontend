 
      // aboutUs.js
// JavaScript for MovieTalks About Us page - Professional implementation

// Wait for DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutUsPage();
});

/**
 * Main initialization function
 * Sets up all event listeners and initial state for the About Us page
 */
function initializeAboutUsPage() {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize team member interaction
    initTeamMembers();
    
    // Initialize animated statistics
    initAnimatedStats();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize smooth scrolling for internal links
    initSmoothScrolling();

    //dropdown fn
    initUserDropdown();
}

/**
 * Mobile menu functionality
 * Toggles navigation on mobile devices
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = navLinks.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }
}

/**
 * Team member interaction
 * Adds hover effects and additional info display for team members
 */
function initTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // Add hover effect
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
        });
        
        // Add click to show more info (for demonstration)
        member.addEventListener('click', function() {
            const memberName = this.querySelector('.member-name').textContent;
            showTeamMemberDetail(memberName);
        });
    });
}

/**
 * Animated statistics
 * Animates the counting up of statistics when they come into view
 */
function initAnimatedStats() {
    const statCards = document.querySelectorAll('.stat-card');
    const statsSection = document.querySelector('.stats-grid');
    
    // Only initialize if we have stats and Intersection Observer is supported
    if (statCards.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStatistics();
                        observer.unobserve(entry.target); // Stop observing after animation
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of element is visible
        );
        
        // Observe the stats section
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
}

/**
 * Animate the statistics counting up
 */
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const animationDuration = 2000; // 2 seconds
    const frameRate = 30; // frames per second
    const totalFrames = (animationDuration / 1000) * frameRate;
    
    statNumbers.forEach(stat => {
        const finalValue = parseStatValue(stat.textContent);
        const increment = finalValue / totalFrames;
        let currentValue = 0;
        
        // Update the stat value gradually
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                clearInterval(timer);
                currentValue = finalValue;
            }
            
            // Format number with commas if it's a large number
            stat.textContent = formatNumber(Math.floor(currentValue));
        }, 1000 / frameRate);
    });
}

/**
 * Parse statistic values from the HTML
 * @param {string} value - The statistic value text
 * @returns {number} The numeric value
 */
function parseStatValue(value) {
    if (value.includes('M')) {
        return parseFloat(value) * 1000000;
    } else if (value.includes('K')) {
        return parseFloat(value) * 1000;
    } else if (value.includes('%')) {
        return parseFloat(value);
    }
    return parseInt(value);
}

/**
 * Format numbers with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toString();
}

/**
 * Search functionality
 * Filters content based on search input (for demonstration)
 */
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        // Add debounce to prevent excessive filtering
        const debouncedSearch = debounce(function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // In a real implementation, this would filter page content
                console.log(`Searching for: ${searchTerm}`);
                showNotification(`Searching for "${searchTerm}"`);
            }
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Show team member detail (for demonstration)
 * @param {string} memberName - Name of the team member
 */
function showTeamMemberDetail(memberName) {
    // In a real implementation, this would show a modal or expand the card
    showNotification(`Showing details for ${memberName}`);
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        font-family: inherit;
    `;
    
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
    }, 3000);
}

/**
 * Utility function to debounce rapid-fire events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

// Make functions available globally if needed
window.movieTalksAbout = {
    init: initializeAboutUsPage,
    showNotification
};
    //login

     // ========== USER DROPDOWN ==========
        function initUserDropdown() {
            const btn = document.getElementById("mainBtn");
            const options = document.getElementById("options");

            // Toggle options when button is clicked
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                options.classList.toggle("show");
            });

            // Hide options when clicking outside
            document.addEventListener("click", () => {
                options.classList.remove("show");
            });

            // Prevent hiding when clicking inside options
            options.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }