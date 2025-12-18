import React from 'react';

const CutoffChart = ({ results, frequency, pulseWidth }) => {
    const w = 300;
    const h = 150;
    const padding = 20;

    const xMax = Math.max(500, results.cutoff * 2);
    const yMax = 120;

    const points = [];
    for (let f = 0; f <= xMax; f += xMax / 20) {
        let p = 100;
        if (f < results.cutoff) {
            p = 100 * (f / results.cutoff);
        }
        points.push({ f, p });
    }

    const pathD = points.map((pt, i) => {
        const x = padding + (pt.f / xMax) * (w - 2 * padding);
        const y = h - padding - (pt.p / yMax) * (h - 2 * padding);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const currX = padding + (frequency / xMax) * (w - 2 * padding);
    const currY = h - padding - (results.actualAvgPower / yMax) * (h - 2 * padding);
    const inRange = frequency <= xMax;

    return (
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Charakterystyka Mocy</h3>
            <svg width="100%" height="160" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
                <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="#4b5563" strokeWidth="1" />
                <line x1={padding} y1={h - padding} x2={padding} y2={padding} stroke="#4b5563" strokeWidth="1" />
                <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                <text x={w / 2} y={h - 5} fill="#9ca3af" fontSize="10" textAnchor="middle">Częstotliwość (kHz)</text>
                <text x={10} y={h / 2} fill="#9ca3af" fontSize="10" transform={`rotate(-90, 10, ${h / 2})`} textAnchor="middle">Moc (W)</text>
                <line x1={padding + (results.cutoff / xMax) * (w - 2 * padding)} y1={padding}
                    x2={padding + (results.cutoff / xMax) * (w - 2 * padding)} y2={h - padding}
                    stroke="#ef4444" strokeWidth="1" opacity="0.5" />
                <text x={padding + (results.cutoff / xMax) * (w - 2 * padding)} y={padding - 5} fill="#ef4444" fontSize="10" textAnchor="middle">
                    f_cut: {Math.round(results.cutoff)}
                </text>
                {inRange && (
                    <circle cx={currX} cy={currY} r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                )}
            </svg>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
                Niebieska linia przerywana: teoretyczny limit mocy dla wybranego impulsu {pulseWidth}ns.
            </p>
        </div>
    );
};

export default CutoffChart;
