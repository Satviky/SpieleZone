import { Link } from 'react-router-dom';
import styles from "../../index.module.css";

const Home2 = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome to Spiele Zone</h1>
            <p style={{ marginBottom: '1rem', color: '#666' }}>by Shadowveil StudioZ</p>
            <h2 style={{ marginBottom: '2rem', color: '#888' }}>Choose Your Game</h2>

            <ul className={styles['game-tile-con']}>
                <li> 
                    <Link to='/tzfe'>
                        <div className={`${styles['game-tile']} ${styles['t2048']} ${styles['zoom']}`}>
                            <div className={styles.gtitle}>2048</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/Snake'>
                        <div className={`${styles['game-tile']} ${styles['tsnake']} ${styles['zoom']}`}>
                            <div className={styles['gtitle']}>Snake</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/HangMan'>
                        <div className={`${styles['game-tile']} ${styles['thangman']} ${styles['zoom']}`}>
                            <div className={styles['gtitle']}>Hangman</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/ghost-code'>
                        <div className={`${styles['game-tile']} ${styles['tgc']} ${styles['zoom']}`}>
                            <div className={styles['gtitle']}>Ghost Code</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/memory'>
                        <div className={`${styles['game-tile']} ${styles['tmemory']} ${styles['zoom']}`}>
                            <div className={styles['gtitle']}>Memory Puzzle</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/bounce'>
                        <div className={`${styles['game-tile']} ${styles['tbounce']} ${styles['zoom']}`}>
                            <div className={styles['gtitle']}>Bounce</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Home2;
