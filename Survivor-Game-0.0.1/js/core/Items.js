// ==============================
// Базовый класс предмета
// ==============================
class Item {
    /**
     * Создаёт новый предмет
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название предмета
     * @param {string} type - Тип ('weapon', 'armor', 'consumable', 'material')
     * @param {string} rarity - Редкость ('common', 'rare', 'epic', 'legendary')
     * @param {number} basePrice - Базовая цена в провизии
     * @param {string} icon - Иконка предмета (эмодзи)
     */
    constructor(id, name, type, rarity, basePrice, icon = '📦') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.rarity = rarity;
        this.basePrice = basePrice;
        this.icon = icon;
        this.description = ''; // Будет заполняться в дочерних классах
    }
    
    /**
     * Получить цену предмета (может быть переопределена)
     * @returns {number} - Цена в провизии
     */
    /////// <0.0.3|1>
    getPrice() {
        const rarityMultiplier = {
            common: 1,
            rare: 1.5,
            epic: 2,
            legendary: 3
        };

        return Math.floor(this.basePrice * (rarityMultiplier[this.rarity] || 1));
    }
    /////// </0.0.3|1>
}

// ==============================
// Класс оружия
// ==============================
class Weapon extends Item {
    /**
     * Создаёт новое оружие
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название
     * @param {string} rarity - Редкость
     * @param {number} basePrice - Цена
     * @param {Object} stats - Характеристики {damage, range, attackSpeed}
     * @param {string} icon - Иконка
     */
    constructor(id, name, rarity, basePrice, stats, icon = '⚔️') {
        super(id, name, 'weapon', rarity, basePrice, icon);
        this.damage = stats.damage || 0;
        this.range = stats.range || 1; // 1 - ближний бой, 2+ - дальний
        this.attackSpeed = stats.attackSpeed || 1.0;
        this.description = `Урон: ${this.damage}, Дальность: ${this.range}`;
    }
}
// ==============================
// Класс расходника
// ==============================
class Consumable extends Item {
    /**
     * Создаёт новый расходник
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название
     * @param {string} rarity - Редкость
     * @param {number} basePrice - Цена
     * @param {string} effect - Эффект ('heal', 'buff', 'resource')
     * @param {number} value - Сила эффекта
     * @param {string} icon - Иконка
     */
    constructor(id, name, rarity, basePrice, effect, value, icon = '💗') {
        super(id, name, 'consumable', rarity, basePrice, icon);
        this.effect = effect;
        this.value = value;
        this.usableInBattle = true;
        this.description = `${effect === 'heal' ? 'Восстанавливает' : 'Дает'} ${value}`;
    }
}
// ==============================
// Класс материала для крафта
// ==============================
class Material extends Item {
    constructor(id, name, rarity, basePrice, icon = '🔨') {
        super(id, name, 'material', rarity, basePrice, icon);
        this.description = 'Используется для крафта';
    }
}

// Делаем все классы глобальными
window.Weapon = Weapon;
window.Armor = Armor;
window.Consumable = Consumable;
window.Material = Material;
// Делаем класс глобальным
window.Item = Item;
