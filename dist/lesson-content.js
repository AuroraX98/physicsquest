import {detailEdits} from './detail-edits.js?v=0.19.0';

// Compare literal teaching text, never fuzzy-match scientific claims or numbers.
export const textKey = text => String(text ?? '').normalize('NFC').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
export const sameText = (a, b) => Boolean(textKey(a)) && textKey(a) === textKey(b);
const sentences = text => String(text ?? '').split(/(?<=[.!?])\s+(?=[A-Z“"‘])/u).filter(Boolean);

export function newParagraphs(paragraphs, alreadyShown) {
  const seen = new Set(alreadyShown.flatMap(text => [textKey(text), ...sentences(text).map(textKey)]));
  return paragraphs.flatMap(paragraph => {
    if (seen.has(textKey(paragraph))) return [];
    const remaining = sentences(paragraph).filter(sentence => {
      const key = textKey(sentence);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join(' ');
    return remaining ? [remaining] : [];
  });
}

export function additionalLessonContent(lesson, focus) {
  const shown = [focus.idea, focus.explanation, ...focus.example.steps];
  const edits = detailEdits.filter(edit => edit.key === lesson.courseId + '/' + lesson.id);
  const paragraphs = (lesson.body ?? []).flatMap(paragraph => {
    const edit = edits.find(edit => edit.original === paragraph);
    return edit ? (edit.replacement ? [edit.replacement] : []) : [paragraph];
  });
  const body = newParagraphs(paragraphs, shown);
  const equation = sameText(lesson.equation, focus.equation) ? '' : (lesson.equation ?? '');
  const limits = newParagraphs(lesson.limits ? [lesson.limits] : [], [...shown, ...body]).join(' ');
  return {body, equation, limits};
}
