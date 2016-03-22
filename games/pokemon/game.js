"use strict";
/*
 Hallo!
 Das hier ist deine Spielevorlage!
 Ich hoffe, ich habe alles gut genug dokumentiert.

 Alles was hier MyGame heißt musst du umbenennen in etwas sehr
 individuelles. So wie KotzeMannGRKDM
 Die wirren Buchstaben können wichtig sein, falls jemand anderes
 auch KotzeMann entwickelt!

 WICHTIG

 Wenn dein Spiel geschafft ist, dann rufe

 onVictory();

 auf! Später wird da dann ein richtiger Gewonnen-Bildschrim erscheinen!

 Wenn man in deinem Spiel verliert, dann rufe

 onLose();

 auf. Dardurch wird dein Spiel neugestartet.

 Während du an deinem Spiel arbeitest, arbeite ich am Drumherum,
 sodass es dann alles auch supi aussieht!
 */

JackDanger.PokemonVadammt = function () {

};

//hier musst du deine Eintragungen vornhemen.
addMyGame("pokemon",    // ID
    "JackDanger Pokemon",           // Anzeige-Name
    "Vadammt",          // Autor
    "Pokemon - nur ohne Pokemon.",  // Beschreibung
    "Steuerung",        //Steuerkreuz
    "[B] Zurück",       //Jump button belegung
    "[A] Auswahl",      //Shoot button belegung
    JackDanger.PokemonVadammt);


JackDanger.PokemonVadammt.prototype.init = function () {
    logInfo("init Game");
    addLoadingScreen(this, true);//nicht anfassen
};

JackDanger.PokemonVadammt.prototype.preload = function () {
    this.load.path = 'games/' + currentGameData.id + '/assets/';//nicht anfassen

    //füge hier ein was du alles laden musst.
    this.load.atlas("pokemon");
};

//wird nach dem laden gestartet
JackDanger.PokemonVadammt.prototype.create = function () {
    Pad.init();//nicht anfassen
};

JackDanger.PokemonVadammt.prototype.mycreate = function () {

    // Init all class-wide values
    this.initValues();
    this.initFighters();

    // Debugging
    this.debugInfoEnabled = true;
    if (this.debugInfoEnabled) {
        this.initDebugInfo();
    }

    //  Set Background color
    game.stage.backgroundColor = "#EEEEEE";

    // Init values
    this.gameState = this.GameStates.INIT;
    this.selectedItemPosition = this.MenuItemPositions.UPPER_LEFT;

    // Add game content
    this.addStuff();

    // Creation done -> switch gameState
    this.initStateDone();
};

JackDanger.PokemonVadammt.prototype.initDebugInfo = function () {
    this.frameCounter = 0;
};

JackDanger.PokemonVadammt.prototype.initValues = function () {
    JackDanger.PokemonVadammt.prototype.Fighters = {
        JackDanger: {
            name: "Jack Danger",
            maxHP: 100,
            attacks: [{name: "Punch", dmg: 10}, {name: "Platscher", dmg: 0}, {name: "Roundhousekick", dmg: 25}, {name: "N/A", dmg: 0}]
        },
        Enemy1: {
            name: "Fieser Fiesling",
            maxHP: 50,
            attacks: [{name: "Beißen", dmg: 5}]
        },
        Enemy2: {
            name: "Netter Fiesling",
            maxHP: 100,
            attacks: [{name: "Beißen", dmg: 5}]
        },

        toString: function (fighter) {
            return fighter.name + "(HP: " + fighter.hp + ")";
        }
    };
    JackDanger.PokemonVadammt.prototype.enemies = [this.Fighters.Enemy1, this.Fighters.Enemy2];

    JackDanger.PokemonVadammt.prototype.SELECTED_INDICATOR = "- ";

    var tmpInitEnums = 0;
    JackDanger.PokemonVadammt.prototype.GameStates = {
        INIT: tmpInitEnums++,
        PLAYER_SELECT: tmpInitEnums++,
        PLAYER_ATTACK: tmpInitEnums++,
        ENEMY_SELECT: tmpInitEnums++,
        ENEMY_ATTACK: tmpInitEnums++,
        CHECK_GAME_OVER: tmpInitEnums++
    };

    this.attackMenu = {};
    tmpInitEnums = 0;
    JackDanger.PokemonVadammt.prototype.MenuItemPositions = {
        UPPER_LEFT: tmpInitEnums++,
        UPPER_RIGHT: tmpInitEnums++,
        LOWER_LEFT: tmpInitEnums++,
        LOWER_RIGHT: tmpInitEnums++
    };
};

