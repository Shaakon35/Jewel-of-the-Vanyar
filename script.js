document.addEventListener('DOMContentLoaded', () => {
    // --- Screens & Elements ---
    const screens = {
        creation: document.getElementById('creation-screen'),
        customization: document.getElementById('customization-screen'),
        home: document.getElementById('home-screen'),
        game: document.getElementById('game-screen'),
        ranking: document.getElementById('ranking-screen')
    };
    const topMenu = document.getElementById('top-menu');
    const menuHomeBtn = document.getElementById('menu-home-btn');
    const menuFightBtn = document.getElementById('menu-fight-btn');
    const menuRankingBtn = document.getElementById('menu-ranking-btn');
    const createCharacterBtn = document.getElementById('create-character-btn');
    const characterNameInput = document.getElementById('character-name-input');
    const acceptCustomizationBtn = document.getElementById('accept-customization-btn');
    const randomizeStatsBtn = document.getElementById('randomize-stats-btn');
    const characterChoices = document.querySelectorAll('input[name="character-choice"]');
    const characterCanvas = document.getElementById('character-canvas');
    const ctx = characterCanvas.getContext('2d');
    let currentCharacterImg = new Image();
    const customHpEl = document.getElementById('custom-hp');
    const customAttackEl = document.getElementById('custom-attack');
    const customDefenseEl = document.getElementById('custom-defense');
    const customAgiEl = document.getElementById('custom-agi');
    const customSpeedEl = document.getElementById('custom-speed');
    const customCritRateEl = document.getElementById('custom-crit-rate');
    const customCritDmgEl = document.getElementById('custom-crit-dmg');
    const customAccuracyEl = document.getElementById('custom-accuracy');
    const customResistanceEl = document.getElementById('custom-resistance');
    const homePlayerNameEl = document.getElementById('home-player-name');
    const homePlayerLevelEl = document.getElementById('home-player-level');
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    const totalFightsEl = document.getElementById('total-fights');
    const winRateEl = document.getElementById('win-rate');
    const homePlayerHpEl = document.getElementById('home-player-hp');
    const homePlayerAttackEl = document.getElementById('home-player-attack');
    const homePlayerDefenseEl = document.getElementById('home-player-defense');
    const homePlayerAgiEl = document.getElementById('home-player-agi');
    const homePlayerSpeedEl = document.getElementById('home-player-speed');
    const homePlayerCritRateEl = document.getElementById('home-player-crit-rate');
    const homePlayerCritDmgEl = document.getElementById('home-player-crit-dmg');
    const homePlayerAccuracyEl = document.getElementById('home-player-accuracy');
    const homePlayerResistanceEl = document.getElementById('home-player-resistance');
    const homeCharacterDisplay = document.getElementById('home-character-display');
    const goToFightBtn = document.getElementById('go-to-fight-btn');
    const fightsRemainingText = document.getElementById('fights-remaining-text');
    const fightLog = document.getElementById('fight-log');
    const playerContainer = document.getElementById('player-container');
    const playerImageEl = document.getElementById('player-image');
    const enemyContainer = document.getElementById('enemy-container');
    const enemyImageEl = document.getElementById('enemy-image');
    const playerNameHud = document.getElementById('player-name-hud');
    const playerLevelHud = document.getElementById('player-level-hud');
    const playerHpBar = document.getElementById('player-hp-bar');
    const playerHpText = document.getElementById('player-hp-text');
    const enemyNameHud = document.getElementById('enemy-name-hud');
    const enemyLevelHud = document.getElementById('enemy-level-hud');
    const enemyHpBar = document.getElementById('enemy-hp-bar');
    const enemyHpText = document.getElementById('enemy-hp-text');
    const playerStatsToggle = document.getElementById('player-stats-toggle');
    const playerStatsPanel = document.getElementById('player-stats-panel');
    const fightPlayerHp = document.getElementById('fight-player-hp');
    const fightPlayerAttack = document.getElementById('fight-player-attack');
    const fightPlayerDefense = document.getElementById('fight-player-defense');
    const fightPlayerAgi = document.getElementById('fight-player-agi');
    const fightPlayerSpeed = document.getElementById('fight-player-speed');
    const fightPlayerCritRate = document.getElementById('fight-player-crit-rate');
    const fightPlayerCritDmg = document.getElementById('fight-player-crit-dmg');
    const fightPlayerAccuracy = document.getElementById('fight-player-accuracy');
    const fightPlayerResistance = document.getElementById('fight-player-resistance');
    const enemyStatsToggle = document.getElementById('enemy-stats-toggle');
    const enemyStatsPanel = document.getElementById('enemy-stats-panel');
    const fightEnemyHp = document.getElementById('fight-enemy-hp');
    const fightEnemyAttack = document.getElementById('fight-enemy-attack');
    const fightEnemyDefense = document.getElementById('fight-enemy-defense');
    const fightEnemyAgi = document.getElementById('fight-enemy-agi');
    const fightEnemySpeed = document.getElementById('fight-enemy-speed');
    const fightEnemyCritRate = document.getElementById('fight-enemy-crit-rate');
    const fightEnemyCritDmg = document.getElementById('fight-enemy-crit-dmg');
    const fightEnemyAccuracy = document.getElementById('fight-enemy-accuracy');
    const fightEnemyResistance = document.getElementById('fight-enemy-resistance');
    const speedToggleBtn = document.getElementById('speed-toggle-btn');
    const statPlusBtns = document.querySelectorAll('.stat-plus-btn');
    const statMinusBtns = document.querySelectorAll('.stat-minus-btn');
    const saveStatsBtn = document.getElementById('save-stats-btn');
    const statPointsAllocationDiv = document.getElementById('stat-points-allocation');
    const pointsToSpendEl = document.getElementById('points-to-spend');
    const rankingTitle = document.getElementById('ranking-title');
    const rankingControls = document.getElementById('ranking-controls');
    const rankingTierFilters = document.getElementById('ranking-tier-filters');
    const rankingTableBody = document.querySelector('#ranking-table tbody');

    // --- Game State & Constants ---
    let player = {};
    let enemy = {};
    let tempStatIncreases = {};
    let isFightInProgress = false;
    let currentSortBy = 'tier';
    let currentTierFilter = 'all';
    const MAX_LOG_LINES = 5;
    const MAX_FIGHTS_PER_DAY = 100;
    const BASE_ANIMATION_DURATION_MS = 600; 
    const speedMultipliers = [1, 2, 4, 10, 100];
    let currentSpeedIndex = 0;
    const characterImages = ["images/c1.png", "images/c2.png", "images/c3.png", "images/c4.png", "images/c5.png", "images/c6.png", "images/c7.png"];
    const enemyNames = ["Grommash", "Skullcrusher", "Bonebreaker", "Gorehowl", "Nightfall"];
    
    // --- Utility Functions ---
    const getTodayDateString = () => new Date().toISOString().split('T')[0];
    const getMonthKey = () => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms / speedMultipliers[currentSpeedIndex]));

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
        }
        if (screenName === 'creation') {
            topMenu.classList.add('hidden');
        } else {
            topMenu.classList.remove('hidden');
        }
    }

    // --- Event Listeners ---
    createCharacterBtn.addEventListener('click', loadOrCreateCharacter);
    acceptCustomizationBtn.addEventListener('click', finalizeCharacterCreation);
    randomizeStatsBtn.addEventListener('click', () => { generateInitialStats(player); updateCustomizationStatsUI(); });
    goToFightBtn.addEventListener('click', handleGoToFight);
    characterChoices.forEach(choice => choice.addEventListener('change', (e) => loadCharacterImage(e.target.value)));
    
    function toggleStatsPanels() {
        playerStatsPanel.classList.toggle('open');
        enemyStatsPanel.classList.toggle('open');
    }
    playerStatsToggle.addEventListener('click', toggleStatsPanels);
    enemyStatsToggle.addEventListener('click', toggleStatsPanels);
    
    speedToggleBtn.addEventListener('click', toggleFightSpeed);
    statPlusBtns.forEach(btn => btn.addEventListener('click', spendStatPoint));
    statMinusBtns.forEach(btn => btn.addEventListener('click', removeStatPoint));
    saveStatsBtn.addEventListener('click', finalizeStatAllocation);
    menuHomeBtn.addEventListener('click', () => showScreen('home'));
    menuFightBtn.addEventListener('click', handleGoToFight);
    menuRankingBtn.addEventListener('click', () => displayRanking());
    rankingScreen.addEventListener('click', (e) => { if (e.target === rankingScreen) showScreen('home'); });
    rankingControls.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSortBy = e.target.dataset.sort;
            displayRanking();
        }
    });
    rankingTierFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentTierFilter = e.target.dataset.tier;
            displayRanking();
        }
    });
    
    // --- Data Migration & Management ---
    function migratePlayerData(data) {
        if (data.ATK !== undefined) { data.Attack = data.ATK; delete data.ATK; }
        if (data.DEF !== undefined) { data.Defense = data.DEF; delete data.DEF; }
        return data;
    }

    function getFightData() {
        let data = JSON.parse(localStorage.getItem(`fightData-${player.name}`));
        const today = getTodayDateString();
        if (!data) { return { fightsToday: 0, lastFightDate: today }; }
        if (data.lastFightDate !== today) {
            data.fightsToday = 0;
            data.lastFightDate = today;
        }
        data.fightsToday = data.fightsToday || 0;
        return data;
    }

    function saveFightData(data) { localStorage.setItem(`fightData-${player.name}`, JSON.stringify(data)); }

    function handleGoToFight() {
        if (isFightInProgress) return;
        const fightData = getFightData();
        if (fightData.fightsToday >= MAX_FIGHTS_PER_DAY) {
            alert("You have reached your daily fight limit. Come back tomorrow!");
            return;
        }
        fightData.fightsToday++;
        saveFightData(fightData);
        startNewFight();
    }
    
    // --- Stat Allocation Logic ---
    function spendStatPoint(event) {
        if (player.unspentStatPoints > 0) {
            const stat = event.target.dataset.stat;
            tempStatIncreases[stat] = (tempStatIncreases[stat] || 0) + 1;
            player.unspentStatPoints--;
            updateHomeUI();
        }
    }

    function removeStatPoint(event) {
        const stat = event.target.dataset.stat;
        if (tempStatIncreases[stat] > 0) {
            tempStatIncreases[stat]--;
            player.unspentStatPoints++;
            updateHomeUI();
        }
    }

    function finalizeStatAllocation() {
        for (const stat in tempStatIncreases) {
            player[stat] = (player[stat] || 0) + tempStatIncreases[stat];
        }
        player.unspentStatPoints = 0;
        tempStatIncreases = {};
        savePlayer();
        updateHomeUI();
    }
    
    // --- Game Logic ---
    function savePlayer() { 
        if (!player.name) return;
        localStorage.setItem(`character-${player.name}`, JSON.stringify(player));
        updateRanking(player);
    }
    
    function loadOrCreateCharacter() {
        const name = characterNameInput.value.trim();
        if (name === "") { alert("Please enter a name!"); return; }
        const savedData = localStorage.getItem(`character-${name}`);
        
        if (savedData) {
            player = migratePlayerData(JSON.parse(savedData));
            savePlayer(); // Re-save with corrected format
        } else {
            player = { name: name };
            generateInitialStats(player);
        }
        
        if (!player.image) {
            showScreen('customization');
            updateCustomizationStatsUI();
            loadCharacterImage(document.querySelector('input[name="character-choice"]:checked').value);
        } else {
            showScreen('home');
            updateHomeUI();
        }
    }
    
    function finalizeCharacterCreation() {
        player.image = characterCanvas.toDataURL();
        generateInitialStats(player);
        savePlayer();
        showScreen('home');
        updateHomeUI();
    }

    function startNewFight() {
        isFightInProgress = true;
        playerContainer.style.transform = 'translateX(0)';
        enemyContainer.style.transform = 'translateX(0)';
        generateEnemy();
        player.currentHP = player.maxHP;
        showScreen('game');
        updateGameUI();
        fightLog.innerHTML = '';
        logMessage("The fight begins!", false, true);
        fight();
    }

    function generateEnemy() {
        const playerLevel = player.level || 1;
        const level = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
        enemy = {
            name: enemyNames[Math.floor(Math.random() * enemyNames.length)], level: level,
            HP: 800 + (level * 200), Attack: 50 + (level * 10), Defense: 40 + (level * 10),
            Agility: 80 + (level * 8), Speed: (player.Speed || 100) - 5 + level,
            'Crit Rate': 10, 'Crit Dmg': 125, Accuracy: 15, Resistance: 15,
            imageSrc: characterImages[Math.floor(Math.random() * characterImages.length)]
        };
        enemy.maxHP = enemy.HP;
        enemy.currentHP = enemy.HP;
    }

    async function fight() {
        let attacker = player.Speed >= enemy.Speed ? player : enemy;
        let defender = attacker === player ? enemy : player;
        while (player.currentHP > 0 && enemy.currentHP > 0) {
            await sleep(800);
            await performAttackSequence(attacker, defender);
            [attacker, defender] = [defender, attacker];
            if(player.currentHP <= 0 || enemy.currentHP <= 0) break;
            await sleep(500);
        }
        endFight();
    }

    async function performAttackSequence(attacker, defender) {
        const attackerElement = (attacker === player) ? playerContainer : enemyContainer;
        const defenderElement = (defender === player) ? playerContainer : enemyContainer;
        const attackerRect = attackerElement.getBoundingClientRect();
        const defenderRect = defenderElement.getBoundingClientRect();
        const moveDistance = defenderRect.left - attackerRect.left - (attackerRect.width * 0.8);
        attackerElement.style.transform = `translateX(${moveDistance}px)`;
        await sleep(BASE_ANIMATION_DURATION_MS);
        const isCrit = Math.random() < (attacker['Crit Rate'] / 100);
        const damageMultiplier = isCrit ? (attacker['Crit Dmg'] / 100) : 1;
        const baseDamage = attacker.Attack * (0.9 + Math.random() * 0.2);
        const damageBeforeDefense = baseDamage * damageMultiplier;
        const defenseFactor = 100 / (100 + defender.Defense);
        const finalDamage = Math.round(damageBeforeDefense * defenseFactor);
        defender.currentHP = Math.max(0, defender.currentHP - finalDamage);
        defenderElement.classList.add('is-getting-hit');
        updateGameUI();
        let message = `${defender.name}: -${finalDamage} HP`;
        if (isCrit) { message += ' (critical)'; }
        logMessage(message, isCrit);
        await sleep(300);
        defenderElement.classList.remove('is-getting-hit');
        attackerElement.style.transform = 'translateX(0)';
        await sleep(BASE_ANIMATION_DURATION_MS);
    }
    
    function endFight() {
        player.totalFights = (player.totalFights || 0) + 1;
        if (player.currentHP > 0) {
            logMessage(`You are victorious!`, false, true);
            player.totalWins = (player.totalWins || 0) + 1;
            const xpGained = 2 + enemy.level;
            logMessage(`You gain ${xpGained} XP.`, false, true);
            player.xp = (player.xp || 0) + xpGained;
            checkLevelUp();
        } else {
             logMessage(`You have been defeated!`, true, true);
        }
        savePlayer();
        setTimeout(() => {
            showScreen('home');
            isFightInProgress = false;
            updateHomeUI();
        }, 3000);
    }

    function checkLevelUp() {
        while ((player.xp || 0) >= player.xpToNextLevel) {
            player.level++;
            player.xp -= player.xpToNextLevel;
            player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
            player.maxHP += 100;
            player.unspentStatPoints = (player.unspentStatPoints || 0) + 5;
            tempStatIncreases = {};
            logMessage(`LEVEL UP! You are now level ${player.level}!`, false, true);
        }
    }

    function logMessage(message, isCritical = false, isSystem = false) {
        if (fightLog.children.length >= MAX_LOG_LINES) { fightLog.firstChild.remove(); }
        const p = document.createElement('p');
        p.textContent = message;
        if (isCritical) p.classList.add('crit-damage-log');
        if (isSystem) p.style.color = '#f1c40f';
        fightLog.appendChild(p);
    }

    function toggleFightSpeed() {
        currentSpeedIndex = (currentSpeedIndex + 1) % speedMultipliers.length;
        const newSpeed = speedMultipliers[currentSpeedIndex];
        speedToggleBtn.textContent = `Speed x${newSpeed}`;
        const newDuration = (BASE_ANIMATION_DURATION_MS / 1000) / newSpeed;
        playerContainer.style.transitionDuration = `${newDuration}s`;
        enemyContainer.style.transitionDuration = `${newDuration}s`;
    }

    // --- Ranking Logic ---
    function updateRanking(playerData) {
        const rankingKey = `gameRankingData-${getMonthKey()}`;
        let rankings = JSON.parse(localStorage.getItem(rankingKey)) || [];
        const playerIndex = rankings.findIndex(p => p.name === playerData.name);
        const summary = { name: playerData.name, level: playerData.level, totalWins: playerData.totalWins || 0, totalFights: playerData.totalFights || 0 };
        if (playerIndex > -1) { rankings[playerIndex] = summary; } 
        else { rankings.push(summary); }
        localStorage.setItem(rankingKey, JSON.stringify(rankings));
    }

    function displayRanking() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonthName = monthNames[new Date().getMonth()];
        rankingTitle.textContent = `${currentMonthName}`;

        rankingControls.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSortBy));
        rankingTierFilters.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.tier === currentTierFilter));

        const rankingKey = `gameRankingData-${getMonthKey()}`;
        let rankings = JSON.parse(localStorage.getItem(rankingKey)) || [];

        if (currentTierFilter !== 'all') {
            rankings = rankings.filter(p => {
                const score = (p.level * 10) + p.totalWins;
                if (currentTierFilter === 'gold') return score >= 150;
                if (currentTierFilter === 'silver') return score >= 50 && score < 150;
                if (currentTierFilter === 'bronze') return score < 50;
                return false;
            });
        }
        
        if (currentSortBy === 'tier') {
            rankings.sort((a, b) => {
                const scoreA = (a.level * 10) + a.totalWins;
                const scoreB = (b.level * 10) + b.totalWins;
                return scoreB - scoreA;
            });
        } else { // Sort by level
            rankings.sort((a, b) => b.level - a.level || b.totalWins - a.totalWins);
        }

        rankingTableBody.innerHTML = '';
        rankings.forEach((p, index) => {
            const losses = p.totalFights - p.totalWins;
            const winrate = p.totalFights > 0 ? Math.round((p.totalWins / p.totalFights) * 100) : 0;
            const score = (p.level * 10) + p.totalWins;
            let tier = '<span class="tier-bronze">Bronze</span>';
            if (score >= 150) tier = '<span class="tier-gold">Gold</span>';
            else if (score >= 50) tier = '<span class="tier-silver">Silver</span>';

            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${p.name}</td><td>${tier}</td><td>${p.level}</td><td>${p.totalWins}</td><td>${losses}</td><td>${winrate}%</td>`;
            rankingTableBody.appendChild(row);
        });
        showScreen('ranking');
    }

    // --- UI Update Functions ---
    function generateInitialStats(charObject) {
        charObject.HP = 1000; charObject.maxHP = 1000;
        charObject['Crit Rate'] = 15; charObject['Crit Dmg'] = 150;
        charObject.Accuracy = 15; charObject.Resistance = 30;
        charObject.unspentStatPoints = charObject.unspentStatPoints || 0;
        charObject.totalFights = charObject.totalFights || 0; 
        charObject.totalWins = charObject.totalWins || 0;
        charObject.level = charObject.level || 1;
        charObject.xp = charObject.xp || 0;
        charObject.xpToNextLevel = charObject.xpToNextLevel || 10;
        let pointsToDistribute = 500 - (100 * 4);
        let coreStats = { Attack: 100, Defense: 100, Agility: 100, Speed: 100 };
        let statKeys = Object.keys(coreStats);
        for (let i = 0; i < pointsToDistribute; i++) {
            coreStats[statKeys[Math.floor(Math.random() * statKeys.length)]]++;
        }
        Object.assign(charObject, coreStats);
    }

    function updateCustomizationStatsUI() {
        customHpEl.textContent = player.HP;
        customAttackEl.textContent = player.Attack;
        customDefenseEl.textContent = player.Defense;
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
        const xpPercent = (player.xpToNextLevel > 0) ? ((player.xp || 0) / player.xpToNextLevel) * 100 : 0;
        xpBar.style.width = `${xpPercent}%`;
        xpText.textContent = `${player.xp || 0} / ${player.xpToNextLevel} XP`;
        totalFightsEl.textContent = player.totalFights || 0;
        const winRate = ((player.totalWins || 0) / (player.totalFights || 1)) * 100;
        winRateEl.textContent = `${Math.round(winRate)}%`;
        homePlayerHpEl.textContent = player.maxHP;
        homePlayerAttackEl.textContent = player.Attack + (tempStatIncreases.Attack || 0);
        homePlayerDefenseEl.textContent = player.Defense + (tempStatIncreases.Defense || 0);
        homePlayerAgiEl.textContent = player.Agility + (tempStatIncreases.Agility || 0);
        homePlayerSpeedEl.textContent = player.Speed + (tempStatIncreases.Speed || 0);
        homePlayerCritRateEl.textContent = player['Crit Rate'] + '%';
        homePlayerCritDmgEl.textContent = player['Crit Dmg'] + '%';
        homePlayerAccuracyEl.textContent = player.Accuracy + '%';
        homePlayerResistanceEl.textContent = player.Resistance + '%';
        homeCharacterDisplay.innerHTML = '';
        if (player.image) { const img = new Image(); img.src = player.image; homeCharacterDisplay.appendChild(img); }
        const fightData = getFightData();
        const fightsLeft = MAX_FIGHTS_PER_DAY - fightData.fightsToday;
        fightsRemainingText.textContent = `${fightsLeft} fights remaining today.`;

        const hasPoints = player.unspentStatPoints > 0;
        statPointsAllocationDiv.classList.toggle('hidden', !hasPoints);
        statPlusBtns.forEach(btn => btn.classList.toggle('hidden', !hasPoints));
        statMinusBtns.forEach(btn => {
            const stat = btn.dataset.stat;
            btn.classList.toggle('hidden', !(tempStatIncreases[stat] > 0));
        });
        if (hasPoints) { pointsToSpendEl.textContent = player.unspentStatPoints; }
    }

    function updateGameUI() {
        // Player
        playerNameHud.textContent = player.name;
        playerLevelHud.textContent = player.level;
        playerHpBar.style.width = `${(player.currentHP / player.maxHP) * 100}%`;
        playerHpText.textContent = `${player.currentHP} / ${player.maxHP}`;
        playerImageEl.src = player.image || '';
        fightPlayerHp.textContent = player.maxHP;
        fightPlayerAttack.textContent = player.Attack;
        fightPlayerDefense.textContent = player.Defense;
        fightPlayerAgi.textContent = player.Agility;
        fightPlayerSpeed.textContent = player.Speed;
        fightPlayerCritRate.textContent = player['Crit Rate'] + '%';
        fightPlayerCritDmg.textContent = player['Crit Dmg'] + '%';
        fightPlayerAccuracy.textContent = player.Accuracy + '%';
        fightPlayerResistance.textContent = player.Resistance + '%';
    
        // Enemy
        enemyNameHud.textContent = enemy.name || 'Enemy';
        enemyLevelHud.textContent = enemy.level || '1';
        enemyHpBar.style.width = `${(enemy.currentHP / enemy.maxHP) * 100}%`;
        enemyHpText.textContent = `${Math.round(enemy.currentHP)} / ${enemy.maxHP}`;
        enemyImageEl.src = enemy.imageSrc || '';
        fightEnemyHp.textContent = enemy.maxHP;
        fightEnemyAttack.textContent = enemy.Attack;
        fightEnemyDefense.textContent = enemy.Defense;
        fightEnemyAgi.textContent = enemy.Agility;
        fightEnemySpeed.textContent = enemy.Speed;
        fightEnemyCritRate.textContent = enemy['Crit Rate'] + '%';
        fightEnemyCritDmg.textContent = enemy['Crit Dmg'] + '%';
        fightEnemyAccuracy.textContent = enemy.Accuracy + '%';
        fightEnemyResistance.textContent = enemy.Resistance + '%';
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

    // --- Initialize Game ---
    (function init(){
        const initialDuration = (BASE_ANIMATION_DURATION_MS / 1000) / speedMultipliers[currentSpeedIndex];
        playerContainer.style.transitionDuration = `${initialDuration}s`;
        enemyContainer.style.transitionDuration = `${initialDuration}s`;
        showScreen('creation');
    })();
});