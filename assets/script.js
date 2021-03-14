var quizClock = 60;
var timerEl = $("#quizClock");
var questionsEl = $("#questions");
var resultEl = $("#result");
var introEl = $('#intro');
var startGameButtonEl = $("#startGame");
var showHighScoresEl = $("#showHighScores");
var currentQuestion = 0;
var timerInterval;

// quiz questions
var arrQuestions = [
    {
        question: "<code>var i = 56;</code><br><br>What type of variable is i?",
        answers: ["Float", "Boolean", "Number", "String"],
        correctAnswerIndex: 2
    },
    {
        question: "<code>var i = [];</code><br><br>What type of variable is i?",
        answers: ["Float", "Array", "Number", "String"],
        correctAnswerIndex: 1
    },
    {
        question: "<code>if (\"0\" == 0) then</code><br><br>The above condition evaluates as?",
        answers: ["True", "False"],
        correctAnswerIndex: 0
    },
    {
        question: "<code>if (\"0\" === 0) then</code><br><br>The above condition evaluates as?",
        answers: ["True", "False"],
        correctAnswerIndex: 1
    },
    {
        question: "Commonly used data types DO NOT include:",
        answers: ["strings", "booleans", "alerts", "functions"],
        correctAnswerIndex: 2
    },
    {
        question: "The condition in an if / else statement is enclosed within:",
        answers: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        correctAnswerIndex: 2
    },
    {
        question: "Arrays in JavaScript can be used to store:",
        answers: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        correctAnswerIndex: 3
    },
    {
        question: "String values must be enclosed within ______ when being assigned to variables.",
        answers: ["commas", "curly brackets", "quotes", "parenthesis"],
        correctAnswerIndex: 2
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: ["JavaScript", "terminal / bash", "for loops", "console.log()"],
        correctAnswerIndex: 3
    }
];

showTime();

// begin quiz code ran on Start Game / Play Again button
function playGame() {
    showHighScoresEl.attr("disabled", "true");
    startGameButtonEl.hide();
    introEl.hide();
    quizClock = 60;
    currentQuestion = 0;
    quizTimer();
    showQuestion();
}

// Display time on clock with pad for values < 10
function showTime() {
    if (quizClock <= 9)
        timerEl.text(":0" + quizClock);
    else
        timerEl.text(":" + quizClock);
}

// show the next question and increment currentQuestion index
function showQuestion() {
    resultEl.html("");
    questionsEl.html("<br>" + arrQuestions[currentQuestion].question + "<br><br>");
    for (i = 0; i < arrQuestions[currentQuestion].answers.length; i++) {
        if (i == arrQuestions[currentQuestion].correctAnswerIndex)
            questionsEl.append(`<button class="answer" data-is-correct=true>${arrQuestions[currentQuestion].answers[i]}</button><br>`);
        else
            questionsEl.append(`<button class="answer" data-is-correct=false>${arrQuestions[currentQuestion].answers[i]}</button><br>`);
    }
    currentQuestion++;
}

// check the user's answer and display result.  Dock time for incorrect answer
questionsEl.on("click", ".answer", function (event) {
    var userAnswer = $(event.target);
    userAnswer.attr("disabled", "true");
    userAnswer.siblings().attr("disabled", "true");
    if (userAnswer.data("isCorrect") == true) {
        resultEl.removeClass();
        resultEl.addClass("green")
        resultEl.html("<hr>Correct!!!");
    }
    else {
        resultEl.removeClass();
        resultEl.addClass("red")
        resultEl.html("<hr>Incorrect!!!");
        quizClock -= 10;
        showTime();
    }

    // Check for end of quiz and call appropriate function after a delay
    if (currentQuestion == arrQuestions.length)
        setTimeout(endGame, 500);
    else
        setTimeout(showQuestion, 500);
});

// setup timer and end game when/if time runs out
function quizTimer() {
    timerInterval = setInterval(function () {
        quizClock--;
        showTime();
        if (quizClock <= 0)
            endGame();
    }, 1000);
}

// End quiz and ask user for initials to store with results
function endGame() {
    showHighScoresEl.attr("disabled", "false");
    clearInterval(timerInterval);
    resultEl.html("");
    questionsEl.html(`<h2>Game Over</h2><h3>Your Score: ${quizClock}</h3>`);
    var htmlTxt = '<p>Please enter your initials <input type="text" id="initials" size=3 maxlength=3 onfocus="resultEl.html(\'\');"> <button id="saveScore" onclick="saveHighScore();">Save</button>';
    questionsEl.append(htmlTxt)
    startGameButtonEl.text("Play Again");
    startGameButtonEl.show();
}

// store results
function saveHighScore() {
    var userInitialsEl = $("#initials");
    var currentDateObj = new Date();
    var currentDate = `${currentDateObj.getMonth() + 1}/${currentDateObj.getDate()}/${currentDateObj.getFullYear()}`;
    var scoreObj = {
        "initials" : userInitialsEl.val(),
        "score" : quizClock,
        "date" : currentDate
    }

    // find the next key value on localStorage
    var arrScores = [];
    var highestKey = 1;
    while (localStorage.getItem(parseInt(highestKey)) != null) {
        console.log(localStorage.getItem(highestKey));
        highestKey++;
    }

    var scoreString = JSON.stringify(scoreObj);
    localStorage.setItem(highestKey.toString(), scoreString);

    // now that the result is stored, show score history
    showHighScores();
}

// display result history in table sorted by descending score
function showHighScores() {
    questionsEl.html("");
    resultEl.html("");
    introEl.hide();
    var arrScores = [];
    var arrScoreElement = [];
    var i = 1;
    while (localStorage.getItem(parseInt(i)) != null) {
        arrScoreElement = [i, JSON.parse(localStorage.getItem(i))];
        arrScores.push(arrScoreElement);
        i++;
    }
    arrScores.sort(function(a, b) { return b[1].score - a[1].score });
    var tableHTML = `<table>
                        <tr>
                            <th>
                                Initials
                            </th>
                            <th>
                                Score
                            </th>
                            <th>
                                Date
                            </th>
                        </tr>
                    `;
    for (var i=0; i<arrScores.length; i++) {
        tableHTML += `
                    <tr>
                        <td>
                            ${arrScores[i][1].initials}
                        </td>
                        <td>
                            ${arrScores[i][1].score}
                        </td>
                        <td>
                            ${arrScores[i][1].date}
                        </td>
                    </tr>
                    `;
    }
    tableHTML += `</table>`;
    questionsEl.append(tableHTML);
    questionsEl.append('<button onClick="clearScores();">Clear Scores</button><br><br>');
}

// clear score history from localStorage
function clearScores() {
    localStorage.clear();
    showHighScores();
}