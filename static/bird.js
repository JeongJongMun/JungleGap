import {quiz} from "./quiz.js";

let isJump = false;
let birdFlyingSpeed = 50;
let birdFallingSpeed = 5;

// 새 올라가기 함수
function birdFlying() {
    if (!isJump) {
        let bird = $("#bird");
        let birdPos = bird.offset();

        let box = $("#question-box");
        let boxPos = box.offset();
        let boxHeight = box.outerHeight(true);

        // 새가 question-box에 닿으면 올라가는 동작을 중단한다.
        if (birdPos.top - birdFlyingSpeed <= boxPos.top + boxHeight) {
            return;
        }

        isJump = true;
        bird.css("top", birdPos.top - birdFlyingSpeed + "px");

        setTimeout(() => {
            isJump = false;
        }, 100);
    }
}
// birdFlying 이벤트 리스너
$(window).keydown(function (event) {
    if (event.code === "Space") {
        birdFlying();
        event.preventDefault();
    }
});

// 새 떨어지기 함수
export function birdFalling() {
    const currentPosition = parseInt($("#bird").css("top"));
    const windowHeight = $(window).height();
    const birdHeight = $("#bird").height();

    if (currentPosition + birdHeight < windowHeight) {
        $("#bird").css("top", currentPosition + birdFallingSpeed + "px");
    }
}

// 원숭이와 새 충돌 감지 함수
export function detectCollision() {
    let bird = $('#bird');
    let monkeys = $('img[id^="monkey"]');

    let birdOffset = bird.offset();
    let birdHeight = bird.outerHeight(true);
    let birdWidth = bird.outerWidth(true);
    let birdTop = birdOffset.top;
    let birdBottom = birdTop + birdHeight;
    let birdLeft = birdOffset.left;
    let birdRight = birdLeft + birdWidth;

    monkeys.each(function () {
        let monkey = $(this);
        let monkeyOffset = monkey.offset();
        let monkeyHeight = monkey.outerHeight(true);
        let monkeyWidth = monkey.outerWidth(true);
        let monkeyTop = monkeyOffset.top;
        let monkeyBottom = monkeyTop + monkeyHeight;
        let monkeyLeft = monkeyOffset.left;
        let monkeyRight = monkeyLeft + monkeyWidth;

        if (birdLeft < monkeyRight && birdRight > monkeyLeft && birdTop < monkeyBottom && birdBottom > monkeyTop) {
            let monkeyId = monkey.attr('id');
            let chosenAnswer = monkeyId[monkeyId.length - 1];
            monkey.parent().parent().remove(); // 원숭이 제거
            quiz(chosenAnswer);
        }
    });
}