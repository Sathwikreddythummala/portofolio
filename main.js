// ====================================
// 1. THREE.JS HERO BACKGROUND ANIMATION
// ====================================
function initThreeJSHero() {
    const container = document.getElementById('hero-background');
    if (!container || typeof THREE === 'undefined') return;

    let scene, camera, renderer, particles;
    const particleCount = 250; 
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x1E1E2C, 1); 
    container.appendChild(renderer.domElement);
    renderer.domElement.style.willChange = 'transform, opacity'; 

    // --- Particle Setup (Data Points) ---
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 400;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00C4CC, // Updated Accent Color
        size: 0.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.00005;
        particles.rotation.y += 0.0001;
        scene.rotation.y += 0.0002; 
        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize (CRITICAL for fixed background to cover new dimensions)
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

if (typeof THREE !== 'undefined') {
    initThreeJSHero();
}

// ====================================
// 2. THEME TOGGLE & SYSTEM PREFERENCE
// (FUNCTION REMOVED - PERMANENT DARK MODE)
// ====================================

// ====================================
// 3. SKILL BARS & ON-SCROLL ANIMATION
// ====================================
function initSkillAnimation() {
    const skillItems = document.querySelectorAll('.skill-item[data-level]');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const level = entry.target.getAttribute('data-level');
                const skillBar = entry.target.querySelector('.skill-bar');
                
                skillBar.style.width = `${level}%`;
                entry.target.classList.add('animated');
                skillBar.setAttribute('aria-valuenow', level);
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}


// ====================================
// 4. CUSTOM CURSOR & MICRO-INTERACTIONS
// ====================================
function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    // Ensure all interactive elements are covered
    const interactiveElements = document.querySelectorAll('.interactive-element, a, button, input, textarea, .project-card');

    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        // Use translate3d for hardware acceleration
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
    
    // The main cursor fix is in CSS, but this is kept as a failsafe
    document.body.style.cursor = 'none';
}


// ====================================
// 5. CONFETTI & ACCESSIBLE FORM VALIDATION
// ====================================
function initForm() {
    const form = document.querySelector('.contact-form');
    const feedback = document.getElementById('form-feedback');
    const formInputs = form.querySelectorAll('input, textarea');
    
    // Confetti color updated to match the new accent
    const confettiSettings = { target: 'confetti-canvas', max: 80, size: 1.5, props: ['circle', 'triangle', 'line'], colors: [[0, 196, 204], [255, 255, 255]], clock: 25, start_from_cover: false };
    const confetti = new ConfettiGenerator(confettiSettings);

    function triggerConfetti() {
        const confettiCanvas = document.getElementById('confetti-canvas');
        confettiCanvas.style.display = 'block';
        confetti.render();
        setTimeout(() => {
            confetti.clear();
            confettiCanvas.style.display = 'none';
        }, 3000); 
    }

    function getErrorMessage(input) {
        if (input.validity.valueMissing) return 'This field is required.';
        if (input.validity.typeMismatch && input.type === 'email') return 'Please enter a valid email address.';
        return '';
    }

    // Real-time accessible validation feedback
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id.replace('-input', '')}-error`);
            
            if (!input.validity.valid) {
                input.classList.add('invalid');
                errorElement.textContent = getErrorMessage(input);
                errorElement.setAttribute('aria-hidden', 'false');
            } else {
                input.classList.remove('invalid');
                errorElement.textContent = '';
                errorElement.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // Submission Handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formIsValid = true;
        formInputs.forEach(input => {
            if (!input.validity.valid) {
                formIsValid = false;
                const errorElement = document.getElementById(`${input.id.replace('-input', '')}-error`);
                input.classList.add('invalid');
                errorElement.textContent = getErrorMessage(input);
                errorElement.setAttribute('aria-hidden', 'false');
            }
        });

        if (formIsValid) {
            // SIMULATED successful submission
            feedback.textContent = 'Thank you! Your message has been sent successfully.';
            feedback.style.background = 'green';
            feedback.style.display = 'block';
            form.reset();
            triggerConfetti();
        } else {
            feedback.textContent = 'Please correct the errors in the form before submitting.';
            feedback.style.background = 'red';
            feedback.style.display = 'block';
        }
    });
}


// ====================================
// 6. MAIN INIT FUNCTION & UTILITIES
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    // Init all advanced features
    initSkillAnimation();
    initCursor();
    initForm();

    // Hero Text Animation
    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.classList.add('animated');
    });

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        const isExpanded = nav.classList.toggle('nav-open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Smooth Scrolling and Nav Closing
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                nav.classList.remove('nav-open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // On-Scroll Reveal Animation (Respecting reduced motion)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
        const revealItems = document.querySelectorAll('.reveal-item');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});