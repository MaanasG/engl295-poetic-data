const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Original 14 Stages
const originalStages = [
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
    quote: "I remember my first semester—I showed up hungover one day and thought I could wing it. Let's just say, I didn't know 'CS' also stood for 'Constant Struggle.' - Andrew L.",
    question: "It's your first semester, and you're already behind in one of your CS courses. You woke up hungover on a Monday morning. Do you...",
    options: [
      { text: "Go to class hungover. 'Who knows how much you'll even pay attention?'", weight: { career: 3, balance: 5, learning: 7 } },
      { text: "Skip class and rejuvenate. 'You can always study at home.'", weight: { career: 2, balance: 7, learning: 4 } }
    ],
    imagePath: "public/gpa.jpg"
  },
  {
    quote: "Back in the day, I spent every weekend debugging with classmates. We called it ‘bonding through bugs.’ - Devinder S.",
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
    quote: "In my first few years, I said 'yes' to every extra course. By year three, I was as burnt out as my laptop’s motherboard. - Kavita R.",
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
    quote: "I lied once in an interview about knowing a language. Three weeks in, my manager realized I didn’t. Most stressful month of my life. - Paul N.",
    question: "You meet a recruiter at a tech event who asks if you've worked with a specific programming language. Do you...",
    options: [
      { text: "Lie and say you have experience with it. 'Whatever it takes to impress!'", weight: { career: 8, balance: 2, learning: 4 } },
      { text: "Be honest and admit you haven't worked with it yet.", weight: { career: 5, balance: 7, learning: 5 } }
    ]
  },
  {
    quote: "Growth and comfort do not coexist in the world of technology.",
    question: "You've landed an internship, but it's demanding. Do you...",
    options: [
      { text: "Stick with the internship, even though it's challenging. 'Hard work pays off!'", weight: { career: 9, balance: 3, learning: 5 } },
      { text: "Drop out and focus on your coursework. 'You know what's best.'", weight: { career: 4, balance: 8, learning: 7 } }
    ],
    imagePath: "public/skill.png"
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
  }
];

// Route to handle the OpenAI API request
app.post('/api/generate', async (req, res) => {
  const { prompt, userDetails } = req.body;

  try {
    const messages = [
      {
        role: 'system',
        content: `
          You are a supportive, knowledgeable guide for a computer science major.
          Personalize the story elements based on the user’s background to make the journey relatable.
          Use the following information to tailor your responses:
          College: ${userDetails.college}
          Hobbies: ${userDetails.hobbies}.
        `,
      },
      { role: 'user', content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error.message);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// New route to generate personalized stages
app.post('/api/generateStages', async (req, res) => {
  const { userDetails } = req.body;

  try {
    const prompt = `
    Modify the following 14 stages for a Computer Science journey to incorporate the user's college and hobbies. Ensure that the weights for career, balance, and learning are adjusted to make each outcome equally likely over the course of all stages.

    **User Details:**
    - College: ${userDetails.college}
    - Hobbies: ${userDetails.hobbies}

    **Original Stages:**
    ${JSON.stringify(originalStages, null, 2)}

    **Instructions:**
    1. For each stage, personalize the 'question' and 'options.text' to include the user's college and hobbies.
    2. Adjust the 'weight' values for 'career', 'balance', and 'learning' in each option to balance the outcomes.
    3. Ensure all 14 stages are retained and only modified for personalization.
    4. **Output the modified stages as a JSON array. Do not include any additional text or formatting outside of the JSON array.**

    **Example Output Format:**
    [
        {
            "quote": "Your personalized quote here.",
            "question": "Your personalized question here.",
            "options": [
                {
                    "text": "Option 1 text.",
                    "weight": {
                        "career": 5,
                        "balance": 5,
                        "learning": 5
                    }
                },
                {
                    "text": "Option 2 text.",
                    "weight": {
                        "career": 5,
                        "balance": 5,
                        "learning": 5
                    }
                }
            ]
        }
        // ... remaining stages
    ]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates interactive story stages.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    let modifiedStagesText = response.choices[0].message.content.trim();

    // Remove Markdown code block syntax if present
    if (modifiedStagesText.startsWith('```') && modifiedStagesText.endsWith('```')) {
      const firstNewline = modifiedStagesText.indexOf('\n');
      if (firstNewline !== -1) {
        modifiedStagesText = modifiedStagesText.substring(firstNewline + 1, modifiedStagesText.length - 3).trim();
      }
    }

    // Attempt to parse the response
    let modifiedStages;
    try {
      modifiedStages = JSON.parse(modifiedStagesText);
    } catch (parseError) {
      console.error('Error parsing modified stages:', parseError);
      console.error('Response from OpenAI:', modifiedStagesText);
      return res.status(500).json({ error: 'Failed to parse modified stages. Ensure OpenAI returned valid JSON.' });
    }

    res.json({ stages: modifiedStages });
  } catch (error) {
    console.error('Error generating stages:', error.message);
    res.status(500).json({ error: 'Error generating stages' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
