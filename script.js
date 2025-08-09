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
    const randomizeStatsBtn = document.getElementById('randomize-stats-btn');
    const characterChoices = document.querySelectorAll('input[name="character-choice"]');
    const characterCanvas = document.getElementById('character-canvas');
    const ctx = characterCanvas.getContext('2d');
    let currentCharacterImg = new Image();

    // Customization Stats Display
    const customHpEl = document.getElementById('custom-hp');
    const customAtkEl = document.getElementById('custom-atk');
    const customDefEl = document.getElementById('custom-def');
    const customAgiEl = document.getElementById('custom-agi');
    const customSpeedEl = document.getElementById('custom-speed');
    const customCritRateEl = document.getElementById('custom-crit-rate');
    const customCritDmgEl = document.getElementById('custom-crit-dmg');
    const customAccuracyEl = document.getElementById('custom-accuracy');
    const customResistanceEl = document.getElementById('custom-resistance');

    // Home Screen Stats
    const homePlayerNameEl = document.getElementById('home-player-name');
    const homePlayerLevelEl = document.getElementById('home-player-level');
    const homePlayerXpEl = document.getElementById('home-player-xp');
    const homeXpToNextLevelEl = document.getElementById('home-xp-to-next-level');
    const homePlayerHpEl = document.getElementById('home-player-hp');
    const homePlayerAtkEl = document.getElementById('home-player-atk');
    const homePlayerDefEl = document.getElementById('home-player-def');
    const homePlayerAgiEl = document.getElementById('home-player-agi');
    const homePlayerSpeedEl = document.getElementById('home-player-speed');
    const homePlayerCritRateEl = document.getElementById('home-player-crit-rate');
    const homePlayerCritDmgEl = document.getElementById('home-player-crit-dmg');
    const homePlayerAccuracyEl = document.getElementById('home-player-accuracy');
    const homePlayerResistanceEl = document.getElementById('home-player-resistance');
    const homeCharacterDisplay = document.getElementById('home-character-display');
    const goToFightBtn = document.getElementById('go-to-fight-btn');

    // Game Screen
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

    // --- Game State & Constants ---
    let player = {};
    let enemy = {};
    const characterImages = [
        "images/c1.png", "images/c2.png", "images/c3.png", "images/c4.png", 
        "images/c5.png", "images/c6.png", "images/c7.png"
    ];
    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];
    
    // --- Event Listeners ---
    createCharacterBtn.addEventListener('click', loadOrCreateCharacter);
    acceptCustomizationBtn.addEventListener('click', finalizeCharacterCreation);
    randomizeStatsBtn.addEventListener('click', () => {
        generateInitialStats(player);
        updateCustomizationStatsUI();
    });
    goToFightBtn.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewFight();
    });
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
            generateInitialStats(player);
            updateCustomizationStatsUI();
            customizationScreen.classList.remove('hidden');
            loadCharacterImage(document.querySelector('input[name="character-choice"]:checked').value);
        }
    }
    
    function generateInitialStats(charObject) {
        // Assign fixed secondary stats
        charObject.HP = 1000;
        charObject['Crit Rate'] = 15;
        charObject['Crit Dmg'] = 150;
        charObject.Accuracy = 15;
        charObject.Resistance = 30;

        // Distribute core stats (ATK, DEF, Agility, Speed)
        // Total must be 500, with a minimum of 100 in each.
        let pointsToDistribute = 500 - (100 * 4); // 100 points to distribute
        let coreStats = { ATK: 100, DEF: 100, Agility: 100, Speed: 100 };
        let statKeys = Object.keys(coreStats);

        for (let i = 0; i < pointsToDistribute; i++) {
            let randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
            coreStats[randomStat]++;
        }
        Object.assign(charObject, coreStats);
    }
    
    function finalizeCharacterCreation() {
        const finalImage = characterCanvas.toDataURL();
        Object.assign(player, {
            level: 1,
            xp: 0,
            xpToNextLevel: 10,
            image: finalImage
        });
        player.maxHP = player.HP; // Set max HP for healing

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
            HP: 800 + level * 200,
            ATK: 50 + level * 10,
            DEF: 40 + level * 10,
            Speed: player.Speed - 5 + level,
            'Crit Rate': 10,
            'Crit Dmg': 125,
            imageSrc: image
        };
        enemy.maxHP = enemy.HP;
    }

    function fight() {
        let attacker = player.Speed >= enemy.Speed ? player : enemy;
        let defender = attacker === player ? enemy : player;
        let turn = 1;

        const fightInterval = setInterval(() => {
            if (player.HP <= 0 || enemy.HP <= 0) {
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
        const isCrit = Math.random() < (attacker['Crit Rate'] / 100);
        const damageMultiplier = isCrit ? (attacker['Crit Dmg'] / 100) : 1;
        
        const baseDamage = attacker.ATK * (0.9 + Math.random() * 0.2);
        const damageBeforeDefense = baseDamage * damageMultiplier;

        const defenseFactor = 100 / (100 + defender.DEF);
        const finalDamage = Math.round(damageBeforeDefense * defenseFactor);

        defender.HP = Math.max(0, defender.HP - finalDamage);

        let attackMessage = `${attacker.name} attacks ${defender.name} for ${finalDamage} damage!`;
        if (isCrit) {
            attackMessage = `CRITICAL HIT! ${attacker.name} strikes ${defender.name} for ${finalDamage} damage!`;
        }
        logMessage(attackMessage);

        const attackerElement = (attacker === player) ? playerContainer : enemyContainer;
        attackerElement.classList.add('attack');
        setTimeout(() => attackerElement.classList.remove('attack'), 200);
    }
    
    function endFight() {
        if (player.HP <= 0) {
            logMessage(`You have been defeated by ${enemy.name}!`);
        } else {
            logMessage(`You have vanquished ${enemy.name}!`);
            const xpGained = 2 + enemy.level;
            logMessage(`You gain ${xpGained} XP.`);
            player.xp += xpGained;
            checkLevelUp();
        }
        player.HP = player.maxHP;
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
            
            player.maxHP += 100;
            player.HP = player.maxHP;
            player.ATK += 5;
            player.DEF += 5;

            logMessage(`*** LEVEL UP! You are now level ${player.level}! ***`);
        }
    }

    function logMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        fightLog.appendChild(p);
        fightLog.scrollTop = fightLog.scrollHeight;
    }

    // --- UI Update Functions ---
    function updateCustomizationStatsUI() {
        customHpEl.textContent = player.HP;
        customAtkEl.textContent = player.ATK;
        customDefEl.textContent = player.DEF;
        customAgiEl.textContent = player.Agility;
        customSpeedEl.textContent = player.Speed;
        customCritRateEl.textContent = player['Crit Rate'] + '%';
        customCritDmgEl.textContent = player['Crit Dmg'] + '%';
        customAccuracyEl.textContent = player.Accuracy + '%';
        customResistanceEl.textContent = player.Resistance + '%';
    }

    function updateHomeUI() {
        homePlayerNameEl.textContent = player.name;
        homePlayerLevelEl.textContent = player.level;
        homePlayerXpEl.textContent = player.xp;
        homeXpToNextLevelEl.textContent = player.xpToNextLevel;
        homePlayerHpEl.textContent = player.maxHP;
        homePlayerAtkEl.textContent = player.ATK;
        homePlayerDefEl.textContent = player.DEF;
        homePlayerAgiEl.textContent = player.Agility;
        homePlayerSpeedEl.textContent = player.Speed;
        homePlayerCritRateEl.textContent = player['Crit Rate'];
        homePlayerCritDmgEl.textContent = player['Crit Dmg'];
        homePlayerAccuracyEl.textContent = player.Accuracy;
        homePlayerResistanceEl.textContent = player.Resistance;


        homeCharacterDisplay.innerHTML = '';
        if (player.image) {
            const img = new Image();
            img.src = player.image;
            homeCharacterDisplay.appendChild(img);
        }
    }

    function updateGameUI() {
        // Player
        playerNameEl.textContent = player.name;
        playerLevelEl.textContent = player.level;
        playerHpEl.textContent = player.HP;
        if (player.image) {
            playerImageEl.src = player.image;
        }

        // Enemy
        enemyNameEl.textContent = enemy.name || 'Enemy';
        enemyLevelEl.textContent = enemy.level || '1';
        enemyHpEl.textContent = enemy.HP || '...';
        enemyImageEl.src = enemy.imageSrc || '';
    }

    function loadCharacterImage(src) {
        currentCharacterImg.src = src;
        currentCharacterImg.onload = () => drawCharacterOnCanvas();
        if (currentCharacterImg.complete) drawCharacterOnCanvas();
    }

    function drawCharacterOnCanvas() {
        ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        const hRatio = characterCanvas.width / currentCharacterImg.width;
        const vRatio = characterCanvas.height / currentCharacterImg.height;
        const ratio = Math.min(hRatio, vRatio) * 0.9;
        const centerShift_x = (characterCanvas.width - currentCharacterImg.width * ratio) / 2;
        const centerShift_y = (characterCanvas.height - currentCharacterImg.height * ratio) / 2;
        ctx.drawImage(currentCharacterImg, 0, 0, currentCharacterImg.width, currentCharacterImg.height,
            centerShift_x, centerShift_y, currentCharacterImg.width * ratio, currentCharacterImg.height * ratio);
    }
});