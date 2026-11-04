import {hasInteractiveModel} from './models.js?v=0.17.2';

// Keep persisted phase IDs stable: 0 Understand, 1 Explore, 2 Check, 3 Apply.
// These two static diagrams add a representation not shown in Understand.
const distinctDiagrams = new Set(['hr-diagram-summary', 'band-occupancy-diagram']);
export const hasDistinctExploration = lesson => hasInteractiveModel(lesson.visual) || distinctDiagrams.has(lesson.visual?.type);
export const lessonPhases = lesson => hasDistinctExploration(lesson) ? [0, 1, 2, 3] : [0, 2, 3];
export const resolveLessonPhase = (lesson, phase) => lessonPhases(lesson).includes(phase) ? phase : 0;
export function neighboringPhase(lesson, phase, direction) {
  const phases = lessonPhases(lesson);
  return phases[phases.indexOf(resolveLessonPhase(lesson, phase)) + direction];
}
