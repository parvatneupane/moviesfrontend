// =============================================================================
// MAIN APPLICATION MODULE
// =============================================================================
const MovieDetailApp = (function() {
    // DOM Elements cache
    const elements = {
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        navLinks: document.querySelector('.nav-links'),
        searchBar: document.querySelector('.search-bar'),
        userActions: document.querySelector('.user-actions'),
        ratingStars: document.querySelectorAll('.star-rating i'),
        ratingSubmit: document.querySelector('.rating-submit'),
        reviewForm: document.querySelector('.review-form form'),
        watchlistBtn: document.getElementById('watchlist-btn')
    };

    // State management
    let state = {
        userRating: 0,
        isMovieInWatchlist: false,
        movieId: 'inception-2010' // This would normally be dynamic
    };

    // Constants
    const STORAGE_KEYS = {
        RATINGS: 'userRatings',
        WATCHLIST: 'myWatchlist'
    };

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    function init() {
        setupEventListeners();
        checkLocalStorage();
        console.log('MovieDetailApp initialized successfully');
    }

    // =========================================================================
    // EVENT LISTENERS SETUP
    // =========================================================================
    function setupEventListeners() {
        // Mobile menu toggle
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Star rating interaction
        if (elements.ratingStars.length > 0) {
            elements.ratingStars.forEach(star => {
                star.addEventListener('click', handleStarClick);
                star.addEventListener('mouseover', handleStarHover);
                star.addEventListener('mouseout', handleStarHoverOut);
            });
        }

        // Rating submission
        if (elements.ratingSubmit) {
            elements.ratingSubmit.addEventListener('click', submitUserRating);
        }

        // Review form submission
        if (elements.reviewForm) {
            elements.reviewForm.addEventListener('submit', handleReviewSubmit);
        }

        // Watchlist functionality
        if (elements.watchlistBtn) {
            elements.watchlistBtn.addEventListener('click', toggleMovieInWatchlist);
        }
    }

    // =========================================================================
    // MOBILE MENU FUNCTIONALITY
    // =========================================================================
    function toggleMobileMenu() {
        elements.navLinks.classList.toggle('active');
        elements.searchBar.classList.toggle('active');
        elements.userActions.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = elements.navLinks.classList.contains('active');
        elements.mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        
        // Change icon based on state
        const icon = elements.mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
        }
    }

    // =========================================================================
    // RATING SYSTEM FUNCTIONALITY
    // =========================================================================
    function handleStarClick(event) {
        const ratingValue = parseInt(event.target.getAttribute('data-value'));
        state.userRating = ratingValue;
        updateStarDisplay(ratingValue);
    }

    function handleStarHover(event) {
        const hoverValue = parseInt(event.target.getAttribute('data-value'));
        updateStarDisplay(hoverValue, true);
    }

    function handleStarHoverOut() {
        updateStarDisplay(state.userRating, false);
    }

    function updateStarDisplay(rating, isHover = false) {
        elements.ratingStars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            
            if (isHover) {
                star.classList.toggle('active', starValue <= rating);
                star.classList.toggle('hover', starValue <= rating);
            } else {
                star.classList.toggle('active', starValue <= rating);
                star.classList.remove('hover');
            }
        });
    }

    function submitUserRating() {
        if (state.userRating === 0) {
            showNotification('Please select a rating before submitting', 'error');
            return;
        }
        
        // Save rating to localStorage
        const ratings = getFromStorage(STORAGE_KEYS.RATINGS, {});
        ratings[state.movieId] = state.userRating;
        saveToStorage(STORAGE_KEYS.RATINGS, ratings);
        
        showNotification(`Thanks for your ${state.userRating} star rating!`, 'success');
    }

    // =========================================================================
    // REVIEW SYSTEM FUNCTIONALITY
    // =========================================================================
    function handleReviewSubmit(event) {
        event.preventDefault();
        
        const titleInput = document.getElementById('review-title');
        const contentInput = document.getElementById('review-content');
        
        if (!validateInputs([titleInput, contentInput])) {
            showNotification('Please fill in both title and review content', 'error');
            return;
        }
        
        // Create and add review
        const newReview = createReviewObject(titleInput.value, contentInput.value);
        addReviewToDOM(newReview);
        
        // Reset form
        resetForm([titleInput, contentInput]);
        
        showNotification('Review submitted successfully!', 'success');
    }

    function createReviewObject(title, content) {
        return {
            title: title,
            content: content,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            rating: state.userRating || 5,
            user: 'You'
        };
    }

    function addReviewToDOM(review) {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList) return;
        
        const reviewElement = createReviewElement(review);
        reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
    }

    function createReviewElement(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="reviewer">
                    <div class="reviewer-avatar">
                        <img src="https://source.unsplash.com/random/100x100/?person,user" alt="User Avatar">
                    </div>
                    <div>
                        <div class="reviewer-name">${review.user}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="rating-stars">
                        ${generateStarIcons(review.rating)}
                    </div>
                </div>
            </div>
            
            <h4>${review.title}</h4>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
        `;
        
        return reviewElement;
    }

    function generateStarIcons(rating) {
        return Array.from({ length: 5 }, (_, i) => 
            `<i class="${i < rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
    }

    // =========================================================================
    // WATCHLIST FUNCTIONALITY
    // =========================================================================
    function toggleMovieInWatchlist() {
        let myWatchlist = getFromStorage(STORAGE_KEYS.WATCHLIST, []);
        
        if (state.isMovieInWatchlist) {
            // Remove from watchlist
            myWatchlist = myWatchlist.filter(id => id !== state.movieId);
            updateWatchlistButton(false);
            showNotification('Removed from your watchlist', 'info');
        } else {
            // Add to watchlist
            if (!myWatchlist.includes(state.movieId)) {
                myWatchlist.push(state.movieId);
            }
            updateWatchlistButton(true);
            showNotification('Added to your watchlist!', 'success');
        }
        
        saveToStorage(STORAGE_KEYS.WATCHLIST, myWatchlist);
        state.isMovieInWatchlist = !state.isMovieInWatchlist;
    }

    function updateWatchlistButton(isInWatchlist) {
        if (!elements.watchlistBtn) return;
        
        if (isInWatchlist) {
            elements.watchlistBtn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
            elements.watchlistBtn.classList.add('added');
        } else {
            elements.watchlistBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Watchlist';
            elements.watchlistBtn.classList.remove('added');
        }
    }

    // =========================================================================
    // LOCAL STORAGE MANAGEMENT
    // =========================================================================
    function checkLocalStorage() {
        // Check if movie is in user's watchlist
        const myWatchlist = getFromStorage(STORAGE_KEYS.WATCHLIST, []);
        state.isMovieInWatchlist = myWatchlist.includes(state.movieId);
        
        if (state.isMovieInWatchlist) {
            updateWatchlistButton(true);
        }
        
        // Check if user has already rated this movie
        const ratings = getFromStorage(STORAGE_KEYS.RATINGS, {});
        if (ratings[state.movieId]) {
            state.userRating = ratings[state.movieId];
            updateStarDisplay(state.userRating);
        }
    }

    function getFromStorage(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    function saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
            showNotification('Failed to save data. Please try again.', 'error');
        }
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================
    function validateInputs(inputs) {
        return inputs.every(input => input && input.value.trim());
    }

    function resetForm(inputs) {
        inputs.forEach(input => {
            if (input) input.value = '';
        });
    }

    // =========================================================================
    // NOTIFICATION SYSTEM
    // =========================================================================
    function showNotification(message, type = 'info') {
        // Remove any existing notifications first
        removeExistingNotifications();
        
        // Create and show new notification
        const notification = createNotificationElement(message, type);
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Set up auto-removal and close button
        setupNotificationRemoval(notification);
    }

    function removeExistingNotifications() {
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });
    }

    function createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;
        return notification;
    }

    function setupNotificationRemoval(notification) {
        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => removeNotification(notification));
        
        // Auto-remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Keep reference to timer for cleanup
        notification._autoRemoveTimer = autoRemoveTimer;
    }

    function removeNotification(notification) {
        if (notification._autoRemoveTimer) {
            clearTimeout(notification._autoRemoveTimer);
        }
        
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }


    

    // =========================================================================
    // PUBLIC API
    // =========================================================================
    return {
        init: init
    };
})();

// =============================================================================
// DOCUMENT READY & INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    MovieDetailApp.init();
    initUserDropdown();
    
    // Additional initialization can go here
    console.log('DOM fully loaded and parsed');
});

// =============================================================================
// ADDITIONAL ENHANCEMENTS (Outside main module)
// =============================================================================

// Lazy loading for images with Intersection Observer
if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                lazyImageObserver.unobserve(img);
            }
        });
    });
    
    // Observe all images
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img').forEach(img => {
            lazyImageObserver.observe(img);
        });
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Example usage for scroll events
window.addEventListener('scroll', debounce(function() {
    // Handle scroll events efficiently
}, 100));

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