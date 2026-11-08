export const ageOptions = Array.from({ length: 88 }, (_, i) => ({
  label: String(i + 11 + 1),
  value: i + 11 + 1,
}));

export const genderOptions = [
  { label: "Male  ", value: "male" },
  { label: "Female  ", value: "female" },
  { label: "Other  ", value: "other" },
];

export const educationOptions = [
  { label: "High school diploma/GED", value: "High school diploma/GED" },
  { label: "Some college", value: "Some college" },
  { label: "Associate's degree", value: "Associate's degree" },
  { label: "Bachelor's degree", value: "Bachelor's degree" },
  { label: "Master's degree", value: "Master's degree" },
  {
    label: "Doctoral degree (e.g. PhD, MD, JD)",
    value: "Doctoral degree (e.g. PhD, MD, JD)",
  },
];

export const personalityOptions = [
  { label: "Introvert", value: "Introvert" },
  { label: "Extrovert", value: "Extrovert" },
  { label: "Ambitious", value: "Ambitious" },
  { label: "Laid-back", value: "Laid-back" },
  { label: "Sense of humor", value: "Sense of humor" },
];

export const lookingForOptions = [
  { label: "Casual dating", value: "Casual dating" },
  {
    label: "Relationship/Long-term partner",
    value: "Relationship/Long-term partner",
  },
  {
    label: "Marriage/Starting a family",
    value: "Marriage/Starting a family",
  },
  {
    label: "Friends/Platonic connections",
    value: "Friends/Platonic connections",
  },
  {
    label: "Unsure/Open to possibilities",
    value: "Unsure/Open to possibilities",
  },
  { label: "Activity partners", value: "Activity partners" },
  { label: "Pen pals/Online-only", value: "Pen pals/Online-only" },
  {
    label: "Something casual/No strings attached",
    value: "Something casual/No strings attached",
  },
  {
    label: "Networking/Professional connections",
    value: "Networking/Professional connections",
  },
];

export const exerciseOptions = [
  { label: "Sedentary/Rarely", value: "Sedentary/Rarely" },
  { label: "Casual/Light", value: "Casual/Light" },
  { label: "Moderate", value: "Moderate" },
  { label: "Active/Frequent", value: "Active/Frequent" },
];

export const alcoholOptions = [
  { label: "Non-drinker", value: "Non-drinker" },
  { label: "Social drinker", value: "Social drinker" },
  { label: "Regular drinker", value: "Regular drinker" },
  { label: "Recovering alcoholic", value: "Recovering alcoholic" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

export const smokingOptions = [
  { label: "Non-smoker", value: "Non-smoker" },
  { label: "Occasional/Social smoker", value: "Occasional/Social smoker" },
  { label: "Regular smoker", value: "Regular smoker" },
  { label: "Vaper/E-cigarette user", value: "Vaper/E-cigarette user" },
];

export const drugUseOptions = [
  { label: "Cannabis user", value: "Cannabis user" },
  { label: "Occasional drug user", value: "Occasional drug user" },
  { label: "Regular drug user", value: "Regular drug user" },
  { label: "Non drug user", value: "Non drug user" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

export const politicalViewsOptions = [
  { label: "Liberal/Progressive", value: "Liberal/Progressive" },
  {
    label: "Moderate/Middle of the road",
    value: "Moderate/Middle of the road",
  },
  { label: "Conservative", value: "Conservative" },
  {
    label: "Apolitical/Not interested in politics",
    value: "Apolitical/Not interested in politics",
  },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

export const religionOptions = [
  { label: "Agnostic", value: "Agnostic" },
  { label: "Atheist", value: "Atheist" },
  { label: "Catholic", value: "Catholic" },
  { label: "Christian", value: "Christian" },
  { label: "Jewish", value: "Jewish" },
  { label: "Muslim", value: "Muslim" },
  { label: "Hindu", value: "Hindu" },
  { label: "Buddhist", value: "Buddhist" },
  { label: "Other religion", value: "Other religion" },
  {
    label: "Spiritual but not religious",
    value: "Spiritual but not religious",
  },
  { label: "Prefer not to say", value: "Prefer not to say" },
];
// Dating Mode (November 8, 2026): who you want to see in Discover. Kept on the phone, not on the server.
export const interestedInOptions = [
  { label: "Men", value: "male" },
  { label: "Women", value: "female" },
  { label: "Everyone", value: "everyone" },
];
