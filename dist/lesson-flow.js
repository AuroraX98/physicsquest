import {motionModels} from './motion-models.js?v=0.19.0';
import {hasInteractiveModel} from './models.js?v=0.19.0';

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

export function explorationPrompt(visual) {
  if (motionModels[visual?.type]) return 'This animation follows the worked example. Predict what will happen, then press Play. Pause or move the slider to look at any moment.';
  if (hasInteractiveModel(visual)) return 'Read the starting values below the picture. Predict what will happen if you change one control, then try it.';
  return 'This picture stays still. Use it to trace the worked example. What would you expect to change if you changed one number?';
}
