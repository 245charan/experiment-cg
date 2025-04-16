/**
 * CaseGuard Website JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initTypedText();
    initHeaderScroll();
    initRevealAnimations();
    initCarousel();
});

// typed.js text animation

function initTypedText() {
    const typedElement = document.getElementById('typed-text');
    
    if (typedElement && window.Typed) {
        // Get typed items from data attribute
        const items = typedElement.getAttribute('data-typed-items');
        const strings = items ? items.split(',') : [
            'Protect sensitive information.',
            'Automate redaction workflows.',
            'Save time with AI detection.',
            'Maintain compliance confidently.'
        ];
        
        // Initialize Typed.js with optimized settings
		console.log('strings', strings);
        new Typed('#typed-text', {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }
}

// Scroll effect

function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }
}


 //Reveal animations on scroll

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.feature-card, .workflow-card, .video-features .feature');
    
    if (revealElements.length > 0) {
        checkRevealElements();
        
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(function() {
                checkRevealElements();
                scrollTimeout = null;
            }, 100);
        }, { passive: true });
        
        // Function to check and reveal elements
        function checkRevealElements() {
            const windowHeight = window.innerHeight;
            const revealPoint = 150;
            
            revealElements.forEach(function(el) {
                if (!el.classList.contains('revealed')) {
                    const elementTop = el.getBoundingClientRect().top;
                    
                    if (elementTop < windowHeight - revealPoint) {
                        el.classList.add('revealed');
                    }
                }
            });
        }
    }
}

 //Coverflow carousel functionality

function initCarousel() {
    let currentIndex = 0;
    let autoRotateTimer;
    const coverflowCarousel = document.querySelector('.coverflow-carousel');
    
    if (!coverflowCarousel) return;
    
    const sliderCards = document.querySelectorAll('.slider-card');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const totalItems = sliderCards.length;
    
    // Navigate to a specific slide

    function loadShow(active = 0) {
        //active should be with in range
        active = (active + totalItems) % totalItems;
        
        const windowWidth = window.innerWidth;
        
        // Update slide classes
        document.querySelectorAll('.slider-video-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active', 'prev', 'next', 'inactive');
        });
        
        // Set active slide and its neighbors
        for (let i = 0; i < totalItems; i++) {
            const slideWrapper = sliderCards[i].querySelector('.slider-video-wrapper');
            
            if (i === active) {
                slideWrapper.classList.add('active');
            } else if (i === (active - 1 + totalItems) % totalItems) {
                slideWrapper.classList.add('prev');
            } else if (i === (active + 1) % totalItems) {
                slideWrapper.classList.add('next');
            } else {
                slideWrapper.classList.add('inactive');
            }
        }
        
        // Update dots
        carouselDots.forEach((dot, index) => {
            if (index === active) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
        
        // Update current index
        currentIndex = active;
        
        // Handle responsive layout
        if (windowWidth <= 768) {
            // Mobile view 
            sliderCards.forEach((item, index) => {
                if (index === active) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.zIndex = '1';
                    item.style.transform = 'none';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.zIndex = '0';
                }
            });
        } else {
            // Desktop view - 3D carousel effect
            sliderCards.forEach((item, index) => {
                item.style.display = 'block';
                
                if (index === active) {
                    // Position active slide
                    item.style.transform = 'translateX(0) scale(1)';
                    item.style.zIndex = '10';
                    item.style.opacity = '1';
                } else if ((index - active + totalItems) % totalItems <= 2) {
                    // Position slides to the right
                    const distance = (index - active + totalItems) % totalItems;
                    item.style.transform = `translateX(${30 * distance}px) scale(${1 - 0.2 * distance}) perspective(16px)`;
                    item.style.zIndex = `${10 - distance}`;
                    item.style.opacity = distance === 1 ? '0.9' : '0';
                } else {
                    // Position slides to the left
                    const distance = (active - index + totalItems) % totalItems;
                    item.style.transform = `translateX(${-30 * distance}px) scale(${1 - 0.2 * distance}) perspective(16px)`;
                    item.style.zIndex = `${10 - distance}`;
                    item.style.opacity = distance === 1 ? '0.9' : '0';
                }
            });
        }
        
        // Lazy load video
        const activeVideo = sliderCards[active].querySelector('video');
        if (activeVideo) {
            // Replace data-src with src if it exists
            if (activeVideo.hasAttribute('data-src') && !activeVideo.src) {
                activeVideo.src = activeVideo.getAttribute('data-src');
            }
            
            // Play video with error handling
            if (activeVideo.paused) {
                activeVideo.play().catch(e => {
                    console.log('Video play error:', e);
                });
            }
        }
    }
    
    // Initialize the carousel
    loadShow(0);
    
    // Add click event to dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            loadShow(index);
            resetAutoRotate();
        });
        
        // Add keyboard support
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadShow(index);
                resetAutoRotate();
            }
        });
    });
    
    // Auto-rotation video
    function startAutoRotate() {
        autoRotateTimer = setInterval(function() {
            loadShow(currentIndex + 1);
        }, 10000);
    }
    
    function resetAutoRotate() {
        clearInterval(autoRotateTimer);
        startAutoRotate();
    }
    
    // Start auto-rotation
    startAutoRotate();
    
    // Pause auto-rotation on user interaction
    coverflowCarousel.addEventListener('mouseenter', function() {
        clearInterval(autoRotateTimer);
    });
    
    coverflowCarousel.addEventListener('mouseleave', function() {
        startAutoRotate();
    });
    
    // Handle window resize to adjust carousel layout
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            loadShow(currentIndex);
        }, 100);
    }, { passive: true });
}

