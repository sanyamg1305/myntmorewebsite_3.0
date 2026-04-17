"use strict";
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (nav)
        nav.classList.toggle('scrolled', window.scrollY > 20);
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add('show');
            if (e.target.classList.contains('stat-animate')) {
                animateCounter(e.target);
            }
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.07 });
document.querySelectorAll('.rv').forEach(el => observer.observe(el));
function animateCounter(el) {
    const target = el.getAttribute('data-target') || el.innerText;
    // Regex to capture [prefix][number][suffix]
    const match = target.match(/^([^0-9.]*)([\d.]+)(.*)$/);
    if (!match)
        return;
    const prefix = match[1];
    const endValue = parseFloat(match[2]);
    const suffix = match[3];
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = match[2].includes('.');
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = easedProgress * endValue;
        const formattedNum = isDecimal ? currentCount.toFixed(1) : Math.floor(currentCount).toString();
        el.innerText = prefix + formattedNum + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
        else {
            el.innerText = target;
        }
    }
    requestAnimationFrame(update);
}
document.querySelectorAll('.trust-num, .ps-num, .nc-val, .as-val, .cs-val, .pc-badge, .lead-score').forEach(el => {
    // Only animate if it contains at least one digit
    if (/\d/.test(el.innerText)) {
        el.setAttribute('data-target', el.innerText);
        const match = el.innerText.match(/^([^0-9.]*)([\d.]+)(.*)$/);
        if (match) {
            el.innerText = match[1] + '0' + match[3]; // Keep prefix and suffix during init
            el.classList.add('stat-animate');
            observer.observe(el);
        }
    }
});
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100)
            cur = s.id;
    });
    navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--white)' : '';
    });
});

// Modal Logic
const modal = document.getElementById('blogModal');
const modalBody = document.querySelector('.modal-body');
const closeModalBtn = document.querySelector('.modal-close');
function openModal(card) {
    var _a, _b;
    if (!modal || !modalBody)
        return;
    const title = ((_a = card.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.innerText) || '';
    const type = ((_b = card.querySelector('.res-type')) === null || _b === void 0 ? void 0 : _b.outerHTML) || '';
    const content = card.getAttribute('data-content') || '';
    modalBody.innerHTML = `
        ${type}
        <h2>${title}</h2>
        <div class="blog-content">${content}</div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    if (!modal)
        return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            closeModal();
    });
}

