import { atom } from "jotai";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

export const audioContextAtom = atom(new AudioContext());
