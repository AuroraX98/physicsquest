import {esc} from './models.js?v=0.17.2';

// Quantities come from the lesson-specific, authored key. Only notation is shared.
export function notationFor(equation, courseId = '') {
  const entries = [], add = (symbol, description) => entries.push({symbol, description});
  if (equation.includes('=')) add('=', 'Equals: both sides have the same value.');
  if (/[≈≃]/u.test(equation)) add('≈', 'About equal: a close estimate, rather than an exact match.');
  if (equation.includes('∝')) add('∝', 'Changes in proportion: multiplying one side by a number multiplies the other by the same number.');
  if (equation.includes('≠')) add('≠', 'Not equal.');
  if (/[<>≤≥≪≫]/u.test(equation)) add('<, >, ≤, ≥', 'Less than, greater than, at most, and at least. A doubled sign means much less or much greater.');
  if (equation.includes('+')) add('+', 'Add the parts on either side.');
  if (/[−-]/u.test(equation)) add('−', 'Subtract. A minus before a quantity reverses its sign.');
  if (/[±∓]/u.test(equation)) add('± / ∓', 'Two sign choices. Use the top signs together, or the bottom signs together.');
  if (equation.includes('×')) add('×', /(?:[a-zA-ZΑ-Ωα-ω]×[a-zA-ZΑ-Ωα-ω]|\bu_s × B|∇\s*×)/u.test(equation) ? 'Between vectors, a cross product: a rule making a new perpendicular vector. Between numbers, multiply.' : 'Multiply the parts on either side.');
  if (equation.includes('·')) add('·', 'Multiply numbers. Between vectors, take the dot product: multiply matching parts and add them.');
  if (/[\/÷]/u.test(equation)) add('/ or ÷', 'Divide the part before the sign by the part after it. Brackets show which parts belong together.');
  if (equation.includes('½')) add('½', 'One half: divide by two.');
  if (equation.includes('√')) add('√', 'Square root: the nonnegative number that, multiplied by itself, gives the number inside.');
  if (/[²³⁴⁵⁶⁷⁸⁹⁻⁺]/u.test(equation) || /\^[0-9(−-]/u.test(equation)) add('Raised numbers', 'Usually a power: ² means multiply by itself; ³ means use three copies. A negative power means divide by the corresponding positive power. Some raised numbers are labels, such as a correction order or a dimension; the quantity key names those cases.');
  if (/[_₀-₉ₐₑₒₓₖₗₘₙₚₛₜᵢᵣᵧⱼ]/u.test(equation)) add('Small lower labels', 'A subscript names a particular value, object, direction or state. It is a label, not multiplication. An underscore also starts a lower label.');
  if (/\^[Α-Ωα-ωa-z]/u.test(equation) && courseId === 'general-relativity') add('Raised letter labels', 'These select a time or space component. They are labels, not powers. Repeated component labels mean add over the stated components.');
  if (/[Σ∑]/u.test(equation)) add('Σ', 'Sum: add all the terms selected by the small labels.');
  if (/[∫∮]/u.test(equation)) add('∫ / ∮', 'Integral: add many tiny pieces. The limits say where to start and stop. A circle on the sign means a closed path or surface.');
  if (equation.includes('∂')) add('∂', 'Partial derivative: find how one quantity changes as one input changes, keeping the other inputs fixed.');
  if (equation.includes('∇')) add('∇', courseId === 'general-relativity' && equation.includes('∇_') ? 'Here it means a covariant derivative: measure change while also allowing for changing coordinate directions. The lower label selects the direction of the change.' : 'Find changes across space. ∇f gives the direction and rate of fastest increase. ∇· measures net outward flow; ∇× measures local turning; ∇² adds second spatial derivatives.');
  if (/[̇̈ḢṀṁ]/u.test(equation)) add('Dot above a letter', 'One dot means rate of change with time. Two dots mean how that rate itself changes with time.');
  if (/[′″]/u.test(equation)) add('′ or ″', courseId === 'relativity' ? 'A prime usually selects the other observer’s value in this course. Where a function is differentiated, primes count its derivatives.' : 'A prime can mean a derivative or label a different value or frame. The lesson’s quantity key states the meaning. Two primes often mean a second derivative.');
  if (equation.includes('†')) add('†', 'Dagger: for a matrix, swap rows with columns and reverse the signs of imaginary parts.');
  if (equation.includes('*')) add('*', 'Star: usually reverse the imaginary part of a complex number. In effective mass m*, it labels effective mass instead.');
  if (equation.includes('̂')) add('Hat above a letter', 'An operator: a rule acting on a state. On a direction vector, a hat instead means its length is one.');
  if (/[̄āū]/u.test(equation)) add('Bar above a letter', 'Usually an average. Over a particle symbol, it can instead select the antiparticle.');
  if (equation.includes('̃')) add('Tilde above a letter', 'A related form of the quantity, such as its wave-based Fourier transform, as named in the lesson.');
  if (equation.includes('⊗')) add('⊗', 'Tensor product: combine two separate state spaces or operations into one joint description.');
  if (/\[[^\[\]]+,[^\[\]]+\]/u.test(equation) && !/\[\[/.test(equation)) add('[A, B]', 'When the brackets compare two operations, this is a commutator: do B then A, and subtract the result of doing A then B. In a range, the two entries instead mark the endpoints.');
  if (/\{[^{}]+,[^{}]+\}/u.test(equation)) add('{ , }', courseId === 'advanced-mechanics' ? 'Poisson bracket: compare how the two quantities change with position and momentum, using the derivatives shown.' : 'Anticommutator: add the products in the two possible orders.');
  if (/[⟨⟩]/u.test(equation)) add('⟨ ⟩ and | ⟩', 'Angle brackets around a quantity mean its average. |ψ⟩ is a state; ⟨v|ψ⟩ compares two states and gives an overlap amplitude.');
  if (equation.includes('|')) add('| |', 'Bars on both sides mean size without a sign, or the length of a vector. A squared amplitude size gives a probability when the state is normalized.');
  if (equation.includes('!')) add('!', 'Factorial: multiply the whole numbers from this number down to 1.');
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
