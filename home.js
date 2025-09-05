// ========== MAIN APPLICATION CODE ==========
// This runs when the page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components of our movie streaming app
    initMobileMenu();
    initSearchFunctionality();
    initMovieCardInteractions();
    initVideoSlider();
    initSmoothScrolling();
    initWatchlistFunctionality();
    initCategoryNavigation();
    initHeaderScrollEffect();
    initLazyLoading();
      initUserDropdown();
});

// ========== MOBILE MENU FUNCTIONALITY ==========
function initMobileMenu() {
    // Get references to the mobile menu button and navigation links
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Exit if elements don't exist (prevents errors)
    if (!mobileMenuBtn || !navLinks) return;
    
    // Toggle menu when button is clicked
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent click from bubbling up
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Update accessibility attribute
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu on resize if viewport becomes large enough
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }, 250));
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
    
    // Perform search with debounce (wait until user stops typing)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            performSearch(searchInput.value.trim());
        }, 300);
    });
    
    // Also search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
        }
    });
}

function performSearch(query) {
    if (query.length === 0) return;
    
    // Show loading state
    const searchIcon = document.querySelector('.search-bar .fa-search');
    if (searchIcon) {
        searchIcon.classList.remove('fa-search');
        searchIcon.classList.add('fa-spinner', 'fa-spin');
    }
    
    // Simulate API call (in a real app, this would be a real API request)
    setTimeout(() => {
        // Restore search icon
        if (searchIcon) {
            searchIcon.classList.remove('fa-spinner', 'fa-spin');
            searchIcon.classList.add('fa-search');
        }
        
        // Show search results
        alert(`Search results for: ${query}`);
    }, 1000);
}

// ========== MOVIE CARD INTERACTIONS ==========
function initMovieCardInteractions() {
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Handle watch button clicks
        const watchBtn = card.querySelector('.card-actions a:first-child');
        if (watchBtn) {
            watchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const movieTitle = card.querySelector('.card-title').textContent;
                window.location.href = "moviedetail.html";
            });
        }
        
        // Handle details button clicks
        const detailsBtn = card.querySelector('.card-actions a:last-child');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const movieTitle = card.querySelector('.card-title').textContent;
                window.location.href = "moviedetail.html";
            });
        }
        
        // Make entire card clickable for movie details
        card.addEventListener('click', function(e) {
            // Don't trigger if user clicked on a button or link
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const movieTitle = card.querySelector('.card-title').textContent;
            // In a real app, this would navigate to movie details page
            window.location.href = "moviedetail.html"; 
        });
    });
}

// ========== VIDEO SLIDER FUNCTIONALITY ==========
function initVideoSlider() {
    const slides = document.querySelectorAll('.video-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.arrow.prev');
    const nextBtn = document.querySelector('.arrow.next');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Initialize the slider
    function initSlider() {
        // Start autoplay
        startSlideInterval();
        
        // Add event listeners for navigation
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // Pause autoplay when user interacts with slider
        const sliderContainer = document.querySelector('.video-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', pauseSlideInterval);
            sliderContainer.addEventListener('mouseleave', startSlideInterval);
            
            // Also pause when tab is not visible
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    pauseSlideInterval();
                } else {
                    startSlideInterval();
                }
            });
        }
    }
    
    // Go to a specific slide
    function goToSlide(n) {
        // Hide current slide and pause its video
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) dots[currentSlide].classList.remove('active');
        
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) currentVideo.pause();
        
        // Update current slide index
        currentSlide = (n + slides.length) % slides.length;
        
        // Show new slide and play its video
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) dots[currentSlide].classList.add('active');
        
        const nextVideo = slides[currentSlide].querySelector('video');
        if (nextVideo) {
            nextVideo.currentTime = 0;
            const playPromise = nextVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Autoplay prevented by browser: ", e);
                });
            }
        }
        
        // Restart interval
        resetSlideInterval();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Start the autoplay interval
    function startSlideInterval() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    }
    
    // Pause the autoplay interval
    function pauseSlideInterval() {
        clearInterval(slideInterval);
    }
    
    // Reset the autoplay interval
    function resetSlideInterval() {
        pauseSlideInterval();
        startSlideInterval();
    }
    
    // Handle watch and add to watchlist buttons in slider
    const watchTrailerBtns = document.querySelectorAll('.slide-buttons .btn-primary');
    const addToWatchlistBtns = document.querySelectorAll('.slide-buttons .btn-secondary');
    
    watchTrailerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const slide = this.closest('.video-slide');
            const title = slide.querySelector('h2').textContent;

             window.location.href = "moviedetail.html";
        });
    });
    
    addToWatchlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const slide = this.closest('.video-slide');
            const title = slide.querySelector('h2').textContent;
            const isInWatchlist = this.dataset.inWatchlist === 'true';
            
            if (isInWatchlist) {
                removeFromWatchlist(title);
                updateWatchlistButtonState(this, false);
            } else {
                addToWatchlist(title);
                updateWatchlistButtonState(this, true);
            }
        });
    });
    
    // Initialize the slider
    initSlider();
}

// ========== WATCHLIST FUNCTIONALITY ==========
function initWatchlistFunctionality() {
    // Initialize watchlist from localStorage if it doesn't exist
    if (!localStorage.getItem('watchlist')) {
        localStorage.setItem('watchlist', JSON.stringify([]));
    }
}

function addToWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist'));
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        
        // Show notification
        showNotification('Added to your watchlist!');
    }
}

function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist'));
    watchlist = watchlist.filter(id => id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Show notification
    showNotification('Removed from your watchlist');
}

function updateWatchlistButtonState(button, isInWatchlist) {
    button.dataset.inWatchlist = isInWatchlist;
    
    if (isInWatchlist) {
        button.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
        button.style.backgroundColor = '#4CAF50';
    } else {
        button.innerHTML = '<i class="fas fa-plus"></i> Add to Watchlist';
        button.style.backgroundColor = '';
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========== movietype category ==========
function initCategoryNavigation() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            window.location.href = "moviedetail.html";
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScrolling() {
    // Add smooth scrolling for anchor links
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

// ========== HEADER SCROLL EFFECT ==========
function initHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========== LAZY LOADING ==========
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========== UTILITY FUNCTIONS ==========

// Debounce function to limit how often a function can be called
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

// Additional functionality for grid items
document.querySelectorAll(".grid-item").forEach(item => {
    item.addEventListener("click", () => {
        window.location.href = "moviedetail.html";
    });
});



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