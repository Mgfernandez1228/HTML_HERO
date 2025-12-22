export default [
  {
    title: 'Some JavaScript your way',
    text: '<p>How do I check if two variables of the same type are equal</p>',
    choices: [
      { label: 'Use =', isCorrect: false },
      { label: 'Use ===', isCorrect: true },
      { label: 'Use ==', isCorrect: false },
      { label: 'Use a better language', isCorrect: false },
    ],
  },
  {
    title: 'Even more JavaScript your way',
    text: '<p>Array1 contains 1, 2, and 3. Array2 contains 4, 5, and 6. What do I get if I add them?</p>',
    choices: [
      { label: '1, 2, 34, 5, 6', isCorrect: true },
      { label: '1, 2, 3, 4, 5, 6', isCorrect: false },
      { label: '21', isCorrect: false },
      { label: '6, 7', isCorrect: false },
    ],
  },
  {
    title: 'The Ultimate Test',
    text: '<p>I define var a = 10, I use \'delete\' on a, then ask the console to output a. What will it show?</p>',
    choices: [
      { label: '10', isCorrect: true },
      { label: 'undefined', isCorrect: false },
      { label: 'Error: Variable \'a\' has been deleted on line 2', isCorrect: false },
      { label: 'True', isCorrect: false },
    ],
  },
];

// Editable NPC lines for level three
export const npcIntro = "Ahh... You've made it to the final challenge. To pass, you must prove your mastery over JavaScript.";
export const passiveDialog = {
  down: "Beautiful day, isn't it?",
  up: "Horrible day, isn't it?",
  right: "Boring day, isn't it?",
  left: "Cool day, isn't it?",
};
