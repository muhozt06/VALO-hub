// araclar.js dosyasının içeriği
// =========================================================

// Tema Değişkenleri
const themeVariables = {
    'dark': { '--primary-color': '#4ADE80', '--secondary-color': '#F97316', 'bg-class': 'bg-zinc-950', 'text-class': 'text-white' },
    'light': { '--primary-color': '#3B82F6', '--secondary-color': '#DC2626', 'bg-class': 'bg-gray-50', 'text-class': 'text-gray-900' },
    'gaming': { '--primary-color': '#F472B6', '--secondary-color': '#A855F7', 'bg-class': 'bg-black', 'text-class': 'text-white' }
};

const getThemeColor = (key) => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    return themeVariables[currentTheme][key];
};

// CROSSHAIR KOPYALAMA JS
function copyToClipboard(elementId, statusId) {
    const codeElement = document.getElementById(elementId);
    const codeText = codeElement.textContent; 
    const statusElement = document.getElementById(statusId);

    navigator.clipboard.writeText(codeText).then(() => {
        
        statusElement.textContent = "✅ Kopyalandı!";
        statusElement.style.color = getThemeColor('--primary-color'); 
        statusElement.classList.remove('invisible', 'opacity-0');
        statusElement.classList.add('visible', 'opacity-100');

        setTimeout(() => {
            statusElement.classList.remove('visible', 'opacity-100');
            statusElement.classList.add('invisible', 'opacity-0');
        }, 2000);

    }).catch(err => {
        statusElement.textContent = "Kopyalama Hatası!";
        statusElement.style.color = '#DC2626'; 
        statusElement.classList.remove('invisible', 'opacity-0');
        statusElement.classList.add('visible', 'opacity-100');
        
        setTimeout(() => {
            statusElement.classList.remove('visible', 'opacity-100');
            statusElement.classList.add('invisible', 'opacity-0');
        }, 3000);
    });
}
// [CROSSHAIR KOPYALAMA JS SONU]


