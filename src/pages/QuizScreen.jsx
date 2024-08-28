import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { shuffleArray } from "../utils/utils";

function QuizScreen({ questions, onComplete, level, setQuizCompleted }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Shuffle questions whenever the level changes
  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, [level, questions]);

  useEffect(() => {
    if (timer <= 0) {
      handleAnswerSubmit();
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const handleAnswerSubmit = (event) => {
    if (event) event.preventDefault();

    let isCorrect = false;

    if (
      currentQuestion.type === "multiple-choice" ||
      currentQuestion.type === "true-false"
    ) {
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "text-input") {
      isCorrect =
        userAnswer.toLowerCase() ===
        currentQuestion.correctAnswer.toLowerCase();
    }

    let updatedIncorrectAnswers = incorrectAnswers;

    if (isCorrect) {
      // Increment score based on current level
      let points = 0;
      if (level === "easy") points = 10;
      else if (level === "medium") points = 20;
      else if (level === "hard") points = 30;

      setScore(score + points);
      setFeedbackMessage("Correct!");
    } else {
      updatedIncorrectAnswers = incorrectAnswers + 1;
      setIncorrectAnswers(updatedIncorrectAnswers);
      setFeedbackMessage("Incorrect!");
    }

    setShowFeedback(true);
    setTimer(30); // Reset timer

    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer("");

      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log(
          "Level complete, incorrectAnswers:",
          updatedIncorrectAnswers,
        );
        // Check if the user answered at least 2 out of 3 questions incorrectly
        if (updatedIncorrectAnswers >= 2) {
          console.log("Too many incorrect answers");
          navigate("/result");
          return;
        }
        onComplete(score);
        setCurrentQuestionIndex(0);

        if (level === "hard") {
          console.log("All questions answered, moving to result screen");
          setQuizCompleted(true);
          navigate("/result");
        } else {
          // Reset incorrect answers count and move to the next level
          console.log("Resetting incorrect answers");
          setIncorrectAnswers(0);
          navigate("/quiz");
        }
      }
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 p-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {currentQuestion.question}
      </h2>
      <form
        onSubmit={(event) => handleAnswerSubmit(event)}
        className="flex w-full flex-col items-center py-8"
      >
        {currentQuestion.type === "multiple-choice" && (
          <div className="mb-4 flex w-full max-w-md flex-col">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`mb-3 flex cursor-pointer items-center rounded-lg border-2 border-gray-300 px-4 py-2 transition-all duration-150 ease-in-out ${
                  userAnswer === option
                    ? "bg-gray-100 hover:bg-gray-100"
                    : "hover:bg-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  name="answer"
                  className="hidden"
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <span className="font-semibold text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "true-false" && (
          <div className="mb-4 flex w-full max-w-md flex-col">
            {["true", "false"].map((option, index) => (
              <label
                key={index}
                className={`mb-3 flex cursor-pointer items-center rounded-lg border-2 border-gray-300 px-4 py-2 transition-all duration-150 ease-in-out ${
                  userAnswer === option
                    ? "bg-gray-100 hover:bg-gray-100"
                    : "hover:bg-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  name="answer"
                  className="hidden"
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <span className="font-semibold text-gray-700">
                  {option.toLocaleUpperCase()}
                </span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "text-input" && (
          <input
            type="text"
            className="mb-6 w-full max-w-md rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userAnswer}
            id="user-answer"
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        )}
        <button
          className="min-w-min rounded-lg bg-green-500 px-6 py-3 text-xl font-semibold text-white shadow-lg transition-all duration-150 ease-in-out hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
          type="submit"
        >
          Submit
        </button>

        <div
          className="mt-8 h-2 rounded-full"
          style={{
            width: `${timer}%`,
            transition: "all 1s linear",
            backgroundColor:
              timer >= 20 ? "green" : timer >= 10 ? "orange" : "red",
          }}
        />
      </form>
      {!showFeedback ? (
        <div className="text-xl font-semibold text-gray-800">
          Time Remaining: {timer}s
        </div>
      ) : (
        <div
          className={`text-xl font-semibold ${
            feedbackMessage === "Correct!" ? "text-green-700" : "text-red-700"
          }`}
        >
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}

QuizScreen.propTypes = {
  questions: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  setQuizCompleted: PropTypes.func.isRequired,
};

export default QuizScreen;
