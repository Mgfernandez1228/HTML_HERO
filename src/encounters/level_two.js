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
  {
    title: 'More CSS',
    text: '<p>How do I center a div horizontally?</p>',
    choices: [
      { label: 'display: flex;', isCorrect: false },
      { label: 'margin: 0 auto;', isCorrect: true },
      { label: 'wow this question is just like that one meme', isCorrect: false },
    ],
  },
  {
    title: 'More CSS',
    text: '<p>Do I always need to use an external stylesheet?</p>',
    choices: [
      { label: 'Yes', isCorrect: false },
      { label: 'No, you can use the style attribute in HTML', isCorrect: true },
      { label: 'Yes, but you need to pay a subscription for it', isCorrect: false },
    ],
  },
  {
    title: 'More CSS',
    text: '<p>What is flexbox?</p>',
    choices: [
      { label: 'a module in javascript', isCorrect: false },
      { label: 'a box to flex your muscles as hard as possible', isCorrect: false },
      { label: 'Layout model for arranging elements in a one-dimensional space', isCorrect: true },
      { label: 'Layout model for defining matrices', isCorrect: false },
    ],
  },
  {
    title: 'More CSS',
    text: '<p>What is the \'@\' symbol used for CSS?</p>',
    choices: [
      { label: 'It means \'at\'', isCorrect: false },
      { label: 'Not a valid symbol in CSS', isCorrect: false },
      { label: 'Tried to ask your mom for hers, it didn\'t go well', isCorrect: false },
      { label: 'Used for at-rules which are CSS preprocessor directives', isCorrect: true }
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
