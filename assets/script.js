var quizClock = 60;
var timerEl = $("#quizClock");
var questionsEl = $("#questions");
var resultEl = $("#result");
var startGameButtonEl = $("#startGame");
var currentQuestion = 0;
var timerInterval;
var arrQuestions = [
    {
        question : "<code>var i = 56;</code><br><br>What type of variable is i?",
        answers : ["Float", "Boolean", "Number", "String"],
        correctAnswerIndex : 2
    },
    {
        question : "<code>var i = [];</code><br><br>What type of variable is i?",
        answers : ["Float", "Array", "Number", "String"],
        correctAnswerIndex : 1
    },
    {
        question : "<code>if (\"0\" == 0) then</code><br><br>The above condition evaluates as?",
        answers : ["True", "False"],
        correctAnswerIndex : 0
    },
    {
        question : "<code>if (\"0\" === 0) then</code><br><br>The above condition evaluates as?",
        answers : ["True", "False"],
        correctAnswerIndex : 1
    }
];

showTime();

function playGame() {
    startGameButtonEl.hide();
    quizClock = 60;
    quizTimer();
    currentQuestion = 0;
    showQuestion(currentQuestion);
}

function showTime() {
    if (quizClock <= 9)
        timerEl.text(":0" + quizClock);
    else
        timerEl.text(":" + quizClock);
}

function showQuestion(questionIndex) {
    questionsEl.html(arrQuestions[questionIndex].question + "<br><br>");
    for (i=0; i<arrQuestions[questionIndex].answers.length; i++) {
        if (i == arrQuestions[questionIndex].correctAnswerIndex)
            questionsEl.append(`<button class="answer" data-is-correct=true>${arrQuestions[questionIndex].answers[i]}</button><br>`);
        else
            questionsEl.append(`<button class="answer" data-is-correct=false>${arrQuestions[questionIndex].answers[i]}</button><br>`);
    }
}

questionsEl.on("click", ".answer", function(event) {
    var userAnswer = $(event.target);
    userAnswer.attr("disabled", "true");
    userAnswer.siblings().attr("disabled", "true");
    if (userAnswer.data("isCorrect") == true) {
        resultEl.html("<hr>Correct!!!");
    }
    else {
        resultEl.html("<hr>Incorrect!!!")
        quizClock -= 10;
        showTime();
    }

    currentQuestion++;

    if (currentQuestion == arrQuestions.length)
        endGame();
    else
        showQuestion(currentQuestion);
});

function quizTimer() {
    timerInterval = setInterval(function() {
        quizClock--;
        showTime();
        if (quizClock <= 0)
           endGame();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    questionsEl.html(`<h1>Game Over</h1><h2>Your Score: ${quizClock}`);
    startGameButtonEl.text("Replay");
    startGameButtonEl.show();
}