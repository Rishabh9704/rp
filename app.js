// Academic Poster JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize poster functionality
    initializePoster();
    setupImageLoading();
    // setupPrintFunctionality();
    setupAccessibility();
    setupInteractiveElements();
});

/**
 * Initialize main poster functionality
 */
function initializePoster() {
    console.log('Academic poster initialized');
    
    // Add loading class to body initially
    document.body.classList.add('poster-loading');
    
    // Remove loading class after content is ready
    setTimeout(() => {
        document.body.classList.remove('poster-loading');
        document.body.classList.add('poster-ready');
    }, 500);
}

/**
 * Handle image loading with fallbacks and loading states
 */
function setupImageLoading() {
    const images = document.querySelectorAll('.section-image');
    
    images.forEach(img => {
        // Add loading state
        img.classList.add('image-loading');
        
        // Handle successful load
        img.addEventListener('load', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-loaded');
        });
        
        // Handle loading errors
        img.addEventListener('error', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-error');
            
            // Create fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-content">
                    <span class="placeholder-icon">📊</span>
                    <span class="placeholder-text">${this.alt}</span>
                </div>
            `;
            
            // Replace image with placeholder
            this.parentNode.insertBefore(placeholder, this);
            this.style.display = 'none';
        });
    });
}

/**
 * Setup print functionality for academic poster
 */
function setupPrintFunctionality() {
    // Add print button (optional)
    const header = document.querySelector('.poster-header');
    if (header) {
        const printButton = document.createElement('button');
        printButton.className = 'btn btn--secondary print-button';
        printButton.innerHTML = '🖨️ Print Poster';
        printButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 12px;
            padding: 6px 12px;
        `;
        
        printButton.addEventListener('click', function() {
            // Optimize for printing
            document.body.classList.add('printing');
            
            // Trigger print
            window.print();
            
            // Reset after print
            setTimeout(() => {
                document.body.classList.remove('printing');
            }, 1000);
        });
        
        header.style.position = 'relative';
        header.appendChild(printButton);
    }
    
    // Handle print events
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('before-print');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('before-print');
    });
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Add keyboard navigation for sections
    const sections = document.querySelectorAll('.poster-section');
    
    sections.forEach((section, index) => {
        section.setAttribute('tabindex', '0');
        section.setAttribute('role', 'region');
        
        // Add aria-label based on section title
        const title = section.querySelector('.section-title, .subsection-title');
        if (title) {
            section.setAttribute('aria-label', title.textContent);
        }
        
        // Keyboard navigation
        section.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('section-expanded');
            }
        });
    });
    
    // Add alt text to chart elements
    const dataChart = document.querySelector('.data-chart');
    if (dataChart) {
        dataChart.setAttribute('role', 'img');
        dataChart.setAttribute('aria-label', 'Pie chart showing distribution of data-related challenges: Dataset Integrity Issues 35%, Mislabeled Images 25%, Unbalanced Data 25%, Dataset Shortage 15%');
    }
}

/**
 * Setup interactive elements and animations
 */
function setupInteractiveElements() {
    // Add hover effects for sections
    const sections = document.querySelectorAll('.poster-section');
    
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.classList.add('section-hover');
        });
        
        section.addEventListener('mouseleave', function() {
            this.classList.remove('section-hover');
        });
    });
    
    // Add click interaction for images
    const images = document.querySelectorAll('.section-image');
    images.forEach(img => {
        img.addEventListener('click', function() {
            // Simple image focus/highlight
            this.classList.toggle('image-focused');
            
            // Remove focus from other images
            images.forEach(otherImg => {
                if (otherImg !== this) {
                    otherImg.classList.remove('image-focused');
                }
            });
        });
    });
    
    // Setup data chart animation
    animateDataChart();
}

/**
 * Animate the data visualization chart
 */
function animateDataChart() {
    const dataChart = document.querySelector('.data-chart');
    if (!dataChart) return;
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .data-chart.animated {
            animation: chartSpin 2s ease-in-out;
        }
        
        @keyframes chartSpin {
            0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
            50% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
            100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        
        .image-placeholder {
            width: 100%;
            max-width: 200px;
            height: 150px;
            background-color: #f0f4f8;
            border: 2px dashed #0d47a1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 16px auto;
        }
        
        .placeholder-content {
            text-align: center;
            color: #0d47a1;
        }
        
        .placeholder-icon {
            font-size: 24px;
            display: block;
            margin-bottom: 8px;
        }
        
        .placeholder-text {
            font-size: 12px;
            font-weight: 500;
        }
        
        .image-focused {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(13, 71, 161, 0.3);
            transition: all 0.3s ease;
        }
        
        .section-hover {
            transform: translateY(-1px);
            transition: transform 0.2s ease;
        }
        
        .poster-loading .poster-content {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .poster-ready .poster-content {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.5s ease;
        }
        
        @media print {
            .print-button {
                display: none !important;
            }
        }
        
        @media (max-width: 768px) {
            .image-focused {
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Trigger animation when chart comes into view
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(dataChart);
}

/**
 * Handle responsive behavior
 */
function handleResponsive() {
    const posterContent = document.querySelector('.poster-content');
    const columns = document.querySelectorAll('.column');
    
    function updateLayout() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            posterContent.classList.add('mobile-layout');
            columns.forEach(col => col.classList.add('mobile-column'));
        } else {
            posterContent.classList.remove('mobile-layout');
            columns.forEach(col => col.classList.remove('mobile-column'));
        }
    }
    
    // Initial check
    updateLayout();
    
    // Listen for resize
    window.addEventListener('resize', updateLayout);
}

// Initialize responsive behavior
handleResponsive();

/**
 * Export functionality for potential external use
 */
window.PosterApp = {
    print: function() {
        document.body.classList.add('printing');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing');
        }, 1000);
    },
    
    focusSection: function(sectionIndex) {
        const sections = document.querySelectorAll('.poster-section');
        if (sections[sectionIndex]) {
            sections[sectionIndex].focus();
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    toggleImage: function(imageIndex) {
        const images = document.querySelectorAll('.section-image');
        if (images[imageIndex]) {
            images[imageIndex].classList.toggle('image-focused');
        }
    }
};

// Add smooth scrolling for any anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});