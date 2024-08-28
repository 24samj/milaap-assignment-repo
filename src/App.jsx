import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import StartScreen from "./pages/StartScreen";
import ResultScreen from "./pages/ResultScreen";
import QuizScreen from "./pages/QuizScreen";
import questionsData from "./constants/questions.json";

function App() {
  const [level, setLevel] = useState("easy");
  const [totalScore, setTotalScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleLevelCompletion = (score) => {
    setTotalScore(totalScore + score);
    if (level === "easy") {
      setLevel("medium");
    } else if (level === "medium") {
      setLevel("hard");
    }
  };

  // store the score in local storage if it is higher than the previous score
  useEffect(() => {
    if (totalScore > localStorage.getItem("highestScore")) {
      localStorage.setItem("highestScore", totalScore);
    }

    if (localStorage.getItem("highestScore")) {
      setHighestScore(parseInt(localStorage.getItem("highestScore")));
    }
  }, [totalScore]);

  const restartQuiz = () => {
    setLevel("easy");
    setTotalScore(0);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <StartScreen
          highestScore={highestScore}
          setQuizCompleted={setQuizCompleted}
        />
      ),
    },
    {
      path: "/quiz",
      element: (
        <QuizScreen
          questions={questionsData[level]}
          onComplete={handleLevelCompletion}
          level={level}
          setQuizCompleted={setQuizCompleted}
        />
      ),
    },
    {
      path: "/result",
      element: (
        <ResultScreen
          score={totalScore}
          onRestart={restartQuiz}
          level={level}
          quizCompleted={quizCompleted}
        />
      ),
    },
    {
      path: "/*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
