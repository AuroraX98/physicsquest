// One hint per misconception. Full worked feedback is separate so it can stay
// behind the learner's request for an explanation.
export function hintForChoice(lesson, optionIndex) {
  const check = lesson?.check;
  if (!Array.isArray(check?.options) || !Number.isInteger(optionIndex) || optionIndex === check.answer ||
      optionIndex < 0 || optionIndex >= check.options.length) return '';
  const hint = lesson.checkHints?.[optionIndex];
  return typeof hint === 'string' ? hint : '';
}
