'use client';

import React, { useState, useRef, useEffect } from 'react';

function shuffleArray(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// -----------------------------------
// TYPE DEFINITIONS
// -----------------------------------

interface CrosswordClue {
  number: number;
  clue: string;
  start: { row: number; col: number };
}

interface GameState {
  currentGame: 'crossword' | 'connectFour';
  crossword: {
    gridState: string[][];
    activeDirection: 'Хоризонтални' | 'Вертикални'; // Updated type
    highlightedWord: { number: number; direction: 'Хоризонтални' | 'Вертикални' } | null; // Updated type
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

  // Crossword data: 19x21 grid
  const crosswordData = {
    grid: [
      "####################",
      "#ГЕОМЕТРИЯ#ЕЛЕКТРОН#",
      "#А##Е#Р####Н##Л###И#",
      "#БРОД#И#МЕЗОСФЕРА#Р#",
      "#О###ЕКО###Т##Т###В#",
      "#РИД#К####А#Ф#КРЕДА#",
      "#О##ФОТОСИНТЕЗА###Н#",
      "#Н###С####Д#с##БИРА#",
      "#ЕРУ#И#ПЕКИН#Д#О####",
      "###П#С#А#Р#Р#И#РИЯД#",
      "##ПЛАТОН#И#А#О#Б##И#",
      "#Д#А#Е##СЛАВЯНКА##В#",
      "#И#ХИМЕРА#Т##И##А#А#",
      "#С###А#У##Л##СТИВЪН#",
      "#ПЕСО#АБУДАБИ#Е#А###",
      "#Е#А###И##С###ООН#Т#",
      "#РЕТОРИКА##А##Р#Г#О#",
      "#С#И#Е#О#Я#Т#ДЕКАРТ#",
      "#И#Р###НЕВРОН#М#Р#Е#",
      "#ЯМАЙКА##А#Н#КАРДАМ#",
      "####################",
    ],
    clues: {
      across: [
        { number: 1, clue: "Дял от математиката", start: { row: 1, col: 1 } },
        { number: 2, clue: "Eлементарна частица", start: { row: 1, col: 11 } },
        { number: 3, clue: "Mясто за преминаване през река", start: { row: 3, col: 1 } },
        { number: 4, clue: "Третият слой на атмосферата", start: { row: 3, col: 8 } },
        { number: 5, clue: "Kонцепция за опазване на околната среда", start: { row: 4, col: 5 } },
        { number: 6, clue: "Земно възвишение", start: { row: 5, col: 1 } },
        { number: 7, clue: "Третият период от мезозойската ера", start: { row: 5, col: 14 } },
        { number: 8, clue: "Процес на хранене на зелените растения", start: { row: 6, col: 4 } },
        { number: 9, clue: "Най-консумираната алкохолна напитка в света", start: { row: 7, col: 15 } },
        { number: 10, clue: "Създателят на вселената в митологията на Толкин", start: { row: 8, col: 1 } },
        { number: 11, clue: "Зимни олимпийски игри през 2022", start: { row: 8, col: 7 } },
        { number: 12, clue: "Град, който носи името на зелени пространства, но всъщност се намира в пустиня", start: { row: 9, col: 15 } },
        { number: 13, clue: "Древногръцки философ", start: { row: 10, col: 2 } },
        { number: 14, clue: "Планина чието бивше име е алиботуш ", start: { row: 11, col: 8 } },
        { number: 15, clue: "Митично създание, комбиниращо черти от различни животински видове", start: { row: 12, col: 3 } },
        { number: 16, clue: "Първото име писател известен със своите романи на ужаса", start: { row: 13, col: 13 } },
        { number: 17, clue: "Парична единица популярна в Южна Америка ", start: { row: 14, col: 1 } },
        { number: 18, clue: "Най-голямто емирство в ОАЕ", start: { row: 14, col: 6 } },
        { number: 19, clue: "Международна организация", start: { row: 15, col: 14 } },
        { number: 20, clue: "Изкуството да убеждаваш с думи", start: { row: 16, col: 1 } },
        { number: 21, clue: "Френски философ, математик и физик", start: { row: 17, col: 13 } },
        { number: 22, clue: "Клетка, която предава сигнали в тялото", start: { row: 18, col: 7 } },
        { number: 23, clue: "Остров, родина на някои от най-бързите бегачи в света", start: { row: 19, col: 1 } },
        { number: 24, clue: "Български хан", start: { row: 19, col: 13 } },
      ],
      down: [
        { number: 25, clue: "Столица на ботсвана ", start: { row: 1, col: 1 } },
        { number: 26, clue: "Метал с атомен номер 29", start: { row: 1, col: 4 } },
        { number: 27, clue: "Фокус", start: { row: 1, col: 6 } },
        { number: 28, clue: "Нощен обитател с характерна маска", start: { row: 1, col: 11 } },
        { number: 29, clue: "Основна единица на живия организъм ", start: { row: 1, col: 14 } },
        { number: 30, clue: "Американска гръндж група", start: { row: 1, col: 18 } },
        { number: 31, clue: "Общество от организми и тяхната среда", start: { row: 4, col: 5 } },
        { number: 32, clue: "Най-дългата планинска верига", start: { row: 5, col: 10 } },
        { number: 33, clue: "Град в мароко или вид шапка", start: { row: 5, col: 12 } },
        { number: 34, clue: "Спорт в който българия има най много олимпийски медали", start: { row: 7, col: 15 } },
        { number: 35, clue: "Чувство на внезапен страх", start: { row: 8, col: 3 } },
        { number: 36, clue: "Древен бог на природата, горите и пастирите", start: { row: 8, col: 7 } },
        { number: 37, clue: "Храна за китове", start: { row: 8, col: 9 } },
        { number: 38, clue: "Характер и поведение на човек", start: { row: 8, col: 11 } },
        { number: 39, clue: "Бога на виното и веселието", start: { row: 8, col: 13 } },
        { number: 40, clue: "Висш съвет на османската администрация", start: { row: 9, col: 18 } },
        { number: 41, clue: "Разлагане на светлината на спектър от цветове", start: { row: 11, col: 1 } },
        { number: 42, clue: "Код на кола от столицата", start: { row: 11, col: 8 } },
        { number: 43, clue: "Сборник от карти", start: { row: 11, col: 10 } },
        { number: 44, clue: "Река в италия ", start: { row: 12, col: 7 } },
        { number: 45, clue: "Войскова част", start: { row: 12, col: 16 } },
        { number: 46, clue: "Доказано логическо твърдение", start: { row: 13, col: 14 } },
        { number: 47, clue: "Вид хумор", start: { row: 14, col: 3 } },
        { number: 48, clue: "Почитано животно, герб на древно племе", start: { row: 15, col: 18 } },
        { number: 49, clue: "Музикална нота", start: { row: 16, col: 5 } },
        { number: 50, clue: "Планински полуостров в Гърция", start: { row: 16, col: 11 } },
        { number: 51, clue: "Най-гъсто населеният остров в света", start: { row: 17, col: 9 } },
      ],
    },
  };

  // Connect Four data: Categories and words for the game
  const connectFourData = {
    categories: [
      { name: "Предмети", words: ["география", "биология", "музика", "немски"] },
      { name: "Бойни изкуства", words: ["джудо", "бокс", "карате", "самбо"] },
      { name: "Български стихотворения", words: ["История", "борба", "вяра", "молитва"] },
      { name: "Често бъркани думи", words: ["инженер", "одеяло", "детски", "не знам"] },
    ],
  };

  // -----------------------------------
  // STATE INITIALIZATION
  // -----------------------------------

  const initialGridState = crosswordData.grid.map(row =>
    row.split('').map(char => (char === '#' ? '#' : ''))
  );

  const initialGameState: GameState = {
    currentGame: 'crossword',
    crossword: {
      gridState: initialGridState,
      activeDirection: 'Хоризонтални', // Changed from 'across'
      highlightedWord: null,
    },
    connectFour: {
      selectedWords: [],
      completedCategories: [],
      remainingWords: shuffleArray(
        connectFourData.categories.flatMap(category =>
          category.words.map(word => ({ word, category: category.name }))
        )
      ),
    },
  };

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentClue, setCurrentClue] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [isPreviousPuzzlesOpen, setIsPreviousPuzzlesOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const cellRefs = useRef<{
    [key: string]: HTMLInputElement;
  } & {
    lastClicked?: string;
    lastClickTime?: number;
  }>({});

  useEffect(() => {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      setGameState(JSON.parse(savedGameState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState]);

  // -----------------------------------
  // CROSSWORD HELPER FUNCTIONS
  // -----------------------------------

  const findCluesForCell = (row: number, col: number) => {
    const acrossClue = crosswordData.clues.across.find(clue => {
      const start = clue.start;
      if (row !== start.row || col < start.col) return false;
      let length = 0;
      for (let i = start.col; i < crosswordData.grid[row].length && crosswordData.grid[row][i] !== '#'; i++) {
        length++;
      }
      return col < start.col + length;
    });

    const downClue = crosswordData.clues.down.find(clue => {
      const start = clue.start;
      if (col !== start.col || row < start.row) return false;
      let length = 0;
      for (let i = start.row; i < crosswordData.grid.length && crosswordData.grid[i][col] !== '#'; i++) {
        length++;
      }
      return row < start.row + length;
    });

    return { acrossClue, downClue };
  };

  const handleCellClick = (row: number, col: number) => {
    const { acrossClue, downClue } = findCluesForCell(row, col);
    if (!acrossClue && !downClue) return;

    const currentCell = `${row}-${col}`;
    const isSameCell = cellRefs.current.lastClicked === currentCell;
    const now = Date.now();
    const lastClickTime = cellRefs.current.lastClickTime || 0;

    if (now - lastClickTime < 300) return;

    cellRefs.current.lastClicked = currentCell;
    cellRefs.current.lastClickTime = now;

    let direction: 'Хоризонтални' | 'Вертикални'; // Updated type
    if (!isSameCell) {
      direction = acrossClue ? 'Хоризонтални' : 'Вертикални';
    } else {
      direction = gameState.crossword.activeDirection === 'Хоризонтални' ? 'Вертикални' : 'Хоризонтални';
    }

    const clue = direction === 'Хоризонтални' ? acrossClue : downClue;
    if (!clue) return;

    setGameState(prev => ({
      ...prev,
      crossword: {
        ...prev.crossword,
        activeDirection: direction,
        highlightedWord: { number: clue.number, direction },
      },
    }));

    setCurrentClue(`${clue.number}. ${clue.clue} (${direction === 'Хоризонтални' ? 'Хоризонтални' : 'Вертикални'})`);

    cellRefs.current[`${row}-${col}`]?.focus();
  };

  const handleCrosswordInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const value = e.target.value.toUpperCase();
    const { acrossClue, downClue } = findCluesForCell(row, col);
    const currentClue = gameState.crossword.activeDirection === 'Хоризонтални' ? acrossClue : downClue;

    if (!currentClue) return;

    const correctChar = crosswordData.grid[row][col];
    const newGridState = gameState.crossword.gridState.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : r
    );

    setGameState(prev => ({
      ...prev,
      crossword: { ...prev.crossword, gridState: newGridState },
    }));

    e.target.value = value || '';
    const nextCell = findNextCell(row, col);
    if (nextCell) nextCell.focus();
  };

  const findNextCell = (row: number, col: number) => {
    const { acrossClue, downClue } = findCluesForCell(row, col);
    const currentClue = gameState.crossword.activeDirection === 'Хоризонтални' ? acrossClue : downClue;
    if (!currentClue) return null;

    const start = currentClue.start;
    let length = 0;

    if (gameState.crossword.activeDirection === 'Хоризонтални') {
      for (let i = start.col; i < crosswordData.grid[row].length && crosswordData.grid[row][i] !== '#'; i++) {
        length++;
      }
    } else {
      for (let i = start.row; i < crosswordData.grid.length && crosswordData.grid[i][col] !== '#'; i++) {
        length++;
      }
    }

    let nextRow = row;
    let nextCol = col;

    if (gameState.crossword.activeDirection === 'Хоризонтални') {
      nextCol++;
      if (nextCol >= start.col + length) return null;
    } else {
      nextRow++;
      if (nextRow >= start.row + length) return null;
    }

    return cellRefs.current[`${nextRow}-${nextCol}`];
  };

  // -----------------------------------
  // CROSSWORD RENDERING FUNCTIONS
  // -----------------------------------

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const renderCrosswordGrid = () => {
    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, row: number, col: number) => {
      e.preventDefault();
      const isBlackCell = crosswordData.grid[row][col] === '#';
      if (!isBlackCell) handleCellClick(row, col);
    };

    return (
      <div className="flex justify-center">
        <div className="w-full">
          {crosswordData.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.split('').map((char, colIndex) => {
                const isBlackCell = char === '#';
                const { acrossClue, downClue } = findCluesForCell(rowIndex, colIndex);
                const isHighlighted = gameState.crossword.highlightedWord && 
                  ((gameState.crossword.highlightedWord.direction === 'Хоризонтални' && acrossClue?.number === gameState.crossword.highlightedWord.number) ||
                   (gameState.crossword.highlightedWord.direction === 'Вертикални' && downClue?.number === gameState.crossword.highlightedWord.number));
                const currentChar = gameState.crossword.gridState[rowIndex][colIndex];
                const correctChar = crosswordData.grid[rowIndex][colIndex];
                const isWrong = hintsEnabled && !isBlackCell && currentChar && currentChar !== correctChar && currentChar !== '';
                const isCorrectLocked = hintsEnabled && !isBlackCell && currentChar === correctChar && currentChar !== '';

                const clueNumber = 
                  (acrossClue?.start.row === rowIndex && acrossClue?.start.col === colIndex) ? acrossClue.number :
                  (downClue?.start.row === rowIndex && downClue?.start.col === colIndex) ? downClue.number :
                  null;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative w-[4.7619vw] h-[4.7619vw] border border-black flex items-center justify-center ${
                      isBlackCell ? 'bg-black' : isWrong ? 'bg-red-200' : isHighlighted ? 'bg-yellow-200' : 'bg-white'
                    }`}
                    {...(isTouchDevice
                      ? { onTouchStart: (e) => handleInteraction(e, rowIndex, colIndex) }
                      : { onClick: (e) => handleInteraction(e, rowIndex, colIndex) })}
                  >
                    {!isBlackCell && (
                      <>
                        {clueNumber !== null && (
                          <span className="absolute top-0 left-0 text-[min(0.6vw,12px)] text-gray-600">
                            {clueNumber}
                          </span>
                        )}
                        <input
                          type="text"
                          maxLength={1}
                          value={currentChar === '#' ? '' : currentChar}
                          className="w-full h-full text-center uppercase border-none outline-none bg-transparent text-[min(3.5vw,42px)] font-bold caret-transparent"
                          ref={el => {
                            if (el) cellRefs.current[`${rowIndex}-${colIndex}`] = el;
                          }}
                          onChange={(e) => !isCorrectLocked && handleCrosswordInput(e, rowIndex, colIndex)}
                          onKeyDown={(e) => !isCorrectLocked && e.currentTarget.select()}
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          disabled={isCorrectLocked}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClues = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-base mt-4">
        <div>
          <h3 className="font-bold">Хоризонтални</h3> {/* Changed from "Across" */}
          {crosswordData.clues.across.map(clue => (
            <div
              key={`across-${clue.number}`}
              className={`p-1 ${
                gameState.crossword.highlightedWord?.number === clue.number &&
                gameState.crossword.highlightedWord?.direction === 'Хоризонтални'
                  ? 'bg-yellow-200'
                  : ''
              }`}
            >
              {clue.number}. {clue.clue}
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold">Вертикални</h3> {/* Changed from "Down" */}
          {crosswordData.clues.down.map(clue => (
            <div
              key={`down-${clue.number}`}
              className={`p-1 ${
                gameState.crossword.highlightedWord?.number === clue.number &&
                gameState.crossword.highlightedWord?.direction === 'Вертикални'
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
  // CONNECT FOUR RENDERING FUNCTION
  // -----------------------------------

  const renderConnectFourGrid = () => {
    const handleWordSelection = (word: string) => {
      const newSelected = gameState.connectFour.selectedWords.includes(word)
        ? gameState.connectFour.selectedWords.filter(w => w !== word)
        : [...gameState.connectFour.selectedWords, word];

      if (newSelected.length === 4) {
        const category = gameState.connectFour.remainingWords.find(w => w.word === newSelected[0])?.category;
        const isCorrect = newSelected.every(w => 
          gameState.connectFour.remainingWords.find(rw => rw.word === w)?.category === category
        );

        if (isCorrect) {
          setGameState(prev => ({
            ...prev,
            connectFour: {
              selectedWords: [],
              completedCategories: [...prev.connectFour.completedCategories, { category: category!, words: newSelected }],
              remainingWords: prev.connectFour.remainingWords.filter(w => !newSelected.includes(w.word)),
            },
          }));
        } else {
          const categoryCounts: { [key: string]: number } = {};
          newSelected.forEach(w => {
            const cat = gameState.connectFour.remainingWords.find(rw => rw.word === w)?.category || 'unknown';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
          const maxCategory = Object.entries(categoryCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
          if (categoryCounts[maxCategory] === 3) {
            setPopupMessage("Само една дума те дели от верния отговор!");
            setTimeout(() => setPopupMessage(null), 2500);
          }
          setGameState(prev => ({ ...prev, connectFour: { ...prev.connectFour, selectedWords: [] } }));
        }
      } else {
        setGameState(prev => ({ ...prev, connectFour: { ...prev.connectFour, selectedWords: newSelected } }));
      }
    };

    const handleShuffle = () => {
      setGameState(prev => ({
        ...prev,
        connectFour: {
          ...prev.connectFour,
          remainingWords: shuffleArray(prev.connectFour.remainingWords),
        },
      }));
    };

    return (
      <div className="relative max-w-md mx-auto font-sans">
        {/* Completed Categories */}
        {gameState.connectFour.completedCategories.map(({ category, words }, index) => (
          <div
            key={index}
            className={`mb-4 p-4 text-black font-bold text-center rounded-lg ${
              index === 0 ? 'bg-[#F9DF6D]' : index === 1 ? 'bg-[#A0C35A]' : index === 2 ? 'bg-[#B0C4EF]' : 'bg-[#BA81C5]'
            }`}
          >
            <div className="text-base uppercase">{category}</div>
            <div className="text-sm mt-1">{words.join(', ')}</div>
          </div>
        ))}
        {/* Remaining Words Grid */}
        {gameState.connectFour.remainingWords.length > 0 && (
          <div className="grid grid-cols-4 gap-1">
            {gameState.connectFour.remainingWords.map(({ word }) => (
              <div
                key={word}
                className={`p-3 text-center text-sm font-bold uppercase rounded-full cursor-pointer transition-colors select-none ${
                  gameState.connectFour.selectedWords.includes(word) ? 'bg-[#5A594E] text-white' : 'bg-[#EFEFE6] hover:bg-gray-200'
                }`}
                onClick={() => handleWordSelection(word)}
              >
                {word}
              </div>
            ))}
          </div>
        )}
        {/* Shuffle Button */}
        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 text-sm font-bold uppercase border border-gray-500 rounded bg-white hover:bg-gray-100 transition-colors select-none"
            onClick={handleShuffle}
          >
            разбъркай
          </button>
        </div>
        {/* Popup Message */}
        {popupMessage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 text-blue-800 p-4 rounded shadow-lg text-center font-bold">
            {popupMessage}
          </div>
        )}
      </div>
    );
  };

  // -----------------------------------
  // MAIN RENDER
  // -----------------------------------

  return (
    <div className="bg-white min-h-screen p-4 overflow-y-auto">
      {/* Navigation Bar */}
      <div className="relative flex mb-4">
        <div className="flex w-full">
          <button
            className={`flex-1 p-2 ${gameState.currentGame === 'crossword' ? 'bg-blue-200' : 'bg-gray-100'} border border-black`}
            onClick={() => setGameState(prev => ({ ...prev, currentGame: 'crossword' }))}
          >
            Кръстословица {/* Changed from "Crossword" */}
          </button>
          <button
            className={`flex-1 p-2 ${gameState.currentGame === 'connectFour' ? 'bg-blue-200' : 'bg-gray-100'} border border-black`}
            onClick={() => setGameState(prev => ({ ...prev, currentGame: 'connectFour' }))}
          >
            Connections {/* Changed from "Connect Four" */}
          </button>
        </div>
        <div className="absolute bottom-0 right-0 p-2 z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-600 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsHintsOpen(false);
              setIsPreviousPuzzlesOpen(false);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {isSettingsOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-30">
              <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-4">
                {!isHintsOpen && !isPreviousPuzzlesOpen ? (
                  <ul className="text-gray-700">
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsPreviousPuzzlesOpen(true)}
                    >
                      предишни пъзели
                    </li>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsHintsOpen(true)}
                    >
                      подсказки
                    </li>
                  </ul>
                ) : isHintsOpen ? (
                  <ul className="text-gray-700">
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setHintsEnabled(true);
                        setIsSettingsOpen(false);
                        setIsHintsOpen(false);
                      }}
                    >
                      правилните букви автоматично се заключват и грешните букви оцветяват кутиите в червено
                    </li>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setHintsEnabled(false);
                        setIsSettingsOpen(false);
                        setIsHintsOpen(false);
                      }}
                    >
                      без подсказки
                    </li>
                  </ul>
                ) : (
                  <ul className="text-gray-700">
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        setIsPreviousPuzzlesOpen(false);
                      }}
                    >
                      седмица едно
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div className="mt-16">
        {gameState.currentGame === 'crossword' ? (
          <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
            {currentClue && (
              <div className="mb-4 text-lg font-semibold text-gray-800">
                {currentClue}
              </div>
            )}
            {renderCrosswordGrid()}
            {renderClues()}
          </div>
        ) : (
          renderConnectFourGrid()
        )}
      </div>
    </div>
  );
}