import {transportLoop} from './transport-globe.js?v=0.19.0';
import {topicMotions} from './topic-motions.js?v=0.19.0';

// Every key identifies a single worked example with its own physical conditions.
export const motionModels = {
 'general-relativity/transport-loop': transportLoop,
 ...topicMotions
};

export function motionVisualFor(courseId,lesson) {
 const key=courseId+'/'+lesson.id, model=motionModels[key];
 return model ? {type:key,title:model.title,caption:model.caption} : lesson.visual;
}
