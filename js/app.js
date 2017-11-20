// Set up constants that we'll need throuhgout the game
var allEnemies = [];
var rows = [-35, 47, 129, 211, 293, 375];
var level = 1;
var levelDisplayer = document.querySelector('.level span');

// Will ramdomly generate valid values for the enemies
function rngEnemy() {
    var enemyRows = rows.slice(1, 4);
    var x = Math.floor(Math.random() * -600) + 400;
    var y = enemyRows[Math.floor(Math.random()*enemyRows.length)];
    var speed = Math.floor(Math.random() * 250) + 50;
    var direction = Math.floor(Math.random() * 2) ? 1 : -1;
    return [x, y, speed, direction];
}

// Will generate enemies based in the value of the level
// with random values for the x possition, y possition
// speed and direction and push them into the allEnemies
// variable
function setEnemies() {
    allEnemies = [];
    for (var i = 0; i < level; i++) {
        allEnemies.push(new Enemy(...rngEnemy()));
    }
}

// Will display the current level in the html
function displayLevel() {
    levelDisplayer.innerHTML = level;
}

// Enemies our player must avoid
var Enemy = function(x=-100, y=47, speed=100, direction=1) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
    this.sprite = this.direction === 1 ? 'images/enemy-bug.png' : 'images/enemy-bug-reverse.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x >= 500 && this.direction === 1) {
        this.direction = -1;
        this.sprite = 'images/enemy-bug-reverse.png';
    }
    if (this.x <= -100 && this.direction === -1) {
        this.direction = 1;
        this.sprite = 'images/enemy-bug.png'
    }
    this.x += (this.speed * dt * this.direction);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player caracter with whom we'll be playing
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 375;
};

// Will be in charge of determinating when the player colides
// with an enemy, required method for game
Player.prototype.update = function() {
    for (var enemy of allEnemies) {
        // If the player possition is overlaped by an enemy, the game will restart
        if ((enemy.x) >= (this.x - 75) && (enemy.x) <= (this.x + 75) && this.y === enemy.y) {
            level = 1;
            this.setNewLevel();
        }
    }
};

// Handle the player's movements, based on a set of keys,
// required method for game
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            this.x = this.x > 0 ? this.x - 100 : this.x;
            break;
        case 'right':
            this.x = this.x < 400 ? this.x + 100 : this.x;
            break;
        case 'up':
            this.y = this.y > -35 ? this.y - 82 : this.y;
            break;
        case 'down':
            this.y = this.y < 375 ? this.y + 82 : this.y;
            break;
    }
};

// Draw the Player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Interval function that's gonna take care of determinating
// when the player won the level. Not handled in the update
// function because I want it to be visible to the player
// that he reached the end and with the player update function
// that's not possible.
Player.prototype.setNextLevelInterval = function () {
    setInterval(() => {
        if (this.y === -35) {
            level++;
            this.setNewLevel();
        }
    }, 500);
}

// Will put the player in the initial position and
// call the setEnemies function along side the displayLevel
// function
Player.prototype.setNewLevel = function () {
    this.y = 375;
    this.x = 200;
    setEnemies();
    displayLevel();
}

// Set up the player and a new first level
var player = new Player();
player.setNextLevelInterval();
player.setNewLevel();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
