import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function StartScreen({ highestScore, setQuizCompleted }) {
  const navigate = useNavigate();

  const startQuiz = () => {
    setQuizCompleted(false);
    navigate("/quiz");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-200 to-blue-500 p-4">
      <h1 className="mb-6 text-center text-5xl font-extrabold text-white drop-shadow-lg">
        Welcome to the Quiz Game!
      </h1>
      <button
        className="mb-6 rounded-lg bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={startQuiz}
      >
        Start Quiz
      </button>
      {highestScore > 0 && (
        <p className="">Your highest score is {highestScore}</p>
      )}
      <p className="text-center text-lg italic text-white">
        Built as an assignment for Milaap
      </p>
    </div>
  );
}

StartScreen.propTypes = {
  highestScore: PropTypes.number.isRequired,
  setQuizCompleted: PropTypes.func.isRequired,
};

export default StartScreen;
