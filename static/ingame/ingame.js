import { birdFalling, detectCollision } from "./bird.js";
import { quizGenerate } from "./quiz.js";

let delta = 50;

let isPlaying = true;

export function pauseGame() {
    isPlaying = false;
}

export function resumeGame() {
    isPlaying = true;
}

function MainLoop() {

    if (!isPlaying) {
        return;
    }
    birdFalling();
    detectCollision();
    quizGenerate();
}
$(document).ready(setInterval(MainLoop, delta));