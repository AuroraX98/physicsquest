// No expression evaluation: learners enter one finite decimal number per part.
export function checkNumeric(input, expected, tolerance=1e-8){
 if(typeof input!=='string'||input.trim()==='')return {valid:false,correct:false,message:'Enter a number first.'};
 const decimal=/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(input.trim());
 const value=decimal?Number(input.trim()):NaN;
 if(!Number.isFinite(value))return {valid:false,correct:false,message:'Use a finite number, with a decimal point if needed. Enter the number only; its units are shown beside the label.'};
 if(!Number.isFinite(expected)||!Number.isFinite(tolerance)||tolerance<0)throw new RangeError('Invalid answer specification');
 return {valid:true,correct:Math.abs(value-expected)<=tolerance,value};
}
