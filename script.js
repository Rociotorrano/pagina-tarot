document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Animation for hamburger lines
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // reset hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => s.style.transform = 'none');
            spans[1].style.opacity = '1';
        });
    });

    // Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to sections and cards
    const revealElements = document.querySelectorAll('.service-card, .section-header, .program-card, .hero-content, .hero-visual');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // Add CSS for revealed state dynamically or via style.css
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Subtle parallax for Hero Image
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image-wrapper');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Magical Sparkle Trail
    let lastSparkle = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < 50) return; // Limit frequency
        lastSparkle = now;

        const dot = document.createElement('div');
        dot.className = 'sparkle-dot';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        
        // Random slight offset
        const moveX = (Math.random() - 0.5) * 20;
        const moveY = (Math.random() - 0.5) * 20;
        
        document.body.appendChild(dot);

        dot.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${moveX}px, ${moveY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => dot.remove();
    });

    // --- Service Modal Logic ---
    const modal = document.getElementById('service-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalCta = document.getElementById('modal-cta');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    // Function to open modal
    const openModal = (card) => {
        const data = card.dataset;
        modalImg.src = data.img;
        modalTitle.textContent = data.title;
        modalType.textContent = data.type;
        modalDesc.innerHTML = `<p>${data.short}</p><p style="margin-top: 1rem;">${data.long}</p>`;
        modalPrice.textContent = data.price;
        modalCta.href = "#";

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    // Card Event Listeners
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => openModal(card));
        card.style.cursor = 'pointer';
    });

    // --- Contact Form Modal Logic ---
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.querySelector('.contact-close');
    const whatsappForm = document.getElementById('whatsapp-form');
    const serviceInput = document.getElementById('form-service-name');
    const displayService = document.getElementById('display-service');

    const openContactModal = (serviceName) => {
        serviceInput.value = serviceName;
        displayService.value = serviceName;
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeContactModal = () => {
        contactModal.classList.remove('active');
        if (!modal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    // Update the CTA in the first modal to open the contact form
    modalCta.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = modalTitle.textContent;
        openContactModal(serviceName);
    });

    // Handle form submission
    whatsappForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const service = serviceInput.value;
        
        const message = `Hola Cecilia! Mi nombre es ${firstName} ${lastName} y me gustaría solicitar el servicio: ${service}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5491155990903?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        closeContactModal();
        closeModal(); // Also close the main modal
        whatsappForm.reset();
    });

    // External buttons (like Sana tu Ser)
    document.querySelectorAll('.btn-main').forEach(btn => {
        if (!btn.closest('.modal')) {
            btn.addEventListener('click', (e) => {
                if (btn.getAttribute('href') && btn.getAttribute('href').includes('wa.me')) {
                    e.preventDefault();
                    let serviceName = "Consulta General";
                    const programTitle = btn.closest('.program-info')?.querySelector('h2')?.textContent;
                    if (programTitle) serviceName = programTitle.trim();
                    
                    openContactModal(serviceName);
                }
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    contactClose.addEventListener('click', closeContactModal);
    contactModal.querySelector('.modal-backdrop').addEventListener('click', closeContactModal);

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeContactModal();
        }
    });
});