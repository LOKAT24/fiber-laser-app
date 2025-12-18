// --- JPT M7 100W DATA APPROXIMATION ---
export const MOPA_DATA = [
    { ns: 2, cutoff: 2900, eMax: 0.03 },
    { ns: 4, cutoff: 2000, eMax: 0.05 },
    { ns: 6, cutoff: 1400, eMax: 0.07 },
    { ns: 9, cutoff: 1000, eMax: 0.10 },
    { ns: 13, cutoff: 700, eMax: 0.14 },
    { ns: 20, cutoff: 500, eMax: 0.20 },
    { ns: 30, cutoff: 350, eMax: 0.28 },
    { ns: 45, cutoff: 250, eMax: 0.40 },
    { ns: 60, cutoff: 200, eMax: 0.50 },
    { ns: 80, cutoff: 160, eMax: 0.62 },
    { ns: 100, cutoff: 130, eMax: 0.76 },
    { ns: 150, cutoff: 90, eMax: 1.10 },
    { ns: 200, cutoff: 70, eMax: 1.40 },
    { ns: 250, cutoff: 67, eMax: 1.50 },
    { ns: 350, cutoff: 67, eMax: 1.50 },
    { ns: 500, cutoff: 67, eMax: 1.50 }
];

// --- KNOWLEDGE BASE / PRESETS ---
export const PRESETS = [
    {
        id: 'manual',
        label: 'Ustawienia Własne (Manual)',
        desc: 'Pełna kontrola nad wszystkimi parametrami.',
        params: null
    },
    {
        id: 'copper_deep',
        label: 'Miedź: Głęboki Grawer',
        desc: 'Miedź silnie odbija IR. Wymaga maksymalnej energii impulsu (długi czas) i wolniejszego skanowania, aby przebić warstwę wierzchnią.',
        params: { power: 100, pulse: 250, freq: 40, speed: 400, hatch: 0.03 }
    },
    {
        id: 'pcb_solder',
        label: 'PCB: Usuwanie Soldermaski',
        desc: 'Kluczowe jest usunięcie żywicy bez uszkodzenia miedzi pod spodem. Używamy średniego impulsu i wysokiej częstotliwości, aby "czyścić" a nie "wiercić".',
        params: { power: 60, pulse: 100, freq: 200, speed: 2000, hatch: 0.05 }
    },
    {
        id: 'pcb_carbon',
        label: 'PCB: Usuwanie Węgla (Laminat)',
        desc: 'Czyszczenie delikatnego laminatu po obróbce. Bardzo krótki impuls (30ns) zapewnia wysoką moc szczytową do ablacji brudu, ale niska energia impulsu nie zwęgla żywicy (FR4).',
        params: { power: 40, pulse: 30, freq: 150, speed: 2500, hatch: 0.04 }
    },
    {
        id: 'steel_black',
        label: 'Stal: Czarne Znakowanie (Annealing)',
        desc: 'Tworzenie tlenków bez odparowania materiału. Bardzo gęsty hatch i zerowa ostrość (często defocus 1-2mm) pomagają w akumulacji ciepła.',
        params: { power: 90, pulse: 200, freq: 300, speed: 300, hatch: 0.005 }
    },
    {
        id: 'alu_white',
        label: 'Aluminium: Białe Znakowanie',
        desc: 'Szybkie spienianie powierzchni. Krótszy impuls zapobiega głębokiemu przetapianiu, dając jasny, matowy kontrast.',
        params: { power: 80, pulse: 60, freq: 60, speed: 1500, hatch: 0.05 }
    },
    {
        id: 'plastic_sensitive',
        label: 'Plastik (ABS/PP): Kontrast',
        desc: 'Materiały wrażliwe na ciepło. Bardzo krótki impuls (<30ns) pozwala na zmianę koloru bez topienia krawędzi (Cold Marking).',
        params: { power: 50, pulse: 10, freq: 40, speed: 2000, hatch: 0.04 }
    },
    {
        id: 'cleaning',
        label: 'Czyszczenie (Rdza/Farba)',
        desc: 'Maksymalna energia uderzeniowa (Peak Power) przy szerokim impulsie, aby wywołać falę uderzeniową odrywającą brud.',
        params: { power: 100, pulse: 500, freq: 30, speed: 3000, hatch: 0.1 }
    }
];
