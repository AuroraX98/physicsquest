// Reviewed removal of paraphrases that add no new teaching. Match the original exactly.
export const detailEdits = [
  {
    "key": "math/power-rule",
    "original": "A power tells us how many times to multiply an input by itself: x³ means x × x × x. For positive whole-number powers, the power rule finds the rate: multiply by the power, then lower that power by one. So the rate of x³ is 3x².",
    "replacement": ""
  },
  {
    "key": "math/fields",
    "original": "A field is a rule that gives a value at each place. A temperature map gives one number at each place: a scalar field. A wind map gives a speed and direction: a vector field. A field is not itself the path followed by an object.",
    "replacement": "A field with one number at each place is called a scalar field. A field with size and direction at each place is called a vector field."
  },
  {
    "key": "math/flux",
    "original": "Imagine an arrow sticking straight out of the sheet. This is its normal, meaning perpendicular direction. The angle θ is between this normal and the field, not between the field and the sheet. For a flat area A in a uniform field of size E, Φ = EA cos θ: multiply field, area and the perpendicular share.",
    "replacement": "The normal is an arrow perpendicular to the sheet. Measure the angle θ from that arrow to the field, not from the sheet itself."
  },
  {
    "key": "math/complex-division",
    "original": "To divide by a nonzero complex number, multiply the top and bottom of the fraction by its conjugate. Multiplying both by the same nonzero number leaves the fraction unchanged. The denominator then becomes real.",
    "replacement": ""
  },
  {
    "key": "math/real-oscillations",
    "original": "A complex number can help us calculate a real repeating signal. At the end, take the real part: the component without i. Write the constant complex amplitude X=a+ib. Both a and b have the signal’s measured units.",
    "replacement": "Write the constant complex amplitude as X=a+ib. Both a and b have the signal’s measured units."
  },
  {
    "key": "math/exponential-decay",
    "original": "If k is 0.1 per minute, the characteristic time is 10 minutes and the half-life is about 6.93 minutes. They answer different questions. A smooth average decay curve does not predict the exact time of each random individual event.",
    "replacement": "The characteristic time and the half-life answer different questions: the first leaves about 37% of the starting amount, while the second leaves 50%."
  },
  {
    "key": "mechanics/position",
    "original": "With constant velocity, each second adds the same signed change to position. Multiply velocity by elapsed time to find displacement, then add the starting position. Starting at −3 m and moving +2 m each second for 4 seconds adds +8 m, so the finish is +5 m.",
    "replacement": ""
  },
  {
    "key": "mechanics/relative-velocity",
    "original": "This classical rule is a good approximation when speeds are much smaller than light speed. A viewpoint moving at constant velocity changes the reported velocity, but does not by itself change acceleration.",
    "replacement": "A viewpoint moving at constant velocity changes the reported velocity, but does not by itself change acceleration."
  },
  {
    "key": "mechanics/choose-system",
    "original": "The system is the object or group you choose to study. Draw it separately. A free-body diagram shows forces from outside that system acting on it. Name the source of each force.",
    "replacement": "The system can be one object or a group of objects. Draw your chosen system separately from its surroundings."
  },
  {
    "key": "mechanics/normal-tension",
    "original": "For a box touching a horizontal table with no vertical acceleration, upward forces balance downward forces. If weight is mg and an extra upward pull is F_up, the table only needs to supply the rest: N + F_up − mg = 0.",
    "replacement": "An extra upward pull shares the job of supporting the box, so the table supplies only the remaining upward force."
  },
  {
    "key": "mechanics/linked-bodies",
    "original": "Treat both carts together first. Their mutual rope pulls are internal and cancel from the combined force total. Divide the total outside horizontal force by total mass to find the common acceleration.",
    "replacement": "Divide the total outside horizontal force by the two carts’ total mass to find their common acceleration."
  },
  {
    "key": "mechanics/radial-acceleration",
    "original": "For uniform circular motion, the acceleration points toward the centre. Its size is v²/r: speed squared divided by radius. Radial means along the line between the object and the centre.",
    "replacement": "Radial means along the line between the object and the centre."
  },
  {
    "key": "mechanics/radial-force-budget",
    "original": "Force components along the tangent change speed and need a separate balance. If actual forces cannot supply the required inward total, the assumed circular path will not occur.",
    "replacement": "Force components along the tangent change speed and need a separate balance."
  },
  {
    "key": "mechanics/kinetic-energy",
    "original": "Kinetic energy means energy of motion. For a constant-mass classical particle, K = ½mv²: half the mass times speed squared. It is nonnegative because mass is positive and a square cannot be negative.",
    "replacement": "Kinetic energy cannot be negative in this model: mass is positive and speed squared cannot be negative."
  },
  {
    "key": "mechanics/centre-mass",
    "original": "The centre of mass is an average position that gives more weight to heavier objects. Multiply each position by its mass, add the results, then divide by total mass. The answer lies closer to the heavier object. It can even be in an empty gap between objects.",
    "replacement": "The centre of mass lies closer to the heavier object."
  },
  {
    "key": "mechanics/collision-types",
    "original": "During a collision, use momentum conservation only when the outside impulse is small enough to ignore. Then separately check kinetic energy, the energy of motion. An elastic collision keeps the same total kinetic energy. An inelastic collision changes some of it into other forms. Perfectly inelastic means the bodies stick and move together afterward.",
    "replacement": "Inelastic does not always mean sticking together. Sticking is the special case called perfectly inelastic."
  },
  {
    "key": "em/electric-dipole",
    "original": "In a uniform field, the two electric forces are equal and opposite, so their net force is zero. Unless the pair is aligned with the field, those forces act at different places and can turn the pair. Torque describes this turning effect.",
    "replacement": "The net force on this dipole is zero in a uniform field. When it is aligned with the field, the turning effect is also zero."
  },
  {
    "key": "em/electric-flux",
    "original": "For a curved surface or varying field, split it into small patches and add E·dA. Here dA is a small area arrow: its size is patch area and its direction is the chosen normal. Electric flux is not a flow of physical field-lines or charge.",
    "replacement": "For a curved surface or varying field, split it into small patches and add E·dA. Here dA is a small area arrow: its size is patch area and its direction is the chosen normal."
  },
  {
    "key": "em/potential-difference",
    "original": "Choose a start A and finish B. The change ΔV means V at B minus V at A. For a small fixed charge q, multiply q by this voltage change to get the change in its electric potential energy. Keep the sign of q: a negative charge reverses the energy-change sign.",
    "replacement": "Choose a start A and finish B. The change ΔV means V at B minus V at A."
  },
  {
    "key": "em/equipotential-surfaces",
    "original": "Zero electric work along the surface does not mean zero force. A perpendicular force can still change the direction of motion. Where the entire gradient is zero, the field is zero and there is no field direction to call perpendicular.",
    "replacement": "A perpendicular force can still change the direction of motion. Where the entire gradient is zero, the field is zero and there is no field direction to call perpendicular."
  },
  {
    "key": "em/current-definition",
    "original": "Conventional current points in the direction positive charge would move. Negative electrons drifting in the opposite direction can make the same conventional current. Charge is transferred, not used up as it passes a component.",
    "replacement": "Conventional current points in the direction positive charge would move."
  },
  {
    "key": "em/current-density-drift",
    "original": "Current density J tells us how much current crosses each square metre, including its direction. For one carrier type, multiply the number of carriers per volume n by charge per carrier q and their average drift velocity v_d.",
    "replacement": "Current density J tells us how much current crosses each square metre, including its direction."
  },
  {
    "key": "em/circuit-power",
    "original": "Power is energy transferred each second. To track power at a component, label one terminal positive for voltage V and count current I as positive when it enters that terminal. Then absorbed power is P=VI. A positive result means energy enters the component; a negative result means it delivers energy to the rest of the circuit.",
    "replacement": "Power is energy transferred each second."
  },
  {
    "key": "em/lorentz-force",
    "original": "Power transferred to a point charge is force dotted with velocity. Since v×B is perpendicular to v, the magnetic part alone does no work on that charge. It can change motion direction without changing speed. The electric part qE can change kinetic energy; zero magnetic work does not mean no magnetic force.",
    "replacement": "To find the power delivered to a point charge, use the dot product of force and velocity. This counts only the force component along the motion."
  },
  {
    "key": "thermodynamics/ideal-gas-limits",
    "original": "A measured ratio can test agreement with the model. A value near one supports the state equation for that state and precision; it does not prove that every other ideal-gas prediction is accurate.",
    "replacement": ""
  },
  {
    "key": "thermodynamics/speed-averages",
    "original": "Kinetic energy depends on speed squared. To describe its average with one speed, first square each speed, average those squares, then take the nonnegative square root. The square root reverses squaring for a nonnegative input.",
    "replacement": "The square root reverses squaring for a nonnegative input."
  },
  {
    "key": "thermodynamics/heat-capacity",
    "original": "For a stated process with nearly constant specific heat and no phase change, heat equals mass times specific heat times temperature change. The process conditions matter because some supplied heat may also support expansion work.",
    "replacement": "Process conditions matter because some supplied heat may also support expansion work."
  },
  {
    "key": "thermodynamics/adiabatic-change",
    "original": "Adiabatic means no heat crosses the chosen boundary. If the gas pushes a load, the energy for that work must come from internal energy. A classical ideal gas then cools.",
    "replacement": ""
  },
  {
    "key": "thermodynamics/engine-energy",
    "original": "A working gas repeatedly returns to its starting state. Its stored internal energy therefore has no net change over a cycle. Heat from a hot source supplies work and heat delivered to a colder sink.",
    "replacement": ""
  },
  {
    "key": "thermodynamics/phase-latent-heat",
    "original": "At a fixed pressure, a pure material can melt while solid and liquid coexist at the melting temperature. Energy changes the microscopic arrangement and interactions, so temperature need not rise while the conversion continues.",
    "replacement": "Solid and liquid coexist during this ideal melting step."
  },
  {
    "key": "optics/light-bands",
    "original": "Frequency counts repeats each second. Wavelength measures the distance between matching parts of a repeating wave. In vacuum their product is the speed of light. Shorter vacuum wavelength therefore means higher frequency.",
    "replacement": "In vacuum, frequency multiplied by wavelength gives the speed of light."
  },
  {
    "key": "optics/thin-lens-signs",
    "original": "Treat the lens as one thin plane. For a real object on the incoming side, dₒ is positive. For the outgoing rays, dᵢ is positive if they meet on the far side, and negative if only their backward extensions meet on the object side.",
    "replacement": "Treat the lens as one thin plane. A real image is on the far side; a virtual image is on the object side."
  },
  {
    "key": "optics/stops-pupils",
    "original": "The entrance pupil is the image of the aperture stop seen through optics in front of it. Its apparent size, not necessarily the physical hole size, sets the usual camera f-number for a distant object.",
    "replacement": ""
  },
  {
    "key": "optics/optical-instruments",
    "original": "A simple astronomical telescope uses an objective to make a real intermediate image, then an eyepiece to present that image under a larger viewing angle. For relaxed viewing, the emerging rays are parallel.",
    "replacement": "The first lens is called the objective. It forms a real image between the lenses."
  },
  {
    "key": "optics/michelson-double-path",
    "original": "Moving one mirror along its arm by distance Δx changes its round-trip path by 2Δx. In air approximated as vacuum, one full fringe cycle occurs for a mirror movement of half a wavelength.",
    "replacement": "One full fringe cycle therefore needs a mirror movement of half a wavelength."
  },
  {
    "key": "optics/huygens-front",
    "original": "Instead of treating an aperture as one ray, imagine dividing it into many small patches. Each contributes a wave to a later observation point. Their phases depend on the travel distances.",
    "replacement": ""
  },
  {
    "key": "atomic-nuclear/binding-needs-a-reference",
    "original": "Set zero energy at an electron and nucleus very far apart and at rest. A bound state lies below that reference. Its negative energy is not negative mass or an impossible measurement.",
    "replacement": ""
  },
  {
    "key": "atomic-nuclear/fill-states-not-locations",
    "original": "One spatial orbital offers two different spin states, so it can hold two electrons with opposite spin labels. The rule is not that two electrons can never be found in the same region of space.",
    "replacement": ""
  },
  {
    "key": "atomic-nuclear/alpha-decay-crosses-a-barrier",
    "original": "In a simplified tunnelling picture, the alpha-like configuration has some chance to pass through a barrier. Positive energy release alone does not determine the escape probability or lifetime.",
    "replacement": ""
  },
  {
    "key": "atomic-nuclear/charged-particles-leave-energy-behind",
    "original": "Average stopping power is energy lost per distance. It varies with particle type, speed and material, so a single constant is only a local approximation.",
    "replacement": ""
  },
  {
    "key": "atomic-nuclear/attenuation-removes-unscattered-photons",
    "original": "Scattered photons can still reach other locations or a broad detector. Therefore this simple law does not directly predict all transmitted energy or dose.",
    "replacement": ""
  },
  {
    "key": "particles/organize-quarks-and-leptons",
    "original": "The three generations repeat charge patterns with different masses. Generation is not a stage through which one particle grows as it gets older.",
    "replacement": "There are three generations of quarks and leptons."
  },
  {
    "key": "particles/reconstruct-invariant-mass",
    "original": "Do not add individual rest masses and call that the system mass. Relative kinetic energy contributes to the total rest-frame energy of the combined system.",
    "replacement": ""
  },
  {
    "key": "particles/compare-collider-and-fixed-target-energy",
    "original": "Opposing equal beams can cancel their total momentum, leaving their total energy available in the CM frame. A beam striking a stationary target gives the whole system net motion.",
    "replacement": ""
  },
  {
    "key": "particles/curvature-measures-transverse-momentum",
    "original": "A magnetic field changes the direction of a moving charged particle without directly doing work on it in the ideal magnetic-only model. The curvature radius depends on transverse momentum.",
    "replacement": ""
  },
  {
    "key": "particles/an-excess-needs-a-statistical-comparison",
    "original": "A background-only model predicts a distribution of possible outcomes, not one exact count. An observed excess must be compared with that distribution and its uncertainties.",
    "replacement": ""
  },
  {
    "key": "materials/lattice-basis-cell",
    "original": "Put a red and a blue bead together as one motif. Repeat that motif along a line. The repeat positions are the lattice; the beads and their offsets are the basis.",
    "replacement": ""
  },
  {
    "key": "materials/bond-types",
    "original": "In an ionic picture, transferred charge makes oppositely charged ions attract. In a covalent picture, electrons occupy shared states concentrated between neighbours. In a metallic picture, some electron states extend across many atoms.",
    "replacement": "In an ionic model, charge transfer creates the oppositely charged ions."
  },
  {
    "key": "materials/acoustic-optical",
    "original": "In a two-atom cell, the atoms can move nearly together or mainly against each other. At a very long wavelength, together-motion barely stretches neighbouring cells and gives an acoustic branch whose frequency tends to zero.",
    "replacement": "The branch whose frequency tends to zero is called acoustic."
  },
  {
    "key": "materials/filled-bands",
    "original": "In an ideal filled band, contributions from states across the band cancel, and Pauli exclusion blocks a small rearrangement into already occupied states. A partly filled band has nearby empty states and can respond.",
    "replacement": "Pauli exclusion prevents an electron from moving into a state that is already occupied."
  },
  {
    "key": "quantum1/photon-momentum-scattering",
    "original": "A photon in vacuum has momentum magnitude p_γ=E_γ/c=h/λ. When it scatters from an electron, conserve both total energy and vector momentum. The outgoing photon can have a longer wavelength and smaller energy while the electron recoils.",
    "replacement": "A photon in vacuum has momentum magnitude p_γ=E_γ/c=h/λ. A photon that leaves with less energy has a longer wavelength."
  },
  {
    "key": "quantum1/position-momentum-actions",
    "original": "In the position description, the position operator multiplies the amplitude by x. The momentum operator differentiates it and multiplies by −iℏ.",
    "replacement": ""
  },
  {
    "key": "quantum3/near-degenerate-block",
    "original": "This exact block calculation does not prove that a chosen two-state truncation is accurate. Check coupling to omitted states and the physical model separately. It only avoids the bad expansion across the small internal gap.",
    "replacement": ""
  },
  {
    "key": "quantum3/atomic-spin-orbit",
    "original": "For electron spin s=1/2, L·S has value ℏ²[j(j+1)−l(l+1)−3/4]/2. Here j labels total angular momentum and l labels orbital angular momentum. Multiply this angular value by the radial average. Use this separated inverse-cube formula only for l>0; an s state has zero orbital angular momentum, not an instruction to multiply zero by a divergent radial integral.",
    "replacement": "For electron spin s=1/2, L·S has value ℏ²[j(j+1)−l(l+1)−3/4]/2. Here j labels total angular momentum and l labels orbital angular momentum. Multiply this angular value by the radial average. This separated formula requires l>0."
  },
  {
    "key": "fluid-dynamics/euler-fluid-equation",
    "original": "The parcel’s mass is ρ times its volume. Newton’s rule says this mass times its material acceleration equals the sum of forces. Divide by volume to compare pressure force −∂p/∂x and gravity force ρgₓ. Dividing again by density gives the acceleration equation shown here.",
    "replacement": "The parcel’s mass is ρ times its volume. Divide Newton’s force rule by volume to compare the pressure force −∂p/∂x and gravity force ρgₓ per volume. Then divide by density to get the acceleration."
  }
];
