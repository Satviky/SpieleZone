import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import styles from './NeonDodge3D.module.css';

const Player = ({ position }) => {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      position,
      0.15
    );
  });

  return (
    <mesh ref={ref} position={[0, -2, 0]}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} color="#00ffff" />
    </mesh>
  );
};

const FallingCube = ({ position, speed, size = 0.5, onHit }) => {
  const ref = useRef();

  useFrame(() => {
    ref.current.position.y -= speed;

    // Reset cube when it goes offscreen
    if (ref.current.position.y < -3) {
      ref.current.position.y = 5;
      ref.current.position.x = (Math.random() - 0.5) * 6;
    }

    // Collision detection
    const distance = ref.current.position.distanceTo(new THREE.Vector3(0, -2, 0));
    if (distance < 0.6) onHit();

    // Rotate cubes for cool effect
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={2} color="#ff00ff" />
    </mesh>
  );
};

const Scene = ({ resetGame, setGameOver }) => {
  const [playerX, setPlayerX] = useState(0);
  const [hit, setHit] = useState(false);
  const [score, setScore] = useState(0);

  const [activeCubeIndex, setActiveCubeIndex] = useState(0);

  const cubes = useMemo(
    () =>
      Array.from({ length: 7 }).map(() => ({
        position: [(Math.random() - 0.5) * 6, 5, 0], // start above
        speed: 0.03 + Math.random() * 0.03,
        size: 0.3 + Math.random() * 0.5
      })),
    []
  );

  // Key handling for player
  const keys = useRef({ left: false, right: false });
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') keys.current.left = true;
    if (e.key === 'ArrowRight') keys.current.right = true;
  };
  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft') keys.current.left = false;
    if (e.key === 'ArrowRight') keys.current.right = false;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update player & score
  useFrame((state, delta) => {
    setPlayerX((x) => {
      let newX = x;
      if (keys.current.left) newX -= 0.08;
      if (keys.current.right) newX += 0.08;
      return THREE.MathUtils.clamp(newX, -3, 3);
    });

    if (!hit) setScore((s) => s + delta * 10);
  });

  const handleHit = () => {
    setHit(true);
  };

  const handleCubeReset = (index) => {
    // after 1-2 seconds spawn next cube
    setTimeout(() => {
      const nextIndex = (index + 1) % cubes.length;
      cubes[nextIndex].position[1] = 5;
      cubes[nextIndex].position[0] = (Math.random() - 0.5) * 6;
      setActiveCubeIndex(nextIndex);
    }, 1500); // delay before next cube falls
  };

  useEffect(() => {
    if (hit) {
      setGameOver(true);
      setTimeout(resetGame, 2000);
    }
  }, [hit]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#00ffff" intensity={3} />
      <Player position={playerX} />
      {cubes.map((cube, i) =>
        i === activeCubeIndex ? (
          <FallingCube
            key={i}
            {...cube}
            onHit={() => handleHit()}
            // reset cube position after it goes below screen
            speed={cube.speed}
          />
        ) : null
      )}
      <Html position={[0, 3, 0]}>
        <div className={styles.score}>Score: {Math.floor(score)}</div>
      </Html>
    </>
  );
};


// ok


const NeonDodge3D = () => {
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setGameOver(false);
  };

  return (
    <div className={styles.container}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#05000f']} />
        <Scene resetGame={resetGame} setGameOver={setGameOver} />
        {gameOver && (
          <Html center>
            <div className={styles.gameOver}>💥 Game Over 💥</div>
          </Html>
        )}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default NeonDodge3D;
