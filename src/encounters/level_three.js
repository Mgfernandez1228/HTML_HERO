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
   {
    title: 'Some JavaScript your way',
    text: '<p>What is NaN?</p>',
    choices: [
      { label: 'It means \'Not a Number\'', isCorrect: true },
      { label: 'Not a valid keyword in JavaScript', isCorrect: false },
      { label: 'It means NULL', isCorrect: false }
    ],
  },
  {
    title: 'Even more JavaScript your way',
    text: '<p>Is JavaScript related to the programming language \'Java\'?</p>',
    choices: [
      { label: 'Yes', isCorrect: false },
      { label: 'No', isCorrect: true },
      { label: 'We\'re all related in some way', isCorrect: false },
    ],
  },
  {
    title: 'The Ultimate Test',
    text: '<p>Is \'null\' greater than or equal to zero in JavaScript?</p>',
    choices: [
      { label: 'You cannot compare them', isCorrect: false },
      { label: 'No', isCorrect: false },
      { label: 'Maybe', isCorrect: false },
      { label: 'Yes', isCorrect: true }
    ],
  },
   {
    title: 'Some JavaScript your way',
    text: '<p>How do I assign a value to a variable?</p>',
    choices: [
      { label: 'Use equal sign', isCorrect: true },
      { label: 'Use curly braces', isCorrect: false },
      { label: 'Use parenthesis', isCorrect: false },
      { label: 'All of the above are valid', isCorrect: false },
    ],
  },
  {
    title: 'Even more JavaScript your way',
    text: '<p>Is JavaScript a strongly typed language?</p>',
    choices: [
      { label: 'My fingers are too weak to type it strongly, anyway', isCorrect: false },
      { label: 'Yes', isCorrect: false },
      { label: 'No', isCorrect: true }
    ],
  },
  {
    title: 'The Ultimate Test',
    text: '<p>How do I use a pointer in JavaScript?</p>',
    choices: [
      { label: 'Pointers do not exist in JavaScript', isCorrect: true },
      { label: 'Use the asterisk next to a type', isCorrect: false },
      { label: 'Curl all your fingers inward except your index finger', isCorrect: false },
      { label: 'Use the ampersand symbol', isCorrect: false },
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
