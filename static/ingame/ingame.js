import { birdFalling, detectCollision } from "./bird.js";
import { quizGenerate } from "./quiz.js";

let delta = 8;
let isPlaying = true;

function exit() {
    window.location.href = "/";
}

const exit_btn = $("#exit-btn");
exit_btn[0].addEventListener("click", exit);

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