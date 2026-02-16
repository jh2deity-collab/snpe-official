"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Text, Float, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function ConveyorBelt() {
    const beltRef = useRef<THREE.Mesh>(null);
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        if (context) {
            context.fillStyle = "#1e293b";
            context.fillRect(0, 0, 512, 512);
            context.fillStyle = "#0ea5e9";
            // Create tech pattern
            for (let i = 0; i < 8; i++) {
                context.fillRect(0, i * 64 + 10, 512, 10);
            }
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    useFrame((state, delta) => {
        if (beltRef.current) {
            const material = beltRef.current.material as THREE.MeshStandardMaterial;
            if (material && material.map) {
                material.map.offset.y -= delta * 0.5;
            }
        }
    });

    return (
        <group position={[0, -1, 0]}>
            {/* Belt Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <boxGeometry args={[4, 10, 0.2]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Moving Surface */}
            <mesh ref={beltRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
                <planeGeometry args={[3.8, 10]} />
                <meshStandardMaterial map={texture} />
            </mesh>
            {/* Side Rails */}
            <mesh position={[-2.1, 0.2, 0]}>
                <boxGeometry args={[0.2, 0.5, 10]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[2.1, 0.2, 0]}>
                <boxGeometry args={[0.2, 0.5, 10]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
        </group>
    );
}

function RobotArm({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null);
    const arm1 = useRef<THREE.Group>(null);
    const arm2 = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = Math.sin(t * 0.5) * 0.5;
        }
        if (arm1.current) {
            arm1.current.rotation.z = Math.sin(t * 1) * 0.3 + 0.5;
        }
        if (arm2.current) {
            arm2.current.rotation.z = Math.cos(t * 1) * 0.5 - 0.5;
        }
    });

    return (
        <group ref={group} position={position}>
            {/* Base */}
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Joint 1 */}
            <group position={[0, 0.5, 0]} ref={arm1}>
                <mesh position={[0, 0.75, 0]}>
                    <boxGeometry args={[0.4, 1.5, 0.4]} />
                    <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.2} />
                </mesh>

                {/* Joint 2 */}
                <group position={[0, 1.5, 0]} ref={arm2}>
                    <mesh position={[0, 0.75, 0]}>
                        <boxGeometry args={[0.3, 1.5, 0.3]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
                    </mesh>

                    {/* Claw */}
                    <mesh position={[0, 1.6, 0]}>
                        <sphereGeometry args={[0.2]} />
                        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            </group>
        </group>
    );
}

function Products() {
    const products = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!products.current) return;
        products.current.children.forEach((child, i) => {
            child.position.z += delta * 2;
            if (child.position.z > 6) {
                child.position.z = -6;
                child.position.y = 0.5; // Reset height
            }
        });
    });

    return (
        <group ref={products}>
            {[-4, -1, 2, 5].map((z, i) => (
                <mesh key={i} position={[0, 0.5, z]} castShadow>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#06b6d4" : "#3b82f6"} metalness={0.5} roughness={0.2} />
                </mesh>
            ))}
        </group>
    );
}

export default function DigitalTwin({ isOptimized }: { isOptimized: boolean }) {
    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                <OrbitControls enableZoom={true} minDistance={5} maxDistance={15} maxPolarAngle={Math.PI / 2} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={1} color="#06b6d4" />

                {/* Atmosphere */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#0ea5e9" />

                {/* Scene Content */}
                <group position={[0, -1, 0]}>
                    <ConveyorBelt />
                    <Products />
                    <RobotArm position={[-2.5, 0, 0]} />
                    <RobotArm position={[2.5, 0, 2]} />

                    {/* Floor Reflection */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>

                {/* Status Text 3D */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Text
                        position={[0, 3, -2]}
                        fontSize={0.5}
                        color={isOptimized ? "#22d3ee" : "#94a3b8"}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {isOptimized ? "AI OPTIMIZATION: ACTIVE" : "MANUAL MODE"}
                    </Text>
                </Float>
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-end">
                <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-white font-mono">
                    <div>CAM_POS: PITCH_35_YAW_45</div>
                    <div>RENDER_ENGINE: WEBGL_2.0</div>
                </div>
            </div>
        </div>
    );
}
