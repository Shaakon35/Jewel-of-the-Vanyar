document.addEventListener('DOMContentLoaded', () => {
    // --- Screens ---
    const creationScreen = document.getElementById('creation-screen');
    const customizationScreen = document.getElementById('customization-screen');
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');

    // --- Elements ---
    const createCharacterBtn = document.getElementById('create-character-btn');
    const characterNameInput = document.getElementById('character-name-input');
    const acceptCustomizationBtn = document.getElementById('accept-customization-btn');
    const characterChoices = document.querySelectorAll('input[name="character-choice"]');
    const colorHueSlider = document.getElementById('color-hue-slider');
    const characterCanvas = document.getElementById('character-canvas');
    const ctx = characterCanvas.getContext('2d');
    let currentCharacterImg = new Image();

    // Customization Stats Display
    const customStrengthEl = document.getElementById('custom-strength');
    const customSpeedEl = document.getElementById('custom-speed');
    const customAgilityEl = document.getElementById('custom-agility');

    // Home
    const goToFightBtn = document.getElementById('go-to-fight-btn');
    const homeCharacterDisplay = document.getElementById('home-character-display');
    const homePlayerNameEl = document.getElementById('home-player-name');
    const homePlayerLevelEl = document.getElementById('home-player-level');
    const homePlayerXpEl = document.getElementById('home-player-xp');
    const homeXpToNextLevelEl = document.getElementById('home-xp-to-next-level');
    const homePlayerHpEl = document.getElementById('home-player-hp');
    const homePlayerStrengthEl = document.getElementById('home-player-strength');
    const homePlayerSpeedEl = document.getElementById('home-player-speed');
    const homePlayerAgilityEl = document.getElementById('home-player-agility');
    const playerSkillsEl = document.getElementById('player-skills');

    // Game
    const fightLog = document.getElementById('fight-log');
    const playerContainer = document.getElementById('player-container');
    const playerNameEl = document.getElementById('player-name');
    const playerLevelEl = document.getElementById('player-level');
    const playerHpEl = document.getElementById('player-hp');
    const playerImageEl = document.getElementById('player-image');
    const enemyContainer = document.getElementById('enemy-container');
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyLevelEl = document.getElementById('enemy-level');
    const enemyHpEl = document.getElementById('enemy-hp');
    const enemyImageEl = document.getElementById('enemy-image');

    // --- Game State ---
    let player = {};
    let enemy = {};
    const characterImages = ["images/character1.jpg", "images/character2.jpg", "images/character3.jpg"];
    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];

    // --- Event Listeners ---
    createCharacterBtn.addEventListener('click', loadOrCreateCharacter);
    acceptCustomizationBtn.addEventListener('click', finalizeCharacterCreation);
    goToFightBtn.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewFight();
    });

    colorHueSlider.addEventListener('input', drawCharacterOnCanvas);
    characterChoices.forEach(choice => choice.addEventListener('change', (e) => {
        loadCharacterImage(e.target.value);
    }));

    // --- Game Logic ---

    function savePlayer() {
        if (player.name) {
            localStorage.setItem(`character-${player.name}`, JSON.stringify(player));
        }
    }
    
    function loadOrCreateCharacter() {
        const name = characterNameInput.value.trim();
        if (name === "") {
            alert("Please enter a name!");
            return;
        }

        const savedData = localStorage.getItem(`character-${name}`);
        creationScreen.classList.add('hidden');

        if (savedData) {
            player = JSON.parse(savedData);
            homeScreen.classList.remove('hidden');
            updateHomeUI();
        } else {
            player = { name: name };
            generateInitialStats();
            updateCustomizationStatsUI();
            customizationScreen.classList.remove('hidden');
            loadCharacterImage(document.querySelector('input[name="character-choice"]:checked').value);
        }
    }
    
    function generateInitialStats() {
        let strength = 1;
        let speed = 1;
        let agility = 1;
        let remainingPoints = 6;
        while (remainingPoints > 0) {
            const r = Math.floor(Math.random() * 3);
            if (r === 0) strength++;
            else if (r === 1) speed++;
            else agility++;
            remainingPoints--;
        }
        player.strength = strength;
        player.speed = speed;
        player.agility = agility;
    }
    
    function finalizeCharacterCreation() {
        const finalImage = characterCanvas.toDataURL();
        Object.assign(player, {
            level: 1,
            hp: 100,
            maxHp: 100,
            xp: 0,
            xpToNextLevel: 10,
            skills: ["Basic Attack"],
            customization: {
                characterImage: finalImage
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
        const image = characterImages[Math.floor(Math.random() * characterImages.length)];

        enemy = {
            name: name,
            level: level,
            hp: 80 + level * 20,
            maxHp: 80 + level * 20,
            strength: 8 + level * 2,
            speed: 4 + level,
            agility: 3 + level,
            imageSrc: image
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
        // Agility gives a small chance to dodge
        if (Math.random() * 20 < defender.agility) {
            logMessage(`${defender.name} dodges ${attacker.name}'s attack!`);
            return;
        }

        const damage = Math.floor(attacker.strength + (Math.random() * attacker.strength / 2));
        defender.hp = Math.max(0, defender.hp - damage);
        logMessage(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);

        const attackerElement = (attacker === player) ? playerContainer : enemyContainer;
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
            player.strength += 2;
            player.speed += 1;
            player.agility += 1;

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
    function updateCustomizationStatsUI() {
        customStrengthEl.textContent = player.strength;
        customSpeedEl.textContent = player.speed;
        customAgilityEl.textContent = player.agility;
    }

    function updateHomeUI() {
        homePlayerNameEl.textContent = player.name;
        homePlayerLevelEl.textContent = player.level;
        homePlayerXpEl.textContent = player.xp;
        homeXpToNextLevelEl.textContent = player.xpToNextLevel;
        homePlayerHpEl.textContent = player.maxHp;
        homePlayerStrengthEl.textContent = player.strength;
        homePlayerSpeedEl.textContent = player.speed;
        homePlayerAgilityEl.textContent = player.agility;

        homeCharacterDisplay.innerHTML = '';
        if (player.customization && player.customization.characterImage) {
            const img = new Image();
            img.src = player.customization.characterImage;
            homeCharacterDisplay.appendChild(img);
        }

        playerSkillsEl.innerHTML = '';
        if(player.skills) {
            player.skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                playerSkillsEl.appendChild(li);
            });
        }
    }

    function updateGameUI() {
        playerNameEl.textContent = player.name;
        playerLevelEl.textContent = player.level;
        playerHpEl.textContent = player.hp;

        if (player.customization && player.customization.characterImage) {
            playerImageEl.src = player.customization.characterImage;
        }

        enemyNameEl.textContent = enemy.name || 'Enemy';
        enemyLevelEl.textContent = enemy.level || '1';
        enemyHpEl.textContent = enemy.hp || '100';
        enemyImageEl.src = enemy.imageSrc || '';
    }

    // --- Customization UI ---
    function loadCharacterImage(src) {
        currentCharacterImg.src = src; // Set src immediately
        currentCharacterImg.onload = () => {
            drawCharacterOnCanvas();
        };
        // If image is already cached, onload might not fire, so draw it just in case
        if (currentCharacterImg.complete) {
            drawCharacterOnCanvas();
        }
    }

    function drawCharacterOnCanvas() {
        ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        ctx.filter = `hue-rotate(${colorHueSlider.value}deg)`;

        const hRatio = characterCanvas.width / currentCharacterImg.width;
        const vRatio = characterCanvas.height / currentCharacterImg.height;
        const ratio = Math.min(hRatio, vRatio) * 0.9;
        const centerShift_x = (characterCanvas.width - currentCharacterImg.width * ratio) / 2;
        const centerShift_y = (characterCanvas.height - currentCharacterImg.height * ratio) / 2;

        ctx.drawImage(currentCharacterImg, 0, 0, currentCharacterImg.width, currentCharacterImg.height,
            centerShift_x, centerShift_y, currentCharacterImg.width * ratio, currentCharacterImg.height * ratio);
        ctx.filter = 'none';
    }
});