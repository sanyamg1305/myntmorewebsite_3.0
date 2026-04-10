const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { 
        (e.target as HTMLElement).classList.add('show'); 
        observer.unobserve(e.target); 
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll<HTMLElement>('.rv').forEach(el => observer.observe(el));

const sections = document.querySelectorAll<HTMLElement>('section[id]');
const navAs = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { 
      if (window.scrollY >= s.offsetTop - 100) cur = s.id; 
  });
  navAs.forEach(a => { 
      a.style.color = a.getAttribute('href') === '#'+cur ? 'var(--white)' : ''; 
  });
});