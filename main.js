/* ============================================
   BERU — il103.github.io
   Custom Identity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNav();
    initScrollReveal();
    initCounters();
    initTerminal();
    initSmoothScroll();
    initTopButton();
    initActiveNav();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2800);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (!nav) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
    }
}

function closeMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) mobileNav.classList.remove('open');
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   COUNTERS
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);

        element.textContent = current + (target >= 10 ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   TERMINAL
   ============================================ */
function initTerminal() {
    const input = document.getElementById('termInput');
    const body = document.getElementById('termBody');

    if (!input || !body) return;

    const commands = {
        help: `<span class="term-out">Available commands:</span><br>
               <span class="term-out dim">whoami   — Show identity</span><br>
               <span class="term-out dim">skills   — List technical skills</span><br>
               <span class="term-out dim">projects — View project list</span><br>
               <span class="term-out dim">contact  — Get contact info</span><br>
               <span class="term-out dim">clear    — Clear terminal</span><br>
               <span class="term-out dim">social   — Social links</span>`,

        whoami: `<span class="term-out">beru — Android developer & kernel builder</span><br>
                 <span class="term-out dim">Building digital realities since 2021.</span>`,

        skills: `<span class="term-out accent">[+] Python (Django, Flask, Scripting)</span><br>
                 <span class="term-out accent">[+] Java (Android SDK, Spring)</span><br>
                 <span class="term-out accent">[+] JavaScript (React, Node.js)</span><br>
                 <span class="term-out accent">[+] Linux (Bash, Docker, Systems)</span><br>
                 <span class="term-out accent">[+] Android (AOSP, Kernel, Recovery)</span><br>
                 <span class="term-out accent">[+] UI/Motion (CSS3, GSAP, Three.js)</span>`,

        projects: `<span class="term-out accent">Project_Onyx/      — Galaxy Tab A7 Kernel CI</span><br>
                    <span class="term-out accent">Recovery_Builder/  — TWRP/OrangeFox Tools</span><br>
                    <span class="term-out accent">Premium_Web/       — Web Identity Systems</span>`,

        contact: `<span class="term-out warn">GitHub:   https://github.com/Il103</span><br>
                  <span class="term-out warn">Telegram: https://t.me/llmify</span><br>
                  <span class="term-out warn">Email:    looooly590@gmail.com</span>`,

        social: `<span class="term-out accent">GitHub:   @Il103</span><br>
                 <span class="term-out accent">Telegram: @llmify</span>`,

        clear: 'CLEAR'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const cmd = input.value.trim().toLowerCase();
        const val = input.value;

        // Add input line
        const inputLine = document.createElement('div');
        inputLine.className = 'term-line';
        inputLine.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${val}</span>`;
        inputLine.style.animation = 'none';
        inputLine.style.opacity = '1';
        body.insertBefore(inputLine, body.lastElementChild);

        // Process command
        if (commands[cmd]) {
            if (commands[cmd] === 'CLEAR') {
                const lines = body.querySelectorAll('.term-line');
                lines.forEach((line, i) => {
                    if (i < lines.length - 1) line.remove();
                });
            } else {
                const out = document.createElement('div');
                out.className = 'term-line';
                out.innerHTML = commands[cmd];
                out.style.animation = 'fadeInUp 0.3s ease forwards';
                body.insertBefore(out, body.lastElementChild);
            }
        } else if (cmd) {
            const err = document.createElement('div');
            err.className = 'term-line';
            err.innerHTML = `<span class="term-out">Command not found: ${cmd}. Type "help" for available commands.</span>`;
            err.style.animation = 'fadeInUp 0.3s ease forwards';
            body.insertBefore(err, body.lastElementChild);
        }

        input.value = '';
        body.scrollTop = body.scrollHeight;
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   TOP BUTTON
   ============================================ */
function initTopButton() {
    const btn = document.getElementById('topBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    });
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}
