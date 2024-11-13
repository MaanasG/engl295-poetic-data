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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
