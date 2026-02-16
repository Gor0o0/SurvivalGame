// Хранилище состояния игры (глобальная переменная)
const GameState = {
    resources: {
        // ресурсы для миссий
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    inventory: {
        // ресурсы для крафта
        wood: 0,
        metal: 0,
        cloth: 0
    },
    _listeners: [],
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

    selectHero(heroId) {
        this.currentHeroId = heroId;
        this.notify();

        // Обновляем отображение в шапке
        const heroNameSpan = document.getElementById('currentHeroName');
        const hero = this.heroes.find(h => h.id === heroId);
        heroNameSpan.textContent = `Герой: ${hero ? hero.name : 'Не выбран'}`;
    },

    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);

        if (diffSeconds >= 1) {
            let resourcesGained = { proviziya: 0, toplivo: 0, instrumenty: 0 };

            // Каждый открытый герой генерирует ресурсы
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    resourcesGained.proviziya += 0.1 * diffSeconds;
                    resourcesGained.toplivo += 0.1 * diffSeconds;
                    resourcesGained.instrumenty += 0.1 * diffSeconds;
                }
            });

            // Применяем накопленное (с округлением)
            this.resources.proviziya += resourcesGained.proviziya;
            this.resources.toplivo += resourcesGained.toplivo;
            this.resources.instrumenty += resourcesGained.instrumenty;

            this.lastPassiveUpdate = now;
            this.notify();
        }


    }


};





// Делаем глобальной
window.GameState = GameState;