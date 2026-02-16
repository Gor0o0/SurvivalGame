
class UIManager {
    constructor() {
        this.screens = {
            lobby: document.getElementById('screenLobby'),
            heroes: document.getElementById('screenHeroes'),
            shop: document.getElementById('screenShop'),
            craft: document.getElementById('screenCraft'),

        };
        
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.resourceElements = {
            proviziya: document.querySelector('#proviziya span'),
            toplivo: document.querySelector('#toplivo span'),
            instrumenty: document.querySelector('#instrumenty span'),
        };
        
        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();
    }
    
    // инициализация слушателей
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }
    
    showScreen(screenId) {
        Object.values(this.screens).forEach(screen =>
            this.screens.classList.remove('active'));
            this.screens[screenId].classList.add('active');
    }
    
    setActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    subscribeToState() {
        window.GameState.subscribe(() => this.updateResourcesUI());

    }
    
    updateResourcesUI() {
        this.resourceElements.proviziya.textContent = window.GameState.resources.proviziya;
        this.resourceElements.toplivo.textContent = window.GameState.resources.toplivo;
        this.resourceElements.instrumenty.textContent = window.GameState.resources.instrumenty;
    }
    renderHeroes() {
    const container = document.getElementById('heroesList');
    container.innerHTML = '';
    
    window.GameState.heroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        // Подсвечиваем выбранного героя
        if (hero.id === window.GameState.currentHeroId) {
            heroCard.style.border = '2px solid #e94560';
        }
        
        heroCard.innerHTML = `
            <h3>${hero.name} (Ур. ${hero.level})</h3>
            <div class="hero-stats">
                <p>❤️ HP: ${hero.currentStats.hp}</p>
                <p>⚔️ Атака: ${hero.currentStats.attack}</p>
                <p>🛡️ Защита: ${hero.currentStats.defense}</p>
            </div>
            <div class="hero-exp">
                <progress value="${hero.exp}" max="${hero.expToNextLevel}"></progress>
                <p>${hero.exp}/${hero.expToNextLevel} опыта</p>
            </div>
            <div class="hero-skills">
                <p>🎯 Очки навыков: ${hero.skillPoints}</p>
            </div>
            <button class="select-hero-btn" data-hero-id="${hero.id}">Выбрать для боя</button>
            <button class="inventory-hero-btn" data-hero-id="${hero.id}">Инвентарь</button>
        `;
        
        container.appendChild(heroCard);
    });
    
    // Добавляем обработчики
    this.attachHeroButtonListeners();
    }
    showHeroInventory(heroId) {
    const hero = window.GameState.heroes.find(h => h.id === heroId);
    
    modalBody.innerHTML = `
        <h2>Инвентарь ${hero.name}</h2>
        <div class="inventory-grid">
            ${hero.inventory.map((item, index) => {
                if (item) {
                    return `<div class="inventory-slot">
                        ${item.icon || '📦'} ${item.name}
                    </div>`;
                } else {
                    return `<div class="inventory-slot empty">Пусто</div>`;
                }
            }).join('')}
        </div>
        <h3>Экипировка</h3>
        <div class="equipment-grid">
            <div>Оружие: ${hero.equipment.weapon?.name || 'Пусто'}</div>
            <div>Броня: ${hero.equipment.armor?.name || 'Пусто'}</div>
            <div>Аксессуар: ${hero.equipment.accessory?.name || 'Пусто'}</div>
        </div>
    `;
    
    document.getElementById('heroModal').style.display = 'block';
}

}

// Делаем глобальной
window.UIManager = UIManager;