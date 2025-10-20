// script.js

// Typewriter Effect
const texts = ["Software Developer", "Tech Explorer", "Passionate Coder"];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typewriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typewriter, typingSpeed);
}

// Start typewriter when page loads
window.addEventListener('load', () => {
    setTimeout(typewriter, 500);
    
    // Ensure first tab (Projects) cards are visible
    const projectCards = document.querySelectorAll('#projects .project-card');
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 2rem';
        navbar.style.boxShadow = '0 5px 30px rgba(44, 106, 116, 0.2)';
    } else {
        navbar.style.padding = '1rem 2rem';
        navbar.style.boxShadow = '0 2px 20px rgba(44, 106, 116, 0.1)';
    }
    
    lastScroll = currentScroll;
});


// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Add animation to cards
        animateCards(tabName);
    });
});

// Animate cards on tab switch - FIXED VERSION
function animateCards(tabName) {
    const container = document.getElementById(tabName);
    if (!container) return;
    
    // Get all cards based on tab type
    let allCards;
    if (tabName === 'projects') {
        allCards = container.querySelectorAll('.project-card');
    } else if (tabName === 'certificates' || tabName === 'othercertificates') {
        allCards = container.querySelectorAll('.certificate-card');
    } else if (tabName === 'techstack') {
        allCards = container.querySelectorAll('.stack-item');
    }
    
    if (!allCards || allCards.length === 0) return;
    
    // Reset and animate cards
    allCards.forEach((card, index) => {
        // Set initial hidden state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Certificate modal/lightbox (optional - click to view larger)
document.addEventListener('DOMContentLoaded', () => {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'certificate-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Close modal
            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
            
            // Animate modal
            setTimeout(() => modal.style.opacity = '1', 10);
        });
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.about, .projects, .contact').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 1s ease';
    observer.observe(section);
});

// Particle effect on mouse move
const hero = document.querySelector('.hero');
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.opacity = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
        
        if (this.opacity <= 0) {
            return false;
        }
        return true;
    }
}

hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (Math.random() < 0.3) {
        particles.push(new Particle(x, y));
    }
});

// Animate particles
function animateParticles() {
    particles = particles.filter(particle => particle.update());
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Download CV button
document.querySelector('.download-btn').addEventListener('click', () => {
    // Ripple effect
    const button = document.querySelector('.download-btn');
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    ripple.style.animation = 'ripple 0.6s';

    button.style.position = 'relative';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    // Buka CV di tab baru
    window.open('SASHA-CV.pdf', '_blank');
});


// Add ripple animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(2);
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for floating icons
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingIcons = document.querySelectorAll('.float-icon');
    
    floatingIcons.forEach((icon, index) => {
        const speed = 0.5 + (index * 0.1);
        icon.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Magnetic effect for social icons
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        icon.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Glowing border animation for profile image
const imageBorder = document.querySelector('.image-border');
let hue = 0;

function animateGlow() {
    hue = (hue + 1) % 360;
    imageBorder.style.filter = `drop-shadow(0 0 20px hsla(${hue}, 70%, 50%, 0.5))`;
    requestAnimationFrame(animateGlow);
}
animateGlow();

// Project cards hover effect with tilt
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Project Image Lightbox for Figma Screenshots
document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const modal = document.createElement('div');
            modal.className = 'image-lightbox';
            modal.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${this.src}" alt="${this.alt}">
                    <div class="lightbox-caption">${this.alt}</div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            };
            
            modal.querySelector('.lightbox-close').addEventListener('click', closeModal);
            modal.querySelector('.lightbox-backdrop').addEventListener('click', closeModal);
            
            setTimeout(() => modal.style.opacity = '1', 10);
        });
    });
});

// Tech stack icons animation on hover
const techItems = document.querySelectorAll('.tech-item');

techItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('i');
        icon.style.transition = 'all 0.5s ease';
        icon.style.transform = 'scale(1.3) rotate(360deg)';
    });
    
    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Contact items pulse effect
const contactItems = document.querySelectorAll('.contact-item');

contactItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

// Add pulse animation on scroll into view
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'pulse 0.6s ease';
        }
    });
}, { threshold: 0.5 });

contactItems.forEach(item => {
    contactObserver.observe(item);
});

// Add pulse keyframes
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);

// Stack items 3D rotation on scroll
const stackItems = document.querySelectorAll('.stack-item');

const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(stackItems).indexOf(entry.target);
            entry.target.style.animation = `stackRotate 1s ease ${index * 0.1}s forwards`;
        }
    });
}, { threshold: 0.2 });

stackItems.forEach(item => stackObserver.observe(item));

const stackStyle = document.createElement('style');
stackStyle.textContent = `
    @keyframes stackRotate {
        from {
            opacity: 0;
            transform: rotateY(-90deg) scale(0.5);
        }
        to {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
        }
    }
`;
document.head.appendChild(stackStyle);

// Text reveal animation for about section
const aboutText = document.querySelectorAll('.about-text p');

const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(aboutText).indexOf(entry.target);
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

aboutText.forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateX(-50px)';
    p.style.transition = 'all 0.8s ease';
    textObserver.observe(p);
});

// Contact Form Handler
// Contact Form Handler with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.send-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success message
                showNotification('success', 'Message Sent Successfully!', 'Thank you! I\'ll get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error message
            showNotification('error', 'Oops! Something went wrong', 'Please try again or email me directly.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification function
function showNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <div>
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Navbar active link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active state style
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--driftwood-teal);
        font-weight: 700;
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navStyle);
// Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    
    let currentSlide = 0;
    let isAnimating = false;
    
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Add active to current
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Button events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Indicator events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Auto-play (optional)
    let autoplayInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 4000);
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide(); // Swipe left
        if (touchEndX > touchStartX + 50) prevSlide(); // Swipe right
    }
});

// Landscape Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const carouselLandscape = document.querySelector('.carousel-landscape');
    if (!carouselLandscape) return;
    
    const slides = carouselLandscape.querySelectorAll('.carousel-slide-landscape');
    const indicators = carouselLandscape.querySelectorAll('.indicator-landscape');
    const prevBtn = carouselLandscape.querySelector('.prev-btn-landscape');
    const nextBtn = carouselLandscape.querySelector('.next-btn-landscape');
    
    let currentSlide = 0;
    let isAnimating = false;
    
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 4000);
    
    carouselLandscape.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carouselLandscape.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 4000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselLandscape.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselLandscape.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    });
});


console.log('🎨 Portfolio loaded successfully!');
console.log('✨ All animations activated!');