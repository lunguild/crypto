// O'yin o'zgaruvchilari
let gameState = {
    coins: 0,
    coinsPerSecond: 0,
    upgrades: [
        {
            id: 1,
            name: "Junior Hamster",
            description: "A small hamster that mines slowly",
            baseCost: 10,
            coinsPerSecond: 1,
            owned: 0,
            costGrowth: 1.15
        },
        {
            id: 2,
            name: "Senior Hamster",
            description: "An experienced mining hamster",
            baseCost: 50,
            coinsPerSecond: 5,
            owned: 0,
            costGrowth: 1.15
        },
        {
            id: 3,
            name: "Hamster Team",
            description: "A group of professional mining hamsters",
            baseCost: 200,
            coinsPerSecond: 20,
            owned: 0,
            costGrowth: 1.15
        },
        {
            id: 4,
            name: "Hamster Farm",
            description: "A whole farm dedicated to mining",
            baseCost: 1000,
            coinsPerSecond: 100,
            owned: 0,
            costGrowth: 1.15
        },
        {
            id: 5,
            name: "Hamster City",
            description: "An entire city of mining hamsters",
            baseCost: 5000,
            coinsPerSecond: 500,
            owned: 0,
            costGrowth: 1.15
        }
    ],
    achievements: [
        {
            id: 1,
            name: "First Coin",
            description: "Earn your first TON coin",
            target: 1,
            achieved: false,
            reward: 10
        },
        {
            id: 2,
            name: "Hundredaire",
            description: "Collect 100 TON coins",
            target: 100,
            achieved: false,
            reward: 100
        },
        {
            id: 3,
            name: "Thousandaire",
            description: "Collect 1,000 TON coins",
            target: 1000,
            achieved: false,
            reward: 1000
        },
        {
            id: 4,
            name: "First Upgrade",
            description: "Purchase your first upgrade",
            target: 1,
            achieved: false,
            reward: 50
        },
        {
            id: 5,
            name: "Passive Income",
            description: "Reach 10 TON per second",
            target: 10,
            achieved: false,
            reward: 200
        }
    ],
    lastSave: Date.now()
};

// DOM elementlari
const coinsDisplay = document.getElementById('coins');
const perSecondDisplay = document.getElementById('per-second');
const clickBtn = document.getElementById('click-btn');
const upgradesList = document.getElementById('upgrades-list');
const achievementsList = document.getElementById('achievements-list');

// O'yinni yuklash
function loadGame() {
    const savedGame = localStorage.getItem('hamsterKombatSave');
    if (savedGame) {
        gameState = JSON.parse(savedGame);

        // O'yin yopilgan vaqtni hisoblash
        const currentTime = Date.now();
        const timeDiff = (currentTime - gameState.lastSave) / 1000; // soniyalarda

        // Offline progress
        if (timeDiff > 0) {
            const offlineEarnings = gameState.coinsPerSecond * timeDiff * 0.5; // 50% offline
            if (offlineEarnings > 0) {
                gameState.coins += offlineEarnings;
                showOfflineEarnings(offlineEarnings);
            }
        }
    }
    updateAllDisplays();
}

// O'yinni saqlash
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('hamsterKombatSave', JSON.stringify(gameState));
}

// Offline daromadni ko'rsatish
function showOfflineEarnings(amount) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `While you were away, your hamsters mined ${Math.floor(amount)} TON!`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 1s';
        setTimeout(() => notification.remove(), 1000);
    }, 3000);
}

// Barcha displeylarni yangilash
function updateAllDisplays() {
    updateCoinDisplay();
    updateUpgradesDisplay();
    updateAchievementsDisplay();
    saveGame();
}

// Coin displeyni yangilash
function updateCoinDisplay() {
    coinsDisplay.textContent = Math.floor(gameState.coins);
    perSecondDisplay.textContent = gameState.coinsPerSecond;
}

