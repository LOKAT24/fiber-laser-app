import React from 'react';
import { Activity, HelpCircle } from 'lucide-react';

const TooltipCard = ({ title, value, unit, subtext, formula, warning }) => (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative group hover:border-gray-600 transition-colors">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Activity size={48} />
        </div>

        <div className="flex justify-between items-start relative z-10">
            <p className="text-gray-400 text-xs uppercase flex items-center gap-1 cursor-help">
                {title}
                {formula && <HelpCircle size={12} className="text-gray-500" />}
            </p>

            {formula && (
                <div className="group-hover:opacity-100 opacity-0 transition-opacity absolute left-0 bottom-full mb-2 bg-gray-900 text-[10px] text-gray-300 p-3 rounded-lg border border-gray-600 z-50 w-max max-w-[240px] shadow-2xl pointer-events-none">
                    <span className="font-bold text-gray-400 block mb-1 uppercase tracking-wider text-[9px] border-b border-gray-700 pb-1">Formuła</span>
                    <span className="font-mono text-emerald-400 block whitespace-pre-wrap leading-relaxed">{formula}</span>
                </div>
            )}
        </div>
        <div className="flex items-baseline mt-2 relative z-0">
            <span className={`text-2xl font-bold ${warning ? 'text-amber-500' : 'text-white'}`}>
                {value}
            </span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
        </div>
        <p className={`text-[10px] mt-1 ${warning ? 'text-amber-500' : 'text-gray-500'}`}>
            {subtext}
        </p>
    </div>
);

export default TooltipCard;
