// Инициализация данных для теста
window.GameState.heroes.push({
    id: '1',
    name: 'Воин',
    level: 1,
    exp: 0,
    stats: { hp: 100, attack: 15, defense: 10 },
    inventory: []
});

window.GameState.heroes.push({
    id: '2',
    name: 'Лучник',
    level: 1,
    exp: 0,
    stats: { hp: 70, attack: 20, defense: 5 },
    inventory: []
});

// Запуск UI
// запустите скрипт отрисовки так как необходимо

// Обработчики кнопок
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const costType = e.target.dataset.costType;
        window.GameState.updateResource(costType, -1);
        alert(`Матч начат! Потрачен 1 ${costType}. Ресурсов осталось: ${window.GameState.resources[costType]}`);
    });
});

setInterval(() => {
    window.GameState.passiveUpdate();
}, 1000); // Каждую секунду проверяем, сколько прошло времени

if (!window.GameState.getCurrentHero()) {
    alert('Сначала выберите героя!');
    return;
}
console.log('Игра запущена!');