const surahs = [
    { id: 1, name: "Al-Fatihah", arabic: "الفاتحة", verses: 7, type: "Meccan" },
    { id: 2, name: "Al-Baqarah", arabic: "البقرة", verses: 286, type: "Medinan" },
    { id: 18, name: "Al-Kahf", arabic: "الكهف", verses: 110, type: "Meccan" },
    { id: 36, name: "Ya-Sin", arabic: "يس", verses: 83, type: "Meccan" },
    { id: 55, name: "Ar-Rahman", arabic: "الرحمن", verses: 78, type: "Medinan" },
    { id: 67, name: "Al-Mulk", arabic: "الملك", verses: 30, type: "Meccan" },
];

function init() {
    const container = document.getElementById('surah-container');
    if (!container) return;

    container.innerHTML = '';

    surahs.forEach(surah => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.innerHTML = `
            <div class="surah-info">
                <h3>${surah.id}. ${surah.name}</h3>
                <p>${surah.verses} Verses • ${surah.type}</p>
            </div>
            <div class="surah-arabic arabic">${surah.arabic}</div>
        `;
        card.onclick = () => {
            alert(`Opening Tafseer for ${surah.name}... (Feature coming soon)`);
        };
        container.appendChild(card);
    });

    // Simple scroll effect for navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'var(--shadow)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    console.log('Tafseer v0 Draft Initialized');
}

document.addEventListener('DOMContentLoaded', init);
