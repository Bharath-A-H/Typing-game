// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [sentence, setSentence] = useState('');
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(30); // 30 seconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentence();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isGameOver) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsGameOver(true);
      calculatePerformance();
    }
  }, [timer, isGameOver]);

  useEffect(() => {
    calculatePerformance();
  }, [input]);

  const fetchSentence = async () => {
    try {
      const response = await fetch('http://localhost:5001/sentence');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSentence(data.sentence);
    } catch (error) {
      setError('Failed to fetch sentence');
      console.error('Fetch error:', error);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);

    const mistakeCount = newValue.split('').filter((char, index) => char !== sentence[index]).length;
    setMistakes(mistakeCount);

    if (newValue === sentence) {
      setIsGameOver(true);
      calculatePerformance();
    }
  };

  const calculatePerformance = () => {
    const wordsTyped = input.split(' ').length;
    const charactersTyped = input.length;
    const minutes = (30 - timer) / 30;
    setWpm((wordsTyped / minutes).toFixed());
    setCpm((charactersTyped / minutes).toFixed());
  };

  const handleNewGame = () => {
    setInput('');
    setTimer(30);
    setIsGameOver(false);
    setError(null);
    setWpm(0);
    setCpm(0);
    setMistakes(0);
    fetchSentence();
  };

  const highlightText = () => {
    const inputWords = input.split(' ');
    const sentenceWords = sentence.split(' ');
    return inputWords.map((word, index) => {
      if (word !== sentenceWords[index]) {
        return `<span class="highlight">${word}</span>`;
      }
      return word;
    }).join(' ');
  };

  return (
    <div className="app">
      <h1>Sentence Typing Game</h1>
      <div className="game">
        <div className="timer">Time Left: {timer}s</div>
        {error ? <p className="error">{error}</p> : <p className="sentence">{sentence}</p>}
        {isGameOver ? (
          <div dangerouslySetInnerHTML={{ __html: highlightText() }} className="highlighted-text"></div>
        ) : (
          <textarea
            className="input"
            value={input}
            onChange={handleInputChange}
            disabled={isGameOver}
            placeholder="Start typing..."
          />
        )}
      </div>
      <div className="performance">
        <p>WPM: {wpm}</p>
        <p>CPM: {cpm}</p>
        <p>Mistakes: {mistakes}</p>
      </div>
      {isGameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button className="new-game-button" onClick={handleNewGame}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default App;
