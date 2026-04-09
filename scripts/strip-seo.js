/**
 * Post-build script: strips SEO meta tags from build/register/index.html
 * and build/login/index.html so React Helmet can inject page-specific
 * tags without duplication. Keeps the React bundle, GA4, charset, viewport.
 */
const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'build', 'register', 'index.html'),
  path.join(__dirname, '..', 'build', 'login', 'index.html'),
];

function stripSeoTags(html) {
  // Remove meta description
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, '');
  // Remove meta keywords
  html = html.replace(/<meta\s+name="keywords"[^>]*>/gi, '');
  // Remove meta robots
  html = html.replace(/<meta\s+name="robots"[^>]*>/gi, '');
  // Remove meta author
  html = html.replace(/<meta\s+name="author"[^>]*>/gi, '');
  // Remove canonical
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  // Remove all og: tags
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '');
  // Remove all twitter: tags
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');
  // Replace title with generic fallback
  html = html.replace(/<title>[^<]*<\/title>/i, '<title>Friendlinq</title>');
  // Remove all JSON-LD script blocks
  html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  return html;
}

for (const file of files) {
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const stripped = stripSeoTags(html);
    fs.writeFileSync(file, stripped, 'utf8');
    console.log('Stripped SEO tags from', path.basename(path.dirname(file)) + '/index.html');
  }
}
