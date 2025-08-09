document.addEventListener('DOMContentLoaded', () => {
    // --- Screens ---
    const creationScreen = document.getElementById('creation-screen');
    const customizationScreen = document.getElementById('customization-screen');
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');

    // --- Elements ---
    // Creation
    const createBruteBtn = document.getElementById('create-brute-btn');
    const bruteNameInput = document.getElementById('brute-name-input');
    
    // Customization
    const acceptCustomizationBtn = document.getElementById('accept-customization-btn');
    const randomizeColorsBtn = document.getElementById('randomize-colors-btn');
    const genderSelect = document.getElementById('gender-select');
    const haircutSelect = document.getElementById('haircut-select');
    const shapeSelect = document.getElementById('shape-select');
    const colorBody = document.getElementById('color-body');
    const colorHair = document.getElementById('color-hair');
    const characterPreview = document.querySelector('.brute-visual');

    // Home
    const goToFightBtn = document.getElementById('go-to-fight-btn');
    const homePlayerNameEl = document.getElementById('home-player-name');
    const homePlayerLevelEl = document.getElementById('home-player-level');
    const homePlayerXpEl = document.getElementById('home-player-xp');
    const homeXpToNextLevelEl = document.getElementById('home-xp-to-next-level');
    const homePlayerHpEl = document.getElementById('home-player-hp');
    const homePlayerStrengthEl = document.getElementById('home-player-strength');
    const homePlayerSpeedEl = document.getElementById('home-player-speed');
    const playerSkillsEl = document.getElementById('player-skills');

    // Game
    const fightLog = document.getElementById('fight-log');
    const playerNameEl = document.getElementById('player-name');
    const playerLevelEl = document.getElementById('player-level');
    const playerHpEl = document.getElementById('player-hp');
    const playerXpEl = document.getElementById('player-xp');
    const xpToNextLevelEl = document.getElementById('xp-to-next-level');
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyLevelEl = document.getElementById('enemy-level');
    const enemyHpEl = document.getElementById('enemy-hp');

    // --- Game State ---
    let player = {};
    let enemy = {};
    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];

    // --- Event Listeners ---
    createBruteBtn.addEventListener('click', loadOrCreateBrute);
    acceptCustomizationBtn.addEventListener('click', finalizeBruteCreation);
    
    goToFightBtn.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewFight();
    });

    // Customization Listeners
    randomizeColorsBtn.addEventListener('click', randomizeColors);
    [colorBody, colorHair].forEach(input => input.addEventListener('input', updateCharacterPreview));

    // --- Game Logic ---

    function savePlayer() {
        if (player.name) {
            localStorage.setItem(`brute-${player.name}`, JSON.stringify(player));
        }
    }

    function loadOrCreateBrute() {
        const name = bruteNameInput.value.trim();
        if (name === "") {
            alert("Please enter a name!");
            return;
        }

        const savedData = localStorage.getItem(`brute-${name}`);

        if (savedData) {
            player = JSON.parse(savedData);
            creationScreen.classList.add('hidden');
            homeScreen.classList.remove('hidden');
            updateHomeUI();
            alert(`Welcome back, ${player.name}!`);
        } else {
            player = { name: name };
            creationScreen.classList.add('hidden');
            customizationScreen.classList.remove('hidden');
            updateCharacterPreview();
        }
    }

    function finalizeBruteCreation() {
        // Assign customization and base stats
        Object.assign(player, {
            level: 1,
            hp: 100,
            maxHp: 100,
            strength: 10,
            speed: 5,
            xp: 0,
            xpToNextLevel: 10,
            skills: ["Basic Attack"],
            customization: {
                gender: genderSelect.value,
                haircut: haircutSelect.value,
                shape: shapeSelect.value,
                colors: {
                    body: colorBody.value,
                    hair: colorHair.value
                }
            }
        });

        savePlayer();
        customizationScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        updateHomeUI();
    }
    
    function startNewFight() {
        generateEnemy();
        updateGameUI();
        fightLog.innerHTML = '';
        logMessage(`A new challenger appears: ${enemy.name}!`);
        setTimeout(fight, 1000);
    }

    function generateEnemy() {
        const name = enemyNames[Math.floor(Math.random() * enemyNames.length)];
        const level = Math.max(1, player.level + Math.floor(Math.random() * 3) - 1);
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
            [attacker, defender] = [defender, attacker];
            turn++;
            updateGameUI();
        }, 1500);
    }

    function performAttack(attacker, defender) {
        const damage = Math.floor(attacker.strength + (Math.random() * attacker.strength / 2));
        defender.hp = Math.max(0, defender.hp - damage);
        logMessage(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);
        
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
        player.hp = player.maxHp;
        savePlayer();
        
        logMessage(`Returning to Home...`);
        setTimeout(() => {
            gameScreen.classList.add('hidden');
            homeScreen.classList.remove('hidden');
            updateHomeUI();
        }, 3000);
        
        updateGameUI();
    }

    function checkLevelUp() {
        if (player.xp >= player.xpToNextLevel) {
            player.level++;
            player.xp = 0;
            player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
            player.maxHp += 20;
            player.hp = player.maxHp;
            player.strength += 3;
            player.speed += 1;

            if (player.level % 3 === 0) {
                const newSkill = "Power Attack";
                if (!player.skills.includes(newSkill)) {
                     player.skills.push(newSkill);
                     logMessage(`*** You learned a new skill: ${newSkill}! ***`);
                }
            }
            logMessage(`*** LEVEL UP! You are now level ${player.level}! ***`);
        }
    }

    function logMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        fightLog.appendChild(p);
        fightLog.scrollTop = fightLog.scrollHeight;
    }

    // --- UI Updates ---
    function updateHomeUI() {
        homePlayerNameEl.textContent = player.name;
        homePlayerLevelEl.textContent = player.level;
        homePlayerXpEl.textContent = player.xp;
        homeXpToNextLevelEl.textContent = player.xpToNextLevel;
        homePlayerHpEl.textContent = player.maxHp;
        homePlayerStrengthEl.textContent = player.strength;
        homePlayerSpeedEl.textContent = player.speed;

        playerSkillsEl.innerHTML = '';
        player.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            playerSkillsEl.appendChild(li);
        });
    }

    function updateGameUI() {
        playerNameEl.textContent = player.name;
        playerLevelEl.textContent = player.level;
        playerHpEl.textContent = player.hp;
        playerXpEl.textContent = player.xp;
        xpToNextLevelEl.textContent = player.xpToNextLevel;
        enemyNameEl.textContent = enemy.name;
        enemyLevelEl.textContent = enemy.level;
        enemyHpEl.textContent = enemy.hp;
    }

    // --- Customization UI ---
    function randomizeColors() {
        colorBody.value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        colorHair.value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        updateCharacterPreview();
    }

    function updateCharacterPreview() {
        characterPreview.style.setProperty('--body-color', colorBody.value);
        characterPreview.style.setProperty('--hair-color', colorHair.value);
    }
});