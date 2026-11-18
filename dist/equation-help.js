import {esc} from './models.js?v=0.19.0';

// Quantities come from the lesson-specific, authored key. Only notation is shared.
export function notationFor(equation, courseId = '') {
  const entries = [], add = (symbol, description) => entries.push({symbol, description});
  const particleCharge = /(?:e|μ|π|W)[⁻⁺](?![⁰¹²³⁴⁵⁶⁷⁸⁹Α-Ωα-ω])/u;
  const particleReaction = ['atomic-nuclear','particles'].includes(courseId) && equation.includes('→') && particleCharge.test(equation);
  if (equation.includes('=')) add('=', 'Equals: both sides have the same value.');
  if (/[≈≃]/u.test(equation)) add('≈', 'About equal: a close estimate, rather than an exact match.');
  if (equation.includes('∼')) add('∼', 'Read the surrounding words to tell whether this means the same scale, an approximate size, or a stated scaling rule.');
  if (equation.includes('∝')) add('∝', 'Changes in proportion: multiplying one side by a number multiplies the other by the same number.');
  if (equation.includes('≠')) add('≠', 'Not equal.');
  if (/[<>≤≥≪≫]/u.test(equation)) add('<, >, ≤, ≥', 'Less than, greater than, at most, and at least. A doubled sign means much less or much greater.');
  if (equation.includes('+')) add('+', particleReaction ? 'And. The particles on the same side of the reaction take part together.' : 'Add two values. A plus sign in front of a number also marks a positive value.');
  if (particleReaction) add('⁻ or ⁺', 'The raised sign on a particle gives its electric charge. An electron, e⁻, carries negative charge.');
  if (equation.includes('%')) add('%', 'Percent means parts out of 100. Divide a percent by 100 to write it as a decimal.');
  if (equation.includes('∈')) add('∈', 'Belongs to. The value on the left is one of the allowed values on the right.');
  if (/[≳≲]/u.test(equation)) add('≳ or ≲', 'Greater than or roughly equal to, or less than or roughly equal to. These signs mark an approximate comparison.');
  if (/[−-]/u.test(equation.replace(/\b[A-Za-z]{2,}(?:-[A-Za-z]{2,})+\b/gu,''))) add('−', 'Subtract. A minus before a quantity reverses its sign.');
  if (/[±∓]/u.test(equation)) add('± / ∓', 'Two sign choices. Use the top signs together, or the bottom signs together.');
  if (/\b\d+(?:[.,]\d+)?\s*[×·]\s*10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹^]/u.test(equation)) add('Powers of ten', 'Multiplying by a power of ten moves the decimal point. For 10³, move it three places right. For 10⁻³, move it three places left.');
  if (equation.includes('×')) add('×', /(?:[a-zA-ZΑ-Ωα-ω]×[a-zA-ZΑ-Ωα-ω]|\bu_s × B|∇\s*×)/u.test(equation) ? 'Between vectors, a cross product: a rule making a new perpendicular vector. Between numbers, multiply.' : 'Multiply the parts on either side.');
  if (equation.includes('·')) add('·', 'Multiply numbers. Between vectors, take the dot product: multiply matching parts and add them.');
  if (/[\/÷]/u.test(equation)) add('/ or ÷', 'Divide the part before the sign by the part after it. Brackets show which parts belong together.');
  if (equation.replace(/T½/g,'').includes('½')) add('½', 'One half: divide by two.');
  if (/[a-zA-ZΑ-Ωα-ω]\s*[=≈]\s*[0-9½]*[a-zA-ZΑ-Ωα-ω][a-zA-ZΑ-Ωα-ω](?=[²³⁴⁵⁶⁷⁸⁹\s)+/−=]|$)/u.test(equation) && !/\b(?:sin|cos|tan|exp|log|ln|Tr)\b/u.test(equation))
    add('Letters side by side', 'A product can leave out the times sign. For example, 2ab means 2 × a × b. Use the quantity names above to tell a product from a single name.');
  if (equation.includes('√')) add('√', 'Square root: the nonnegative number that, multiplied by itself, gives the number inside.');
  if (/[²³⁴⁵⁶⁷⁸⁹]|[⁻⁺](?=[⁰¹²³⁴⁵⁶⁷⁸⁹Α-Ωα-ω])|\^[0-9(−-]/u.test(equation)) add('Raised numbers', 'For a power, ² means multiply by itself. For example, 3² = 3 × 3 = 9. A negative power takes the reciprocal: 2⁻² = 1/4. A raised number can also label an order or a dimension.');
  if (/[_₀-₉ₐₑₒₓₖₗₘₙₚₛₜᵢᵣᵧⱼ]/u.test(equation)) add('Small lower labels', 'A subscript names a particular value, object, direction or state. It is a label, not multiplication. For example, x₁ can label the first position. An underscore also starts a lower label.');
  if (/\^[Α-Ωα-ωa-z]/u.test(equation) && courseId === 'general-relativity') add('Raised letter labels', 'These select a time or space component. They are labels, not powers. Repeated component labels mean add over the stated components.');
  if (/[Σ∑]/u.test(equation)) add('Σ', 'Sum: add all the terms selected by the small labels.');
  if (/[∫∮]/u.test(equation)) add('∫ / ∮', 'Integral: add many tiny pieces. The limits say where to start and stop. A circle on the sign means a closed path or surface.');
  if (equation.includes('∂')) add('∂', 'Partial derivative: find how one quantity changes as one input changes, keeping the other inputs fixed.');
  if (equation.includes('∇')) add('∇', courseId === 'general-relativity' && equation.includes('∇_') ? 'Here it means a covariant derivative: measure change while also allowing for changing coordinate directions. The lower label selects the direction of the change.' : 'Find changes across space. ∇f gives the direction and rate of fastest increase. ∇· measures net outward flow; ∇× measures local turning; ∇² adds second spatial derivatives.');
  if (/[̇̈ḢṀṁ]/u.test(equation)) add('Dot above a letter', 'One dot means rate of change with time. Two dots mean how that rate itself changes with time.');
  if (/[′″]/u.test(equation)) add('′ or ″', courseId === 'relativity' ? 'A prime usually selects the other observer’s value in this course. Where a function is differentiated, primes count its derivatives.' : 'A prime can mean a derivative or label a different value or frame. Use the quantity names for this equation to tell which meaning fits. Two primes often mean a second derivative.');
  if (equation.includes('†')) add('†', 'Dagger: for a matrix, swap rows with columns and reverse the signs of imaginary parts.');
  if (equation.includes('*')) add('*', equation.includes('β_*') ? 'The star on the width labels the value giving the lowest trial energy.' : equation.includes('m*') ? 'The star on m labels effective mass, which describes how an electron responds inside the material.' : 'A star after a complex number means its complex conjugate. Keep the real part and reverse the sign of the imaginary part.');
  if (equation.includes('ŷ')) add('ŷ', 'A hat over y marks the value predicted by the fitted model.');
  if (equation.includes('̂')) add('Hat above a letter', courseId==='waves'&&equation.includes('p̂') ? 'The hat on p marks the size of the sound-pressure swing.' : ['math','em'].includes(courseId) ? 'A hat on a direction vector marks a vector whose length is one.' : 'An operator: a rule acting on a state.');
  if (/[̄āū]/u.test(equation)) add('Bar above a letter', 'Usually an average. Over a particle symbol, it can instead select the antiparticle.');
  if (equation.includes('̃')) add('Tilde above a letter', 'A related form of the quantity, such as its wave-based Fourier transform, as named in the lesson.');
  if (equation.includes('⊗')) add('⊗', 'Tensor product: combine two separate state spaces or operations into one joint description.');
  if (/\[a,\s*b\]/u.test(equation)) add('[a, b]', 'The interval from position a to position b.');
  if (/\[(?!a,\s*b\])[\p{L}\p{M}∇⊗†_₀-₉ₓᵧ]+,\s*[\p{L}\p{M}∇⊗†_₀-₉ₓᵧ]+\]/u.test(equation) && !equation.includes('[[')) add('[A, B]', 'A commutator compares two orders. Do B then A, then subtract the result of doing A then B.');
  if (/\{\s*0\s*,\s*1\s*\}/u.test(equation)) add('{0, 1}', 'The set has two allowed values, zero and one.');
  else if (/\{[^{}]+,[^{}]+\}/u.test(equation)) add('{ , }', courseId === 'advanced-mechanics' ? 'Poisson bracket: compare how two quantities change with position and momentum, using the derivatives shown.' : 'Anticommutator: add the products in the two possible orders.');
  if (/[⟨⟩]/u.test(equation)) add('⟨ ⟩ and | ⟩', 'Around one quantity, angle brackets give its average. Around two states, as in ⟨u,v⟩ or ⟨v|ψ⟩, they give an overlap amplitude. A ket such as |ψ⟩ names one state.');
  if (/\|[^|⟨⟩]+\||∣[^∣]+∣/u.test(equation)) add('| |', 'Bars on both sides mean size without a sign, or the length of a vector. A squared amplitude size gives a probability when the state is normalized.');
  if (equation.includes('!')) add('!', 'Factorial means multiply the whole numbers from this number down to 1. For example, 3! = 3 × 2 × 1 = 6. By definition, 0! = 1.');
  if (equation.includes('∞')) add('∞', 'Infinity: no finite end to the range or limiting value.');
  if (/[→⇒↔]/u.test(equation)) add('→ / ⇒ / ↔', 'An arrow shows a change, an implication, or a connection. In a particle reaction, it points from the starting particles to the products.');
  if (equation.includes('⊕')) add('⊕', 'Exclusive OR: the result is 1 when the two bits differ, and 0 when they match.');
  return entries;
}

export function equationKeyHTML(entries = [], equation = '', courseId = '') {
  const notation = notationFor(equation, courseId).filter(n=>!entries.some(s=>s.symbol===n.symbol));
  if (!entries.length && !notation.length) return '';
  const rows = list => list.map(s => `<div><dt><code>${esc(s.symbol)}</code>${s.name && s.name !== s.symbol ? ` <span>— ${esc(s.name)}</span>` : ''}</dt><dd>${esc(s.description)}${s.unit && s.unit !== 'no unit' ? ` <span class="symbol-unit">Unit: ${esc(s.unit)}.</span>` : ''}</dd></div>`).join('');
  return `<div class="equation-key"><h3>What each part means</h3>${entries.length ? `<dl class="quantity-key">${rows(entries)}</dl>` : ''}${notation.length ? entries.length ? `<div class="notation-key"><h4>How to read the marks</h4><dl>${rows(notation)}</dl></div>` : `<dl>${rows(notation)}</dl>` : ''}</div>`;
}

export function lessonEquationKey(lesson, equation) {
  return lesson.equationBreakdowns?.[equation] ?? lesson.equationGuide?.symbols ?? [];
}
