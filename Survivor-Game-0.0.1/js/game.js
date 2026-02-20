// ==============================
// Глобальный файл - точка запуска
// ==============================

// +++ НОВОЕ: Создаём трёх героев через класс Hero
const warrior = new window.Hero(
    '1', 
    'Воин', 
    { hp: 120, attack: 18, defense: 12, speed: 8 }, 
    'warrior'
);

const archer = new window.Hero(
    '2', 
    'Лучник', 
    { hp: 80, attack: 22, defense: 6, speed: 15 }, 
    'archer'
);

const mage = new window.Hero(
    '3', 
    'Маг', 
    { hp: 70, attack: 25, defense: 4, speed: 12 }, 
    'mage'
);

// Добавляем тестовые предметы в инвентарь
warrior.addToInventory(new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🧪'));
warrior.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));

warrior.addToInventory({
    id: 'item2',
    name: 'Меч',
    type: 'weapon',
    bonusAttack: 5,
    icon: '⚔️'
});
// Запуск UI
// запустите скрипт отрисовки так как необходимо

// Обработчики кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const costType = e.target.dataset.costType;
        
        if (!window.GameState.getCurrentHero()) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        window.GameState.updateResource(costType, -1);
        
        // +++ НОВОЕ: даем немного опыта за матч
        const currentHero = window.GameState.getCurrentHero();
        currentHero.addExp(10);
        
        alert(`Матч начат с героем ${currentHero.name}! Потрачен 1 ${costType}. Получено 10 опыта.`);
    });
});

setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000); // Каждую секунду проверяем, сколько прошло времени

if (!window.GameState.getCurrentHero()) {
    alert('Сначала выберите героя!');
    return;
}

// Добавляем героев в глобальное состояние
window.GameState.heroes.push(warrior);
window.GameState.heroes.push(archer);
window.GameState.heroes.push(mage);
// Автоматически выбираем первого героя
window.GameState.selectHero('1');

// +++ НОВОЕ: инициализируем магазин
window.GameState.initShop();
// +++ НОВОЕ: Автоматически выбираем первого героя
window.GameState.selectHero('1');

console.log('Игра запущена! Магазин инициализирован.');
