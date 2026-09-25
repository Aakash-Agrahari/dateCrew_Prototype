// Mocked data. In production this comes from the CRM / email system.
export const clients = [
  { id: "c1", name: "Priya (29, F)", prefs: { ageMin: 27, ageMax: 33, minHeightCm: 172, religions: ["Hindu"],
      diet: ["veg", "eggetarian"], smoking: "never", wantsKids: "yes", cities: ["Delhi", "Gurgaon", "Noida"] } },
  { id: "c2", name: "Arjun (28, M)", prefs: { ageMin: 25, ageMax: 30, minHeightCm: 158, religions: ["Hindu", "Sikh", "Jain"],
      diet: ["veg", "eggetarian", "non-veg"], smoking: "any", wantsKids: "yes", cities: ["Mumbai", "Pune"] } },
];
export const profiles = [
  { id: "p1", name: "Rahul", age: 31, heightCm: 175, religion: "Hindu", diet: "veg", smoking: "never", wantsKids: "yes", city: "Gurgaon" },
  { id: "p2", name: "Karan", age: 36, heightCm: 168, religion: "Hindu", diet: "non-veg", smoking: "occasional", wantsKids: "no", city: "Bangalore" },
  { id: "p3", name: "Vikram", age: 30, heightCm: 170, religion: "Hindu", diet: "veg", smoking: "never", wantsKids: "yes", city: "Delhi" },
  { id: "p4", name: "Aman", age: 29, heightCm: 180, religion: "Sikh", diet: "non-veg", smoking: "never", wantsKids: "yes", city: "Delhi" },
  { id: "p5", name: "Neha", age: 27, heightCm: 160, religion: "Hindu", diet: "non-veg", smoking: "never", wantsKids: "yes", city: "Pune" },
  { id: "p6", name: "Sana", age: 24, heightCm: 162, religion: "Muslim", diet: "non-veg", smoking: "never", wantsKids: "yes", city: "Mumbai" },
  { id: "p7", name: "Isha", age: 28, heightCm: 155, religion: "Jain", diet: "veg", smoking: "never", wantsKids: "no", city: "Mumbai" },
];
export const rejections = [
  { clientId: "c1", profileId: "p2", text: "He smokes and is way too old for me" },
  { clientId: "c1", profileId: "p3", text: "Bit short, not sure, maybe" },
  { clientId: "c1", profileId: "p4", text: "Non veg, I told you I eat only veg" },
  { clientId: "c1", profileId: "p4", text: "Different community" },
  { clientId: "c1", profileId: "p1", text: "Job doesn't seem stable and salary is low" },
  { clientId: "c1", profileId: "p2", text: "Lives in Bangalore, I don't want to relocate" },
  { clientId: "c2", profileId: "p6", text: "Not from my religion" },
  { clientId: "c2", profileId: "p7", text: "She doesn't want kids" },
  { clientId: "c2", profileId: "p5", text: "Photos didn't appeal, just no spark" },
  { clientId: "c2", profileId: "p7", text: "Too short for me? not sure" },
  { clientId: "c2", profileId: "p5", text: "Family seems very conservative" },
  { clientId: "c2", profileId: "p6", text: "Too young, and different faith" },
];
