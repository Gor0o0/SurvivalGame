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
        // +++ НОВОЕ: переименовываем для крафта (было wood, metal, cloth)
        material_wood: 5,
        material_iron: 2,
        material_cloth: 3
    },
    shop: null,
    // +++ НОВОЕ: менеджер рецептов
    recipeManager: null,
    
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
     * Получить все материалы для отображения в удобном формате
     * @returns {Object} - Объект с материалами
     */
    getMaterials() {
        return {
            wood: this.inventory.material_wood || 0,
            iron: this.inventory.material_iron || 0,
            cloth: this.inventory.material_cloth || 0
        };
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
        /**
     * Инициализация рецептов
     */
    initRecipes() {
        this.recipeManager = new window.RecipeManager();
        this.notify();
    },
        /**
     * Крафт предмета
     * @param {string} recipeId - ID рецепта
     * @param {string} heroId - ID героя
     * @returns {Object} - Результат крафта
     */
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        // Крафтим предмет
        const result = this.recipeManager.craft(recipeId, hero, this.inventory);
        
        if (result.success) {
            this.notify(); // Обновляем UI
        }
        
        return result;
    },
        /**
     * Добавляет награды после боя (материалы и возможные рецепты)
     * @returns {Object} - Объект с наградами
     */
    addBattleRewards() {
        // Случайные материалы
        const materials = [
            { type: 'material_wood', amount: Math.floor(Math.random() * 3) + 1 },
            { type: 'material_iron', amount: Math.floor(Math.random() * 2) },
            { type: 'material_cloth', amount: Math.floor(Math.random() * 2) }
        ];
        
        materials.forEach(m => {
            if (m.amount > 0) {
                this.updateMaterial(m.type, m.amount);
            }
        });
        
        // Шанс открыть новый рецепт (30%)
        if (this.recipeManager && Math.random() < 0.3) {
            const newRecipe = this.recipeManager.tryUnlockRandomRecipe();
            if (newRecipe) {
                return {
                    materials: materials,
                    newRecipe: newRecipe
                };
            }
        }
        
        return { materials: materials };
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