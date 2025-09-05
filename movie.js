 
       // ========== MAIN APPLICATION INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('MovieTalks - Your Cinema Experience - Initializing...');
    
    // Initialize all components
    initMobileNavigation();
    initSearchFunctionality();
    initFilterSystem();
    initMovieInteractions();
    initPagination();
    initFooterAccordions();
     //dropdown fn
    initUserDropdown();
    
    console.log('MovieTalks initialization complete!');
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

// ========== SEARCH FUNCTIONALITY ==========
function initSearchFunctionality() {
    const searchBar = document.querySelector('.search-bar');
    const searchInput = searchBar ? searchBar.querySelector('input') : null;
    const searchIcon = searchBar ? searchBar.querySelector('.fa-search') : null;
    
    if (!searchInput || !searchIcon) return;
    
    // Focus search when icon is clicked
    searchIcon.addEventListener('click', function() {
        searchInput.focus();
    });
    
    // Perform search with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }, 500); // 500ms debounce
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    console.log(`Searching for: ${query}`);
    
    // Show loading state
    const searchIcon = document.querySelector('.search-bar .fa-search');
    if (searchIcon) {
        searchIcon.classList.remove('fa-search');
        searchIcon.classList.add('fa-spinner', 'fa-spin');
    }
    
    // Simulate API call
    setTimeout(() => {
        // Restore search icon
        if (searchIcon) {
            searchIcon.classList.remove('fa-spinner', 'fa-spin');
            searchIcon.classList.add('fa-search');
        }
        
        // In a real app, this would display search results
        // For now, we'll just show a notification
        showNotification(`Showing results for: "${query}"`);
        
        // Clear the search input
        document.querySelector('.search-bar input').value = '';
    }, 1500);
}

// ========== FILTER SYSTEM ==========
function initFilterSystem() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const applyFiltersBtn = document.querySelector('.filter-buttons .btn-primary');
    const resetFiltersBtn = document.querySelector('.filter-buttons .btn-secondary');
    
    if (!applyFiltersBtn || !resetFiltersBtn) return;
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        const filters = {};
        
        filterSelects.forEach(select => {
            if (select.value) {
                filters[select.id] = select.value;
            }
        });
        
        applyMovieFilters(filters);
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', function() {
        filterSelects.forEach(select => {
            select.value = '';
        });
        
        // Reset to show all movies
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.style.display = 'block';
        });
        
        showNotification('Filters reset');
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortMovies(this.value);
        });
    }
}

