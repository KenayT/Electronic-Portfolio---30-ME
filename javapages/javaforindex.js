document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('portfolio-theme');

    if (!currentTheme) {
        currentTheme = 'dark';
        localStorage.setItem('portfolio-theme', 'dark');
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeBtn) {
        if (currentTheme === 'dark') {
            themeBtn.textContent = '☀️';
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            themeBtn.textContent = '🌙';
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        }

        // TOGGLETHEME
        function toggleTheme() {
            let theme = document.documentElement.getAttribute('data-theme');
            const profileImg = document.getElementById('profile-img'); // Grab the image

            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('portfolio-theme', 'light');
                if (themeBtn) {
                    themeBtn.textContent = '🌙';
                    themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
                }
                // Switch to the Light Mode Image
                if (profileImg) profileImg.src = 'img/mee.jpg'; 
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('portfolio-theme', 'dark');
                if (themeBtn) {
                    themeBtn.textContent = '☀️';
                    themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
                }
                // Switch back to the Dark Mode Image
                if (profileImg) profileImg.src = 'img/mode.jpg'; 
            }
        }

        // Advanced Theme Toggle with Droplet Effect (View Transitions)
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
    }

    // --- Video Hover Logic ---
    const aboutQuadrant = document.getElementById('about-quadrant');
    const aboutVideo = document.getElementById('about-video');
    const profileImg = document.querySelector('.profile-img');

    if (aboutQuadrant && aboutVideo) {
        aboutQuadrant.addEventListener('mouseenter', () => {
            aboutVideo.currentTime = 0; 
            aboutVideo.play();
        });
        aboutQuadrant.addEventListener('mouseleave', () => {
            aboutVideo.pause();
        });
    }

    if (profileImg && aboutVideo) {
        profileImg.addEventListener('mouseenter', () => {
            aboutVideo.currentTime = 0; 
            aboutVideo.play();
        });
        profileImg.addEventListener('mouseleave', () => {
            aboutVideo.pause();
        });
    }

    // --- SCROLL REVEAL ANIMATIONS FOR INTRO SECTION ---
    const introImg = document.getElementById('intro-img');
    const introContent = document.querySelector('.intro-content');

    const observerOptions = {
        threshold: 0.2
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    if (introImg) scrollObserver.observe(introImg);
    if (introContent) scrollObserver.observe(introContent);

    // --- BUTTERY SMOOTH TRAILING CURSOR LOGIC ---
    const cursor = document.getElementById('custom-cursor');
    
    // Set starting positions
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Track real mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor && cursor.style.opacity === '0') {
            cursor.style.opacity = '1'; // Show cursor once mouse moves
        }
    });

    // Animate the custom cursor using hardware acceleration
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        if (cursor) {
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
        
        requestAnimationFrame(animateCursor); 
    }
    
    // Start animation loop
    animateCursor();

    // Hide custom cursor when leaving the window
    document.addEventListener('mouseout', () => {
        if (cursor) cursor.style.opacity = '0';
    });

    // =========================================
    // Water Droplet Page Transition Logic
    // =========================================
    const navLinks = document.querySelectorAll('.nav-links a:not(.active), .btn-primary, .quadrant');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            
            if (targetUrl && targetUrl.includes('.html') && !targetUrl.includes('#')) {
                e.preventDefault(); 
                
                const droplet = document.createElement('div');
                droplet.classList.add('page-transition-droplet');
                document.body.appendChild(droplet);
                
                // Start exactly at the mouse click
                droplet.style.left = `${e.clientX}px`;
                droplet.style.top = `${e.clientY}px`;
                
                // Expand the wave
                setTimeout(() => {
                    droplet.style.transform = 'translate(-50%, -50%) scale(150)';
                }, 10);
                
                // Navigate after wave covers the screen
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 600); 
            }
        });
    });

    // =========================================
    // MOBILE HAMBURGER MENU LOGIC
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Stops the background website from scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close the menu automatically if the user clicks a link
        const mobileLinks = navMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

   // =========================================
    // 5. DISAPPEARING TAGLINE LOGIC
    // =========================================
    const tagline = document.getElementById('profile-tagline');
    const quadrants = document.querySelectorAll('.quadrant');
    const centerImage = document.getElementById('profile-img'); // Grabbing your photo

    if (tagline) {
        // 1. Hide/Show when hovering the 4 quadrants
        if (quadrants.length > 0) {
            quadrants.forEach(quad => {
                quad.addEventListener('mouseenter', () => tagline.classList.add('fade-out'));
                quad.addEventListener('mouseleave', () => tagline.classList.remove('fade-out'));
            });
        }

        // 2. Hide/Show when hovering the center image itself
        if (centerImage) {
            centerImage.addEventListener('mouseenter', () => tagline.classList.add('fade-out'));
            centerImage.addEventListener('mouseleave', () => tagline.classList.remove('fade-out'));
        }
    }

});