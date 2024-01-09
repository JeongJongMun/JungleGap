let delta = 50;
let isJump = false;
let birdFlyingSpeed = 50;
let birdFallingSpeed = 5;
let monkeyMovingSpeed = 3000;
let quizInterval = 1000;
let health = 3;
let currentQuizType = "";
let currentQuizIdx = 0;
let canQuiz = true;
let score = 0;

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
    "외출 가능 횟수는 일 1회다."
]
let questionType = ["number", "OX", "OX", "OX", "number"]


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

// 새 떨어지기 함수
function birdFalling() {
    const currentPosition = parseInt($("#bird").css("top"));
    const windowHeight = $(window).height();
    const birdHeight = $("#bird").height();

    if (currentPosition + birdHeight < windowHeight) {
        $("#bird").css("top", currentPosition + birdFallingSpeed + "px");
    }
}

// 체력 갱신 함수
function updateHealth(health) {
    let healthContainer = $("#hp-box");
    healthContainer.empty();

    for (let i = 0; i < health; i++) {
        let heartImg = `<img id="hp" src="../static/heart.png" alt="HP" class="size-20">`;
        healthContainer.append(heartImg);
    }
}

// 문제 생성
function quizGenerate() {
    canQuiz = false;
    let question = questionList[currentQuizIdx];
    currentQuizType = questionType[currentQuizIdx];
    currentQuizIdx = (currentQuizIdx + 1) % questionList.length;
    $("#question").text(question);
    monkeySpawn();
}

// 원숭이 생성 함수
function monkeySpawn() {
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
            <img id="monkeyO" src="../static/monkey.png" alt="Monkey" class="size-40">
        </div>
        <div>
            <img id="monkeyX" src="../static/monkey.png" alt="Monkey" class="size-40">
        </div>
    </div>
    `;

    let monkeyElement;
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
        setTimeout(() => {
            canQuiz = true;
        }, quizInterval)
    });

}

// 원숭이와 새 충돌 감지 함수
function detectCollision() {
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

            if (chosenAnswer !== answerList[currentQuizIdx - 1]) {
                health--; // 체력 감소
                updateHealth(health); // 체력 갱신
                if (health <= 0) {
                    // alert("Game Over");
                    // location.href = "/";
                }
                $("#wrong").css("visibility", "visible");
                $("#correct").css("visibility", "hidden");
                let answer = answerShow[currentQuizIdx - 1];
                $("#answer-show-wrong").text(answer);
            }
            else {
                score++; // 점수 증가
                $("#score").text(score);
                $("#correct").css("visibility", "visible");
                $("#wrong").css("visibility", "hidden");
                let answer = answerShow[currentQuizIdx - 1];
                $("#answer-show-correct").text(answer);
            }


            monkey.parent().parent().remove(); // 원숭이 무리 제거
        }
    });
}


$(window).keydown(function (event) {
    if (event.code === "Space") {
        birdFlying();
        event.preventDefault();
    }
});

function MainLoop() {
    birdFalling();
    detectCollision();
    if (canQuiz) {
        quizGenerate();
        canQuiz = false;
    }
}
$(document).ready(setInterval(MainLoop, delta));