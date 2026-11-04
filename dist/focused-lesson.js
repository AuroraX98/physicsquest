import {esc} from './models.js?v=0.17.2';
import {equationKeyHTML,lessonEquationKey} from './equation-help.js?v=0.17.2';
import {lessonDiagramHTML} from './lesson-diagram.js?v=0.17.2';
import {additionalLessonContent, sameText} from './lesson-content.js?v=0.17.2';

export function focusedEquationHTML(equation, symbols = [], courseId = '') {
  if (!equation?.trim()) return '';
  return `<section class="focused-equation" aria-label="Equation"><h2>Equation</h2><pre><code>${esc(equation)}</code></pre>${equationKeyHTML(symbols,equation,courseId)}</section>`;
}

export function focusedLessonHTML(lesson, focus) {
  if (!focus) return '';
  const diagram = lessonDiagramHTML(lesson.lessonDiagram);
  const explanation = `<div class="smallheading">ONE IDEA</div><p class="idea">${esc(focus.idea)}</p><p>${esc(focus.explanation)}</p>${focusedEquationHTML(focus.equation,lessonEquationKey(lesson,focus.equation),lesson.courseId)}<section class="focused-example" aria-label="One example"><h2>One example: ${esc(focus.example.title)}</h2><ol>${focus.example.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>`;
  const extra = additionalLessonContent(lesson, focus);
  const terms = (focus.terms ?? []).filter(term => !lessonEquationKey(lesson,focus.equation).some(symbol => sameText(term.definition,symbol.description)));
  const hasMore = extra.body.length || extra.equation.trim();
  const details = `${terms.length ? `<details class="focus-words"><summary>Words and symbols in this idea</summary><dl>${terms.map(t => `<div><dt>${esc(t.term)}</dt><dd>${esc(t.definition)}</dd></div>`).join('')}</dl></details>` : ''}${hasMore || extra.limits ? `<details class="full-explanation"><summary>${hasMore ? 'Go deeper into this idea' : 'When this applies'}</summary>${extra.body.map(p => `<p>${esc(p)}</p>`).join('')}${focusedEquationHTML(extra.equation,lessonEquationKey(lesson,extra.equation),lesson.courseId)}${extra.limits ? `<p class="model-note">${hasMore ? '<strong>When this applies</strong><br>' : ''}${esc(extra.limits)}</p>` : ''}</details>` : ''}`;
  if (!diagram) return explanation + details;
  return `<div class="focused-pair"><div class="focused-explanation">${explanation}</div><aside class="focused-visual" aria-label="Picture of the worked example"><div class="smallheading">THIS EXAMPLE, PICTURED</div><p class="pictured-example">${esc(focus.example.title)}</p>${diagram}</aside><div class="focused-details">${details}</div></div>`;
}
