const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "A picture is worth a thousand words."
];

app.get('/sentence', (req, res) => {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  res.json({ sentence: sentences[randomIndex] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
