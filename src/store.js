//way for kaplay to communicate with react

import {atom, createStore} from 'jotai';

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const encounterAtom = atom(null); // null or string: 'level_one'|'level_two'|'level_three'
export const heartsAtom = atom(3);
export const scoreAtom = atom(0);
export const joystickAtom = atom({ x: 0, y: 0 }); // virtual joystick direction for mobile
export const mobileButtonAtom = atom(false); // whether mobile button A is pressed
export const isGameRunningAtom = atom(true);

export const store = createStore();