JackDanger.PokemonVadammt.prototype.addStuff = function (dt) {
    // Jack Danger sprite
    this.player = this.add.sprite(game.width * 0.25, game.height * 0.75, "pokemon", "face");
    this.player.x -= this.player.width * 0.5;
    this.player.y -= this.player.height * 0.5;

    // Enemy sprite
    this.ball = this.add.sprite(game.width * 0.75, game.height * 0.25, "pokemon", "ball");
    this.ball.x -= this.ball.width * 0.5;
    this.ball.y -= this.ball.height * 0.5;

    // Create Menu
    var menuWidth = game.width * 0.5;
    var menuHeight = game.height * 0.25;
    var attackNames = [];
    this.fighterJackDanger.attacks.forEach(function (atk) {
        attackNames.push(atk.name)
    });
    this.createAttackMenu(game.width - menuWidth, game.height - menuHeight, menuWidth, menuHeight, attackNames);
    // Select a menu item
    this.selectMenuItem(this.MenuItemPositions.UPPER_LEFT);

    // Create Stats
    // Give all stats the same size
    var statsWidth = game.width * 0.5;
    var statsHeight = game.height * 0.25;

    // Create Jack Danger stats
    this.statsEnemy = this.createStats(0, 0, statsWidth, statsHeight, this.fighterEnemy);

    // Create enemy stats
    var jdXPos = game.width * 0.5;
    var jdYPos = game.height * 0.5;
    this.statsJackDanger = this.createStats(jdXPos, jdYPos, statsWidth, statsHeight, this.Fighters.JackDanger);

};

JackDanger.PokemonVadammt.prototype.initFighters = function () {
    // Jack Danger
    this.fighterJackDanger = this.Fighters.JackDanger;
    this.fighterJackDanger.hp = this.fighterJackDanger.maxHP;

    // 1st Enemy
    this.fighterEnemy = this.Fighters.Enemy1;
    this.fighterEnemy.hp = this.fighterEnemy.maxHP;
};

//wird jeden Frame aufgerufen
JackDanger.PokemonVadammt.prototype.update = function () {
    var deltaT = this.time.physicsElapsedMS * 0.001;

    this.playerControlls(deltaT);
    /*    this.updateBall(deltaT);
     this.bounding();
     this.collision();
     this.updateTime(deltaT);
     */

    if (this.debugInfoEnabled) {
        this.updateDebugInfo(this, game.width / 2, 30);
    }
};

JackDanger.PokemonVadammt.prototype.updateDebugInfo = function (self, xPos, yPos) {
    game.debug.text("Frame: " + ++self.frameCounter, xPos, yPos, "#000");
};

// TODO state-funktionen implementieren!
JackDanger.PokemonVadammt.prototype.initStateDone = function () {
    // Error checking
    if (this.gameState != this.GameStates.INIT) {
        throw new Error("Invalid state error. Currently not in state INIT.");
    }

    logInfo("State: INIT Done...");

    // Switch to PLAYER_SELECT
    this.playerSelectTransition();
};

JackDanger.PokemonVadammt.prototype.playerSelectTransition = function () {
    this.gameState = this.GameStates.PLAYER_SELECT;
    logInfo("State: PLAYER_SELECT...");
};

JackDanger.PokemonVadammt.prototype.playerSelectDone = function (chosenAttack) {
    // Error checking
    if (this.gameState != this.GameStates.PLAYER_SELECT) {
        throw new Error("Invalid state error. Currently not in state PLAYER_SELECT.");
    }

    logInfo("State: PLAYER_SELECT done...");

    // Switch gameState
    this.playerAttackTransition(chosenAttack);
};

JackDanger.PokemonVadammt.prototype.playerAttackTransition = function (chosenAttackIndex) {
    this.gameState = this.GameStates.PLAYER_ATTACK;
    logInfo("State: PLAYER_ATTACK");

    // TODO Attack...
    this.processAttack(this.fighterJackDanger, this.fighterEnemy, chosenAttackIndex);

    // Check if game is over, if not: Switch to ENEMY_SELECT
    this.checkGameOverTransition(this.enemySelectTransition);
};

