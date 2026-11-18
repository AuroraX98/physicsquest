// Older curriculum files are also archival fixtures. Their short-lesson records
// carry reviewed wording corrections for the matching lesson's displayed copy.
export function applyLessonCopy(lesson, focus) {
  for (const [path, text] of Object.entries(focus?.lessonCopy ?? {})) {
    const parts = path.split('.');
    const field = parts.pop();
    let owner = lesson;
    for (const part of parts) {
      if (!owner || !Object.hasOwn(owner, part)) {
        owner = null;
        break;
      }
      owner = owner[part];
    }
    if (owner && Object.hasOwn(owner, field) && typeof owner[field] === 'string' && typeof text === 'string') {
      owner[field] = text;
    }
  }
}
