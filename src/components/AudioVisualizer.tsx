"use client";

import React, { useEffect, useRef } from 'react';
import { useAudioVisualizer } from '@/contexts/AudioVisualizerContext';

interface AudioVisualizerProps {
    type?: 'bars' | 'wave';
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
    type = 'bars',
    width = 60,
    height = 24,
    color = 'rgba(180, 190, 254, 0.8)', // Catppuccin Lavenderish
    className = ''
}) => {
    const { analyser } = useAudioVisualizer();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            if (type === 'bars') {
                analyser.getByteFrequencyData(dataArray);
            } else {
                analyser.getByteTimeDomainData(dataArray);
            }

            ctx.clearRect(0, 0, width, height);

            if (type === 'bars') {
                // Only use the lower half of frequencies (where most music energy is)
                const usefulBins = Math.floor(bufferLength * 0.5);
                const barWidth = (width / usefulBins) * 2;
                let barHeight;
                let x = 0;

                for (let i = 0; i < usefulBins; i++) {
                    barHeight = (dataArray[i] / 255) * height;

                    ctx.fillStyle = color;
                    // Calculate precise x to avoid small gaps
                    ctx.fillRect(Math.floor(x), height - barHeight, Math.ceil(barWidth) - 1, barHeight);

                    x += barWidth;
                }
            } else {
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = color;
                ctx.beginPath();

                const sliceWidth = width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * height / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyser, type, width, height, color]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`block opacity-80 ${className}`}
            style={{ width, height }}
        />
    );
};
