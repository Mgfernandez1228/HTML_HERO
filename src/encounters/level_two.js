export default [
  {
    title: 'Level Two - Encounter 1',
    text: '<p>A sleepy guard stands watch. What do you do?</p>',
    choices: [
      { label: 'Steal the key from the guard', isCorrect: false },
      { label: 'Distract the guard with a joke', isCorrect: true },
      { label: 'Charge the gate', isCorrect: false },
      { label: 'Hide in the shadows', isCorrect: false },
    ],
  },
  {
    title: 'Level Two - Encounter 2',
    text: '<p>The guard recovers—make your next move.</p>',
    choices: [
      { label: 'Fight him head-on', isCorrect: false },
      { label: 'Slip the key while he yawns', isCorrect: true },
      { label: 'Call for reinforcements', isCorrect: false },
      { label: 'Feign surrender', isCorrect: false },
    ],
  },
];

// Editable NPC lines for level two
export const npcIntro = "I am the CSS Wizard, You might be good enough to deal with HTML, but you are never getting past me!";
export const passiveDialog = {
  down: "Beautiful day, isn't it?",
  up: "Horrible day, isn't it?",
  right: "Boring day, isn't it?",
  left: "Cool day, isn't it?",
};
