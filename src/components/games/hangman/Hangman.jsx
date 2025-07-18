import { useState, useEffect, useCallback } from 'react';
import words from '../../../assets/words.json';
import styles from './Hangman.module.css'; // ✅ CSS Module import

const Hangman = () => {
    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    };

    const [word] = useState(getRandomWord());
    const [guesses, setGuesses] = useState([]);
    const [remainingAttempts, setRemainingAttempts] = useState(9);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const handleGuess = useCallback((letter) => {
        if (guesses.includes(letter) || remainingAttempts <= 0 || gameOver || won) return;
        const updatedGuesses = [...guesses, letter];
        setGuesses(updatedGuesses);
        if (!word.includes(letter)) setRemainingAttempts(prev => prev - 1);
    }, [guesses, remainingAttempts, gameOver, won, word]);

    const handleKeyPress = useCallback((e) => {
        const letter = e.key.toLowerCase();
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key === "Escape" ) return;
        if (letter >= 'a' && letter <= 'z') handleGuess(letter);
    }, [handleGuess]);

    useEffect(() => {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Game",
            "name": "Hangman",
            "applicationCategory": "Word game",
            "operatingSystem": "All",
            "url": "https://spiele-zone.vercel.app/HangMan",
            "author": { "@type": "Organization", "name": "Shadowveil StudioZ" },
            "description": "Play Hangman online at Spiele Zone. Guess the word before you run out of chances!",
            "image": "https://spiele-zone.vercel.app/images/Hangman.png"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        if (remainingAttempts === 0) setGameOver(true);
        else if (word.split("").every(letter => guesses.includes(letter))) setWon(true);
    }, [remainingAttempts, guesses, word]);

    const displayWord = word.split("").map(letter => guesses.includes(letter) ? letter : "_").join(" ");

    return (
        <div className={styles['hangman-container']}>
            <h1>Hangman Game</h1>
            <div className={styles.word}>{gameOver || won ? word : displayWord}</div>
            <div className={styles.attempts}>Remaining Attempts: {remainingAttempts}</div>
            <div className={styles.guesses}>Guessed Letters: {guesses.join(", ")}</div>
            <div className={styles.keyboard}>
                {"abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
                    <button
                        key={letter}
                        onClick={() => handleGuess(letter)}
                        disabled={guesses.includes(letter) || gameOver || won}
                    >
                        {letter}
                    </button>
                ))}
            </div>
            {gameOver && <div className={styles['game-over']}>Game Over! The word was "{word}".</div>}
            {won && <div className={styles.win}>You win! The word was "{word}".</div>}
        </div>
    );
};

export default Hangman;