function applyMovieFilters(filters) {
    console.log('Applying filters:', filters);
    
    const movieCards = document.querySelectorAll('.movie-card');
    let visibleCount = 0;
    
    movieCards.forEach(card => {
        let shouldShow = true;
        const metaText = card.querySelector('.card-meta').textContent;
        const rating = parseFloat(card.querySelector('.card-rating').textContent);
        
        // Genre filter
        if (filters.genre && !metaText.toLowerCase().includes(filters.genre)) {
            shouldShow = false;
        }
        
        // Year filter
        if (filters.year) {
            const year = metaText.match(/\d{4}/);
            if (year) {
                const movieYear = parseInt(year[0]);
                
                if (filters.year === '2010s' && (movieYear < 2010 || movieYear > 2019)) {
                    shouldShow = false;
                } else if (filters.year === '2000s' && (movieYear < 2000 || movieYear > 2009)) {
                    shouldShow = false;
                } else if (filters.year === '1990s' && (movieYear < 1990 || movieYear > 1999)) {
                    shouldShow = false;
                } else if (filters.year.length === 4 && movieYear !== parseInt(filters.year)) {
                    shouldShow = false;
                }
            }
        }
        
 if (filters.rating && rating < parseInt(filters.rating)) {
    shouldShow = false;
}

    
        // Show/hide based on filters
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    showNotification(`Found ${visibleCount} movies matching your filters`);
}

function sortMovies(criteria) {
    const moviesGrid = document.querySelector('.movies-grid');
    const movieCards = Array.from(document.querySelectorAll('.movie-card'));
    
    movieCards.sort((a, b) => {
        switch(criteria) {
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.card-rating').textContent);
                const ratingB = parseFloat(b.querySelector('.card-rating').textContent);
                return ratingB - ratingA;
                
            case 'newest':
                const yearA = parseInt(a.querySelector('.card-meta').textContent.match(/\d{4}/)[0]);
                const yearB = parseInt(b.querySelector('.card-meta').textContent.match(/\d{4}/)[0]);
                return yearB - yearA;
                
            case 'title':
                const titleA = a.querySelector('.card-title').textContent.toLowerCase();
                const titleB = b.querySelector('.card-title').textContent.toLowerCase();
                return titleA.localeCompare(titleB);
                
            default: // popularity
                // For demo, we'll use a combination of rating and badge presence
                const badgeA = a.querySelector('.card-badge') ? 1 : 0;
                const badgeB = b.querySelector('.card-badge') ? 1 : 0;
                const ratingA2 = parseFloat(a.querySelector('.card-rating').textContent);
                const ratingB2 = parseFloat(b.querySelector('.card-rating').textContent);
                return (badgeB + ratingB2/10) - (badgeA + ratingA2/10);
        }
    });
    
    // Reappend sorted cards
    movieCards.forEach(card => moviesGrid.appendChild(card));
    showNotification(`Movies sorted by ${criteria}`);
}

// ========== MOVIE INTERACTIONS ==========
function initMovieInteractions() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Watch button
        const watchBtn = card.querySelector('.card-actions a:first-child');
        if (watchBtn) {
            watchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const movieTitle = card.querySelector('.card-title').textContent;
                window.location.href = "moviedetail.html";
            });
        }
        
        // Details button
        const detailsBtn = card.querySelector('.card-actions a:last-child');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const movieTitle = card.querySelector('.card-title').textContent;
                // In a real app, this would navigate to a details page
                window.location.href = "moviedetail.html";
            });
        }
        
        // Add to watchlist functionality (using localStorage)
        const watchlistBtn = card.querySelector('.watchlist-btn');
        if (watchlistBtn) {
            watchlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const movieTitle = card.querySelector('.card-title').textContent;
                toggleWatchlist(movieTitle, watchlistBtn);
            });
        }
    });
}

// ========== PAGINATION ==========
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination button');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would load the appropriate page of results
            const pageNum = this.textContent;
            if (pageNum) {
                showNotification(`Loading page ${pageNum}...`);
            } else if (this.querySelector('.fa-chevron-right')) {
                const activePage = document.querySelector('.pagination button.active');
                const nextPage = parseInt(activePage.textContent) + 1;
                showNotification(`Loading page ${nextPage}...`);
            }
        });
    });
}

// ========== WATCHLIST FUNCTIONALITY ==========
function toggleWatchlist(movieTitle, button) {
    // Get current watchlist from localStorage
    let watchlist = JSON.parse(localStorage.getItem('movietalks_watchlist') || '[]');
    
    if (watchlist.includes(movieTitle)) {
        // Remove from watchlist
        watchlist = watchlist.filter(title => title !== movieTitle);
        localStorage.setItem('movietalks_watchlist', JSON.stringify(watchlist));
        
        // Update button appearance
        button.innerHTML = '<i class="fas fa-plus"></i> Add to Watchlist';
        button.classList.remove('in-watchlist');
        
        showNotification(`Removed "${movieTitle}" from your watchlist`);
    } else {
        // Add to watchlist
        watchlist.push(movieTitle);
        localStorage.setItem('movietalks_watchlist', JSON.stringify(watchlist));
        
        // Update button appearance
        button.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
        button.classList.add('in-watchlist');
        
        showNotification(`Added "${movieTitle}" to your watchlist`);
    }
}

// ========== FOOTER ACCORDIONS (MOBILE) ==========
function initFooterAccordions() {
    const footerColumns = document.querySelectorAll('.footer-column');
    
    footerColumns.forEach(column => {
        const title = column.querySelector('h3');
        
        if (title) {
            title.addEventListener('click', function() {
                if (window.innerWidth < 768) { // Only on mobile
                    column.classList.toggle('active');
                }
            });
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

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Debounce function for resize events
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized resize handling
window.addEventListener('resize', debounce(function() {
    // Close mobile menu if screen is large enough
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}, 250));
    
// Additional functionality for grid items
document.querySelectorAll(".movies-grid").forEach(item => {
    item.addEventListener("click", () => {
        window.location.href = "moviedetail.html";
    });
});


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