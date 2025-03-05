'use client';

import React, { useState, useRef } from 'react';

// -----------------------------------
// TYPE DEFINITIONS
// -----------------------------------

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  start: { row: number; col: number };
}

interface GameState {
  currentGame: 'crossword' | 'connectFour';
  crossword: {
    gridState: string[][];
    activeDirection: 'across' | 'down';
    highlightedWord: { number: number; direction: 'across' | 'down' } | null;
  };
  connectFour: {
    selectedWords: string[];
    completedCategories: { category: string; words: string[] }[];
    remainingWords: { word: string; category: string }[];
  };
}

// -----------------------------------
// MAIN COMPONENT
// -----------------------------------

export default function CrosswordAndConnectFour() {
  // -----------------------------------
  // DATA DEFINITIONS
  // -----------------------------------

  // Crossword data: 15x15 square grid from The Guardian Quick Crossword #17106
  const crosswordData = {
    grid: [
      "###############",
      "#####DEFEAT####",
      "####ELEGANT####",
      "###SPACECRAFT##",
      "##RESTAURANT###",
      "#ABSENTMINDED##",
      "##TROUSERS#####",
      "#INSIGHT#######",
      "#####INFANTS###",
      "####CURATOR####",
      "###PUNCTUATION#",
      "##ENCOUNTER####",
      "#INSPECTOR#####",
      "#####TARIFF####",
      "###############",
    ],
    clues: {
      across: [
        { number: 1, clue: "Overcome", answer: "DEFEAT", start: { row: 1, col: 5 } },
        { number: 2, clue: "Stylish", answer: "ELEGANT", start: { row: 2, col: 4 } },
        { number: 3, clue: "Vehicle for an extraterrestrial trip", answer: "SPACECRAFT", start: { row: 3, col: 3 } },
        { number: 4, clue: "Eatery", answer: "RESTAURANT", start: { row: 4, col: 2 } },
        { number: 5, clue: "Inattentive", answer: "ABSENTMINDED", start: { row: 5, col: 1 } },
        { number: 6, clue: "Legwear", answer: "TROUSERS", start: { row: 6, col: 2 } },
        { number: 7, clue: "Perception", answer: "INSIGHT", start: { row: 7, col: 1 } },
        { number: 8, clue: "Young children", answer: "INFANTS", start: { row: 9, col: 5 } },
        { number: 9, clue: "Museum official", answer: "CURATOR", start: { row: 10, col: 4 } },
        { number: 10, clue: "Marks in a sentence", answer: "PUNCTUATION", start: { row: 11, col: 3 } },
        { number: 11, clue: "Meeting", answer: "ENCOUNTER", start: { row: 12, col: 2 } },
        { number: 12, clue: "Policeman", answer: "INSPECTOR", start: { row: 13, col: 1 } },
        { number: 13, clue: "Tax", answer: "TARIFF", start: { row: 14, col: 5 } },
      ],
      down: [
        { number: 1, clue: "More secure", answer: "SAFER", start: { row: 1, col: 7 } },
        { number: 2, clue: "Bird of prey", answer: "EAGLE", start: { row: 1, col: 8 } },
        { number: 3, clue: "Prepare for publication", answer: "EDIT", start: { row: 2, col: 6 } },
        { number: 4, clue: "Wanderer", answer: "NOMAD", start: { row: 2, col: 11 } },
        { number: 5, clue: "Charming", answer: "CUTE", start: { row: 4, col: 5 } },
        { number: 6, clue: "Dispute", answer: "ARGUE", start: { row: 5, col: 3 } },
        { number: 7, clue: "Unlawful", answer: "ILLEGAL", start: { row: 5, col: 9 } },
        { number: 8, clue: "Warning", answer: "NOTICE", start: { row: 8, col: 2 } },
      ],
    },
  };

  // Connect Four data: Categories and words for the game
  const connectFourData = {
    categories: [
      { name: "Science Fields", words: ["Physics", "Chemistry", "Biology", "Astronomy"] },
      { name: "Tools", words: ["Microscope", "Telescope", "Calculator", "Computer"] },
      { name: "Methods", words: ["Observe", "Measure", "Analyze", "Predict"] },
      { name: "Equipment", words: ["Beaker", "Pipette", "Burner", "Flask"] },
    ],
  };

  // -----------------------------------
  // STATE INITIALIZATION
  // -----------------------------------

  // Initialize crossword grid with empty cells (except black cells)
  const initialGridState = crosswordData.grid.map(row =>
    row.split('').map(char => (char === '#' ? '#' : ''))
  );

  // Main game state: Tracks current game, crossword progress, and Connect Four progress
  const [gameState, setGameState] = useState<GameState>({
    currentGame: 'crossword', // Default game shown on load
    crossword: {
      gridState: initialGridState, // User-input grid state
      activeDirection: 'across', // Current typing direction
      highlightedWord: null, // Currently highlighted word (number and direction)
    },
    connectFour: {
      selectedWords: [], // Words currently selected by user
      completedCategories: [], // Successfully matched categories
      remainingWords: connectFourData.categories.flatMap(category =>
        category.words.map(word => ({ word, category: category.name }))
      ), // Words still available to match
    },
  });

  // Ref to store input element references for focusing
  const cellRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  // -----------------------------------
  // CROSSWORD HELPER FUNCTIONS
  // -----------------------------------

  // Finds across and down clues intersecting a given cell
  const findCluesForCell = (row: number, col: number) => {
    const acrossClue = crosswordData.clues.across.find(clue => {
      const start = clue.start;
      return row === start.row && col >= start.col && col < start.col + clue.answer.length;
    });

    const downClue = crosswordData.clues.down.find(clue => {
      const start = clue.start;
      return col === start.col && row >= start.row && row < start.row + clue.answer.length;
    });

    return { acrossClue, downClue };
  };

  // Handles cell click: Sets active direction and highlights word
  const handleCellClick = (row: number, col: number, clickCount: number) => {
    const { acrossClue, downClue } = findCluesForCell(row, col);
    if (!acrossClue && !downClue) return; // Ignore clicks on non-word cells

    // Single click = across, double click = down (if both exist)
    const direction = (clickCount % 2 === 1 || !downClue) ? 'across' : 'down';
    const clue = direction === 'across' ? acrossClue : downClue;

    setGameState(prev => ({
      ...prev,
      crossword: {
        ...prev.crossword,
        activeDirection: direction,
        highlightedWord: { number: clue!.number, direction },
      },
    }));

    // Focus the clicked cell
    cellRefs.current[`${row}-${col}`]?.focus();
  };

  // Handles user input in crossword cells
  const handleCrosswordInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const value = e.target.value.toUpperCase(); // Convert input to uppercase
    const { acrossClue, downClue } = findCluesForCell(row, col);
    const currentClue = gameState.crossword.activeDirection === 'across' ? acrossClue : downClue;

    if (!currentClue) return; // Ignore if no clue exists

    const start = currentClue.start;
    const index = gameState.crossword.activeDirection === 'across' ? col - start.col : row - start.row;
    const correctChar = currentClue.answer[index]; // Correct letter for this position

    // Update grid state with new input (replaces existing letter)
    const newGridState = [...gameState.crossword.gridState.map(row => [...row])];
    newGridState[row][col] = value || '';

    setGameState(prev => ({
      ...prev,
      crossword: { ...prev.crossword, gridState: newGridState },
    }));

    // Move to next cell if input is correct
    if (value === correctChar) {
      const nextCell = findNextCell(row, col);
      if (nextCell) nextCell.focus();
    }
  };

  // Finds the next cell in the current word for auto-advance
  const findNextCell = (row: number, col: number) => {
    const { acrossClue, downClue } = findCluesForCell(row, col);
    const currentClue = gameState.crossword.activeDirection === 'across' ? acrossClue : downClue;
    if (!currentClue) return null;

    const start = currentClue.start;
    const length = currentClue.answer.length;
    let nextRow = row;
    let nextCol = col;

    if (gameState.crossword.activeDirection === 'across') {
      nextCol++;
      if (nextCol >= start.col + length) return null; // End of word
    } else {
      nextRow++;
      if (nextRow >= start.row + length) return null; // End of word
    }

    return cellRefs.current[`${nextRow}-${nextCol}`];
  };

  // -----------------------------------
  // CROSSWORD RENDERING FUNCTIONS
  // -----------------------------------

  // Renders the crossword grid
  const renderCrosswordGrid = () => {
    return crosswordData.grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.split('').map((char, colIndex) => {
          const isBlackCell = char === '#';
          const { acrossClue, downClue } = findCluesForCell(rowIndex, colIndex);
          const isHighlighted = gameState.crossword.highlightedWord && 
            ((gameState.crossword.highlightedWord.direction === 'across' && acrossClue?.number === gameState.crossword.highlightedWord.number) ||
             (gameState.crossword.highlightedWord.direction === 'down' && downClue?.number === gameState.crossword.highlightedWord.number));
          const currentChar = gameState.crossword.gridState[rowIndex][colIndex];
          const correctChar = !isBlackCell ? (
            acrossClue && acrossClue.start.row === rowIndex && colIndex >= acrossClue.start.col && colIndex < acrossClue.start.col + acrossClue.answer.length
              ? acrossClue.answer[colIndex - acrossClue.start.col]
              : downClue && downClue.start.col === colIndex && rowIndex >= downClue.start.row && rowIndex < downClue.start.row + downClue.answer.length
              ? downClue.answer[rowIndex - downClue.start.row]
              : ''
          ) : '#';
          const isWrong = !isBlackCell && currentChar !== correctChar && currentChar !== '';
          const isCorrectLocked = !isBlackCell && currentChar === correctChar;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`relative w-10 h-10 border border-black ${
                isBlackCell ? 'bg-black' : 'bg-white'
              } ${isHighlighted ? 'bg-yellow-200' : ''} ${isWrong ? 'bg-red-200' : ''}`}
              onClick={() => !isBlackCell && handleCellClick(rowIndex, colIndex, 1)}
              onDoubleClick={() => !isBlackCell && handleCellClick(rowIndex, colIndex, 2)}
            >
              {!isBlackCell && (
                <>
                  {/* Display clue number at the start of a word */}
                  {(acrossClue?.start.row === rowIndex && acrossClue?.start.col === colIndex) ||
                  (downClue?.start.row === rowIndex && downClue?.start.col === colIndex) ? (
                    <span className="absolute top-0 left-0 text-[10px] text-gray-600">
                      {acrossClue?.number || downClue?.number}
                    </span>
                  ) : null}
                  <input
                    type="text"
                    maxLength={1}
                    value={currentChar === '#' ? '' : currentChar}
                    className="w-full h-full text-center uppercase border-none outline-none bg-transparent"
                    ref={el => void (el && (cellRefs.current[`${rowIndex}-${colIndex}`] = el))}
                    onChange={(e) => !isCorrectLocked && handleCrosswordInput(e, rowIndex, colIndex)}
                    disabled={isCorrectLocked} // Lock correct letters
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  // Renders the crossword clues in two columns
  const renderClues = () => {
    return (
      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
        <div>
          <h3 className="font-bold">Across</h3>
          {crosswordData.clues.across.map(clue => (
            <div
              key={`across-${clue.number}`}
              className={`p-1 ${
                gameState.crossword.highlightedWord?.number === clue.number &&
                gameState.crossword.highlightedWord?.direction === 'across'
                  ? 'bg-yellow-200'
                  : ''
              }`}
            >
              {clue.number}. {clue.clue}
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold">Down</h3>
          {crosswordData.clues.down.map(clue => (
            <div
              key={`down-${clue.number}`}
              className={`p-1 ${
                gameState.crossword.highlightedWord?.number === clue.number &&
                gameState.crossword.highlightedWord?.direction === 'down'
                  ? 'bg-yellow-200'
                  : ''
              }`}
            >
              {clue.number}. {clue.clue}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -----------------------------------
  // CONNECT FOUR HELPER FUNCTIONS
  // -----------------------------------

  // Handles word selection in Connect Four
  const handleWordSelection = (word: string) => {
    const newSelected = gameState.connectFour.selectedWords.includes(word)
      ? gameState.connectFour.selectedWords.filter(w => w !== word) // Deselect if already selected
      : [...gameState.connectFour.selectedWords, word]; // Add to selection

    if (newSelected.length === 4) { // Check when 4 words are selected
      const category = gameState.connectFour.remainingWords.find(w => w.word === newSelected[0])?.category;
      const isCorrect = newSelected.every(w => 
        gameState.connectFour.remainingWords.find(rw => rw.word === w)?.category === category
      );

      if (isCorrect) { // If all 4 words match a category
        setGameState(prev => ({
          ...prev,
          connectFour: {
            selectedWords: [],
            completedCategories: [...prev.connectFour.completedCategories, { category: category!, words: newSelected }],
            remainingWords: prev.connectFour.remainingWords.filter(w => !newSelected.includes(w.word)),
          },
        }));
      } else { // If selection is incorrect
        const correctWords = connectFourData.categories.find(c => c.name === category)?.words || [];
        const offByOne = newSelected.filter(w => !correctWords.includes(w)).length === 1;
        if (offByOne) alert("You are one off!");
        setGameState(prev => ({ ...prev, connectFour: { ...prev.connectFour, selectedWords: [] } }));
      }
    } else {
      setGameState(prev => ({ ...prev, connectFour: { ...prev.connectFour, selectedWords: newSelected } }));
    }
  };

  // -----------------------------------
  // CONNECT FOUR RENDERING FUNCTION
  // -----------------------------------

  // Renders the Connect Four game
  const renderConnectFourGrid = () => {
    return (
      <div>
        {/* Display completed categories */}
        {gameState.connectFour.completedCategories.map(({ category, words }, index) => (
          <div key={index} className="flex justify-between mb-2">
            <div className="flex">
              {words.map(word => (
                <span key={word} className="px-2">{word}</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{category}</span>
          </div>
        ))}
        {/* Display remaining words in a 4x4 grid */}
        <div className="grid grid-cols-4 gap-0">
          {gameState.connectFour.remainingWords.map(({ word }) => (
            <div
              key={word}
              className={`p-2 text-center border border-black cursor-pointer ${
                gameState.connectFour.selectedWords.includes(word) ? 'bg-yellow-200' : 'bg-white'
              }`}
              onClick={() => handleWordSelection(word)}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -----------------------------------
  // MAIN RENDER
  // -----------------------------------

  return (
    <div className="bg-white min-h-screen p-2">
      {/* Navigation Bar */}
      <div className="flex mb-4">
        <button
          className={`flex-1 p-2 ${gameState.currentGame === 'crossword' ? 'bg-blue-200' : 'bg-gray-100'} border border-black`}
          onClick={() => setGameState(prev => ({ ...prev, currentGame: 'crossword' }))}
        >
          Crossword
        </button>
        <button
          className={`flex-1 p-2 ${gameState.currentGame === 'connectFour' ? 'bg-blue-200' : 'bg-gray-100'} border border-black`}
          onClick={() => setGameState(prev => ({ ...prev, currentGame: 'connectFour' }))}
        >
          Connect Four
        </button>
      </div>

      {/* Game Content */}
      {gameState.currentGame === 'crossword' ? (
        <div className="overflow-x-auto">
          {renderCrosswordGrid()}
          {renderClues()}
        </div>
      ) : (
        renderConnectFourGrid()
      )}
    </div>
  );
}