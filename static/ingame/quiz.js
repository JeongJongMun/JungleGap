import { pauseGame, resumeGame } from "./ingame.js";

let canQuiz = true;
let monkeyElement;
let monkeyMovingSpeed = 5000;

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
    "외출 가능 횟수는 일 ?회다.",
    "크래프톤 정글의 비주얼 담당은 백승현 코치님이다.",
    "경기대 내부의 학식당의 개수는?",
    "기숙사 공용 냉장고는 4층에 있다."]
let answerList = ["2", "O", "O", "X", "1", "X", "4", "X"]
let answerShow = [
    "기숙사 세탁실은 2층에 있다.",
    "경기드림타워 구내식당의 중식 시간은 11:30~13:00이다.",
    "기숙사의 출입 금지 시간은 새벽 02시 ~ 05시이다.",
    "크래프톤 정글의 기본 출석시간은 월~토 10:00 ~ 23:00이다.",
    "외출 가능 횟수는 일 1회다.",
    "크래프톤 정글의 비주얼 담당은 김현수 코치님이다.",
    "경기대 내부의 학식당의 개수는 4개다.",
    "기숙사 공용 냉장고는 2층에 있다."]
let questionType = ["number", "OX", "OX", "OX", "number", "OX", "number", "OX"]

let monkeys_number = `
<div class="absolute grid grid-cols-1 gap-4 right-0 bottom-0 h-4/5 content-start" style="left: 80%">
    <div class="overflow-auto">
        <img id="monkey1" src="../static/monkey1.png" alt="Monkey" class="h-3/4">
    </div>
    <div class="overflow-auto">
        <img id="monkey2" src="../static/monkey2.png" alt="Monkey" class="h-3/4">
    </div>
    <div class="overflow-auto">
        <img id="monkey3" src="../static/monkey3.png" alt="Monkey" class="h-3/4">
    </div>
    <div class="overflow-auto">
        <img id="monkey4" src="../static/monkey4.png" alt="Monkey" class="h-3/4">
    </div>
</div>
`;

let monkeys_ox = `
<div class="absolute grid grid-cols-1 gap-20 right-0 h-4/5 content-end" style="left: 80%; bottom:10%;">
    <div class="overflow-auto">
        <img id="monkeyO" src="../static/monkeyO.png" alt="Monkey" class="">
    </div>
    <div class="overflow-auto">
        <img id="monkeyX" src="../static/monkeyX.png" alt="Monkey" class="">
    </div>
</div>
`;

// 게임 종료 알림 함수
function GameOverAlert() {
    Swal.fire({
        title: "게임 종료!",
        text: "다시 도전해보세요!",
        icon: "question",
        confirmButtonText: "재시작",
        showDenyButton: true,
        denyButtonText: "메인으로"
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
        else if (result.isDenied) {
            window.location.href = '/';
        }
    });
}

// 문제 생성 및 원숭이 생성
export function quizGenerate() {
    if (!canQuiz) {
        return;
    }
    if (currentQuizIdx > questionList.length - 1) {
        GameOverAlert();
        canQuiz = false;
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

// DB에 스코어 저장 함수
function scoreSave() {
    let data = {
        score_give: score,
    }
    $.ajax({
        type: "POST",
        url: "/api/score",
        data: data,
        success: function (response) {
            console.log(response);
        }
    });
}

// 체력 감소 함수
function hpDown() {
    health--;
    let healthContainer = $("#hp-box");
    healthContainer.empty();

    for (let i = 0; i < health; i++) {
        let heartImg = `<img id="hp" src="../static/heart.png" alt="HP" class="size-20">`;
        healthContainer.append(heartImg);
    }
    if (health <= 0) {
        pauseGame();
        GameOverAlert();
        resumeGame();
    }
}

// 점수 획득 함수
function scoreUp() {
    score++;
    $("#score").text(score);
    scoreSave();
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
                currentQuizIdx++;
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