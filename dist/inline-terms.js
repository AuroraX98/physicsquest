import {esc} from './models.js?v=0.19.0';

// Match complete scientific words, including hyphenated names, before escaping the text.
export function lessonText(lesson, focus) {
  const names = new Map();
  for (const entry of [...(focus.terms ?? []), ...(lesson.glossary ?? [])]) {
    const name = entry.term.split(/\s*[,([]/u)[0].trim();
    if (name.length < 3 || !/[a-zA-Z]{3}/u.test(name) || !entry.definition?.trim()) continue;
    if (!names.has(name.toLowerCase())) names.set(name.toLowerCase(),entry);
  }
  if (!names.size) return esc;
  const alternatives = [...names.keys()].sort((a,b)=>b.length-a.length)
    .map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const pattern = new RegExp('(?<![\\p{L}\\p{N}-])(?:'+alternatives.join('|')+')(?![\\p{L}\\p{N}-])','giu');
  const shown = new Set();
  return value => {
    let result = '',offset = 0;
    for (const match of value.matchAll(pattern)) {
      const word = match[0].toLowerCase();
      if (shown.has(word)) continue;
      shown.add(word);
      const entry = names.get(word);
      result += esc(value.slice(offset,match.index));
      result += `<button type="button" class="term-link" aria-expanded="false" data-meaning="${esc(entry.definition)}">${esc(match[0])}</button>`;
      offset = match.index+match[0].length;
    }
    return result + esc(value.slice(offset));
  };
}
export function bindTermHelp(main) {
  let button, panel;
  const close = () => {
    if (button) button.setAttribute('aria-expanded','false');
    button?.removeAttribute('aria-controls');
    panel?.remove();
    button = panel = undefined;
  };
  main.addEventListener('click',event => {
    const next = event.target.closest('.term-link');
    const same = next === button;
    close();
    if (!next || same) return;
    button = next;
    panel = document.createElement('div');
    panel.className = 'term-definition';
    panel.id = 'current-term-definition';
    panel.setAttribute('role','status');
    next.closest('p,li').after(panel);
    const name = document.createElement('strong');
    name.textContent = next.textContent;
    panel.append(name,document.createTextNode(' '+next.dataset.meaning));
    next.setAttribute('aria-controls',panel.id);
    next.setAttribute('aria-expanded','true');
  });
  main.addEventListener('keydown',event => {if (event.key==='Escape' && panel?.isConnected) {button.focus();close();}});
}
