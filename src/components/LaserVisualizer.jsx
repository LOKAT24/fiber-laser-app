import React, { useRef, useEffect, useState } from 'react';
import { MousePointer2, Play, Square, AlignJustify } from 'lucide-react';

const LaserVisualizer = ({ results, spotSize }) => {
    const canvasRef = useRef(null);
    const animationReqRef = useRef(null);
    const animationProgressRef = useRef(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Toggle Function
    const toggleAnimation = () => {
        if (isAnimating) {
            setIsAnimating(false);
            if (animationReqRef.current) cancelAnimationFrame(animationReqRef.current);
        } else {
            animationProgressRef.current = 0;
            setIsAnimating(true);
        }
    };

    // Reset animation when params change
    useEffect(() => {
        if (isAnimating) {
            setIsAnimating(false);
            if (animationReqRef.current) cancelAnimationFrame(animationReqRef.current);
            animationProgressRef.current = 0;
        }
    }, [results, spotSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Dynamic Zoom
        const zoom = Math.min(5, Math.max(1, 60 / spotSize));

        const centerY = height / 2;
        const spotPx = spotSize * zoom;
        const distPx = results.pulseDistanceMicrons * zoom;
        const hatchPx = results.lineIntervalMicrons * zoom;

        const startX = 20;
        // Calculate visible pulses based on canvas width
        const visiblePulses = Math.ceil((width - 40) / (distPx || 0.1)) + 1;
        const totalPulses = visiblePulses * 3; // 3 lines

        const drawFrame = () => {
            // Clear
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, width, height);

            // Draw Ruler
            ctx.strokeStyle = '#4b5563';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(10, height - 20);
            ctx.lineTo(width - 10, height - 20);
            ctx.stroke();

            // Scale marker (100 microns)
            ctx.fillStyle = '#9ca3af';
            ctx.font = '10px sans-serif';
            ctx.fillText('Skala: 100 µm', 10, height - 5);
            ctx.fillRect(10, height - 22, 100 * zoom, 4);

            // Determine how many pulses to draw based on animation state
            let currentLimit = isAnimating ? animationProgressRef.current : totalPulses;

            // Draw 3 Lines: Top (-1), Center (0), Bottom (1)
            const lines = [-1, 0, 1];

            let pulsesProcessed = 0;
            let headX = -100;
            let headY = -100;

            lines.forEach((lineOffset, lineIndex) => {
                const yBase = centerY + (lineOffset * hatchPx);

                // Background line (hatch path)
                if (hatchPx > 20) {
                    ctx.beginPath();
                    ctx.moveTo(startX, yBase);
                    ctx.lineTo(width, yBase);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.stroke();
                }

                if (yBase + spotPx / 2 < 0 || yBase - spotPx / 2 > height) return;

                if (distPx < 0.5) {
                    // Optimization: continuous line for high density
                    ctx.beginPath();
                    ctx.moveTo(startX, yBase);
                    const endX = Math.min(width, startX + (visiblePulses * distPx));
                    const drawWidth = isAnimating ? Math.min(endX - startX, (currentLimit / 3) * distPx) : endX - startX;

                    if (drawWidth > 0) {
                        ctx.lineWidth = spotPx;
                        ctx.lineCap = 'round';
                        ctx.strokeStyle = lineOffset === 0 ? `rgba(239, 68, 68, 0.8)` : `rgba(239, 68, 68, 0.4)`;
                        ctx.lineTo(startX + drawWidth, yBase);
                        ctx.stroke();

                        // Reset
                        ctx.lineWidth = 1;
                        ctx.lineCap = 'butt';
                    }

                    headX = startX + drawWidth;
                    headY = yBase;
                    pulsesProcessed += (drawWidth / distPx);
                } else {
                    for (let i = 0; i < visiblePulses; i++) {
                        if (pulsesProcessed >= currentLimit) break;

                        const x = startX + (i * distPx);
                        if (x - spotPx > width) break;

                        // Draw Pulse
                        ctx.beginPath();
                        ctx.arc(x, yBase, spotPx / 2, 0, 2 * Math.PI);
                        ctx.fillStyle = lineOffset === 0 ? `rgba(239, 68, 68, 0.5)` : `rgba(239, 68, 68, 0.2)`;
                        ctx.fill();

                        // Center Point
                        if (distPx > 2) {
                            ctx.beginPath();
                            ctx.arc(x, yBase, 1, 0, 2 * Math.PI);
                            ctx.fillStyle = lineOffset === 0 ? '#fff' : 'rgba(255,255,255,0.3)';
                            ctx.fill();
                        }

                        // Stroke
                        if (spotPx > 3) {
                            ctx.beginPath();
                            ctx.arc(x, yBase, spotPx / 2, 0, 2 * Math.PI);
                            ctx.strokeStyle = lineOffset === 0 ? `rgba(255, 100, 100, 0.8)` : `rgba(255, 100, 100, 0.3)`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }

                        // Track head position
                        headX = x;
                        headY = yBase;
                        pulsesProcessed++;
                    }
                }
            });

            // Draw Laser Head Crosshair if animating
            if (isAnimating && pulsesProcessed < totalPulses) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 1;

                // Crosshair
                ctx.beginPath();
                ctx.moveTo(headX - 10, headY);
                ctx.lineTo(headX + 10, headY);
                ctx.moveTo(headX, headY - 10);
                ctx.lineTo(headX, headY + 10);
                ctx.stroke();

                // Circle around head
                ctx.beginPath();
                ctx.arc(headX, headY, 5, 0, 2 * Math.PI);
                ctx.stroke();
            }

            if (isAnimating) {
                if (currentLimit < totalPulses) {
                    // Speed control: pulses per frame
                    // Base speed on user speed setting to make it feel relative
                    const speedFactor = Math.max(0.2, results.pulseDistanceMicrons > 50 ? 0.2 : 0.5);
                    animationProgressRef.current += speedFactor;
                    animationReqRef.current = requestAnimationFrame(drawFrame);
                } else {
                    setIsAnimating(false);
                }
            }
        };

        drawFrame();

        return () => {
            if (animationReqRef.current) cancelAnimationFrame(animationReqRef.current);
        };
    }, [results, spotSize, isAnimating]);

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                <div className="flex items-center space-x-2">
                    <MousePointer2 size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-200">Symulacja Wypełnienia (Hatch)</h3>
                </div>

                {/* Right side controls/stats */}
                <div className="flex items-center space-x-4">

                    {/* PLAY BUTTON */}
                    <button
                        onClick={toggleAnimation}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-bold transition-all ${isAnimating
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                            }`}
                    >
                        {isAnimating ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        <span>{isAnimating ? 'STOP' : 'SYMULUJ (SLOW-MO)'}</span>
                    </button>

                    <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block"></div>

                    <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-xs flex items-center gap-1"><AlignJustify size={10} /> Hatch</span>
                        <span className={`font-mono font-bold ${results.hatchOverlap > 80 ? 'text-green-400' : results.hatchOverlap < 20 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {results.hatchOverlap.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-xs">Overlap</span>
                        <span className={`font-mono font-bold ${results.overlap > 90 ? 'text-red-400' : 'text-green-400'}`}>
                            {results.overlap.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={192}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* LEGEND / HINTS */}
            <div className="bg-gray-900 p-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                    <span className="font-bold text-gray-300 block mb-1">Zalecenia dla Hatch (Interwału):</span>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><span className="text-gray-300">Grawer powierzchniowy</span>: Overlap 20-40%.</li>
                        <li><span className="text-gray-300">Deep Engraving / 3D</span>: Overlap 50-70%.</li>
                        <li><span className="text-gray-300">Wygładzanie (Polerka)</span>: Overlap {'>'} 80%.</li>
                    </ul>
                </div>
                <div>
                    <span className="font-bold text-gray-300 block mb-1">Zalecenia dla Fluencji:</span>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><span className="text-gray-300">&lt; 5 J/cm²</span>: Znakowanie powierzchniowe, tworzywa.</li>
                        <li><span className="text-gray-300">5 - 20 J/cm²</span>: Standardowe grawerowanie metali.</li>
                        <li><span className="text-gray-300">&gt; 20 J/cm²</span>: Agresywna ablacja, głębokie grawerowanie.</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default LaserVisualizer;
