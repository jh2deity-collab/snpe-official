"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Box, Sphere, Cylinder } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

interface FactorySceneProps {
    nodes: any[];
    isOptimized: boolean;
    metrics: any;
    legacyMetrics?: any;
}

interface FactoryNodeProps {
    position: [number, number, number];
    label: string;
    isOptimized: boolean;
    index: number;
    type?: string;
}

function FactoryNode({ position, label, isOptimized, index, type }: FactoryNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Idle animation
        if (isOptimized) {
            // Smooth floating
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
            meshRef.current.rotation.y += 0.01;
        } else {
            // Glitchy vibration
            if (Math.random() > 0.9) {
                meshRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.2;
            }
        }
    });

    const color = isOptimized ? "#3b82f6" : "#ef4444"; // Blue vs Red

    return (
        <group position={position}>
            {/* Machine Body - Dynamic Shape Based on Type */}
            {type === "server" ? (
                <Cylinder ref={meshRef} args={[0.5, 0.5, 2, 16]}>
                    <meshStandardMaterial color={hovered ? "white" : color} opacity={0.8} transparent />
                </Cylinder>
            ) : type === "agv" ? (
                <Box ref={meshRef} args={[1, 0.5, 1.5]}>
                    <meshStandardMaterial color={hovered ? "white" : color} opacity={0.8} transparent />
                </Box>
            ) : type === "input" ? (
                <Sphere ref={meshRef} args={[0.8, 16, 16]}>
                    <meshStandardMaterial color={hovered ? "white" : color} opacity={0.8} transparent />
                </Sphere>
            ) : (
                <Box
                    ref={meshRef}
                    args={[1.5, 1, 1.5]}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <meshStandardMaterial color={hovered ? "white" : color} opacity={0.8} transparent />
                </Box>
            )}

            {/* Label */}
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>

            {/* Status Indicator */}
            <Sphere position={[0, 0.8, 0]} args={[0.2, 16, 16]}>
                <meshBasicMaterial color={isOptimized ? "#4ade80" : "#f87171"} />
            </Sphere>
        </group>
    );
}

function DataFlow({ start, end, isOptimized }: { start: [number, number, number], end: [number, number, number], isOptimized: boolean }) {
    const particleRef = useRef<THREE.Mesh>(null);

    // Create a curve for the path
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(...start),
            new THREE.Vector3((start[0] + end[0]) / 2, start[1] + 2, (start[2] + end[2]) / 2), // Arc
            new THREE.Vector3(...end)
        ]);
    }, [start, end]);

    useFrame((state) => {
        if (!particleRef.current) return;

        // Move particle along the curve
        const t = (state.clock.elapsedTime * (isOptimized ? 1 : 0.5)) % 1;
        const position = curve.getPoint(t);
        particleRef.current.position.copy(position);
    });

    return (
        <>
            {/* Connection Line */}
            <Line points={curve.getPoints(20)} color={isOptimized ? "#3b82f6" : "#7f1d1d"} lineWidth={1} opacity={0.3} transparent />

            {/* Flowing Particle */}
            <Sphere ref={particleRef} args={[0.15, 8, 8]}>
                <meshBasicMaterial color={isOptimized ? "#60a5fa" : "#ef4444"} />
            </Sphere>
        </>
    );
}

export default function FactoryScene({ nodes, isOptimized, metrics }: FactorySceneProps) {
    // Define 3D positions for nodes based on index
    // 0: Processing (Left)
    // 1: Assembly (Center)
    // 2: Quality (Right)
    // 3: Logistics (Back/Front)

    // Simple layout: Linear or Grid
    const getPosition = (idx: number): [number, number, number] => {
        const count = nodes.length;
        if (isOptimized) {
            // Optimized: Linear efficient layout centered
            return [(idx - (count - 1) / 2) * 4, 0, 0];
        } else {
            // Legacy: Chaotic staggered layout
            const z = (idx % 2 === 0) ? 2 : -2;
            const x = (idx - (count - 1) / 2) * 4;
            return [x + (Math.random() - 0.5), 0, z + (Math.random() - 0.5)];
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative">
            <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                <OrbitControls enableZoom={true} enablePan={true} autoRotate={isOptimized} autoRotateSpeed={0.5} />

                {/* Grid Floor */}
                <gridHelper args={[30, 30, "#1e293b", "#0f172a"]} position={[0, -1, 0]} />

                {/* Render Nodes */}
                {nodes.map((node, i) => (
                    <FactoryNode
                        key={node.id}
                        index={i}
                        position={getPosition(i)}
                        label={node.label}
                        isOptimized={isOptimized}
                        type={node.type}
                    />
                ))}

                {/* Render Data Flows between nodes */}
                {nodes.map((node, i) => {
                    if (i === nodes.length - 1) return null; // Last node has no outgoing flow
                    const start = getPosition(i);
                    const end = getPosition(i + 1);
                    return <DataFlow key={`flow-${i}`} start={start} end={end} isOptimized={isOptimized} />;
                })}

                {/* Legacy Chaos Flows (Random connections) */}
                {!isOptimized && (
                    <>
                        <DataFlow start={getPosition(0)} end={getPosition(2)} isOptimized={false} />
                        <DataFlow start={getPosition(3)} end={getPosition(1)} isOptimized={false} />
                    </>
                )}

            </Canvas>

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className={`text-sm font-bold px-3 py-1 rounded-full border ${isOptimized ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-red-500 bg-red-500/10 text-red-400"}`}>
                    {isOptimized ? "DIGITAL TWIN: OPTIMIZED" : "DIGITAL TWIN: LEGACY"}
                </div>
            </div>
        </div>
    );
}
