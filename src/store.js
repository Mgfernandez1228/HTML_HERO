//way for kaplay to communicate with react

import {atom, createStore} from 'jotai';

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const encounterAtom = atom(null); // null or string: 'level_one'|'level_two'|'level_three'
export const heartsAtom = atom(3);
export const scoreAtom = atom(0);
export const store = createStore();
