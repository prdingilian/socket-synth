import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BufferGeometry } from "three";
import { config, useSpring } from "@react-spring/three";

const Stars = ({ count }: { count: number }) => {
  const geometryRef = useRef<BufferGeometry>();

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(
      [...new Array(count * 3)].map(() => 5 - Math.random() * 10)
    );
    const purple = new THREE.Color("#8A3FFC");
    const colors = new Float32Array(
      [...new Array(count)].flatMap(() => purple.toArray())
    );
    return [positions, colors];
  }, [count]);

  const { rotateSpeed } = useSpring({
    from: { rotateSpeed: 0.01 },
    rotateSpeed: 0.0002,
    config: config.molasses,
    reset: true,
  });
  useFrame(() => {
    geometryRef.current?.rotateX(rotateSpeed.get());
    geometryRef.current?.rotateY(rotateSpeed.get());
    geometryRef.current?.rotateZ(rotateSpeed.get());
  });

  return (
    <points>
      <pointsMaterial attach="material" size={1.8}></pointsMaterial>
      <bufferGeometry ref={geometryRef} attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        ></bufferAttribute>
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
};

const AnimatedDots = () => {
  return (
    <div className="canvas-container">
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 100] }}
        raycaster={{ params: { Points: { threshold: 0.1 } } }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Stars count={3000} />
        <fog attach="fog" args={["#8A3FFC", 100, 108]} />
      </Canvas>
    </div>
  );
};

export default AnimatedDots;
