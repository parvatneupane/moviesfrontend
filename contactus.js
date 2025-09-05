 
        // JavaScript for MovieTalks Contact Us page

        // Wait for DOM to fully load before executing scripts
        document.addEventListener('DOMContentLoaded', function() {
            initializeContactPage();
        });

        /**
         * Main initialization function
         * Sets up all event listeners and initial state for the Contact Us page
         */
        function initializeContactPage() {
            // Initialize mobile menu functionality
            initMobileMenu();
            
            // Initialize FAQ accordion functionality
            initFAQAccordion();
            
            // Initialize contact form submission
            initContactForm();
            
            // Initialize search functionality
            initSearch();

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
         * FAQ accordion functionality
         * Toggles FAQ answers when questions are clicked
         */
        function initFAQAccordion() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                
                question.addEventListener('click', function() {
                    // Toggle active class on the FAQ item
                    item.classList.toggle('active');
                    
                    // Close other FAQ items when one is opened
                    if (item.classList.contains('active')) {
                        faqItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }
                });
            });
        }

        /**
         * Contact form submission handling
         * Processes form data and shows confirmation
         */
        function initContactForm() {
            const contactForm = document.getElementById('contactForm');
            
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form values
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const subject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value;
                    
                    // In a real implementation, you would send this data to a server
                    // For this example, we'll just show a success message
                    
                    // Show success notification
                    showNotification('Thank you for your message! We will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                });
            }
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
         * Show notification to user
         * @param {string} message - Notification message
         */
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
                    
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
        window.movieTalksContact = {
            init: initializeContactPage,
            showNotification
        };


        
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