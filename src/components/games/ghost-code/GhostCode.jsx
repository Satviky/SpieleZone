import { useState, useEffect } from "react";
import wordList from "../../../assets/words.json";
import styles from "./GhostCode.module.css";

const GhostCode = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "2048",
      "applicationCategory": "Number game",
      "operatingSystem": "All",
      "url": "https://www.spielezone.xyz/ghost-code",
      "author": { "@type": "Organization", "name": "Shadowveil StudioZ" },
      "description": "Play Ghost Code online at Spiele Zone. Type the word before they drop to bottom.",
      "image": "https://spiele-zone.vercel.app/images/sz.png"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const speed = Math.max(3000 - score * 200, 1000);

    const interval = setInterval(() => {
      const newWord = {
        text: wordList[Math.floor(Math.random() * wordList.length)],
        position: 0,
        id: Math.random(),
      };
      setWords((prevWords) => [...prevWords, newWord]);
    }, speed);

    return () => clearInterval(interval);
  }, [score, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const moveInterval = setInterval(() => {
      setWords((prevWords) => {
        const updatedWords = prevWords.map((word) => ({
          ...word,
          position: word.position + 5,
        }));

        if (updatedWords.some((word) => word.position >= 400)) {
          setGameOver(true);
          return [];
        }

        return updatedWords;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [words, gameOver]);

  const handleInput = (event) => {
    // const typedWord = event.target.value.toLowerCase();
    let typedWord = event.target.value.toLowerCase();

    typedWord = typedWord.replace(/[^a-z]/g, ""); //<- here here you made the changes

    setCurrentWord(typedWord);

    if (words.some((word) => word.text.toLowerCase() === typedWord)) {
      setWords(words.filter((word) => word.text.toLowerCase() !== typedWord));
      setScore(score + 1);
      setCurrentWord("");
    }
  };

  const restartGame = () => {
    setWords([]);
    setScore(0);
    setGameOver(false);
    setCurrentWord("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GhostCode</h1>
      <h2 className={styles.subtitle}>Type the words before they reach the bottom!</h2>

      {gameOver ? (
        <>
          <h2 className={styles.subtitle}>👾Game Over!👾</h2>
          <p className={styles.score}>Your final score: {score}</p>


          <div className={styles.btncont}>
            <button onClick={restartGame} className={styles.button}>Restart</button>

            {isMobile() ? (
              <button
                className={styles.button}
                onClick={() => {
                  const text = `🕹️I scored ${score} points in GhostCode on Spiele Zone!👻\n Try to beat my Score: <https://www.spielezone.xyz/ghost-code>`;
                  navigator.share({ text });
                }}
              >
                Share
              </button>
            ) : (
              <button
                className={styles.button}
                onClick={() => {
                  const text = `🕹️I scored ${score} points in GhostCode on Spiele Zone! 👻 \n Think you can beat it? \n Play here: <https://www.spielezone.xyz/ghost-code>`;
                  navigator.clipboard.writeText(text);
                  alert("Copied! Paste it anywhere.");
                }}
              >
                Share
              </button>
            )}
          </div>


        </>
      ) : (
        <>
          <div className={styles.gameScreen}>
            {words.map((word) => (
              <div
                key={word.id}
                className={styles.fallingWord}
                style={{ top: `${word.position}px` }}
              >
                {word.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={currentWord}
            onChange={handleInput}
            placeholder="Type here..."
            className={styles.input}
            autoFocus
          />
          <p className={styles.score}>Score: {score}</p>
        </>
      )}
    </div>
  );
};

export default GhostCode;