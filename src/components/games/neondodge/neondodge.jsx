import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import styles from './NeonDodge3D.module.css';

const Player = ({ position }) => {
  const ref = useRef();

  useFrame(() => {
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position, 0.2);
  });

  return (
    <mesh ref={ref} position={[0, -2, 0]}>
      <sphereGeometry args={[0.4, 24, 24]} />
      <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} color="#00ffff" />
    </mesh>
  );
};

const FallingCube = ({ cube, paused }) => {
  const ref = useRef();

  useFrame(() => {
    if (paused) return;

    // Move cube
    ref.current.position.y -= cube.speed;
    cube.position[1] = ref.current.position.y; // ✅ sync with logic

    // Reset cube after it goes below screen
    if (ref.current.position.y < -3.2) {
      const newX = (Math.random() - 0.5) * 6;
      const newY = 5;
      const newSize = 0.3 + Math.random() * 0.5;
      const newSpeed = 0.02 + Math.random() * 0.03;

      ref.current.position.set(newX, newY, 0);
      ref.current.scale.set(newSize, newSize, newSize);

      cube.position = [newX, newY, 0]; // ✅ also reset logic data
      cube.size = newSize;
      cube.speed = newSpeed;
    }

    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={cube.position}>
      <boxGeometry args={[cube.size, cube.size, cube.size]} />
      <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={2} color="#ff00ff" />
    </mesh>
  );
};

// niche ke chize kitne scary hai
const Scene = ({ setGameOver }) => {
  const [playerX, setPlayerX] = useState(0);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const playerRadius = 0.4;
  const keys = useRef({ left: false, right: false });

  const cubes = useRef(
    Array.from({ length: 1 }).map(() => ({
      position: [Math.random() * 4 - 2, 5, 0],
      speed: 0.02 + Math.random() * 0.03,
      size: 0.3 + Math.random() * 0.5,
    }))
  );

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX / window.innerWidth;
      setPlayerX((touchX - 0.5) * 6);
    };
    window.addEventListener('touchmove', handleTouchMove);
    return () => window.removeEventListener('touchmove', handleTouchMove);
  }, []);

  useFrame((_, delta) => {
    if (paused) return;

    // Player movement
    setPlayerX((x) => {
      let newX = x;
      if (keys.current.left) newX -= 0.08;
      if (keys.current.right) newX += 0.08;
      return THREE.MathUtils.clamp(newX, -3, 3);
    });

    // Collision detection
    for (let cube of cubes.current) {
      const cubeX = cube.position[0];
      const cubeY = cube.position[1];
      const half = cube.size / 2;

      if (
        playerX + playerRadius > cubeX - half &&
        playerX - playerRadius < cubeX + half &&
        -2 + playerRadius > cubeY - half &&
        -2 - playerRadius < cubeY + half
      ) {
        setPaused(true);
        setGameOver(true);
      }
    }

    setScore((s) => s + delta * 10);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} color="#00ffff" intensity={3} />

      <Player position={playerX} />
      {cubes.current.map((cube, i) => (
        <FallingCube key={i} cube={cube} paused={paused} />
      ))}

      <Html position={[0, 3, 0]}>
        <div className={styles.score}>Score: {Math.floor(score)}</div>
      </Html>
    </>
  );
};
// thank god ye itna hi hai

const NeonDodge3D = () => {
  const [gameOver, setGameOver] = useState(false);

  return (
    <div className={styles.container}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#05000f']} />
        {!gameOver && <Scene setGameOver={setGameOver} />}
        {gameOver && (
          <Html center>
            <div className={styles.gameOver}>💥 Game Over 💥</div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default NeonDodge3D;
