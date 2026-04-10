const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

const regex = /:root\{[\s\S]*?--gray-8:#CCCCCC;/;
const replacement = `:root{
  --black:#FFFFFF;
  --gold:#d99b00;
  --gold-glow:rgba(217,155,0,0.15);
  --gold-glow2:rgba(217,155,0,0.06);
  --white:#0A0A0A;
  --gray-1:#F6F6F6;
  --gray-2:#EEEEEE;
  --gray-3:#E0E0E0;
  --gray-4:#BDBDBD;
  --gray-5:#9E9E9E;
  --gray-6:#757575;
  --gray-7:#424242;
  --gray-8:#212121;`;

css = css.replace(regex, replacement);
css = css.replace(/rgba\(255,255,255,/g, 'rgba(0,0,0,');
css = css.replace(/rgba\(0,0,0,0\.85\)/g, 'rgba(255,255,255,0.85)');
css = css.replace(/0 80px 160px rgba\(0,0,0,0\.9\)/g, '0 80px 160px rgba(0,0,0,0.15)');

fs.writeFileSync('style.css', css);
console.log("Light theme applied successfully.");
