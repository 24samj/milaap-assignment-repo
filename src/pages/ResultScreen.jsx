import { useNavigate } from "react-router-dom";
import { FaTrophy, FaRedoAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { IoMdArrowBack } from "react-icons/io";

const ResultMessage = ({ level, quizCompleted }) => {
  if (quizCompleted) return "Quiz Completed!";
  switch (level) {
    case "easy":
      return "You failed at the easy level!";
    case "medium":
      return "You failed at the medium level!";
    case "hard":
      return "You failed at the hard level!";
    default:
      return "Unknown level!";
  }
};

const ResultScreen = ({ score, onRestart, level, quizCompleted }) => {
  const navigate = useNavigate();

  const handleRestart = () => {
    onRestart();
    navigate("/");
  };

  const handleRetry = () => {
    navigate("/quiz");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white p-4 shadow-lg">
            <FaTrophy className="text-6xl text-yellow-500" />
          </div>
        </div>
        <h1 className="mb-4 text-center text-4xl font-extrabold text-gray-800">
          <ResultMessage level={level} quizCompleted={quizCompleted} />
        </h1>
        <p className="mb-6 text-2xl font-semibold text-gray-700">
          Your Score: <span className="text-blue-600">{score}</span>
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          {/*retry level button */}
          {!quizCompleted && (
            <button
              className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-xl font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleRetry}
            >
              <IoMdArrowBack className="mr-2 text-xl" />
              Retry Level
            </button>
          )}
          <button
            className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-xl font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={handleRestart}
          >
            <FaRedoAlt className="mr-2 text-xl" />
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

ResultScreen.propTypes = {
  score: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  quizCompleted: PropTypes.bool.isRequired,
};

export default ResultScreen;
