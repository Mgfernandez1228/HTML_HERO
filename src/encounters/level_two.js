export default [
  {
    title: 'Doing CSS',
    text: '<p>I want to outline some text, How may I do that?</p>',
    choices: [
      { label: 'Use text-outline', isCorrect: false },
      { label: 'Use -webkit-text-stroke', isCorrect: true },
      { label: 'Use text-decoration', isCorrect: false },
      { label: 'Add a border to the text', isCorrect: false },
    ],
  },
  {
    title: 'More CSS',
    text: '<p>I want a margin with the top and bottom at 10px, left and right at 20px. What do I do?</p>',
    choices: [
      { label: 'margin: 20px 10px;', isCorrect: false },
      { label: 'margin: 10px 20px;', isCorrect: true },
      { label: 'margin: 10px 20px', isCorrect: false },
      { label: 'margin: 10px 10x 20px 20px;', isCorrect: false },
    ],
  },
];

// Editable NPC lines for level two
export const npcIntro = "I am the CSS Wizard. You may be good enough for basic HTML tags, but can you handle CSS? Prove your worth!";
export const passiveDialog = {
  down: "Beautiful day, isn't it?",
  up: "Horrible day, isn't it?",
  right: "Boring day, isn't it?",
  left: "Cool day, isn't it?",
};
