document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. Theme Initialization & View Transitions
    // =========================================
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('portfolio-theme');

    if (!currentTheme) {
        currentTheme = 'dark';
        localStorage.setItem('portfolio-theme', 'dark');
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    function toggleTheme() {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
            themeBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
            themeBtn.textContent = '☀️';
        }
    }

    themeBtn.addEventListener('click', (event) => {
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 600,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });
    });

    // =========================================
    // 2. Custom Cursor Logic 
    // =========================================
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursor.style.opacity === '0') cursor.style.opacity = '1'; 
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor); 
        }
        animateCursor();

        document.addEventListener('mouseout', () => cursor.style.opacity = '0');
    }

    // =========================================
    // 3. Scroll Animations (Intersection Observer)
    // =========================================
    const scrollElements = document.querySelectorAll('.scroll-anim');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => observer.observe(el));

    // =========================================
    // 4. Form Simulation Logic
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const btnText = document.querySelector('.btn-text');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop actual page reload

            // 1. Loading State
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
            btnText.textContent = 'Sending...';

            // 2. Simulate Network Request (1.5 seconds)
            setTimeout(() => {
                // Hide the form
                contactForm.classList.add('hidden');

                // Reveal the success animation container
                successMessage.classList.add('active');
            }, 1500);
        });
    }

// =========================================
    // MOBILE HAMBURGER MENU LOGIC
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling on the body when the mobile menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close the menu automatically when a link is clicked
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });


        // =========================================
    // REAL WORKING EMAIL LOGIC (BACKGROUND SYNC)
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-message');
    const sendAnotherBtn = document.getElementById('send-another-btn');
    const submitBtnText = document.querySelector('.btn-text');

    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stops the page from redirecting

            // Change button text so the user knows it's working
            if (submitBtnText) submitBtnText.textContent = 'Sending...';

            // Gather the data typed into the form
            const formData = new FormData(contactForm);

            // Send the email in the background!
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success! Hide the form and show the checkmark
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            })
            .catch(error => {
                alert('Oops! There was a problem submitting your form.');
            })
            .finally(() => {
                // Reset the button text back to normal
                if (submitBtnText) submitBtnText.textContent = 'Send Message';
            });
        });
    }

    // =========================================
    // "SEND ANOTHER MESSAGE" BUTTON LOGIC
    // =========================================
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            contactForm.reset(); // Clears out the text they typed
            successMsg.style.display = 'none'; // Hides the checkmark
            contactForm.style.display = 'flex'; // Brings the blank form back
        });
    }
    }

});