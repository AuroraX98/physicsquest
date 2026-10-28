export const TRACKS=['physics','quantum'];
export const trackForCourse=id=>/^quantum[123]$/.test(id)?'quantum':'physics';
export const normalizeTrack=value=>TRACKS.includes(value)?value:'physics';
export const coursesForTrack=(courses,track)=>courses.filter(course=>trackForCourse(course.id)===normalizeTrack(track));

// Course metadata is the single source of category labels, including future paths.
export const courseBadge=course=>typeof course?.title==='string'&&course.title.trim()?course.title.trim():'Learning path';
