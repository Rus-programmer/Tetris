import {figures} from "./figures.js";

export function randomElement() {
    let i = Math.round(Math.random() * 10);
    if (i >= figures.length) {
        return randomElement();
    }
    return i;
}