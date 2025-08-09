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
    const characterChoices = document.querySelectorAll('input[name="character-choice"]');
    const colorHueSlider = document.getElementById('color-hue-slider');
    const characterCanvas = document.getElementById('character-canvas');
    const ctx = characterCanvas.getContext('2d');
    let currentCharacterImg = new Image();

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
    const playerSkillsEl = document.getElementById('player-skills');

    // Game
    const fightLog = document.getElementById('fight-log');
    const playerContainer = document.getElementById('player-container');
    const playerNameEl = document.getElementById('player-name');
    const playerLevelEl = document.getElementById('player-level');
    const playerHpEl = document.getElementById('player-hp');
    const playerImageEl = document.getElementById('player-image');
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyLevelEl = document.getElementById('enemy-level');
    const enemyHpEl = document.getElementById('enemy-hp');

    // --- Game State ---
    let player = {};
    let enemy = {};
    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];

    // --- Event Listeners ---
    // This handles the "Validate" button on the first screen.
    createBruteBtn.addEventListener('click', loadOrCreateBrute);

    // This handles the "Create Brute" button on the customization screen.
    acceptCustomizationBtn.addEventListener('click', finalizeBruteCreation);

    // This handles the "Find a New Opponent" button on the home screen.
    goToFightBtn.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startNewFight();
    });

    // Customization Listeners
    colorHueSlider.addEventListener('input', drawCharacterOnCanvas);
    characterChoices.forEach(choice => choice.addEventListener('change', (e) => {
        loadCharacterImage(e.target.value);
    }));

    // --- Game Logic ---

    function savePlayer() {
        if (player.name) {
            localStorage.setItem(`brute-${player.name}`, JSON.stringify(player));
        }
    }
    
    // Transition 1: From Creation to Home/Customization
    function loadOrCreateBrute() {
        const name = bruteNameInput.value.trim();
        if (name === "") {
            alert("Please enter a name!");
            return;
        }

        const savedData = localStorage.getItem(`brute-${name}`);

        creationScreen.classList.add('hidden'); // Hide the creation screen

        if (savedData) {
            // If player exists, go to Home Screen
            player = JSON.parse(savedData);
            homeScreen.classList.remove('hidden');
            updateHomeUI();
            alert(`Welcome back, ${player.name}!`);
        } else {
            // If new player, go to Customization Screen
            player = { name: name };
            customizationScreen.classList.remove('hidden');
            // Load the default selected character image
            loadCharacterImage(document.querySelector('input[name="character-choice"]:checked').value);
        }
    }

    // Transition 2: From Customization to Home
    function finalizeBruteCreation() {
        // Create the final character image with color adjustments
        const finalImage = characterCanvas.toDataURL();

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
                characterImage: finalImage
            }
        });

        savePlayer();
        customizationScreen.classList.add('hidden'); // Hide customization
        homeScreen.classList.remove('hidden');      // Show home screen
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
            playerContainer :
            document.getElementById('enemy-container');

        attackerElement.classList.add('attack');
        setTimeout(() => attackerElement.classList.remove('attack'), 200);
    }
    
    // Transition 3: From Game to Home
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
            gameScreen.classList.add('hidden'); // Hide game screen
            homeScreen.classList.remove('hidden'); // Show home screen
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

        homeCharacterDisplay.innerHTML = '';
        if (player.customization && player.customization.characterImage) {
            const img = new Image();
            img.src = player.customization.characterImage;
            homeCharacterDisplay.appendChild(img);
        }

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

        if (player.customization && player.customization.characterImage) {
            playerImageEl.src = player.customization.characterImage;
        }

        enemyNameEl.textContent = enemy.name || 'Enemy';
        enemyLevelEl.textContent = enemy.level || '1';
        enemyHpEl.textContent = enemy.hp || '100';
    }

    // --- Customization UI ---
    function loadCharacterImage(src) {
        currentCharacterImg.onload = () => {
            drawCharacterOnCanvas();
        };
        currentCharacterImg.src = src;
    }

    function drawCharacterOnCanvas() {
        ctx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        ctx.filter = `hue-rotate(${colorHueSlider.value}deg)`;

        // Draw the image centered and scaled to fit
        const hRatio = characterCanvas.width / currentCharacterImg.width;
        const vRatio = characterCanvas.height / currentCharacterImg.height;
        const ratio = Math.min(hRatio, vRatio) * 0.9; // 0.9 to add some padding
        const centerShift_x = (characterCanvas.width - currentCharacterImg.width * ratio) / 2;
        const centerShift_y = (characterCanvas.height - currentCharacterImg.height * ratio) / 2;

        ctx.drawImage(currentCharacterImg, 0, 0, currentCharacterImg.width, currentCharacterImg.height,
            centerShift_x, centerShift_y, currentCharacterImg.width * ratio, currentCharacterImg.height * ratio);
        ctx.filter = 'none'; // Reset filter
    }
});