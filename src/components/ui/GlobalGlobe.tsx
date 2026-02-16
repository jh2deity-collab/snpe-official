"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

// Mock Supply Chain Hubs
const HUBS = [
    { name: "Seoul HQ", pos: [127, 37.5], color: "#22d3ee", status: "Active" },
    { name: "Detroit Plant", pos: [-83, 42], color: "#3b82f6", status: "Active" },
    { name: "Stuttgart R&D", pos: [9, 48], color: "#6366f1", status: "Active" },
    { name: "Shanghai Logistics", pos: [121, 31], color: "#22d3ee", status: "Warning" },
    { name: "Singapore Hub", pos: [103, 1], color: "#22d3ee", status: "Active" },
    { name: "São Paulo Node", pos: [-46, -23], color: "#3b82f6", status: "Active" },
];

// Conversions for Lat/Long to Vector3
function latLongToVector3(lat: number, lon: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

function HubMarker({ hub }: { hub: typeof HUBS[0] }) {
    const [hovered, setHovered] = useState(false);
    const position = useMemo(() => latLongToVector3(hub.pos[1], hub.pos[0], 2.05), [hub.pos]);

    return (
        <group position={position}>
            <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={hub.status === "Warning" ? "#ef4444" : hub.color} />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={hub.status === "Warning" ? "#ef4444" : hub.color} transparent opacity={0.2} />
            </mesh>

            {(hovered || hub.status === "Warning") && (
                <Html distanceFactor={10}>
                    <div className="bg-slate-900/90 border border-white/10 p-2 rounded-lg backdrop-blur-md whitespace-nowrap">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">{hub.name}</p>
                        <p className={`text-[8px] font-mono ${hub.status === "Warning" ? "text-red-400" : "text-cyan-400"}`}>{hub.status}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

function Routes() {
    const curves = useMemo(() => {
        const result: THREE.QuadraticBezierCurve3[] = [];
        const start = HUBS[0]; // Seoul HQ
        const startPos = latLongToVector3(start.pos[1], start.pos[0], 2);

        HUBS.slice(1).forEach(hub => {
            const endPos = latLongToVector3(hub.pos[1], hub.pos[0], 2);
            // Midpoint with some height
            const midPos = startPos.clone().lerp(endPos, 0.5).normalize().multiplyScalar(2.5);
            result.push(new THREE.QuadraticBezierCurve3(startPos, midPos, endPos));
        });
        return result;
    }, []);

    return (
        <group>
            {curves.map((curve, idx) => (
                <mesh key={idx}>
                    <tubeGeometry args={[curve, 64, 0.005, 8, false]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}

function Globe() {
    const globeRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={globeRef}>
            {/* The Earth */}
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#0f172a"
                    emissive="#1e293b"
                    emissiveIntensity={0.5}
                    wireframe={true}
                />
            </Sphere>
            <Sphere args={[1.98, 64, 64]}>
                <meshStandardMaterial color="#020617" transparent opacity={0.9} />
            </Sphere>

            {/* Atmosphere Glow */}
            <Sphere args={[2.1, 64, 64]}>
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.05} side={THREE.BackSide} />
            </Sphere>

            {/* Markers & Routes */}
            {HUBS.map((hub, i) => (
                <HubMarker key={i} hub={hub} />
            ))}
            <Routes />
        </group>
    );
}

export default function GlobalGlobe() {
    return (
        <div className="w-full h-full min-h-[500px] bg-slate-950/50 rounded-3xl overflow-hidden relative border border-white/5">
            <div className="absolute top-6 left-6 z-10 space-y-1">
                <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Global Intelligence</h3>
                <p className="text-2xl font-black text-white tracking-tighter">SUPPLY CHAIN TWIN</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    NETWORK STABLE: 98.4% EFFICIENCY
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Globe />
                <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={10} />
            </Canvas>

            <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
                <div className="p-3 bg-slate-900/80 border border-white/10 rounded-xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Live Nodes</p>
                    <div className="space-y-2">
                        {HUBS.slice(0, 3).map((hub, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${hub.status === "Warning" ? "bg-red-500" : "bg-cyan-500"}`} />
                                <span className="text-[10px] font-bold text-slate-200 uppercase">{hub.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