JackDanger.PokemonVadammt.prototype.processAttack = function (attacker, victim, attackIndex) {
    var attack = attacker.attacks[attackIndex];
    victim.hp -= attack.dmg;

    // TODO Update indicator
    updateIndicator(this);

    logInfo(attacker.name + " attacked " + this.Fighters.toString(victim) + " - dealing " + attack.dmg + " damage.");

    function updateIndicator(self) {
        var indicator = findVictimIndicator(self);

        // Resize indicator
        var hpInPercentage = 100 * victim.hp / victim.maxHP;
        indicator.indicator.setPercent(hpInPercentage);

        // Re-color
        var newColor = self.calcIndicatorColor(hpInPercentage);
        // TODO finish: indicator.color = newColor;
    }

    function findVictimIndicator(self) {
        // TODO implement this function using an ID.
        if (victim.name == self.fighterJackDanger.name) {
            return self.statsJackDanger;
        }
        else if (victim.name == self.fighterEnemy.name) {
            return self.statsEnemy;
        }
        else {
            throw new Error("Cannot find stats for victim.");
        }
    }
};

JackDanger.PokemonVadammt.prototype.enemySelectTransition = function () {
    this.gameState = this.GameStates.ENEMY_SELECT;
    logInfo("State: Enemy selecting...");
    // TODO Implement a better strategy...
    var selectedAttackIndex = 0;

    // Switch to ENEMY_ATTACK
    this.enemyAttackTransition(selectedAttackIndex);
};

/**
 *
 * @param chosenAttackIndex The index of the selected attack in the fighter array (0 to 3).
 */
JackDanger.PokemonVadammt.prototype.enemyAttackTransition = function (chosenAttackIndex) {
    this.gameState = this.GameStates.ENEMY_ATTACK;
    logInfo("State: PLAYER_ATTACK");

    // TODO Attack...
    this.processAttack(this.fighterEnemy, this.fighterJackDanger, chosenAttackIndex);

    // Check if game is over, if not: Switch to ENEMY_SELECT
    this.checkGameOverTransition(this.playerSelectTransition());
};

JackDanger.PokemonVadammt.prototype.checkGameOverTransition = function () {
    var lastState = this.gameState;
    this.gameState = this.GameStates.CHECK_GAME_OVER;
    logInfo("State: Check is game over...");

    if (this.fighterJackDanger.hp <= 0) {
        logInfo("Game is over! You lose!");
        onLose();
    }
    else if (this.fighterEnemy.hp <= 0) {
        logInfo("Game is over! You win!");
        onVictory();
    }

    // Run the
    if (lastState == this.GameStates.PLAYER_ATTACK) {
        this.enemySelectTransition();
    }
    else if (lastState == this.GameStates.ENEMY_ATTACK) {
        this.playerAttackTransition();
    }
};

