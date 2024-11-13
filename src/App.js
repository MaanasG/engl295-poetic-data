// App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userDetails, setUserDetails] = useState({ college: '', hobbies: '' });
  const [currentStage, setCurrentStage] = useState(0);
  const [response, setResponse] = useState('');
  const [weights, setWeights] = useState({ career: 0, balance: 0, learning: 0 });

  const stages = [
    {
      question: "You've just entered UMD. You need to choose a major. Do you...",
      options: [
        { text: "Choose Computer Science (CS). 'Competitive but useful!'", weight: { career: 10, balance: 3, learning: 5 } },
        { text: "Choose Computer Engineering (CE). 'Less saturated but more difficult'", weight: { career: 8, balance: 5, learning: 7 } }
      ]
    },
    {
      question: "You’re deciding between a focus in software engineering or data science. Do you...",
      options: [
        { text: "Choose Cyber Security. 'There’s a promising future in this!'", weight: { career: 8, balance: 5, learning: 7 } },
        { text: "Choose General. 'You can always find your own focus!'", weight: { career: 5, balance: 7, learning: 10 } }
      ]
    },
    {
      question: "It’s your first semester, and you're already behind in one of your CS courses. You woke up hungover on a Monday morning. Do you...",
      options: [
        { text: "Go to class hungover. 'Who knows how much you'll even pay attention?'", weight: { career: 3, balance: 5, learning: 7 } },
        { text: "Skip class and rejuvenate. 'You can always study at home.'", weight: { career: 2, balance: 7, learning: 4 } }
      ]
    },
    {
      question: "You meet a group of classmates who invite you to work on a side project together. Do you...",
      options: [
        { text: "Join the project and build your network. 'Extra work but great hands-on experience!'", weight: { career: 7, balance: 5, learning: 8 } },
        { text: "Focus on your own assignments and stay solo. 'Keep those grades up!'", weight: { career: 5, balance: 8, learning: 5 } }
      ]
    },
    {
      question: "It’s midterm season, and it’s the night before two exams: CS and Math. Do you...",
      options: [
        { text: "Spend extra time studying for the CS exam. 'After all, this is your field.'", weight: { career: 8, balance: 3, learning: 9 } },
        { text: "Spend extra time studying for the Math exam. 'Might as well sharpen my skills.'", weight: { career: 4, balance: 7, learning: 5 } }
      ]
    },
    {
      question: "You’re offered an optional course on blockchain technology. Do you...",
      options: [
        { text: "Take the course to expand your knowledge and skill set. 'The more skills the better!'", weight: { career: 6, balance: 3, learning: 10 } },
        { text: "Skip it—don’t want to overburden yourself. 'The last thing you want is burnout!'", weight: { career: 4, balance: 9, learning: 3 } }
      ]
    },
    {
      question: "You’re running low on time—do you skip a lecture to finish your project? Do you...",
      options: [
        { text: "Skip the lecture and work on the project. 'You work faster at home anyways.'", weight: { career: 8, balance: 4, learning: 5 } },
        { text: "Go to the lecture and risk being behind on your project. 'What if today's lesson is crucial?'", weight: { career: 5, balance: 8, learning: 6 } }
      ]
    },
    {
      question: "It’s summer, and you’re looking for an internship. You get two offers: a startup or a large tech company. Do you...",
      options: [
        { text: "Accept the offer at the startup. 'More hands-on experience, less pay.'", weight: { career: 6, balance: 7, learning: 8 } },
        { text: "Accept the offer at the large tech company. 'Better pay, less hands-on experience.'", weight: { career: 9, balance: 4, learning: 6 } }
      ]
    },
    {
      question: "You meet a recruiter at a tech event who asks if you’ve worked with a specific programming language. Do you...",
      options: [
        { text: "Lie and say you have experience with it. 'Whatever it takes to impress!'", weight: { career: 8, balance: 2, learning: 4 } },
        { text: "Be honest and admit you haven’t worked with it yet. 'You wouldn’t want to lie.'", weight: { career: 5, balance: 7, learning: 5 } }
      ]
    },
    {
      question: "You’ve landed an internship, but it’s demanding. Do you...",
      options: [
        { text: "Stick with the internship, even though it’s challenging. 'Hard work pays off!'", weight: { career: 9, balance: 3, learning: 5 } },
        { text: "Drop out and focus on your coursework. 'You know what’s best.'", weight: { career: 4, balance: 8, learning: 7 } }
      ]
    },
    {
      question: "You receive a LinkedIn message from a former professor offering you a chance to work on a special research project. Do you...",
      options: [
        { text: "Accept the research opportunity. 'This will look great on a resume!'", weight: { career: 7, balance: 4, learning: 9 } },
        { text: "Decline to focus on other things. 'You'd rather find a job that pays.'", weight: { career: 6, balance: 8, learning: 3 } }
      ]
    },
    {
      question: "You’ve graduated, and it’s time to choose your job. You’re offered two positions:",
      options: [
        { text: "A position at a top Silicon Valley company with a high salary. 'Big league stuff! You’re moving up.'", weight: { career: 10, balance: 3, learning: 6 } },
        { text: "A position at a non-profit working on tech for social good with a lower salary. 'Sounds like ethical and fulfilling work!'", weight: { career: 5, balance: 9, learning: 6 } }
      ]
    },
    {
      question: "You’ve been offered a job that requires you to relocate to a different city. Do you...",
      options: [
        { text: "Take the job and move. 'This is your future!'", weight: { career: 8, balance: 4, learning: 5 } },
        { text: "Decline and stay in your current city. 'Change can be scary. You love where you are!'", weight: { career: 4, balance: 8, learning: 3 } }
      ]
    },
    {
      question: "Your first job requires you to work long hours, and you're feeling burned out. Do you...",
      options: [
        { text: "Push through the burnout to advance in your career. 'You’ll feel worse if you're not productive!'", weight: { career: 9, balance: 2, learning: 5 } },
        { text: "Take a break and reassess your work-life balance. 'Everyone needs a break sometimes.'", weight: { career: 3, balance: 10, learning: 4 } }
      ]
    },
  ];

  const handleUserDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleStart = async () => {
    const initialPrompt = `Welcome! Let's begin your journey in Computer Science.`;
    const response = await axios.post('http://localhost:5001/api/generate', {
      prompt: initialPrompt,
      userDetails,
    });
    setResponse(response.data.response);
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
    <div>
      {currentStage === 0 ? (
        <div>
          <h1>Welcome! Tell us a bit about yourself.</h1>
          <input
            type="text"
            name="college"
            placeholder="College"
            onChange={handleUserDetailsChange}
          />
          <input
            type="text"
            name="hobbies"
            placeholder="Hobbies"
            onChange={handleUserDetailsChange}
          />
          <button onClick={handleStart}>Start</button>
        </div>
      ) : currentStage <= stages.length ? (
        <div>
          <h2>{stages[currentStage - 1].question}</h2>
          {stages[currentStage - 1].options.map((option, idx) => (
            <button key={idx} onClick={() => handleOptionClick(option)}>
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h2>Your Journey Ends Here:</h2>
          <p>{calculateEnding()}</p>
        </div>
      )}
    </div>
  );
}

export default App;
