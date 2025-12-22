export default [
  {
    title: 'HTML Tags',
    text: '<p>What tag do I use for a really big header?</p>',
    choices: [
      { label: 'h2', isCorrect: false },
      { label: 'h1', isCorrect: true },
      { label: 'h3', isCorrect: false },
      { label: 'p', isCorrect: false },
    ],
  },
  {
    title: 'HTML Tags',
    text: '<p>What tag do I use for a link?</p>',
    choices: [
      { label: 'a href', isCorrect: true },
      { label: 'nav', isCorrect: false },
      { label: 'div', isCorrect: false },
      { label: 'link', isCorrect: false },
    ],
  },
  {
    title: 'HTML Keywords',
    text: '<p>Why would anyone use the class keyword?</p>',
    choices: [
      { label: 'They can\'t afford schooling in real life', isCorrect: false },
      { label: 'To do Object Oriented Programming', isCorrect: false },
      { label: 'To allow multiple elements to use the same styling', isCorrect: true },
      { label: 'Subjugation of the working masses to a minority group', isCorrect: false },
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
