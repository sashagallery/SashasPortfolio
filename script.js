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
    
    // Also ensure Projects 2 cards are visible
    const project2Cards = document.querySelectorAll('#projects2 .project-card');
    project2Cards.forEach(card => {
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
    if (tabName === 'projects' || tabName === 'projects2') {
        allCards = container.querySelectorAll('.project-card');
    } else if (tabName === 'certificates' || tabName === 'othercertificates') {
        allCards = container.querySelectorAll('.certificate-card');
    } else if (tabName === 'techstack') {
        allCards = container.querySelectorAll('.stack-item');
    }
    
    if (!allCards || allCards.length === 0) return;
    
    // Ensure cards are visible initially
    allCards.forEach(card => {
        card.style.transition = 'none';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Force reflow
    void container.offsetHeight;
    
    // Animate with stagger
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Carousel Functionality with Lightbox
class Carousel {
    constructor(carouselId) {
        this.carouselId = carouselId;
        this.container = document.querySelector(`[data-carousel-id="${carouselId}"]`);
        this.images = this.container.querySelectorAll('img');
        this.dots = document.querySelectorAll(`[data-dots="${carouselId}"] .dot`);
        this.prevBtn = document.querySelector(`.carousel-btn.prev[data-carousel="${carouselId}"]`);
        this.nextBtn = document.querySelector(`.carousel-btn.next[data-carousel="${carouselId}"]`);
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.lightbox = null;
        
        this.init();
    }
    
    init() {
        // Button events
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
            this.resetAutoplay();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
            this.resetAutoplay();
        });
        
        // Dot events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goTo(index);
                this.resetAutoplay();
            });
        });
        
        // Image click for lightbox
        this.images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(index);
            });
        });
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        this.container.parentElement.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.parentElement.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    goTo(index) {
        this.images[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        this.images[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goTo(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goTo(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.next(), 3000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    openLightbox(index) {
        this.stopAutoplay();
        
        // Create lightbox
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'carousel-lightbox';
        this.lightbox.innerHTML = `
            <div class="carousel-lightbox-backdrop"></div>
            <div class="carousel-lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <img src="${this.images[index].src}" alt="${this.images[index].alt}">
                <button class="lightbox-nav next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-counter">
                    <span class="current">${index + 1}</span> / ${this.images.length}
                </div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate lightbox
        setTimeout(() => this.lightbox.classList.add('active'), 10);
        
        let lightboxIndex = index;
        const lightboxImg = this.lightbox.querySelector('img');
        const counter = this.lightbox.querySelector('.current');
        
        // Navigation in lightbox
        const updateLightbox = (newIndex) => {
            lightboxIndex = newIndex;
            lightboxImg.src = this.images[lightboxIndex].src;
            lightboxImg.alt = this.images[lightboxIndex].alt;
            counter.textContent = lightboxIndex + 1;
        };
        
        // Lightbox prev button
        this.lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => {
            const prevIndex = (lightboxIndex - 1 + this.images.length) % this.images.length;
            updateLightbox(prevIndex);
        });
        
        // Lightbox next button
        this.lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => {
            const nextIndex = (lightboxIndex + 1) % this.images.length;
            updateLightbox(nextIndex);
        });
        
        // Close lightbox
        const closeLightbox = () => {
            this.lightbox.classList.remove('active');
            setTimeout(() => {
                this.lightbox.remove();
                document.body.style.overflow = 'auto';
                this.startAutoplay();
            }, 300);
        };
        
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        this.lightbox.querySelector('.carousel-lightbox-backdrop').addEventListener('click', closeLightbox);
        
        // Keyboard navigation
        const handleKeyboard = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeyboard);
            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (lightboxIndex - 1 + this.images.length) % this.images.length;
                updateLightbox(prevIndex);
            } else if (e.key === 'ArrowRight') {
                const nextIndex = (lightboxIndex + 1) % this.images.length;
                updateLightbox(nextIndex);
            }
        };
        
        document.addEventListener('keydown', handleKeyboard);
    }
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
    const foodieCarousel = new Carousel('foodie');
    const wordpressCarousel = new Carousel('wordpress');
    const androidCarousel = new Carousel('android');
});

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

console.log('🎨 Portfolio loaded successfully!');
console.log('✨ All animations activated!');