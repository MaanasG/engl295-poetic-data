import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function App() {
  const [userDetails, setUserDetails] = useState({ college: '', hobbies: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [weights, setWeights] = useState({ career: 0, balance: 0, learning: 0 });
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const images = {
    3: 'gpa.jpg', // Load image paths directly on frontend
    8: 'skill.png',
  };

  // Mapping of endings to their descriptions
  const endings = {
    "Corporate Overachiever Ending": `You’re working at a top tech company, making a six-figure salary, but you’re constantly stressed and overworked. You’ve reached the top of your career, but you feel burned out and disconnected from personal passions. The journey was fast and lucrative, but you sacrificed a lot in terms of personal fulfillment.`,
    
    "Passion-Driven Innovator Ending": `You’re leading a tech start-up focused on social impact, living a balanced lifestyle, and working with an amazing team. The salary is decent but not astronomical, and you’re constantly learning new things. While it’s not the most financially rewarding path, you’re truly happy with your career and the difference you’re making in the world.`,
    
    "Mid-Career Crisis Ending": `After a few years of working at a high-paying corporate job, you’ve hit a plateau. You’re starting to question whether the financial success was worth the sacrifices made along the way. You’re considering a major life change or perhaps returning to school for a new challenge.`
  };

  const handleUserDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleStart = async () => {
    if (!userDetails.college.trim() || !userDetails.hobbies.trim()) {
      setError('Please fill in both your college and hobbies.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/generateStages', { userDetails });
      setStages(res.data.stages);
      setCurrentStage(1);
    } catch (err) {
      console.error('Error fetching stages:', err);
      setError('Failed to generate your journey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    if (currentStage === 9 && option.text.toLowerCase().includes("lie")){  // Career-defining choice in Stage 9
      throw new Error("The journey ends here due to an irreversible choice.");  // Redirect to 404 if they choose "Drop out"
    } else {
      const newWeights = {
        career: weights.career + (option.weight.career || 0),
        balance: weights.balance + (option.weight.balance || 0),
        learning: weights.learning + (option.weight.learning || 0),
      };
      setWeights(newWeights);
      setCurrentStage(currentStage + 1);
    }
  };

  const calculateEnding = () => {
    const { career, balance, learning } = weights;
    if (career > balance && career > learning) {
      return { title: "Corporate Overachiever Ending", description: endings["Corporate Overachiever Ending"] };
    }
    if (balance > career && balance > learning) {
      return { title: "Passion-Driven Innovator Ending", description: endings["Passion-Driven Innovator Ending"] };
    }
    return { title: "Mid-Career Crisis Ending", description: endings["Mid-Career Crisis Ending"] };
  };

  const restartJourney = () => {
    setCurrentStage(0);
    setWeights({ career: 0, balance: 0, learning: 0 });
    setStages([]);
    setUserDetails({ college: '', hobbies: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl"
          >
            {currentStage === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
                  Welcome to Your CS Journey
                </h1>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="college"
                    placeholder="Your College"
                    value={userDetails.college}
                    onChange={handleUserDetailsChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="hobbies"
                    placeholder="Your Hobbies"
                    value={userDetails.hobbies}
                    onChange={handleUserDetailsChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-200 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Generating...' : 'Begin Your Journey'}
                  </button>
                </div>
              </motion.div>
            ) : currentStage <= stages.length ? (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <p className="text-gray-400 italic text-center mb-4">
                  "{stages[currentStage - 1].quote}"
                </p>
                <h2 className="text-2xl font-semibold text-center mb-8">
                  {stages[currentStage - 1].question}
                </h2>
                {images[currentStage] && (
                  <img
                    src={images[currentStage]}
                    alt="Stage illustration"
                    className="w-full mb-4"
                  />
                )}
                <div className="space-y-4">
                  {stages[currentStage - 1].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded text-left transition-colors duration-200 border border-gray-600 hover:border-blue-400"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              (() => {
                const ending = calculateEnding();
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                  >
                    <h2 className="text-3xl font-bold text-blue-400">
                      {ending.title}
                    </h2>
                    <p className="text-xl">{ending.description}</p>
                    <p className="mt-4">
                      <strong>Summary:</strong><br />
                      Career: {weights.career}<br />
                      Balance: {weights.balance}<br />
                      Learning: {weights.learning}
                    </p>
                    <button
                      onClick={restartJourney}
                      className="mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Restart Journey
                    </button>
                  </motion.div>
                );
              })()
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
