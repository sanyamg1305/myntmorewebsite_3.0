const fs = require('fs');

// 1. REVERT CSS TO DARK THEME
let css = fs.readFileSync('style.css', 'utf8');

const regex = /:root\{[\s\S]*?--gray-8:#212121;/;
const darkRoot = `:root{
  --black:#000000;
  --gold:#FFC947;
  --gold-glow:rgba(255,201,71,0.15);
  --gold-glow2:rgba(255,201,71,0.06);
  --white:#FFFFFF;
  --gray-1:#0C0C0C;
  --gray-2:#141414;
  --gray-3:#1C1C1C;
  --gray-4:#2C2C2C;
  --gray-5:#3A3A3A;
  --gray-6:#666666;
  --gray-7:#999999;
  --gray-8:#CCCCCC;`;

css = css.replace(regex, darkRoot);
// Inverse back transparent colors
css = css.replace(/rgba\(0,0,0,/g, 'rgba(255,255,255,');
// Fix specific shadows/backgrounds that were inverted back
css = css.replace(/rgba\(255,255,255,0\.85\)/g, 'rgba(0,0,0,0.85)'); // nav glassmorphism
css = css.replace(/0 80px 160px rgba\(255,255,255,0\.15\)/g, '0 80px 160px rgba(0,0,0,0.9)'); // hero drop shadow
css = css.replace(/border-color:rgba\(255,255,255,0\.3\)/g, 'border-color:rgba(255,201,71,0.3)'); // restore specific gold border if altered
fs.writeFileSync('style.css', css);
console.log("CSS reverted to dark mode.");

// 2. READ INDEX AND EXTRACT COMMON ELEMENTS
let indexStr = fs.readFileSync('index.html', 'utf8');

// Extract everything from start to end of the opening <body>
const startMatch = indexStr.match(/<!DOCTYPE html>[\s\S]*?<body>/)[0];

// Extract Nav - We will manually recreate the nav so we can modify the links.
const navHTML = `
<!-- NAV -->
<nav id="nav">
  <div class="w">
    <div class="nav-inner">
      <a href="index.html" class="logo" style="display:flex;align-items:center;"><img src="logo.png" alt="Myntmore" style="height:44px;"></a>
      <ul class="nav-links">
        <li><a href="services.html">Services</a></li>
        <li><a href="tools.html">Tools</a></li>
        <li><a href="case-studies.html">Case Studies</a></li>
        <li><a href="resources.html">Resources</a></li>
        <li><a href="about.html">About</a></li>
      </ul>
      <div class="nav-end">
        <a href="contact.html" class="btn btn-gold btn-sm">Book a call →</a>
      </div>
    </div>
  </div>
</nav>
`;

// Extract Footer 
// The footer needs to be updated with multi-page links
const footerHTML = `
<!-- FOOTER -->
<footer>
  <div class="w">
    <div class="footer-top">
      <div>
        <a href="index.html" class="footer-logo-mark">Mynt<span>more</span></a>
        <div class="footer-desc">B2B growth systems for founders who want predictable pipeline — not more promises.</div>
        <div class="footer-contact">Mumbai, India · <a href="mailto:hello@myntmore.com">hello@myntmore.com</a></div>
      </div>
      <div>
        <div class="f-head">Services</div>
        <ul class="f-links">
          <li><a href="services.html">Sales Intelligence</a></li>
          <li><a href="services.html">AI Lead Generation</a></li>
          <li><a href="services.html">LinkedIn Outreach</a></li>
          <li><a href="services.html">Personal Branding</a></li>
          <li><a href="services.html">Cold Email</a></li>
        </ul>
      </div>
      <div>
        <div class="f-head">Company</div>
        <ul class="f-links">
          <li><a href="about.html">About</a></li>
          <li><a href="case-studies.html">Case Studies</a></li>
          <li><a href="resources.html">Resources</a></li>
          <li><a href="tools.html">Free Tools</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="f-head">Tools</div>
        <ul class="f-links">
          <li><a href="tools.html">Profile Optimizer</a></li>
          <li><a href="tools.html">DM Angle Generator</a></li>
          <li><a href="tools.html">Posting Rhythm Builder</a></li>
          <li><a href="resources.html">Newsletter</a></li>
          <li><a href="resources.html">Pipeline Playbook</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="f-copy">© 2026 Myntmore. Built in Mumbai.</span>
      <div class="f-social">
        <a href="#">LinkedIn</a>
        <a href="#">Twitter / X</a>
        <a href="#">Instagram</a>
      </div>
    </div>
  </div>
</footer>
`;

const endMatch = `\n<script src="main.js"></script>\n</body>\n</html>`;

// Helper to write pages
function writePage(filename, contentBody) {
    fs.writeFileSync(filename, startMatch + '\n' + navHTML + '\n' + contentBody + '\n' + footerHTML + endMatch);
    console.log("Generated: " + filename);
}

// Extract Sections from index.html specifically
function getSection(id) {
    const startStr = '<section id="' + id + '"';
    const startIndex = indexStr.indexOf(startStr);
    if (startIndex === -1) return '';
    const endIndex = indexStr.indexOf('</section>', startIndex);
    if (endIndex === -1) return '';
    return indexStr.substring(startIndex, endIndex + 10);
}

const hero = getSection('hero');
const logos = getSection('logos');
const problem = getSection('problem');
const process = getSection('process');
const numbers = getSection('numbers');
const cta = getSection('cta');

// Modify the CTA section's links specifically!
// Inside CTA: <a href="#cta"... -> <a href="contact.html"...
let modCTA = cta.replace(/href="[^"]*"/g, (fullMatch) => {
    if (fullMatch.includes('mailto')) return fullMatch;
    return 'href="contact.html"';
});

// 1. Generate index.html (Home)
// Keep Hero, logos, problem, process, numbers, and modCTA.
// Also add simple previews for Services, Proof, Testimonials (we'll fetch them from original index to act as previews).
const servicesP = getSection('services').replace(/href="#[^"]*"/g, 'href="services.html"').replace('What we build', 'Our Systems').substring(0, 1500) + '...</div></section>'; // Hacky but easier: just use the first bit of the grid, or just include the full section for now but link "Explore All Services". Let's put in custom blocks for previews.

let newHomeBody = hero.replace(/href="#cta"/g, 'href="contact.html"').replace(/href="#proof"/g, 'href="case-studies.html"') + '\n' +
    logos + '\n' +
    problem.replace(/href="#services"/g, 'href="services.html"') + '\n' +
    process + '\n' +
    numbers + '\n' +
    modCTA;

writePage('index.html', newHomeBody);

// We will write custom structures for other pages in the next step to perfectly match the brief.
// For now, let's just lay down empty or base structural components for the others.

writePage('services.html', '<section id="services-page"><div class="w" style="margin-top:100px;"><h1>Services</h1></div></section>');
writePage('tools.html', '<section id="tools-page"><div class="w" style="margin-top:100px;"><h1>Free Tools</h1></div></section>');
writePage('case-studies.html', '<section id="cases-page"><div class="w" style="margin-top:100px;"><h1>Case Studies</h1></div></section>');
writePage('resources.html', '<section id="resources-page"><div class="w" style="margin-top:100px;"><h1>Resources</h1></div></section>');
writePage('about.html', '<section id="about-page"><div class="w" style="margin-top:100px;"><h1>About Us</h1></div></section>');
writePage('contact.html', '<section id="contact-page"><div class="w" style="margin-top:100px;"><h1>Contact</h1></div></section>');

console.log("Initial multipage scaffolding complete!");