JackDanger.PokemonVadammt.prototype.createAttackMenu = function (xPos, yPos, width, height, menuEntries, fontSize) {
    if (isNaN(fontSize)) fontSize = 20;

    var borderWidth = 4;
    var newWidth = width - borderWidth;
    var newHeight = height - borderWidth;

    // Create border
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(borderWidth, 0x000, 1);
    graphics.drawRect(xPos, yPos, newWidth, newHeight);

    // Set new (x,y) to inside the border.
    var newXPos = xPos + borderWidth;
    var newYPos = yPos + borderWidth;

    var textYOffset = newHeight * 0.25;
    var menuSelectorWidth = 20; // width of bitmapText(..., "testfont", "--", 20)

    // Add Text
    // UPPER_LEFT
    this.menu1 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menuEntries[this.MenuItemPositions.UPPER_LEFT], fontSize);
    this.menu1.anchor.x = 0;
    this.menu1.anchor.y = 0.5;
    this.menu1Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", this.SELECTED_INDICATOR, fontSize);
    this.menu1Selector.anchor.x = 0;
    this.menu1Selector.anchor.y = 0.5;

    // UPPER_RIGHT
    this.menu2 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menuEntries[this.MenuItemPositions.UPPER_RIGHT], fontSize);
    this.menu2.anchor.x = 0;
    this.menu2.anchor.y = 0.5;
    this.menu2Selector = game.add.bitmapText(newXPos + newWidth * 0.5, newYPos + textYOffset, "testfont", this.SELECTED_INDICATOR, fontSize);
    this.menu2Selector.anchor.x = 0;
    this.menu2Selector.anchor.y = 0.5;

    // 2nd Row...
    textYOffset *= 3;
    // LOWER_LEFT
    this.menu3 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menuEntries[this.MenuItemPositions.LOWER_LEFT], fontSize);
    this.menu3.anchor.x = 0;
    this.menu3.anchor.y = 0.5;
    this.menu3Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", this.SELECTED_INDICATOR, fontSize);
    this.menu3Selector.anchor.x = 0;
    this.menu3Selector.anchor.y = 0.5;

    // LOWER_RIGHT
    this.menu4 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menuEntries[this.MenuItemPositions.LOWER_RIGHT], fontSize);
    this.menu4.anchor.x = 0;
    this.menu4.anchor.y = 0.5;
    this.menu4Selector = game.add.bitmapText(newXPos + newWidth * 0.5, newYPos + textYOffset, "testfont", this.SELECTED_INDICATOR, fontSize);
    this.menu4Selector.anchor.x = 0;
    this.menu4Selector.anchor.y = 0.5;
};

JackDanger.PokemonVadammt.prototype.selectMenuItem = function (menuItemPos) {
    this.menu1Selector.text = "";
    this.menu2Selector.text = "";
    this.menu3Selector.text = "";
    this.menu4Selector.text = "";

    this.selectedItemPosition = menuItemPos;
    var selectedSelector = this.findMenuItemSelector(menuItemPos);
    selectedSelector.text = this.SELECTED_INDICATOR;
};

JackDanger.PokemonVadammt.prototype.findMenuItemSelector = function (menuItemPos) {
    switch (menuItemPos) {
        case this.MenuItemPositions.UPPER_LEFT:
            return this.menu1Selector;
            break;
        case this.MenuItemPositions.UPPER_RIGHT:
            return this.menu2Selector;
            break;
        case this.MenuItemPositions.LOWER_LEFT:
            return this.menu3Selector;
            break;
        case this.MenuItemPositions.LOWER_RIGHT:
            return this.menu4Selector;
            break;
        default:
            throw new Error("no action for " + menuItem + " defined.");
    }
};

// TODO draw debug/design-lines...

JackDanger.PokemonVadammt.prototype.createStats = function (xPos, yPos, width, height, owner, fontSize) {
    if (isNaN(fontSize)) fontSize = 20;

    // Create (debug) border
    var border = game.add.graphics(0, 0);
    border.lineStyle(1, 0xFF0000, 1);
    border.drawRect(xPos, yPos, width - 1, height);

    // Name
    var nameText = game.add.bitmapText(xPos + 0, yPos + 0, "testfont", owner.name, fontSize);
    nameText.anchor.x = 0;
    nameText.anchor.y = 0;

    // Health Points
    // Values
    var newWidth = 0.8 * width;
    var indicatorXPos = xPos + width * 0.1;
    var indicatorYPos = yPos + fontSize * 2;
    var indicatorWidth = (width - (indicatorXPos - xPos)) * 0.9;
    var indicatorHeight = fontSize * 1.75;
    var indicatorColor = this.calcIndicatorColor(1);
    // HP indicator
    var indicatorConfig = {
        x: 1 + (indicatorXPos + newWidth * 0.5),
        y: indicatorYPos + indicatorHeight * 0.5,
        width: indicatorWidth,
        height: indicatorHeight,
        bg: {
            color: '#FFFFFF'
        },
        bar: {
            color: indicatorColor
        },
        animationDuration: 200,
        flipped: false
    };
    var indicator = new this.HealthBar(this.game, indicatorConfig);

    // Indicator border
    var indicatorBorder = game.add.graphics(0, 0);
    indicatorBorder.lineStyle(2, 0x000000, 1);
    indicatorBorder.drawRect(indicatorXPos, indicatorYPos, indicatorWidth, fontSize * 1.75);

    // Text
    var hpText = game.add.bitmapText(xPos, indicatorYPos + 0.25 * fontSize, "testfont", "HP    " + owner.hp, fontSize);
    hpText.anchor.x = 0;
    hpText.anchor.y = 0;

    return {
        border: border,
        nameText: nameText,
        indicator: indicator,
        indicatorBorder: indicatorBorder,
        hpText: hpText
    }
};

