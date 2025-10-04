import { useState, useEffect, useCallback } from 'react';
import styles from './Game2048.module.css';
import { Helmet } from 'react-helmet';
const rotateLeft = (board) => board[0].map((_, i) => board.map(row => row[3 - i]));
const rotateRight = (board) => board[0].map((_, i) => board.map(row => row[i]).reverse());

const moveLeft = (board) => {
    return board.map(row => {
        const nonZero = row.filter(val => val !== 0);
        for (let i = 0; i < nonZero.length - 1; i++) {
            if (nonZero[i] === nonZero[i + 1]) {
                nonZero[i] *= 2;
                nonZero[i + 1] = 0;
            }
        }
        const merged = nonZero.filter(val => val !== 0);
        return [...merged, ...Array(4 - merged.length).fill(0)];
    });
};

const moveRight = (board) =>
    moveLeft(board.map(row => row.reverse())).map(row => row.reverse());

const moveUp = (board) =>
    rotateRight(moveLeft(rotateLeft(board)));

const moveDown = (board) =>
    rotateLeft(moveLeft(rotateRight(board)));

const changeInBoard = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

const isGameOver = (board) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
};

const addNewTile = (board) => {
    const emptyTiles = [];
    board.forEach((row, i) =>
        row.forEach((val, j) => {
            if (val === 0) emptyTiles.push([i, j]);
        })
    );
    if (emptyTiles.length === 0) return;
    const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[row][col] = Math.random() > 0.5 ? 2 : 4;
};

const createBoard = () => {
    const board = Array(4).fill().map(() => Array(4).fill(0));
    addNewTile(board);
    addNewTile(board);
    return board;
};

const Game2048 = () => {
    const [board, setBoard] = useState(createBoard());
    const [gameOver, setGameOver] = useState(false);
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState(false);
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [resetting, setResetting] = useState(false);
    const [showResetMsg, setShowResetMsg] = useState(false);

    // SEO -> Kuch to online padha tha isliye add kiya hai
    useEffect(() => {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Game",
            "name": "2048",
            "applicationCategory": "Number game",
            "operatingSystem": "All",
            "url": "https://www.spielezone.xyz/tzfe",
            "author": { "@type": "Organization", "name": "Shadowveil StudioZ" },
            "description": "Play 2048 online at Spiele Zone. Merge and win",
            "image": "https://spiele-zone.vercel.app/images/2048.png"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, []);

    const handleTouchStart = (e) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        });
    };

    const handleKeyPress = useCallback((e) => {
        if (gameOver) return;
        // e.preventDefault()

        let newBoard = board.map(row => [...row]);
        const key = e.key.toLowerCase();

        if (e.key === 'ArrowUp' || key === 'w') {
            e.preventDefault?.();
            newBoard = moveUp(newBoard);
        }
        else if (e.key === 'ArrowDown' || key === 's') {
            e.preventDefault?.();
            newBoard = moveDown(newBoard);
        }
        else if (e.key === 'ArrowLeft' || key === 'a') {
            e.preventDefault?.();
            newBoard = moveLeft(newBoard);
        }
        else if (e.key === 'ArrowRight' || key === 'd') {
            e.preventDefault?.();
            newBoard = moveRight(newBoard);
        }
        else return;

        if (changeInBoard(board, newBoard)) {
            addNewTile(newBoard);
            setBoard(newBoard);
            if (isGameOver(newBoard)) setGameOver(true);
        }
    }, [board, gameOver]);



    const handleTouchEnd = useCallback((e) => {
        if (gameOver) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - touchStart.x;
        const deltaY = endY - touchStart.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            handleKeyPress({ key: deltaX > 50 ? 'ArrowRight' : 'ArrowLeft' });
        } else {
            handleKeyPress({ key: deltaY > 50 ? 'ArrowDown' : 'ArrowUp' });
        }
    }, [touchStart, handleKeyPress, gameOver]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleKeyPress, handleTouchEnd]);

    const handleReset = () => {
        setResetting(true);
        setTimeout(() => {
            setBoard(createBoard());
            setGameOver(false);
            setRating(0);
            setRated(false);
            setResetting(false);
            setShowResetMsg(true);
            setTimeout(() => setShowResetMsg(false), 2000);
        }, 300);
    };

    const handleStarClick = (value) => {
        setRating(value);
        setRated(true);
    };


    return (
        <div className={styles.container}>
            <Helmet>
                <title>Play 2048 Online - Shadowveil StudioZ</title>
                <meta name="description" content="Enjoy the classic 2048 game online. Merge and score by Shadowveil StudioZ!" />
                <meta name="keywords" content="Hangman, online hangman, word game, puzzle game, spiele zone, shadowveil studioz" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="2048 - Play Online | Spiele Zone" />
                <meta property="og:description" content="Guess the hidden word in this free browser Hangman game. Play now at Spiele Zone!" />
                <meta property="og:image" content="https://spiele-zone.vercel.app/images/2048.png" />
                <meta property="og:url" content="https://www.spielezone.xyz/tzfe" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="2048 - Play Online | Spiele Zone" />
                <meta name="twitter:description" content="Guess the word before you run out of lives. Play Hangman free online." />
                <meta name="twitter:image" content="https://spiele-zone.vercel.app/images/tzfe.png" />
                <link rel="canonical" href="https://www.spielezone.xyz/tzfe" />
            </Helmet>

            <h1 className={styles.title}>2048 Mario Edition</h1>

            {showResetMsg && (
                <div className={styles.resetToast}>✨ New Game Started!</div>
            )}

            <div className={styles.boardWrapper}>
                <div className={`${styles.board} ${resetting ? styles.resetting : ''}`}>
                    {board.map((row, i) => (
                        <div className={styles.row} key={i}>
                            {row.map((val, j) => (
                                <div
                                    key={j}
                                    className={`${styles.tile} ${styles[`tile-${val}`] || ''}`}
                                >
                                    {val !== 0 ? val : ''}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className={styles.gameOverlay}>
                        <p>Game Over!</p>
                        <button onClick={handleReset} className={styles.resetButton}>
                            🔄 Reset Game
                        </button>

                        {!rated ? (
                            <div className={styles.emojiRating}>
                                {[1, 2, 3, 4, 5, 6, 7].map((num, i) => (
                                    <span
                                        key={i}
                                        className={`${styles.emoji} ${rating >= num ? styles.selected : ''}`}
                                        onClick={() => handleStarClick(num)}
                                    >
                                        {['👎', '😠', '😕', '😐', '😃', '😆', '❤️'][i]}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>Thank you for rating!</p>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <p>By Satviky</p>
                <p>UI/UX by Keshav</p>
            </div>
        </div>
    );
};

export default Game2048;
