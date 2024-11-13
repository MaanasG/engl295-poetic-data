import React, { useState } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [userDetails, setUserDetails] = useState({ college: '', hobbies: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [response, setResponse] = useState('');
  const [weights, setWeights] = useState({ career: 0, balance: 0, learning: 0 });

  // Your existing stages array remains the same
  const stages = [
    {
      quote: "The journey of a thousand lines of code begins with a single class declaration.",
      question: "You've just entered UMD. You need to choose a major. Do you...",
      options: [
        { text: "Choose Computer Science (CS). 'Competitive but useful!'", weight: { career: 10, balance: 3, learning: 5 } },
        { text: "Choose Computer Engineering (CE). 'Less saturated but more difficult'", weight: { career: 8, balance: 5, learning: 7 } }
      ]
    },
    {
      quote: "Choose a path that ignites your curiosity, for passion fuels persistence.",
      question: "You're deciding between a focus in software engineering or data science. Do you...",
      options: [
        { text: "Choose Cyber Security. 'There's a promising future in this!'", weight: { career: 8, balance: 5, learning: 7 } },
        { text: "Choose General. 'You can always find your own focus!'", weight: { career: 5, balance: 7, learning: 10 } }
      ]
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      question: "It's your first semester, and you're already behind in one of your CS courses. You woke up hungover on a Monday morning. Do you...",
      options: [
        { text: "Go to class hungover. 'Who knows how much you'll even pay attention?'", weight: { career: 3, balance: 5, learning: 7 } },
        { text: "Skip class and rejuvenate. 'You can always study at home.'", weight: { career: 2, balance: 7, learning: 4 } }
      ]
    },
    {
      quote: "Alone we can do so little; together we can debug so much.",
      question: "You meet a group of classmates who invite you to work on a side project together. Do you...",
      options: [
        { text: "Join the project and build your network. 'Extra work but great hands-on experience!'", weight: { career: 7, balance: 5, learning: 8 } },
        { text: "Focus on your own assignments and stay solo. 'Keep those grades up!'", weight: { career: 5, balance: 8, learning: 5 } }
      ]
    },
    {
      quote: "Time management is the art of prioritizing your panic.",
      question: "It's midterm season, and it's the night before two exams: CS and Math. Do you...",
      options: [
        { text: "Spend extra time studying for the CS exam. 'After all, this is your field.'", weight: { career: 8, balance: 3, learning: 9 } },
        { text: "Spend extra time studying for the Math exam. 'Might as well sharpen my skills.'", weight: { career: 4, balance: 7, learning: 5 } }
      ]
    },
    {
      quote: "The only way to do great work is to love what you learn.",
      question: "You're offered an optional course on blockchain technology. Do you...",
      options: [
        { text: "Take the course to expand your knowledge and skill set. 'The more skills the better!'", weight: { career: 6, balance: 3, learning: 10 } },
        { text: "Skip it—don't want to overburden yourself. 'The last thing you want is burnout!'", weight: { career: 4, balance: 9, learning: 3 } }
      ]
    },
    {
      quote: "Sometimes the best line of code is the one you don't write.",
      question: "You're running low on time—do you skip a lecture to finish your project? Do you...",
      options: [
        { text: "Skip the lecture and work on the project. 'You work faster at home anyways.'", weight: { career: 8, balance: 4, learning: 5 } },
        { text: "Go to the lecture and risk being behind on your project. 'What if today's lesson is crucial?'", weight: { career: 5, balance: 8, learning: 6 } }
      ]
    },
    {
      quote: "Your first job is like your first program - it doesn't have to be perfect, but it has to run.",
      question: "It's summer, and you're looking for an internship. You get two offers: a startup or a large tech company. Do you...",
      options: [
        { text: "Accept the offer at the startup. 'More hands-on experience, less pay.'", weight: { career: 6, balance: 7, learning: 8 } },
        { text: "Accept the offer at the large tech company. 'Better pay, less hands-on experience.'", weight: { career: 9, balance: 4, learning: 6 } }
      ]
    },
    {
      quote: "Honesty is the first chapter in the book of wisdom.",
      question: "You meet a recruiter at a tech event who asks if you've worked with a specific programming language. Do you...",
      options: [
        { text: "Lie and say you have experience with it. 'Whatever it takes to impress!'", weight: { career: 8, balance: 2, learning: 4 } },
        { text: "Be honest and admit you haven't worked with it yet. 'You wouldn't want to lie.'", weight: { career: 5, balance: 7, learning: 5 } }
      ]
    },
    {
      quote: "Growth and comfort do not coexist in the world of technology.",
      question: "You've landed an internship, but it's demanding. Do you...",
      options: [
        { text: "Stick with the internship, even though it's challenging. 'Hard work pays off!'", weight: { career: 9, balance: 3, learning: 5 } },
        { text: "Drop out and focus on your coursework. 'You know what's best.'", weight: { career: 4, balance: 8, learning: 7 } }
      ]
    },
    {
      quote: "Research is what I'm doing when I don't know what I'm doing.",
      question: "You receive a LinkedIn message from a former professor offering you a chance to work on a special research project. Do you...",
      options: [
        { text: "Accept the research opportunity. 'This will look great on a resume!'", weight: { career: 7, balance: 4, learning: 9 } },
        { text: "Decline to focus on other things. 'You'd rather find a job that pays.'", weight: { career: 6, balance: 8, learning: 3 } }
      ]
    },
    {
      quote: "Life is not about finding yourself. Life is about creating yourself.",
      question: "You've graduated, and it's time to choose your job. You're offered two positions:",
      options: [
        { text: "A position at a top Silicon Valley company with a high salary. 'Big league stuff! You're moving up.'", weight: { career: 10, balance: 3, learning: 6 } },
        { text: "A position at a non-profit working on tech for social good with a lower salary. 'Sounds like ethical and fulfilling work!'", weight: { career: 5, balance: 9, learning: 6 } }
      ]
    },
    {
      quote: "Sometimes the biggest step forward requires a leap of faith.",
      question: "You've been offered a job that requires you to relocate to a different city. Do you...",
      options: [
        { text: "Take the job and move. 'This is your future!'", weight: { career: 8, balance: 4, learning: 5 } },
        { text: "Decline and stay in your current city. 'Change can be scary. You love where you are!'", weight: { career: 4, balance: 8, learning: 3 } }
      ]
    },
    {
      quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      question: "Your first job requires you to work long hours, and you're feeling burned out. Do you...",
      options: [
        { text: "Push through the burnout to advance in your career. 'You'll feel worse if you're not productive!'", weight: { career: 9, balance: 2, learning: 5 } },
        { text: "Take a break and reassess your work-life balance. 'Everyone needs a break sometimes.'", weight: { career: 3, balance: 10, learning: 4 } }
      ]
    },
  ];


  const handleUserDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleStart = async () => {
    const initialPrompt = `Welcome! Let's begin your journey in Computer Science.`;
    setResponse(initialPrompt);
    setCurrentStage(1);
  };

  const handleOptionClick = (option) => {
    const newWeights = {
      career: weights.career + (option.weight.career || 0),
      balance: weights.balance + (option.weight.balance || 0),
      learning: weights.learning + (option.weight.learning || 0),
    };
    setWeights(newWeights);
    setCurrentStage(currentStage + 1);
  };

  const calculateEnding = () => {
    const maxWeight = Math.max(weights.career, weights.balance, weights.learning);
    if (maxWeight === weights.career) return "Corporate Overachiever Ending";
    if (maxWeight === weights.balance) return "Passion-Driven Innovator Ending";
    return "Mid-Career Crisis Ending";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-xl"
        >
          {currentStage === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                  onChange={handleUserDetailsChange}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  name="hobbies"
                  placeholder="Your Hobbies"
                  onChange={handleUserDetailsChange}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleStart}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-200"
                >
                  Begin Your Journey
                </button>
              </div>
            </motion.div>
          ) : currentStage <= stages.length ? (
            <motion.div
              key={currentStage}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-6"
            >
              <h2 className="text-3xl font-bold text-blue-400">
                Your Journey Ends Here
              </h2>
              <p className="text-xl">{calculateEnding()}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;