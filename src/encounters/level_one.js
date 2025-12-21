export default [
  {
    title: 'Level One Encounter',
    text: '<p>A mysterious sage blocks your path. Choose your action:</p>',
    choices: [
      { label: 'Approach the glowing altar', isCorrect: false },
      { label: 'Inspect the carved runes', isCorrect: true },
      { label: 'Run back to town', isCorrect: false },
      { label: 'Shout for help', isCorrect: false },
    ],
  },
];

// Editable NPC lines for level one
export const npcIntro = "Get Ready! if you can't do this you will never beat the CSS wizard and King JavaScript, HTML HERO!";
export const passiveDialog = {
  down: "Beautiful day, isn't it?",
  up: "Horrible day, isn't it?",
  right: "Boring day, isn't it?",
  left: "Cool day, isn't it?",
};
