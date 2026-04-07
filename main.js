"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // Navigation scroll effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }
    });
    // Intersection Observer for scroll reveals
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    const revealElements = document.querySelectorAll('.rv');
    revealElements.forEach(el => observer.observe(el));
    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });
    // Page fade-in effect
    if (document.body) {
        document.body.style.opacity = '1';
    }
});
