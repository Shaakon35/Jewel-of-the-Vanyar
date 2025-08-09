document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const creationScreen = document.getElementById('creation-screen');
    const gameScreen = document.getElementById('game-screen');
    const createBruteBtn = document.getElementById('create-brute-btn');
    const bruteNameInput = document.getElementById('brute-name-input');
    const fightBtn = document.getElementById('fight-btn');
    const fightLog = document.getElementById('fight-log');

    // Player Elements
    const playerNameEl = document.getElementById('player-name');
    const playerLevelEl = document.getElementById('player-level');
    const playerHpEl = document.getElementById('player-hp');
    const playerXpEl = document.getElementById('player-xp');
    const xpToNextLevelEl = document.getElementById('xp-to-next-level');

    // Enemy Elements
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyLevelEl = document.getElementById('enemy-level');
    const enemyHpEl = document.getElementById('enemy-hp');

    // --- Game State ---
    let player = {};
    let enemy = {};

    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];

    // --- Event Listeners ---
    createBruteBtn.addEventListener('click', createBrute);
    fightBtn.addEventListener('click', startNewFight);

    // --- Game Logic ---
    function createBrute() {
        const name = bruteNameInput.value.trim();
        if (name === "") {
            alert("Please enter a name for your brute!");
            return;
        }

        player = {
            name: name,
            level: 1,
            hp: 100,
            maxHp: 100,
            strength: 10,
            speed: 5,
            xp: 0,
            xpToNextLevel: 10,
        };

        creationScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        updatePlayerUI();
        startNewFight();
    }

    function startNewFight() {
        generateEnemy();
        updateEnemyUI();
        fightBtn.classList.add('hidden');
        fightLog.innerHTML = '';
        logMessage(`A new challenger appears: ${enemy.name}!`);
        setTimeout(fight, 1000);
    }

    function generateEnemy() {
        const name = enemyNames[Math.floor(Math.random() * enemyNames.length)];
        const level = Math.max(1, player.level + Math.floor(Math.random() * 3) - 1); // Enemy level is close to player's
        enemy = {
            name: name,
            level: level,
            hp: 80 + level * 20,
            maxHp: 80 + level * 20,
            strength: 8 + level * 2,
            speed: 4 + level,
        };
    }

    function fight() {
        let attacker = player.speed >= enemy.speed ? player : enemy;
        let defender = attacker === player ? enemy : player;
        let turn = 1;

        const fightInterval = setInterval(() => {
            if (player.hp <= 0 || enemy.hp <= 0) {
                clearInterval(fightInterval);
                endFight();
                return;
            }

            logMessage(`--- Turn ${turn} ---`);
            performAttack(attacker, defender);

            // Swap roles
            [attacker, defender] = [defender, attacker];
            turn++;
            updateUI();
        }, 1500);
    }

    function performAttack(attacker, defender) {
        const damage = Math.floor(attacker.strength + (Math.random() * attacker.strength / 2));
        defender.hp = Math.max(0, defender.hp - damage);
        logMessage(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);
        
        // Visual feedback for attack
        const attackerElement = (attacker === player) ? 
            document.getElementById('player-container') : 
            document.getElementById('enemy-container');
            
        attackerElement.classList.add('attack');
        setTimeout(() => attackerElement.classList.remove('attack'), 200);
    }
    
    function endFight() {
        if (player.hp <= 0) {
            logMessage(`You have been defeated by ${enemy.name}!`);
        } else {
            logMessage(`You have vanquished ${enemy.name}!`);
            const xpGained = 2 + enemy.level;
            logMessage(`You gain ${xpGained} XP.`);
            player.xp += xpGained;
            checkLevelUp();
        }
        player.hp = player.maxHp; // Restore health after fight
        fightBtn.classList.remove('hidden');
        updateUI();
    }

    function checkLevelUp() {
        if (player.xp >= player.xpToNextLevel) {
            player.level++;
            player.xp = 0;
            player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
            
            // Improve stats
            player.maxHp += 20;
            player.hp = player.maxHp;
            player.strength += 3;
            player.speed += 1;

            logMessage(`*** LEVEL UP! You are now level ${player.level}! ***`);
        }
    }

    function logMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        fightLog.appendChild(p);
        fightLog.scrollTop = fightLog.scrollHeight; // Auto-scroll to bottom
    }

    // --- UI Updates ---
    function updatePlayerUI() {
        playerNameEl.textContent = player.name;
        playerLevelEl.textContent = player.level;
        playerHpEl.textContent = player.hp;
        playerXpEl.textContent = player.xp;
        xpToNextLevelEl.textContent = player.xpToNextLevel;
    }

    function updateEnemyUI() {
        enemyNameEl.textContent = enemy.name;
        enemyLevelEl.textContent = enemy.level;
        enemyHpEl.textContent = enemy.hp;
    }

    function updateUI() {
        updatePlayerUI();
        updateEnemyUI();
    }
});