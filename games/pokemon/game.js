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
    "[A] Auswahl",      //Jump button belegung
    "[B] Zurück",       //Shoot button belegung
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

    //  Set Background color
    game.stage.backgroundColor = "#EEEEEE";
};

JackDanger.PokemonVadammt.prototype.mycreate = function () {

    this.addStuff();

    // Create Menu
    var menuWidth = game.width * 0.5;
    var menuHeight = game.height * 0.25;
    this.createAttackMenu(game.width - menuWidth, game.height - menuHeight, menuWidth, menuHeight);
    // Select a menu item
    this.selectMenuItem(MenuItemPositions.UPPER_LEFT);
};

//wird jeden Frame aufgerufen
JackDanger.PokemonVadammt.prototype.update = function () {
    var dt = this.time.physicsElapsedMS * 0.001;

    this.playerControlls(dt);
    /*    this.updateBall(dt);
     this.bounding();
     this.collision();
     this.updateTime(dt);
     */
};

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles /////// 
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////

FightState = {
    INIT: 0,
    SELECT_ATTACK: 1,
    ATTACK: 2,
    ENEMY_SELECT_ATTACK: 3,
    ENEMY_ATTACK: 4
};

MenuItemPositions = {
    UPPER_LEFT: 0,
    UPPER_RIGHT: 1,
    LOWER_LEFT: 2,
    LOWER_RIGHT: 3
};

var SELECTED_INDICATOR = "- ";

JackDanger.PokemonVadammt.prototype.addStuff = function (dt) {
    // Player
    this.player = this.add.sprite(game.width * 0.25, 350, "pokemon", "face");

    // Enemy
    this.ball = this.add.sprite(game.width * 0.75, 50, "pokemon", "ball");
    this.ball.dir = {x: 1, y: 1};

    // Time Text
    this.timeText = game.add.bitmapText(game.width / 2, 20, "testfont", "TEST", 30);
    this.timeText.anchor.set(0.5);

    // Init values
    this.fightState = FightState.INIT;
    this.selectedItemPosition = MenuItemPositions.UPPER_LEFT;
};

JackDanger.PokemonVadammt.prototype.createAttackMenu = function (xPos, yPos, width, height, fontSize) {
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
    // 1st Row
    var menu1Str = "Menu Item 1";
    this.menu1 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menu1Str, fontSize);
    this.menu1.anchor.x = 0;
    this.menu1.anchor.y = 0.5;
    this.menu1Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu1Selector.anchor.x = 0;
    this.menu1Selector.anchor.y = 0.5;

    var menu2Str = "Menu Item 2";
    this.menu2 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menu2Str, fontSize);
    this.menu2.anchor.x = 0;
    this.menu2.anchor.y = 0.5;
    this.menu2Selector = game.add.bitmapText(newXPos + newWidth * 0.5, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu2Selector.anchor.x = 0;
    this.menu2Selector.anchor.y = 0.5;

    // 2nd Row...
    textYOffset *= 3;
    var menu3Str = "Menu Item 3";
    this.menu3 = game.add.bitmapText(newXPos + menuSelectorWidth, newYPos + textYOffset, "testfont", menu3Str, fontSize);
    this.menu3.anchor.x = 0;
    this.menu3.anchor.y = 0.5;
    this.menu3Selector = game.add.bitmapText(newXPos, newYPos + textYOffset, "testfont", SELECTED_INDICATOR, fontSize);
    this.menu3Selector.anchor.x = 0;
    this.menu3Selector.anchor.y = 0.5;

    var menu4Str = "Menu Item 4";
    this.menu4 = game.add.bitmapText(newXPos + menuSelectorWidth + newWidth * 0.5, newYPos + textYOffset, "testfont", menu4Str, fontSize);
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

JackDanger.PokemonVadammt.prototype.playerControlls = function (dt) {

    // Process the Arrow-Keys
    this.changeSelection();

    // TODO Select an menu-item

    this.speed += 100 * dt;
};

/**
 *
 * @returns {boolean} true if the selection changed.
 */
JackDanger.PokemonVadammt.prototype.changeSelection = function () {
    switch (this.selectedItemPosition) {
        case MenuItemPositions.UPPER_LEFT:
            if (Pad.isDown(Pad.RIGHT))
                this.selectMenuItem(MenuItemPositions.UPPER_RIGHT);
            else if (Pad.isDown(Pad.DOWN))
                this.selectMenuItem(MenuItemPositions.LOWER_LEFT);
            break;

        case MenuItemPositions.UPPER_RIGHT:
            if (Pad.isDown(Pad.LEFT))
                this.selectMenuItem(MenuItemPositions.UPPER_LEFT);
            else if (Pad.isDown(Pad.DOWN))
                this.selectMenuItem(MenuItemPositions.LOWER_RIGHT);
            break;

        case MenuItemPositions.LOWER_LEFT:
            if (Pad.isDown(Pad.RIGHT))
                this.selectMenuItem(MenuItemPositions.LOWER_RIGHT);
            else if (Pad.isDown(Pad.UP))
                this.selectMenuItem(MenuItemPositions.UPPER_LEFT);
            break;

        case MenuItemPositions.LOWER_RIGHT:
            if (Pad.isDown(Pad.LEFT))
                this.selectMenuItem(MenuItemPositions.LOWER_LEFT);
            else if (Pad.isDown(Pad.UP))
                this.selectMenuItem(MenuItemPositions.UPPER_RIGHT);
            break;
    }
}


JackDanger.PokemonVadammt.prototype.collision = function () {
    var difX = this.player.x - this.ball.x;
    var difY = this.player.y - this.ball.y;
    if (Math.sqrt(difX * difX + difY * difY) < this.ball.width * 0.8) {
        //LOST
        onLose();
    }
};

JackDanger.PokemonVadammt.prototype.bounding = function () {
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > (this.game.width - this.player.width)) this.player.x = this.game.width - this.player.width;
    if (this.player.y < 0) this.player.y = 0;
    if (this.player.y > (this.game.height - this.player.height)) this.player.y = this.game.height - this.player.height;
};