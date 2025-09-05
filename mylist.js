 
      // movieTalks.js
// JavaScript for MovieTalks - My Watchlist functionality

// Wait for DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    initMovieTalks();
});

/**
 * Main initialization function
 * Sets up all event listeners and initial state
 */
function initMovieTalks() {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize watchlist item management
    initWatchlistItems();
    
    // Initialize tab functionality
    initTabs();
    
    // Initialize sorting functionality
    initSorting();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize stats update (for demonstration)
    initDemoStats();


    //init dropdown
    initUserDropdown()
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
 * Watchlist item management
 * Handles removal of items and progress tracking
 */
function initWatchlistItems() {
    const movieGrid = document.querySelector('.movies-grid');
    
    if (!movieGrid) return;
    
    // Add event listener for remove buttons using event delegation
    movieGrid.addEventListener('click', function(event) {
        const removeBtn = event.target.closest('.remove-btn');
        
        if (removeBtn) {
            // Find the parent movie card
            const movieCard = removeBtn.closest('.movie-card');
            
            if (movieCard) {
                // Animation for removal
                movieCard.style.opacity = '0';
                movieCard.style.transition = 'opacity 0.3s ease';
                
                // Remove after animation completes
                setTimeout(() => {
                    movieCard.remove();
                    updateStatsAfterRemoval();
                    showNotification('Item removed from your watchlist');
                }, 300);
            }
        }
    });
    
    // Add event listeners for progress tracking (for demonstration)
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        bar.addEventListener('click', function(event) {
            // Only respond if clicking directly on the progress bar track
            if (event.target === this) {
                const progress = this.querySelector('.progress');
                const newWidth = Math.min(100, progress.offsetWidth + 20);
                progress.style.width = newWidth + '%';
                
                // If progress is complete, add watched badge if not present
                if (newWidth === 100) {
                    const card = this.closest('.movie-card');
                    const badge = card.querySelector('.card-badge');
                    
                    if (!badge) {
                        const newBadge = document.createElement('span');
                        newBadge.className = 'card-badge';
                        newBadge.textContent = 'Watched';
                        
                        const cardImage = card.querySelector('.card-image');
                        cardImage.appendChild(newBadge);
                        
                        updateStatsAfterWatched();
                        showNotification('Marked as watched!');
                    }
                }
            }
        });
    });
}

/**
 * Tab functionality
 * Filters content based on selected tab
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the filter type from tab text
            const filterType = this.textContent.trim().toLowerCase();
            
            // Filter movies based on tab selection
            filterMovies(filterType);
        });
    });
}

/**
 * Filter movies based on selected tab
 * @param {string} filterType - Type of filter to apply
 */
function filterMovies(filterType) {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        let shouldShow = true;
        
        switch(filterType) {
            case 'movies':
                // In a real app, we would check movie vs TV show data
                // For demo, we'll use a simple check on genre/content
                const genre = card.querySelector('.card-meta span').textContent;
                shouldShow = !genre.includes('TV Show');
                break;
                
            case 'tv shows':
                // Similar simplified check for demo
                const genreTV = card.querySelector('.card-meta span').textContent;
                shouldShow = genreTV.includes('TV Show');
                break;
                
            case 'watched':
                const badge = card.querySelector('.card-badge');
                shouldShow = badge && badge.textContent === 'Watched';
                break;
                
            case 'unwatched':
                const unwatchedBadge = card.querySelector('.card-badge');
                shouldShow = !unwatchedBadge || unwatchedBadge.textContent !== 'Watched';
                break;
                
            default: // 'all items'
                shouldShow = true;
        }
        
        // Apply display based on filter
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

/**
 * Sorting functionality
 * Sorts movies based on selected criteria
 */
function initSorting() {
    const sortSelect = document.getElementById('sort');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortMovies(sortValue);
        });
    }
}

/**
 * Sort movies based on selected criteria
 * @param {string} sortBy - Criteria to sort by
 */
function sortMovies(sortBy) {
    const movieGrid = document.querySelector('.movies-grid');
    const movieCards = Array.from(document.querySelectorAll('.movie-card'));
    
    // Sort based on selected criteria
    switch(sortBy) {
        case 'title':
            movieCards.sort((a, b) => {
                const titleA = a.querySelector('.card-title').textContent.toLowerCase();
                const titleB = b.querySelector('.card-title').textContent.toLowerCase();
                return titleA.localeCompare(titleB);
            });
            break;
            
        case 'rating':
            movieCards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('.card-rating').textContent.split(' ')[1]);
                const ratingB = parseFloat(b.querySelector('.card-rating').textContent.split(' ')[1]);
                return ratingB - ratingA; // Descending order
            });
            break;
            
        case 'release':
            movieCards.sort((a, b) => {
                // Extract year from meta info (simplified for demo)
                const yearA = parseInt(a.querySelector('.card-meta span').textContent.split('•')[0]);
                const yearB = parseInt(b.querySelector('.card-meta span').textContent.split('•')[0]);
                return yearB - yearA; // Newest first
            });
            break;
            
        case 'recent':
        default:
            // Default order - recently added (as in HTML)
            // In a real app, we would have timestamps for when items were added
            break;
    }
    
    // Remove all cards from grid
    while (movieGrid.firstChild) {
        movieGrid.removeChild(movieGrid.firstChild);
    }
    
    // Append sorted cards
    movieCards.forEach(card => {
        movieGrid.appendChild(card);
    });
}

/**
 * Search functionality
 * Filters movies based on search input
 */
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            const movieCards = document.querySelectorAll('.movie-card');
            movieCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Update stats after removing an item
 * (For demonstration purposes - in a real app this would sync with backend)
 */
function updateStatsAfterRemoval() {
    const totalItems = document.querySelector('.stats-container .stat-item:nth-child(1) .stat-number');
    if (totalItems) {
        let count = parseInt(totalItems.textContent);
        if (count > 0) count--;
        totalItems.textContent = count;
    }
}

/**
 * Update stats after marking as watched
 * (For demonstration purposes)
 */
function updateStatsAfterWatched() {
    const watchedItems = document.querySelector('.stats-container .stat-item:nth-child(4) .stat-number');
    if (watchedItems) {
        let count = parseInt(watchedItems.textContent);
        count++;
        watchedItems.textContent = count;
    }
}

/**
 * Initialize demo stats with random fluctuations
 * (For demonstration purposes only)
 */
function initDemoStats() {
    // Add some random fluctuation to stats for demo purposes
    setTimeout(() => {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const originalValue = parseInt(stat.textContent);
            // Store original value as a data attribute
            stat.dataset.original = originalValue;
        });
    }, 1000);
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
            document.body.removeChild(notification);
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

// Make functions available globally for demonstration purposes
window.movieTalks = {
    init: initMovieTalks,
    filterMovies,
    sortMovies,
    showNotification
};
    
//dropdown
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