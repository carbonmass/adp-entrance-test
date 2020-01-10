document.addEventListener("DOMContentLoaded", function() {
  const start = document.querySelector(".start");
  const quizQuestions = document.querySelector(".quiz-questions");
  const scoreContainer = document.querySelector(".score");
  let scoreDigit = document.querySelector(".score-digit");
  let score = 0;

  const json = quiz =>
    fetch("./src/quiz.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        let quizData = data.quizzes[quiz];
        appendQuestions(quizData, quiz);
      });

  const gameStart = () => {
    mutliChoice("Quiz 1");
    mutliChoice("Quiz 2");
    score = 0;
    selectQuiz();
  };

  const startQuiz = quiz => {
    scoreContainer.classList.toggle("active");
    json(quiz);
  };

  const selectQuiz = () => {
    document.querySelectorAll(".quiz-btn").forEach(element => {
      element.addEventListener("click", event => {
        if (element.classList.contains("quiz-one")) {
          startQuiz(0);
        } else {
          startQuiz(1);
        }
      });
    });
  };

  const mutliChoice = (answer, answerBox) => {
    let button = document.createElement("button");
    let answerText = document.createElement("h3");
    quizQuestions.appendChild(button);
    button.appendChild(answerText);
    button.classList.add(answerBox);
    answerText.innerHTML = answer;
  };

  const appendQuestions = (quizSelection, quiz, questionNumber = 0) => {
    quizQuestions.innerHTML = "";
    let array = quizSelection.questions;

    if (questionNumber < array.length) {
      let answers = array[questionNumber].answers;
      start.innerHTML = array[questionNumber].question;

      for (i = 0; i < answers.length; i++) {
        mutliChoice(answers[i].content, +i);
      }

      document.querySelectorAll("button").forEach(element => {
        element.addEventListener(
          "click",
          () => {
            let submitAnswer = element.classList.value.slice(
              element.classList.value.length - 1,
              element.classList.value.length
            );

            if (answers[submitAnswer].value === true) {
              element.style.backgroundColor = "lightseagreen";
              score++;
              let nexQuestion = questionNumber + 1;
              scoreDigit.innerHTML = score;

              setTimeout(() => {
                appendQuestions(quizSelection, quiz, nexQuestion);
              }, 2000);
            } else {
              element.style.backgroundColor = "red";
              let nexQuestion = questionNumber + 1;
              scoreDigit.innerHTML = score;
              setTimeout(() => {
                appendQuestions(quizSelection, quiz, nexQuestion);
              }, 2000);
            }
          },
          { once: true }
        );
      });
    } else {
      scoreContainer.classList.remove("active");
      let finalScore = Math.ceil((score / array.length) * 100);
      if (finalScore > 50) {
        start.innerHTML =
          "Your Score: " +
          finalScore +
          "%" +
          '<br><span style="color:green">Pass</span>';
      } else {
        start.innerHTML =
          "Your Score: " +
          finalScore +
          "%" +
          '<br><span style="color:red">Fail</span>';
      }
    }
  };
  
  selectQuiz();
});
