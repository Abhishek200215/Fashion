// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen Animation
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
                initAnimations();
            }, 1000);
        }, 1500);
    } else {
        initAnimations();
    }

    function initAnimations() {
        // Initialize GSAP animations
        gsap.registerPlugin(ScrollTrigger);

        // Custom Cursor
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (cursorDot && cursorOutline) {
            window.addEventListener('mousemove', (e) => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                
                gsap.to(cursorOutline, {
                    left: e.clientX,
                    top: e.clientY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            const hoverElements = document.querySelectorAll('a, button, .option, .product-card, .menu-btn');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorDot.style.backgroundColor = 'var(--accent-color)';
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    cursorOutline.style.borderColor = 'var(--accent-color)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorDot.style.backgroundColor = 'var(--accent-color)';
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.borderColor = 'var(--primary-color)';
                });
            });
        }

        // Mobile Menu Toggle
        const menuBtn = document.querySelector('.menu-btn');
        const nav = document.querySelector('#main-nav');

        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuBtn.querySelector('i').classList.toggle('fa-times');
                
                if (nav.classList.contains('active')) {
                    gsap.from(nav.querySelectorAll('li'), {
                        x: 50,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "back.out(1.7)"
                    });
                }
            });

            document.querySelectorAll('#main-nav ul li a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuBtn.querySelector('i').classList.remove('fa-times');
                });
            });
        }

        // Header scroll effect
        const header = document.querySelector('#main-header');
        if (header) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    header.classList.remove('hidden');
                    return;
                }
                
                if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
                    header.classList.add('hidden');
                } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
                    header.classList.remove('hidden');
                }
                
                lastScroll = currentScroll;
            });
        }

        // Product carousel functionality
        const productOptions = document.querySelectorAll('.carousel .option');
        const mainProduct = document.querySelector('.main-product');

        if (productOptions.length && mainProduct) {
            productOptions.forEach(option => {
                option.addEventListener('click', () => {
                    productOptions.forEach(opt => {
                        opt.classList.remove('active');
                    });
                    
                    option.classList.add('active');
                    
                    const newImage = option.getAttribute('data-img');
                    
                    gsap.to(mainProduct, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            mainProduct.src = newImage;
                            gsap.fromTo(mainProduct, 
                                { opacity: 0, y: -20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
                            );
                        }
                    });
                });
            });
        }

        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const cartCount = document.querySelector('.cart-count');
        let count = 0;

        if (addToCartButtons.length && cartCount) {
            addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    count++;
                    cartCount.textContent = count;
                    
                    const productCard = button.closest('.product-card');
                    const productImage = productCard.querySelector('img').cloneNode(true);
                    
                    // Style the cloned image
                    productImage.style.position = 'fixed';
                    productImage.style.width = '100px';
                    productImage.style.height = '100px';
                    productImage.style.objectFit = 'cover';
                    productImage.style.borderRadius = '10px';
                    productImage.style.zIndex = '1000';
                    productImage.style.pointerEvents = 'none';
                    productImage.style.left = `${e.clientX - 50}px`;
                    productImage.style.top = `${e.clientY - 50}px`;
                    productImage.style.transform = 'scale(1)';
                    productImage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                    document.body.appendChild(productImage);
                    
                    const cartRect = document.querySelector('.cart').getBoundingClientRect();
                    const cartX = cartRect.left + cartRect.width / 2;
                    const cartY = cartRect.top + cartRect.height / 2;
                    
                    gsap.to(productImage, {
                        x: cartX - e.clientX,
                        y: cartY - e.clientY,
                        scale: 0.2,
                        duration: 0.8,
                        ease: "power2.in",
                        onComplete: () => {
                            productImage.remove();
                            
                            const cart = document.querySelector('.cart');
                            gsap.to(cart, {
                                scale: 1.2,
                                duration: 0.2,
                                yoyo: true,
                                repeat: 1,
                                ease: "power2.inOut"
                            });
                            
                            const productName = button.parentElement.querySelector('h3').textContent;
                            showNotification(`${productName} added to cart!`);
                        }
                    });
                });
            });
        }

        // Back to top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: 0,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(backToTopBtn, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            });
        }

       // Ensure GSAP ScrollToPlugin is registered
gsap.registerPlugin(ScrollToPlugin);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            gsap.to(window, {
                scrollTo: {
                    y: targetElement,
                    offsetY: 80
                },
                duration: 1,
                ease: "power2.inOut"
            });
        }
    });
});

        // Form submissions
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Your message has been sent successfully!');
                
                gsap.to(contactForm, {
                    opacity: 0.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        contactForm.reset();
                        gsap.to(contactForm, {
                            opacity: 1,
                            duration: 0.3
                        });
                    }
                });
            });
        }

        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Thank you for subscribing to our newsletter!');
                
                gsap.to(newsletterForm, {
                    opacity: 0.5,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        newsletterForm.reset();
                        gsap.to(newsletterForm, {
                            opacity: 1,
                            duration: 0.3
                        });
                    }
                });
            });
        }

        // Hover effects for product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Section animations with ScrollTrigger
        gsap.utils.toArray('section').forEach(section => {
            if (section.id !== 'home') {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 80%",
                    onEnter: () => {
                        gsap.from(section.querySelectorAll('.animate__animated'), {
                            y: 50,
                            opacity: 0,
                            duration: 0.8,
                            stagger: 0.2,
                            ease: "back.out(1.7)"
                        });
                    },
                    once: true
                });
            }
        });

        // Parallax effect for product images
        gsap.utils.toArray('.product-image img').forEach(img => {
            ScrollTrigger.create({
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    img.style.transform = `translateY(${-30 * self.progress}px)`;
                }
            });
        });
    }

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        document.body.appendChild(notification);
        
        gsap.to(notification, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    notification.remove();
                }
            });
        }, 3000);
    }
});