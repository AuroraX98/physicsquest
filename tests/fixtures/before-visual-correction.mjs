// Historical fingerprints include this published unit typo. Reverse only this
// exact correction for preservation checks; a separate test requires the fix.
export const beforeVisualCorrection=value=>JSON.parse(JSON.stringify(value).replaceAll('V_eff = 5 J and the effective-potential slope','V_eff = 5 p_φ and the effective-potential slope'));