// SAYFA YENİLENMESİNİ ENGELLEYEN VE HESAPLAMA KODLARI
document.addEventListener('DOMContentLoaded', () => {
    
    // DOM Elementlerini yakalama
    const sensForm = document.getElementById('sens-form');
    const rrForm = document.getElementById('rr-form');
    const calculateSensBtn = document.getElementById('calculate-sens-btn');
    const inputSens = document.getElementById('input-sens');
    const resultSens = document.getElementById('result-sens');
    const sourceGame = document.getElementById('source-game-input');
    const targetGame = document.getElementById('target-game-input');
    const calculateRrBtn = document.getElementById('calculate-rr-btn');
    const rankInput = document.getElementById('current-rank-input');
    const performanceScoreInput = document.getElementById('performance-score');
    const matchResultInput = document.getElementById('match-result-input');
    const resultRr = document.getElementById('result-rr');
    const currentRankDisplay = document.getElementById('current-rank-display');
    
    // TEMA DEĞİŞTİRME MANTIĞI
    const themes = ['dark', 'light', 'gaming'];
    const themeIcons = { 'dark': '🌑', 'light': '☀️', 'gaming': '👾' };
    const body = document.getElementById('body');
    const toggleBtn = document.getElementById('toggleBg');
    const bgIcon = document.getElementById('bgIcon');
    const root = document.documentElement;
    const newsTicker = document.getElementById('news-ticker');
    const mainHeader = document.getElementById('main-header');

    function applyTheme(themeName) {
        const themeData = themeVariables[themeName];
        
        body.className = `font-sans transition-colors duration-500 theme-${themeName} ${themeData['bg-class']} ${themeData['text-class']}`;

        for (const [key, value] of Object.entries(themeData)) {
            if (key.startsWith('--')) {
                root.style.setProperty(key, value);
            }
        }
        newsTicker.style.backgroundColor = themeData['--secondary-color'];
        mainHeader.style.backgroundColor = themeName === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 10, 0.9)';
        mainHeader.style.borderColor = themeData['--primary-color'];
        bgIcon.textContent = themeIcons[themeName]; 
        localStorage.setItem('theme', themeName);
    }

    function toggleNextTheme() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        applyTheme(nextTheme);
    }

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'dark'); 

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleNextTheme);
    }
    // [TEMA JS SONU]


    // 1. FORM SUBMIT ENGELLEME (Yenilenme sorununu çözen ana ve eksik kısım)
    if (sensForm) {
        sensForm.addEventListener('submit', function(e) {
            e.preventDefault(); // <-- DİĞER TARAYICILARI DURDURAN KRİTİK KOD!
        });
    }

    if (rrForm) {
        rrForm.addEventListener('submit', function(e) {
            e.preventDefault(); // <-- DİĞER TARAYICILARI DURDURAN KRİTİK KOD!
        });
    }


    /* HASSASİYET DÖNÜŞTÜRÜCÜ JS */
    const CONVERSION_RATIOS = {
        'csgo': 3.181818, 'valorant': 1, 'pubg': 0.35, 'apex': 0.44  
    };

    if (calculateSensBtn) {
        calculateSensBtn.addEventListener('click', () => {
            const source = sourceGame.value; 
            const target = targetGame.value; 
            const inputValue = inputSens.value;

            const inputSensitivity = parseFloat(inputValue.replace(',', '.'));

            if (isNaN(inputSensitivity) || inputSensitivity <= 0 || !CONVERSION_RATIOS[source] || !CONVERSION_RATIOS[target]) {
                resultSens.textContent = "Giriş Hatalı! Değer Kontrolü!";
                resultSens.style.color = getThemeColor('--secondary-color');
                return;
            }

            if (source === target) {
                resultSens.textContent = "Aynı Oyun!";
                resultSens.style.color = getThemeColor('--secondary-color');
                return;
            }

            let baseValorantSens = inputSensitivity * CONVERSION_RATIOS[source];
            let finalSensitivity = baseValorantSens / CONVERSION_RATIOS[target];

            resultSens.textContent = finalSensitivity.toFixed(4);
            resultSens.style.color = getThemeColor('--primary-color');
        });
    }
    // [HASSASİYET DÖNÜŞTÜRÜCÜ JS SONU]


    /* RR HESAPLAYICI JS */
    const RANKS = [
        "Demir 1", "Demir 2", "Demir 3", "Bronz 1", "Bronz 2", "Bronz 3",
        "Gümüş 1", "Gümüş 2", "Gümüş 3", "Altın 1", "Altın 2", "Altın 3",
        "Platin 1", "Platin 2", "Platin 3", "Elmas 1", "Elmas 2", "Elmas 3",
        "Ölümsüzlük 1", "Ölümsüzlük 2", "Ölümsüzlük 3", "Radyant"
    ];

    const getRankText = (value) => {
        return RANKS[value - 1] || "Bilinmiyor";
    };
    
    if (rankInput && currentRankDisplay) {
        rankInput.addEventListener('change', () => {
            const rankValue = parseInt(rankInput.value); 
            currentRankDisplay.textContent = `Mevcut Rank: ${getRankText(rankValue)}`;
        });
        
        const initialRankValue = parseInt(rankInput.value);
        currentRankDisplay.textContent = `Mevcut Rank: ${getRankText(initialRankValue)}`;
    }


    if (calculateRrBtn) {
        calculateRrBtn.addEventListener('click', () => {
            const rankValue = parseInt(rankInput.value); 
            const performance = parseInt(performanceScoreInput.value); 
            const result = matchResultInput.value; 

            let baseRR = 0;
            let mmrAdjustment = 0; 
            
            if (rankValue <= 6) { 
                baseRR = 23; 
                mmrAdjustment = 5; 
            } else if (rankValue <= 12) { 
                baseRR = 18; 
                mmrAdjustment = 0;
            } else if (rankValue <= 18) { 
                baseRR = 16; 
                mmrAdjustment = -3;
            } else { 
                baseRR = 14; 
                mmrAdjustment = -7; 
            }

            let performanceBonus = 0;
            switch(performance) {
                case 5: performanceBonus = 8; break; 
                case 4: performanceBonus = 4; break; 
                case 2: performanceBonus = -3; break; 
                case 1: performanceBonus = -7; break; 
                default: performanceBonus = 0; 
            }
            
            let estimatedRR = 0;
            let color = getThemeColor('--primary-color');

            if (result === 'win') {
                estimatedRR = baseRR + performanceBonus + mmrAdjustment;
                estimatedRR = Math.max(10, estimatedRR); 
                resultRr.textContent = `+${estimatedRR}`;
                color = getThemeColor('--primary-color');
            } else if (result === 'loss') {
                estimatedRR = baseRR - performanceBonus - mmrAdjustment;
                estimatedRR = Math.max(12, estimatedRR); 
                resultRr.textContent = `-${estimatedRR}`;
                color = '#DC2626'; 
            } else if (result === 'draw') {
                estimatedRR = performanceBonus * 1.5; 
                estimatedRR = Math.round(Math.min(10, Math.max(-10, estimatedRR))); 
                resultRr.textContent = `${estimatedRR >= 0 ? '+' : ''}${estimatedRR}`;
                color = estimatedRR >= 0 ? getThemeColor('--primary-color') : '#DC2626';
            }

            resultRr.style.color = color;
            currentRankDisplay.textContent = `Mevcut Rank: ${getRankText(rankValue)}`;
        });
    }
    // [RR HESAPLAYICI JS SONU]
});