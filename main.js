const API_BASE = 'https://api.alquran.cloud/v1';

// State management
let allSurahs = [];

async function fetchSurahs() {
    try {
        const response = await fetch(`${API_BASE}/surah`);
        const data = await response.json();
        allSurahs = data.data;
        renderSurahs(allSurahs);
    } catch (error) {
        console.error('Error fetching surahs:', error);
        document.getElementById('surah-container').innerHTML = '<p class="error">Failed to load Surahs. Please try again later.</p>';
    }
}

function renderSurahs(surahs) {
    const container = document.getElementById('surah-container');
    if (!container) return;

    container.innerHTML = '';

    surahs.forEach((surah, index) => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.style.transitionDelay = `${(index % 10) * 0.05}s`;
        card.innerHTML = `
            <div class="surah-info">
                <h3>${surah.number}. ${surah.englishName}</h3>
                <p>${surah.numberOfAyahs} Verses • ${surah.revelationType}</p>
            </div>
            <div class="surah-arabic arabic">${surah.name}</div>
        `;
        card.onclick = () => openSurahDetail(surah.number);
        container.appendChild(card);
        
        // Trigger animation after append
        requestAnimationFrame(() => {
            card.classList.add('show');
        });
    });
}

async function openSurahDetail(number) {
    const homePage = document.getElementById('home-page');
    const detailPage = document.getElementById('detail-page');
    const content = document.getElementById('surah-detail-content');

    // Show detail page, hide home
    homePage.classList.remove('active');
    detailPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    content.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Gathering Knowledge...</p>
        </div>
    `;

    try {
        // Fetch Surah (Arabic) and Tafseer (Jalalayn) in parallel
        const [surahRes, tafseerRes] = await Promise.all([
            fetch(`${API_BASE}/surah/${number}`),
            fetch(`${API_BASE}/surah/${number}/ar.jalalayn`)
        ]);

        const surahData = await surahRes.json();
        const tafseerData = await tafseerRes.json();

        renderDetail(surahData.data, tafseerData.data);
    } catch (error) {
        console.error('Error fetching detail:', error);
        content.innerHTML = '<p class="error">The knowledge could not be retrieved. Please try again.</p>';
    }
}

function renderDetail(surah, tafseer) {
    const content = document.getElementById('surah-detail-content');
    
    let ayahsHTML = '';
    surah.ayahs.forEach((ayah, index) => {
        const tafseerText = tafseer.ayahs[index].text;
        ayahsHTML += `
            <div class="ayah-card">
                <div class="ayah-text arabic">${ayah.text}</div>
                <div class="tafseer-text">
                    <strong>Tafseer Al-Jalalayn:</strong><br>
                    ${tafseerText}
                </div>
            </div>
        `;
    });

    content.innerHTML = `
        <div class="surah-header">
            <p>Chapter ${surah.number}</p>
            <h1>${surah.name}</h1>
            <h2>${surah.englishName}</h2>
            <p>${surah.englishNameTranslation} • ${surah.numberOfAyahs} Ayahs</p>
        </div>
        <div class="ayahs-list">
            ${ayahsHTML}
        </div>
    `;
}

function setupEventListeners() {
    // Back button
    document.getElementById('back-btn').onclick = () => {
        document.getElementById('detail-page').classList.remove('active');
        document.getElementById('home-page').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Search functionality with debounce
    let timeout;
    const searchInput = document.getElementById('quran-search');
    searchInput.oninput = (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            const filtered = allSurahs.filter(s => 
                s.englishName.toLowerCase().includes(query) || 
                s.name.includes(query) ||
                s.number.toString() === query
            );
            renderSurahs(filtered);
        }, 300);
    };

    // Advanced Navbar Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Logo click to home
    document.querySelector('.logo').onclick = () => {
        document.getElementById('detail-page').classList.remove('active');
        document.getElementById('home-page').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderSurahs(allSurahs);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    fetchSurahs();
});
