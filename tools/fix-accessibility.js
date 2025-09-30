const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function listHtml(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for(const e of entries){
    if(e.isDirectory()){
      if(e.name === 'node_modules' || e.name === '.git') continue;
      files = files.concat(listHtml(path.join(dir,e.name)));
    } else if(e.isFile() && e.name.endsWith('.html')){
      files.push(path.join(dir,e.name));
    }
  }
  return files;
}

function safeWrite(file, data){
  fs.writeFileSync(file, data, 'utf8');
}

function basenameNoExt(file){
  return path.basename(file).replace(/\.[^.]+$/, '');
}

function humanAltFromSrc(src){
  try{
    const name = path.basename(src).replace(/[-_]/g,' ').replace(/\.[^.]+$/,'');
    return name.charAt(0).toUpperCase() + name.slice(1);
  }catch(e){
    return 'Image';
  }
}

const files = listHtml(root);
console.log('Found', files.length, 'HTML files');

let totalChanges = 0;

files.forEach(file => {
  let s = fs.readFileSync(file, 'utf8');
  let original = s;

  // 1) Fix dropdown toggle ids and corresponding dropdown-menu aria-labelledby
  // Find occurrences of id="navbarDropdown" (or class dropdown-toggle) and make unique per-file per-occurrence
  const toggleRegex = /(<a[^>]+class=["'][^"']*dropdown-toggle[^"']*["'][^>]*>)/gi;
  let toggleIndex = 0;
  s = s.replace(toggleRegex, (match) => {
    toggleIndex++;
    // ensure id attribute present and unique
    let idMatch = match.match(/id=\"([^\"]+)\"/i);
    const newId = `navbarDropdown-${basenameNoExt(file)}-${toggleIndex}`;
    if(idMatch){
      // replace existing id value
      return match.replace(/id=\"([^\"]+)\"/i, `id="${newId}"`);
    } else {
      // insert id before closing '>' of opening tag
      return match.replace(/>$/, ` id="${newId}">`);
    }
  });

  // After ensuring toggles have unique ids, update the nearest .dropdown-menu after each toggle to use aria-labelledby
  // We'll iterate through toggles in the file to map them to subsequent dropdown-menu blocks
  const toggleIdRegex = /id=\"(navbarDropdown-[^\"]+)\"/g;
  let match;
  const toggleIds = [];
  while((match = toggleIdRegex.exec(s))){
    toggleIds.push({id: match[1], index: match.index});
  }

  // For each toggle id, find the next occurrence of <div class="dropdown-menu" after its index and set aria-labelledby
  toggleIds.forEach((t,i) => {
    // search substring after the toggle occurrence
    const sub = s.slice(t.index);
    const menuMatch = sub.match(/<div[^>]+class=["'][^"']*dropdown-menu[^"']*["'][^>]*>/i);
    if(menuMatch){
      // compute global index of the menu
      const menuIndex = t.index + sub.indexOf(menuMatch[0]);
      // examine the tag to see if aria-labelledby exists
      const tag = menuMatch[0];
      let newTag;
      if(/aria-labelledby=\"[^\"]+\"/i.test(tag)){
        newTag = tag.replace(/aria-labelledby=\"[^\"]+\"/i, `aria-labelledby="${t.id}"`);
      } else {
        newTag = tag.replace(/>$/, ` aria-labelledby="${t.id}">`);
      }
      // replace at position
      s = s.slice(0, menuIndex) + newTag + s.slice(menuIndex + tag.length);
    }
  });

  // 2) Social icon links: add aria-label and title when missing
  // Find anchors inside .sosmed-icon and .sosmed-icon.primary etc.
  s = s.replace(/(<div[^>]*class=["'][^"']*sosmed-icon[^"']*["'][^>]*>[\s\S]*?<\/div>)/gi, (container) => {
    return container.replace(/<a([^>]*)>(\s*<i[^>]*class=["'][^"']*fa-[^"']+["'][^>]*>\s*<\/i>\s*)<\/a>/gi, (aMatch, attrs, inner) => {
      let attrsStr = attrs;
      if(!/aria-label=/.test(attrsStr)){
        // detect service by inner icon class
        let svc = 'Social link';
        const fa = inner.match(/fa-([a-z0-9-]+)/i);
        if(fa){
          const token = fa[1];
          if(token.includes('facebook')) svc = 'Facebook';
          else if(token.includes('twitter') || token === 'x') svc = 'Twitter';
          else if(token.includes('linkedin')) svc = 'LinkedIn';
          else if(token.includes('instagram')) svc = 'Instagram';
          else if(token.includes('pinterest')) svc = 'Pinterest';
        }
        attrsStr = attrsStr + ` aria-label="${svc}" title="${svc}"`;
      }
      return `<a${attrsStr}>${inner}</a>`;
    });
  });

  // 3) Fill empty alt attributes with humanized filename
  s = s.replace(/<img([^>]*?)alt=\"\"([^>]*?)>/gi, (m, a1, a2) => {
    const srcMatch = (a1 + a2).match(/src=\"([^\"]+)\"/i);
    let alt = 'Image';
    if(srcMatch) alt = humanAltFromSrc(srcMatch[1]);
    return `<img${a1}alt="${alt}"${a2}>`;
  });

  // 4) Ensure progress-bar elements have aria-label (in markup)
  s = s.replace(/<div([^>]*class=["'][^"']*progress-bar[^"']*["'][^>]*)>/gi, (m, tagStart) => {
    if(/aria-label=/.test(tagStart) || /aria-labelledby=/.test(tagStart)) return `<div${tagStart}>`;
    const valMatch = tagStart.match(/aria-valuenow=\"([^\"]+)\"/i);
    let label = 'Progress';
    if(valMatch) label = `${valMatch[1]}%`;
    return `<div${tagStart} aria-label="${label}">`;
  });

  if(s !== original){
    safeWrite(file, s);
    totalChanges++;
    console.log('Patched:', file);
  }
});

console.log('Total files changed:', totalChanges);
