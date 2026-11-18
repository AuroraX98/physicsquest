import {lessonText} from './inline-terms.js?v=0.19.0';
import {formulaReadings} from './formula-readings.js?v=0.19.0';
import {esc} from './models.js?v=0.19.0';
import {equationKeyHTML,lessonEquationKey} from './equation-help.js?v=0.19.0';
import {lessonDiagramHTML} from './lesson-diagram.js?v=0.19.0';
import {additionalLessonContent, sameText} from './lesson-content.js?v=0.19.0';

export function focusedEquationHTML(equation, symbols = [], courseId = '', reading = '', example = '') {
  if (!equation?.trim()) return example;
  const meaning = reading ? `<p class="formula-reading"><strong>In words</strong> ${esc(reading)}</p>` : '';
  return `<section class="focused-equation" aria-label="Equation"><h2>Equation</h2><pre><code>${esc(equation)}</code></pre>${meaning}${example}${equationKeyHTML(symbols,equation,courseId)}</section>`;
}

export function formulaReading(lesson, focus, equation) {
  if (!equation?.trim()) return '';
  if (sameText(equation, focus?.equation)) {
    const reading = formulaReadings[lesson.courseId + '/' + lesson.id];
    if (reading) return reading;
    // The focused formula may describe a different example than the longer formula.
    // Only use the guide when it was written for this expression.
    if (!sameText(equation, lesson.equation)) return focus.explanation;
  }
  return lesson.equationGuide?.meaning || '';
}

export function focusedLessonHTML(lesson, focus) {
  if (!focus) return '';
  const diagram = lessonDiagramHTML(lesson.lessonDiagram);
  const words=lessonText(lesson,focus);
  const intro=`<p class="idea">${words(focus.idea)}</p><p>${words(focus.explanation)}</p>`;
  const example = `<section class="focused-example" aria-label="One example"><h2>One example: ${esc(focus.example.title)}</h2><ol>${focus.example.steps.map(s => `<li>${words(s)}</li>`).join('')}</ol></section>`;
  const reading = formulaReading(lesson, focus, focus.equation);
  const repeatsIntro = sameText(reading,focus.explanation) || sameText(reading,focus.idea);
  const explanation = `${intro}${focusedEquationHTML(focus.equation,lessonEquationKey(lesson,focus.equation),lesson.courseId,repeatsIntro?'':reading,example)}`;
  const extra = additionalLessonContent(lesson, focus);
  const terms = [...(focus.terms ?? []), ...(lesson.glossary ?? []).filter(entry =>
    !(focus.terms ?? []).some(t => t.term.toLowerCase() === entry.term.toLowerCase()))].filter(term => !lessonEquationKey(lesson,focus.equation).some(symbol => sameText(term.definition,symbol.description)));
  const hasMore = extra.body.length || extra.equation.trim();
  const details = `${terms.length ? `<details class="focus-words"><summary>Words and symbols in this lesson</summary><dl>${terms.map(t => `<div><dt>${esc(t.term)}</dt><dd>${esc(t.definition)}${t.example ? `<span class="glossary-example">${esc(t.example)}</span>` : ''}</dd></div>`).join('')}</dl></details>` : ''}${hasMore || extra.limits ? `<details class="full-explanation"><summary>${hasMore ? 'Go deeper into this idea' : 'When this applies'}</summary>${extra.body.map(p => `<p>${esc(p)}</p>`).join('')}${focusedEquationHTML(extra.equation,lessonEquationKey(lesson,extra.equation),lesson.courseId,extra.body.some(p=>sameText(p,lesson.equationGuide?.meaning))?'':formulaReading(lesson,focus,extra.equation))}${extra.limits ? `<p class="model-note">${hasMore ? '<strong>When this applies</strong><br>' : ''}${esc(extra.limits)}</p>` : ''}</details>` : ''}`;
  if (!diagram) return explanation + details;
  return `<div class="focused-pair"><div class="focused-explanation">${explanation}</div><aside class="focused-visual" aria-label="Picture of the worked example"><div class="smallheading">THIS EXAMPLE, PICTURED</div><p class="pictured-example">${esc(focus.example.title)}</p>${diagram}</aside><div class="focused-details">${details}</div></div>`;
}
