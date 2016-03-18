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

Fighters = {
    JackDanger: {
        name: "Jack Danger",
        maxHP: 100,
        hp: 100,
        attacks: [{name: "Punch", dmg: 10}, {name: "Platscher", dmg: 0}, {name: "Roundhousekick", dmg: 25}, {name: "N/A", dmg: 0}]
    },
    Enemy1: {
        name: "Fieser Fiesling",
        maxHP: 50,
        hp: 50,
        attacks: [{name: "Beißen", dmg: 5}]
    },
    Enemy2: {
        name: "Netter Fiesling",
        maxHP: 100,
        hp: 100,
        attacks: [{name: "Beißen", dmg: 5}]
    }
};
var enemies = [Fighters.Enemy1, Fighters.Enemy2];

var SELECTED_INDICATOR = "- ";

FightState = {
    INIT: 0,
    PLAYER_SELECT: 1,
    JD_ATTACK: 2,
    ENEMY_SELECT: 3,
    ENEMY_ATTACK: 4,
    CHECK_GAME_OVER: 5
};

MenuItemPositions = {
    UPPER_LEFT: 0,
    UPPER_RIGHT: 1,
    LOWER_LEFT: 2,
    LOWER_RIGHT: 3
};

JackDanger.PokemonVadammt.prototype.mycreate = function () {

    //  Set Background color
    game.stage.backgroundColor = "#EEEEEE";

    // Init values
    this.fightState = this.FightState.INIT;
    this.selectedItemPosition = MenuItemPositions.UPPER_LEFT;

    this.addStuff();
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
};

// TODO process states....
// Player_Select -> JD_Attack -> Enemy_Select -> Enemy_Attack -> Check_Game_Over -> Player_Select

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles /////// 
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////

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
    var menuItemTexts = ["Attack 1", "Menu Item 2", "Menu Item 3", "Menu Item 3"];
    this.createAttackMenu(game.width - menuWidth, game.height - menuHeight, menuWidth, menuHeight, menuItemTexts);
    // Select a menu item
    this.selectMenuItem(MenuItemPositions.UPPER_LEFT);

    // Create Stats
    // Give all stats the same size
    var statsWidth = game.width * 0.5;
    var statsHeight = game.height * 0.25;
    // Create Jack Danger stats
    this.createStats(0, 0, statsWidth, statsHeight, Fighters.Enemy1);
    // Create enemy stats
    var jdXPos = game.width * 0.5;
    var jdYPos = game.height * 0.5;
    this.createStats(jdXPos, jdYPos, statsWidth, statsHeight, Fighters.JackDanger);

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
    this.menu1 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menuEntries[MenuItemPositions.UPPER_LEFT], fontSize);
    this.menu1.anchor.x = 0;
    this.menu1.anchor.y = 0.5;
    this.menu1Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu1Selector.anchor.x = 0;
    this.menu1Selector.anchor.y = 0.5;

    // UPPER_RIGHT
    this.menu2 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menuEntries[MenuItemPositions.UPPER_RIGHT], fontSize);
    this.menu2.anchor.x = 0;
    this.menu2.anchor.y = 0.5;
    this.menu2Selector = game.add.bitmapText(newXPos + newWidth * 0.5, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu2Selector.anchor.x = 0;
    this.menu2Selector.anchor.y = 0.5;

    // 2nd Row...
    textYOffset *= 3;
    // LOWER_LEFT
    this.menu3 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menuEntries[MenuItemPositions.LOWER_LEFT], fontSize);
    this.menu3.anchor.x = 0;
    this.menu3.anchor.y = 0.5;
    this.menu3Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu3Selector.anchor.x = 0;
    this.menu3Selector.anchor.y = 0.5;

    // LOWER_RIGHT
    this.menu4 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menuEntries[MenuItemPositions.LOWER_RIGHT], fontSize);
    this.menu4.anchor.x = 0;
    this.menu4.anchor.y = 0.5;
    this.menu4Selector = game.add.bitmapText(newXPos + newWidth * 0.5, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
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
    selectedSelector.text = SELECTED_INDICATOR;
};

JackDanger.PokemonVadammt.prototype.findMenuItemSelector = function (menuItemPos) {
    switch (menuItemPos) {
        case MenuItemPositions.UPPER_LEFT:
            return this.menu1Selector;
            break;
        case MenuItemPositions.UPPER_RIGHT:
            return this.menu2Selector;
            break;
        case MenuItemPositions.LOWER_LEFT:
            return this.menu3Selector;
            break;
        case MenuItemPositions.LOWER_RIGHT:
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
    // Indicator
    var indicatorXPos = xPos + width * 0.1;
    var indicatorYPos = yPos + fontSize * 2;
    var indicatorWidth = (width - (indicatorXPos - xPos)) * 0.9;
    var indicator = game.add.graphics(0, 0);
    indicator.beginFill(this.indicatorColor(owner.hp / owner.maxHP));
    indicator.drawRect(indicatorXPos, indicatorYPos, indicatorWidth, fontSize * 1.75);
    indicator.endFill();
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
        hpText: hpText
    };
};

JackDanger.PokemonVadammt.prototype.indicatorColor = function (healthInPercent) {
    // TODO: Green to red gradient (see http://phaser.io/docs/2.4.6/Phaser.Color.html#.HSVColorWheel and http://phaser.io/examples/v2/display/hsv-color-wheel).
//    var colors = Phaser.Color.HSVColorWheel();
    return 0xDD0000;
};

JackDanger.PokemonVadammt.prototype.playerControlls = function (dt) {

    // Process the Arrow-Keys
    this.changeSelection();

    if (Pad.justDown(Pad.SHOOT)) {
        // TODO Select an menu-item
        logInfo("Selected " + this.selectedItemPosition.toString());
    }

    this.speed += 100 * dt;
};

JackDanger.PokemonVadammt.prototype.changeSelection = function () {
    switch (this.selectedItemPosition) {
        case MenuItemPositions.UPPER_LEFT:
            if (Pad.justDown(Pad.RIGHT))
                this.selectMenuItem(MenuItemPositions.UPPER_RIGHT);
            else if (Pad.justDown(Pad.DOWN))
                this.selectMenuItem(MenuItemPositions.LOWER_LEFT);
            break;

        case MenuItemPositions.UPPER_RIGHT:
            if (Pad.justDown(Pad.LEFT))
                this.selectMenuItem(MenuItemPositions.UPPER_LEFT);
            else if (Pad.justDown(Pad.DOWN))
                this.selectMenuItem(MenuItemPositions.LOWER_RIGHT);
            break;

        case MenuItemPositions.LOWER_LEFT:
            if (Pad.justDown(Pad.RIGHT))
                this.selectMenuItem(MenuItemPositions.LOWER_RIGHT);
            else if (Pad.justDown(Pad.UP))
                this.selectMenuItem(MenuItemPositions.UPPER_LEFT);
            break;

        case MenuItemPositions.LOWER_RIGHT:
            if (Pad.justDown(Pad.LEFT))
                this.selectMenuItem(MenuItemPositions.LOWER_LEFT);
            else if (Pad.justDown(Pad.UP))
                this.selectMenuItem(MenuItemPositions.UPPER_RIGHT);
            break;
    }
};