JackDanger.PokemonVadammt.prototype.calcIndicatorColor = function (healthInPercent) {
    // TODO: Green to red gradient (see http://phaser.io/docs/2.4.6/Phaser.Color.html#.HSVColorWheel and http://phaser.io/examples/v2/display/hsv-color-wheel).
//    var colors = Phaser.Color.HSVColorWheel();
    return "#DD0000";
};

JackDanger.PokemonVadammt.prototype.playerControlls = function (dt) {

    // Only accept selection in the state PLAYER_SELECT
    if (this.gameState == this.GameStates.PLAYER_SELECT) {
        // Process the Arrow-Keys
        changeAttackMenuSelection(this);

        chooseAttack(this);
    }

    function changeAttackMenuSelection(self) {
        switch (self.selectedItemPosition) {
            case self.MenuItemPositions.UPPER_LEFT:
                if (Pad.justDown(Pad.RIGHT))
                    self.selectMenuItem(self.MenuItemPositions.UPPER_RIGHT);
                else if (Pad.justDown(Pad.DOWN))
                    self.selectMenuItem(self.MenuItemPositions.LOWER_LEFT);
                break;

            case self.MenuItemPositions.UPPER_RIGHT:
                if (Pad.justDown(Pad.LEFT))
                    self.selectMenuItem(self.MenuItemPositions.UPPER_LEFT);
                else if (Pad.justDown(Pad.DOWN))
                    self.selectMenuItem(self.MenuItemPositions.LOWER_RIGHT);
                break;

            case self.MenuItemPositions.LOWER_LEFT:
                if (Pad.justDown(Pad.RIGHT))
                    self.selectMenuItem(self.MenuItemPositions.LOWER_RIGHT);
                else if (Pad.justDown(Pad.UP))
                    self.selectMenuItem(self.MenuItemPositions.UPPER_LEFT);
                break;

            case self.MenuItemPositions.LOWER_RIGHT:
                if (Pad.justDown(Pad.LEFT))
                    self.selectMenuItem(self.MenuItemPositions.LOWER_LEFT);
                else if (Pad.justDown(Pad.UP))
                    self.selectMenuItem(self.MenuItemPositions.UPPER_RIGHT);
                break;
        }
    }

    function chooseAttack(self) {
        if (Pad.justDown(Pad.SHOOT)) {
            // TODO Select an menu-item
            logInfo("Selected Attack " + self.selectedItemPosition);

            // Selection is over -> Inform Switch-Machine
            var selectedAttack = self.selectedItemPosition;
            self.playerSelectDone(selectedAttack);
        }
    }

    self.speed += 100 * dt;
};


/**
 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)
 https://github.com/bmarwane/phaser.healthbar

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

JackDanger.PokemonVadammt.prototype.HealthBar = function (game, providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawHealthBar();
};
JackDanger.PokemonVadammt.prototype.HealthBar.prototype.constructor = JackDanger.PokemonVadammt.prototype.HealthBar;

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.mergeWithDefaultConfiguration = function (newConfig) {
    var defaultConfig = {
        width: 250,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#FEFF03'
        },
        animationDuration: 200,
        flipped: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor == Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch (e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.drawHealthBar = function () {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.hpBarBmd = bmd;

    this.barSprite = this.game.add.sprite(this.x - this.config.width / 2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if (this.flipped) {
        this.barSprite.scale.x = -1;
    }
};

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};


JackDanger.PokemonVadammt.prototype.HealthBar.prototype.setPercent = function (newValue) {
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;

    var newWidth = this.config.width * (newValue / 100);

    this.setWidth(newWidth);
};

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.setWidth = function (newWidth) {
    if (this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to({width: newWidth}, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

JackDanger.PokemonVadammt.prototype.HealthBar.prototype.setColor = function (color) {
    var col;
    if (isNaN(color)) {
        col = Phaser.Color.hexToColor(color);
    }
    else {
        col = Phaser.Color.getRGB(color);
    }
    this.hpBarBmd.fill(col.r, col.g, col.b);
};