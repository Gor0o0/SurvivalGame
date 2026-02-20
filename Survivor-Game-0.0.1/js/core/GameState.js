// Хранилище состояния игры (глобальная переменная)
const GameState = {
    resources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    inventory: {
        wood: 0,
        metal: 0,
        cloth: 0
    },
    // +++ НОВОЕ: магазин (пока null, будет инициализирован позже)
    shop: null,
    
    _listeners: [],
    // ... остальные методы
    subscribe(callback) {
        this._listeners.push(callback);
    },
    notify() {
        this._listeners.forEach(cb => cb(this));
    },
    updateResource(type, amount) {
        if (this.resources[type] !== undefined) {
            this.resources[type] = Math.max(0, this.resources[type] + 1);
            this.notify();
        }
    },

    /**
     * Выбирает героя для боя
     * @param {string} heroId - ID героя
     */
    selectHero(heroId) {
        this.currentHeroId = heroId;
        
        // Обновляем отображение в шапке
        const heroNameSpan = document.getElementById('currentHeroName');
        const hero = this.heroes.find(h => h.id === heroId);
        if (hero) {
            heroNameSpan.textContent = `Герой: ${hero.name}`;
        } else {
            heroNameSpan.textContent = 'Герой: Не выбран';
        }
        
        this.notify();
    },
    
    /**
     * Возвращает текущего выбранного героя
     * @returns {Object|null} - Герой или null
     */
    getCurrentHero() {
        return this.heroes.find(h => h.id === this.currentHeroId);
    },
        /**
     * Инициализирует магазин
     */
    initShop() {
        this.shop = new window.Shop();
        this.notify();
    },
    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);
        
        if (diffSeconds >= 1) {
            const resourcesGained = {
                proviziya: 0,
                toplivo: 0,
                instrumenty: 0
            };
            
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    resourcesGained.proviziya += 0.05 * diffSeconds;
                    resourcesGained.toplivo += 0.03 * diffSeconds;
                    resourcesGained.instrumenty += 0.02 * diffSeconds;
                }
            });
            
            this.resources.proviziya = Math.round((this.resources.proviziya + resourcesGained.proviziya) * 10) / 10;
            this.resources.toplivo = Math.round((this.resources.toplivo + resourcesGained.toplivo) * 10) / 10;
            this.resources.instrumenty = Math.round((this.resources.instrumenty + resourcesGained.instrumenty) * 10) / 10;
            
            this.lastPassiveUpdate = now;
            
            // +++ НОВОЕ: проверяем обновление магазина
            if (this.shop) {
                const refreshed = this.shop.checkAndRefresh();
                if (refreshed) {
                    console.log('Ассортимент магазина обновлен!');
                }
            }
            
            this.notify();
        }
    }

};

// Запускаем цикл пассивного обновления (каждую секунду)
setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000);

// Делаем глобальной
window.GameState = GameState;