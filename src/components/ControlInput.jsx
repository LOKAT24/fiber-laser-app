import React from 'react';

const ControlInput = ({ label, value, setValue, min, max, step, unit, colorClass, warning, onUserChange }) => {
    const handleChange = (val) => {
        setValue(val);
        if (onUserChange) onUserChange();
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-sm text-gray-300">{label}</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => handleChange(Number(e.target.value))}
                        className={`w-20 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-right font-mono text-sm focus:border-${colorClass.split('-')[1]}-500 outline-none text-${colorClass.split('-')[1]}-400`}
                    />
                    <span className="text-xs text-gray-500 w-8">{unit}</span>
                </div>
            </div>
            <input
                type="range" min={min} max={max} step={step}
                value={value} onChange={(e) => handleChange(Number(e.target.value))}
                className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${colorClass.split('-')[1]}-500`}
            />
            {warning}
        </div>
    );
};

export default ControlInput;
