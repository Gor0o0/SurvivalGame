class ArenaController {
    constructor() {
        // Создаём менеджер спрайтов
        if (!window.spriteManager) {
            window.spriteManager = new SpriteManager();
        }
        this.arena = null;
        this.initEventListeners();
    }
    
    initEventListeners() {
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                document.getElementById('heroModal').style.display = 'none';

                // Если мы на арене и есть ожидающий навык, сбрасываем его
                if (window.currentArena && window.currentArena.hero && window.currentArena.hero.heroData) {
                    const hero = window.currentArena.hero.heroData;
                    if (hero.pendingSkillLevel > 0) {
                        hero.pendingSkillLevel = 0;
                        window.currentArena.skillChoiceShown = false;
                        window.currentArena.resume();
                    }
                }
            });
        }
    }
    
    startExpedition(location, hero) {
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return false;
        }
        
        console.log('Starting expedition with hero:', hero);
        
        // Сохраняем текущее состояние героя
        hero.currentStats.hp = hero.baseStats.hp;
        
        // Создаём арену
        this.arena = new SurvivorsArena('gameCanvas');
        this.arena.init(hero);
        
        // Переключаем экран
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenArena').classList.add('active');
        
        // Скрываем навигацию
        //document.querySelector('.game-nav').style.display = 'none';
        
        // Принудительно скрываем основной хедер
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader) {
            gameHeader.style.display = 'none';
            gameHeader.style.visibility = 'hidden';
        }
        
        // Даем время на перерисовку DOM
        setTimeout(() => {
            // Запускаем арену
            this.arena.start();
        }, 100);
        
        return true;
    }
}

window.ArenaController = ArenaController;