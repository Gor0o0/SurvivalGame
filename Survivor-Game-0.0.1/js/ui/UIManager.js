
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
                
                // +++ НОВОЕ: добавили проверку на магазин
                if (screenId === 'heroes') {
                    this.renderHeroes();
                } else if (screenId === 'shop') {
                    this.renderShop();
                }
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    } 
    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();
            
            if (this.screens.heroes.classList.contains('active')) {
                this.renderHeroes();
            } 
            // +++ НОВОЕ: обновляем магазин если он активен
            else if (this.screens.shop.classList.contains('active')) {
                this.renderShop();
            }
        });
    }
    
    updateResourcesUI() {
        this.resourceElements.proviziya.textContent = window.GameState.resources.proviziya;
        this.resourceElements.toplivo.textContent = window.GameState.resources.toplivo;
        this.resourceElements.instrumenty.textContent = window.GameState.resources.instrumenty;
    }
    /**
     * Отрисовывает список героев
     */
    renderHeroes() {
        const container = document.getElementById('heroesList');
        container.innerHTML = ''; // Очищаем контейнер
        
        window.GameState.heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            
            // Если герой выбран - выделяем его красной рамкой
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
                <button class="select-hero-btn" data-hero-id="${hero.id}">Выбрать для боя</button>
                <button class="inventory-hero-btn" data-hero-id="${hero.id}">Инвентарь</button>
            `;
            
            container.appendChild(heroCard);
        });
        
        // Добавляем обработчики для кнопок выбора героя
        document.querySelectorAll('.select-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                window.GameState.selectHero(heroId);
                this.renderHeroes(); // Перерисовываем для обновления рамки
            });
        });
        
        // Добавляем обработчики для кнопок инвентаря
        document.querySelectorAll('.inventory-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                this.showHeroInventory(heroId);
            });
        });
    }
        /**
     * Отрисовывает магазин
     */
    renderShop() {
        const container = document.getElementById('shopItems');
        container.innerHTML = '';
        
        if (!window.GameState.shop) {
            container.innerHTML = '<p>Магазин не инициализирован</p>';
            return;
        }
        
        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }
        
        window.GameState.shop.dailyItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'shop-item';
            
            // Определяем цвет редкости
            let rarityColor = '#ffffff';
            if (item.rarity === 'rare') rarityColor = '#4caaff';
            if (item.rarity === 'epic') rarityColor = '#aa4cff';
            if (item.rarity === 'legendary') rarityColor = '#ffaa4c';
            
            itemCard.innerHTML = `
                <div style="font-size: 3rem;">${item.icon}</div>
                <h3 style="color: ${rarityColor};">${item.name}</h3>
                <p class="item-type">${item.type}</p>
                <p class="item-description">${item.description}</p>
                <p class="item-price">💰 ${item.getPrice()} провизии</p>
                <p class="item-rarity" style="color: ${rarityColor};">${item.rarity}</p>
                <button class="buy-item-btn" data-item-id="${item.id}">Купить</button>
            `;
            
            container.appendChild(itemCard);
        });
        
        // Добавляем обработчики покупки
        document.querySelectorAll('.buy-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const currentHero = window.GameState.getCurrentHero();
                
                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }
                
                const result = window.GameState.shop.buyItem(itemId, currentHero.id);
                
                if (result.success) {
                    alert(result.message);
                    this.renderShop(); // Обновляем магазин
                } else {
                    alert(result.message);
                }
            });
        });
        
        // Добавляем информацию о времени обновления
        const lastUpdate = new Date(window.GameState.shop.lastUpdate);
        const nextUpdate = new Date(lastUpdate.getTime() + 30000); // +30 секунд для теста
        
        const shopInfo = document.createElement('div');
        shopInfo.className = 'shop-info';
        shopInfo.style.marginTop = '20px';
        shopInfo.style.textAlign = 'center';
        shopInfo.innerHTML = `
            <p>🔄 Ассортимент обновится через: <span id="shopTimer"></span>с</p>
        `;
        container.appendChild(shopInfo);
        
        // Запускаем таймер обновления
        this.startShopTimer();
    }
        /**
     * Запускает таймер обновления магазина
     */
    startShopTimer() {
        if (this.shopTimer) clearInterval(this.shopTimer);
        
        this.shopTimer = setInterval(() => {
            const timerElement = document.querySelector('#shopTimer');
            if (timerElement) {
                const lastUpdate = window.GameState.shop.lastUpdate;
                const timeLeft = Math.max(0, 30 - Math.floor((Date.now() - lastUpdate) / 1000));
                timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    this.renderShop(); // Перерисовываем при обновлении
                }
            }
        }, 1000);
    }

    /**
     * Показывает инвентарь героя в модальном окне
     * @param {string} heroId - ID героя
     */
    /**
     * Показывает инвентарь героя в модальном окне
     * @param {string} heroId - ID героя
     */
    showHeroInventory(heroId) {
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        if (!hero) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Инвентарь ${hero.name}</h2>
            <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                ${hero.inventory.map((item, index) => {
                    if (item) {
                        return `<div class="inventory-slot" data-slot="${index}" style="background: #0f3460; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 2rem;">${item.icon}</div>
                            <div>${item.name}</div>
                            ${item.type === 'consumable' ? '<button class="use-item-btn" data-hero-id="' + heroId + '" data-slot="' + index + '">Использовать</button>' : ''}
                        </div>`;
                    } else {
                        return `<div class="inventory-slot empty" data-slot="${index}" style="background: #1a1a2e; padding: 15px; border-radius: 5px; border: 1px dashed #0f3460; text-align: center;">
                            Пусто
                        </div>`;
                    }
                }).join('')}
            </div>
            <h3>Экипировка</h3>
            <div class="equipment-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Оружие:</strong><br>
                    ${hero.equipment.weapon ? hero.equipment.weapon.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Броня:</strong><br>
                    ${hero.equipment.armor ? hero.equipment.armor.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Аксессуар:</strong><br>
                    ${hero.equipment.accessory ? hero.equipment.accessory.name : 'Пусто'}
                </div>
            </div>
        `;
        
        // Добавляем обработчики для использования расходников
        document.querySelectorAll('.use-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                const slot = parseInt(e.target.dataset.slot);
                const hero = window.GameState.heroes.find(h => h.id === heroId);
                
                if (hero && hero.useConsumable(slot)) {
                    alert('Предмет использован!');
                    this.showHeroInventory(heroId); // Обновляем отображение
                } else {
                    alert('Нельзя использовать этот предмет сейчас');
                }
            });
        });
        
        document.getElementById('heroModal').style.display = 'block';
    }

}

// Делаем глобальной
window.UIManager = UIManager;