// Deterministic hard-constraint check: does this profile break the client's stated preferences?
export function checkProfile(prefs, p) {
  const v = [];
  const add = (field, expected, actual) => v.push({ field, expected, actual });
  if (p.age < prefs.ageMin || p.age > prefs.ageMax) add("age", `${prefs.ageMin}-${prefs.ageMax}`, p.age);
  if (p.heightCm < prefs.minHeightCm) add("height", `>= ${prefs.minHeightCm} cm`, `${p.heightCm} cm`);
  if (!prefs.religions.includes(p.religion)) add("religion", prefs.religions.join("/"), p.religion);
  if (!prefs.diet.includes(p.diet)) add("diet", prefs.diet.join("/"), p.diet);
  if (prefs.smoking === "never" && p.smoking !== "never") add("smoking", "non-smoker", p.smoking);
  if (prefs.wantsKids && p.wantsKids !== prefs.wantsKids) add("kids", `wants kids: ${prefs.wantsKids}`, `wants kids: ${p.wantsKids}`);
  if (!prefs.cities.includes(p.city)) add("location", prefs.cities.join("/"), p.city);
  return v;
}
