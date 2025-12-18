import { MOPA_DATA } from '../data/constants';

// Linear interpolation helper
export const interpolate = (val, x0, x1, y0, y1) => y0 + ((val - x0) * (y1 - y0)) / (x1 - x0);

export const getCutoffFreq = (ns) => {
    if (ns <= 2) return MOPA_DATA[0].cutoff;
    if (ns >= 500) return MOPA_DATA[MOPA_DATA.length - 1].cutoff;

    for (let i = 0; i < MOPA_DATA.length - 1; i++) {
        if (ns >= MOPA_DATA[i].ns && ns <= MOPA_DATA[i + 1].ns) {
            return interpolate(ns, MOPA_DATA[i].ns, MOPA_DATA[i + 1].ns, MOPA_DATA[i].cutoff, MOPA_DATA[i + 1].cutoff);
        }
    }
    return 80; // Fallback
};

export const calculateLaserPhysics = ({ powerPercent, frequency, pulseWidth, speed, spotSize, lineInterval }) => {
    const nominalPower = 100; // Watts
    const cutoff = getCutoffFreq(pulseWidth);

    let efficiencyFactor = 1.0;
    if (frequency < cutoff) {
        efficiencyFactor = frequency / cutoff;
    }

    const actualAvgPower = nominalPower * (powerPercent / 100) * efficiencyFactor;
    const pulseEnergy = frequency === 0 ? 0 : actualAvgPower / frequency; // mJ
    const peakPower = pulseWidth === 0 ? 0 : (pulseEnergy / pulseWidth) * 1000;

    const spotRadiusCm = (spotSize / 2) / 10000; // um to cm
    const spotArea = Math.PI * (spotRadiusCm * spotRadiusCm); // cm2

    const fluence = spotArea === 0 ? 0 : (pulseEnergy / 1000) / spotArea;
    const irradiance = spotArea === 0 ? 0 : (peakPower / 1000) / spotArea;

    // Overlap Calculation (Pulse Overlap)
    const pulseDistanceMicrons = (speed / (frequency * 1000)) * 1000;
    const overlap = Math.max(0, (1 - (pulseDistanceMicrons / spotSize)) * 100);

    // Hatch Overlap Calculation (Line Overlap)
    const lineIntervalMicrons = lineInterval * 1000;
    const hatchOverlap = Math.max(0, (1 - (lineIntervalMicrons / spotSize)) * 100);

    return {
        cutoff,
        actualAvgPower,
        pulseEnergy,
        peakPower,
        fluence,
        irradiance,
        pulseDistanceMicrons,
        overlap,
        hatchOverlap,
        lineIntervalMicrons,
        efficiencyFactor,
        spotArea
    };
};
