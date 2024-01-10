import { pauseGame, resumeGame } from "./ingame.js";

let canQuiz = true;
let monkeyElement;
let monkeyMovingSpeed = 3000;

let currentQuizType = "";
let currentQuizIdx = 0;
let quizInterval = 2000;

let score = 0;
let health = 3;

let questionList = [
    "기숙사 세탁실은 ?층에 있다.",
    "경기드림타워 구내식당의 중식 시간은 11:30~13:00이다.",
    "기숙사의 출입 금지 시간은 새벽 02시 ~ 05시이다.",
    "크래프톤 정글의 기본 출석시간은 월~금 10:00 ~ 23:00이다.",
    "외출 가능 횟수는 일 ?회다."]
let answerList = ["2", "O", "O", "X", "1"]
let answerShow = [
    "기숙사 세탁실은 2층에 있다.",
    "경기드림타워 구내식당의 중식 시간은 11:30~13:00이다.",
    "기숙사의 출입 금지 시간은 새벽 02시 ~ 05시이다.",
    "크래프톤 정글의 기본 출석시간은 월~토 10:00 ~ 23:00이다.",
    "외출 가능 횟수는 일 1회다."]
let questionType = ["number", "OX", "OX", "OX", "number"]

let monkeys_number = `
<div class="absolute grid grid-cols-1 gap-4 right-0 top-1/3 content-start" style="left: 80%">
    <div>
        <img id="monkey1" src="../static/monkey.png" alt="Monkey" class="size-24">
    </div>
    <div>
        <img id="monkey2" src="../static/monkey.png" alt="Monkey" class="size-24">
    </div>
    <div>
        <img id="monkey3" src="../static/monkey.png" alt="Monkey" class="size-24">
    </div>
    <div>
        <img id="monkey4" src="../static/monkey.png" alt="Monkey" class="size-24">
    </div>
</div>
`;

let monkeys_ox = `
<div class="absolute flex flex-col gap-20 top-1/4" style="left: 80%">
    <div>
        <img id="monkeyO" src="../static/monkey.png" alt="Monkey" class="size-48">
    </div>
    <div>
        <img id="monkeyX" src="../static/monkey.png" alt="Monkey" class="size-48">
    </div>
</div>
`;


// 문제 생성 및 원숭이 생성
export function quizGenerate() {
    if (!canQuiz) {
        return;
    }
    canQuiz = false;
    let question = questionList[currentQuizIdx];
    currentQuizType = questionType[currentQuizIdx];
    $("#question").text(question);

    if (currentQuizType === "OX") {
        monkeyElement = $(monkeys_ox);
    }
    else {
        monkeyElement = $(monkeys_number);
    }
    $("body").append(monkeyElement);

    monkeyElement.animate({
        left: "-=100%"
    }, monkeyMovingSpeed, function () {
    });

}

// 체력 감소 함수
function hpDown() {
    health--;
    console.log(health);
    let healthContainer = $("#hp-box");
    healthContainer.empty();

    for (let i = 0; i < health; i++) {
        let heartImg = `<img id="hp" src="../static/heart.png" alt="HP" class="size-20">`;
        healthContainer.append(heartImg);
    }
    if (health <= 0) {
        pauseGame();
        Swal.fire({
            title: "Game Over..",
            text: "다시 도전해보세요!",
            icon: "question", 
            confirmButtonText: "확인",
        }).then((result) => {
            if (result.isConfirmed) {
                resumeGame();
                // Redirect to main page
            }
        });
    }
}

// 점수 획득 함수
function scoreUp() {
    score++;
    $("#score").text(score);
}

// 정답 알람창 팝업 함수
function alert_answer(isCorrect) {
    pauseGame();
    let _answer = answerShow[currentQuizIdx];
    let _title;
    let _icon;

    if (isCorrect) {
        _title = "정답!";
        _icon = "success";
    }
    else {
        _title = "오답!";
        _icon = "error";
    }
    Swal.fire({
        title: _title,
        text: _answer,
        icon: _icon,
        confirmButtonText: "확인",
    }).then((result) => {
        if (result.isConfirmed) {
            resumeGame();
            setTimeout(() => {
                canQuiz = true;
                currentQuizIdx = (currentQuizIdx + 1) % questionList.length;
            }, quizInterval);
        }
    });
}

// 퀴즈 정답 유무 확인 함수
export function quiz(chosenAnswer) {
    if (chosenAnswer !== answerList[currentQuizIdx]) {
        alert_answer(false);
        hpDown();
    }
    else {
        scoreUp();
        alert_answer(true);
    }
}