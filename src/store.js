//way for kaplay to communicate with react

import {atom, createStore} from 'jotai';

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const store = createStore();