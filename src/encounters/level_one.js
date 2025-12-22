export default [
  {
    title: 'HTML Tags',
    text: '<p>What tags do I use for a really big header?</p>',
    choices: [
      { label: 'h2', isCorrect: false },
      { label: 'h1', isCorrect: true },
      { label: 'h3', isCorrect: false },
      { label: 'p', isCorrect: false },
    ],
  },
];

// Editable NPC lines for level one
export const npcIntro = "Greetings, traveler. To proceed to the CSS Wizard, you must answer my riddle correctly.";
export const passiveDialog = {
  down: "Beautiful day, isn't it?",
  up: "Horrible day, isn't it?",
  right: "Boring day, isn't it?",
  left: "Cool day, isn't it?",
};
