// A numeric entry can point to a check worth trying. It cannot tell us what the learner actually did.
export function numericHint(part, value, prompt='') {
  const expected=part.answer;
  const label=part.label||'';
  const context=[label,prompt].join(' ');
  const working=part.feedback||'';
  if (/\bprobability\b/i.test(label) && !/density|current|ratio|percent|per cent|%/i.test(label+' '+part.unit) &&
      expected>=0 && expected<=1 && (value<0 || value>1)) {
    return 'A probability written as a fraction runs from 0 to 1. If you used a percent, how could you write it as a fraction?';
  }
  if (expected!==0 && Math.sign(value)===-Math.sign(expected) &&
      Math.abs(value+expected)<=Math.max(part.tolerance??0,Math.abs(expected)*1e-8)) {
    return 'Look at the sign of your result. Which quantities or directions in this problem carry a minus sign?';
  }
  if (expected!==0 && value!==0 && Math.sign(value)===Math.sign(expected)) {
    const power=Math.log10(Math.abs(value/expected));
    if (Math.abs(Math.round(power)-power)<1e-7 && Math.abs(Math.round(power))>=1 && Math.abs(power)<=12 &&
        /centimet|millimet|kilomet|nanomet|micro|milli|percent|per cent|convert|prefix|\b(?:cm|mm|km|nm|mT|mV|kV|keV|meV|GeV)\b|%/i.test(context+' '+working)){
      return 'Check the size of the units. Write the given value in the unit needed for your calculation before you use it.';
    }
  }
  if (/√|square root/i.test(working)) return 'Look under the square-root sign. Work out the whole quantity under it before taking the root.';
  if (/\b(?:weighted|weights?)\b/i.test(working) && /average|mean|expectation/i.test(context)) return 'Check how much each value counts. Match each value to its weight before combining them.';
  if (/\b(?:sin|cos|tan)\b|(?:sin|cos|tan)[(θωφ]/i.test(working)) return 'Check the angle in the calculation. Does your calculator expect degrees or radians for this value?';
  if (/\bsubtract|−/i.test(working) && /change|difference|final|initial|gain|loss|drop|shift|offset/i.test(context)) return 'Write down the two quantities you are comparing. Which one does the question ask you to subtract from the other?';
  if (working.includes('²') || /squared|square of/i.test(working)) return 'Check which quantity is squared. Squaring a number means multiplying it by itself.';
  if (/[÷/]/u.test(working)) return 'Write the division as a fraction. Which quantities belong above the line, and which belong below it?';
  if (/[×]/u.test(working)||/\bmultiply/i.test(working)) return 'Write each factor beside its meaning in the problem, then multiply the factors together.';
  if (/average|mean/i.test(label)) return 'Check how each value counts toward the average. Do all values have the same weight here?';
  if (part.unit && !['dimensionless','1','no unit'].includes(part.unit)) return 'Trace the units through your calculation. The result for this part should be in '+part.unit+'.';
  return 'Compare the question with the worked example. Which quantity changed, and which values stay the same?';
}
