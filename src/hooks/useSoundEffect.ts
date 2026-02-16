"use client";

import { useCallback, useRef } from "react";

export type SoundType = "click" | "success" | "warning" | "error" | "scan" | "glitch";

export function useSoundEffect() {
    const audioCtx = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const playSound = useCallback((type: SoundType) => {
        initAudio();
        if (!audioCtx.current) return;

        const ctx = audioCtx.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case "click":
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case "scan":
                oscillator.type = "square";
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.linearRampToValueAtTime(800, now + 0.5);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
                oscillator.start(now);
                oscillator.stop(now + 0.5);
                break;

            case "success":
                // Chord-like success sound
                [523.25, 659.25, 783.99].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(freq, now + i * 0.1);
                    gain.gain.setValueAtTime(0.1, now + i * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
                    osc.start(now + i * 0.1);
                    osc.stop(now + i * 0.1 + 0.5);
                });
                break;

            case "warning":
                oscillator.type = "sawtooth";
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case "error":
                oscillator.type = "triangle";
                oscillator.frequency.setValueAtTime(100, now);
                oscillator.frequency.setValueAtTime(80, now + 0.1);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case "glitch":
                // Random noise burst
                const bufferSize = ctx.sampleRate * 0.1;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const noiseGain = ctx.createGain();
                noise.connect(noiseGain);
                noiseGain.connect(ctx.destination);
                noiseGain.gain.setValueAtTime(0.05, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                noise.start(now);
                noise.stop(now + 0.1);
                break;
        }
    }, []);

    return { playSound };
}