// Upgradelar displeyni yangilash
function updateUpgradesDisplay() {
    upgradesList.innerHTML = '';

    gameState.upgrades.forEach(upgrade => {
        const currentCost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costGrowth, upgrade.owned));

        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade-item';

        upgradeElement.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name} (${upgrade.owned})</div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-production">+${upgrade.coinsPerSecond} TON/s</div>
            </div>
            <div class="upgrade-cost">${currentCost} TON</div>
            <button class="buy-btn" data-id="${upgrade.id}" ${gameState.coins < currentCost ? 'disabled' : ''}>
                Buy
            </button>
        `;

        upgradesList.appendChild(upgradeElement);
    });

    // Buy tugmalariga event listener qo'shish
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const upgradeId = parseInt(this.getAttribute('data-id'));
            buyUpgrade(upgradeId);
        });
    });
}

// Achievement displeyni yangilash
function updateAchievementsDisplay() {
    achievementsList.innerHTML = '';

    gameState.achievements.forEach(achievement => {
        const progress = achievement.id <= 3 ? gameState.coins / achievement.target * 100 :
                      achievement.id === 4 ? gameState.upgrades.reduce((acc, upg) => acc + upg.owned, 0) / achievement.target * 100 :
                      gameState.coinsPerSecond / achievement.target * 100;

        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.achieved ? '' : 'achievement-locked'}`;

        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.achieved ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${!achievement.achieved ? `
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${Math.min(100, progress)}%"></div>
                </div>
                ` : ''}
            </div>
            ${achievement.achieved ? `<div class="achievement-reward">+${achievement.reward} TON</div>` : ''}
        `;

        achievementsList.appendChild(achievementElement);
    });
}

// Upgrade sotib olish
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const currentCost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costGrowth, upgrade.owned));

    if (gameState.coins >= currentCost) {
        gameState.coins -= currentCost;
        upgrade.owned++;
        gameState.coinsPerSecond += upgrade.coinsPerSecond;

        // Achievement tekshirish
        checkAchievement(4); // First Upgrade achievement
        checkAchievement(5); // Passive Income achievement

        updateAllDisplays();
        animatePurchase(upgrade.name);
    }
}

// Achievement tekshirish
function checkAchievement(achievementId) {
    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.achieved) return;

    let conditionMet = false;

    switch(achievementId) {
        case 1: // First Coin
            conditionMet = gameState.coins >= achievement.target;
            break;
        case 2: // Hundredaire
            conditionMet = gameState.coins >= achievement.target;
            break;
        case 3: // Thousandaire
            conditionMet = gameState.coins >= achievement.target;
            break;
        case 4: // First Upgrade
            const totalUpgrades = gameState.upgrades.reduce((acc, upg) => acc + upg.owned, 0);
            conditionMet = totalUpgrades >= achievement.target;
            break;
        case 5: // Passive Income
            conditionMet = gameState.coinsPerSecond >= achievement.target;
            break;
    }

    if (conditionMet) {
        achievement.achieved = true;
        gameState.coins += achievement.reward;
        showAchievementNotification(achievement);
        updateAllDisplays();
    }
}

// Achievement bildirishnomasini ko'rsatish
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="font-size: 24px;">🏆</div>
        <div style="font-weight: bold;">Achievement Unlocked!</div>
        <div>${achievement.name}</div>
        <div>+${achievement.reward} TON</div>
    `;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#ffd700';
    notification.style.color = '#333';
    notification.style.padding = '15px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 15px rgba(0,0,0,0.3)';
    notification.style.textAlign = 'center';
    notification.style.width = '250px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 1s';
        setTimeout(() => notification.remove(), 1000);
    }, 3000);
}

// Xarid animatsiyasi
function animatePurchase(itemName) {
    const animation = document.createElement('div');
    animation.className = 'purchase-animation';
    animation.textContent = `Purchased: ${itemName}`;
    animation.style.position = 'fixed';
    animation.style.bottom = '20px';
    animation.style.left = '50%';
    animation.style.transform = 'translateX(-50%)';
    animation.style.backgroundColor = '#4CAF50';
    animation.style.color = 'white';
    animation.style.padding = '10px 20px';
    animation.style.borderRadius = '5px';
    animation.style.zIndex = '1000';

    document.body.appendChild(animation);

    setTimeout(() => {
        animation.style.opacity = '0';
        animation.style.transition = 'opacity 1s';
        setTimeout(() => animation.remove(), 1000);
    }, 2000);
}

// Click hodisasi
clickBtn.addEventListener('click', () => {
    gameState.coins += 1;
    updateCoinDisplay();

    // Achievement tekshirish
    checkAchievement(1); // First Coin
    checkAchievement(2); // Hundredaire
    checkAchievement(3); // Thousandaire

    // Animatsiya
    animateClick();
});

// Click animatsiyasi
function animateClick() {
    const coin = document.createElement('div');
    coin.className = 'click-coin';
    coin.textContent = '+1';
    coin.style.position = 'absolute';
    coin.style.color = '#ff9500';
    coin.style.fontWeight = 'bold';
    coin.style.fontSize = '20px';
    coin.style.pointerEvents = 'none';
    coin.style.userSelect = 'none';

    // Random pozitsiya
    const rect = clickBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
    const y = rect.top + rect.height / 2 + (Math.random() * 40 - 20);

    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;

    document.body.appendChild(coin);

    // Animatsiya
    const animation = coin.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-50px)' }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    });

    animation.onfinish = () => coin.remove();
}

// Passive income
setInterval(() => {
    if (gameState.coinsPerSecond > 0) {
        gameState.coins += gameState.coinsPerSecond / 10; // Har 100ms da 1/10
        updateCoinDisplay();
    }
}, 100);

// Auto-save
setInterval(() => {
    saveGame();
}, 30000);

// O'yin ishga tushirish
loadGame();
