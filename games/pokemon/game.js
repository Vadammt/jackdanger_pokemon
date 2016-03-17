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
addMyGame("pokemon",
    "JackDanger Pokemon",
    "Vadammt",
    "Pokemon - nur ohne Pokemon.",
    "Steuerung", //Steuerkreuz
    "[A] Auswahl", //Jump button belegung
    "[B] Zurück", //Shoot button belegung
    JackDanger.PokemonVadammt);


JackDanger.PokemonVadammt.prototype.init = function () {
    logInfo("init Game");
    addLoadingScreen(this, true);//nicht anfassen
}

JackDanger.PokemonVadammt.prototype.preload = function () {
    this.load.path = 'games/' + currentGameData.id + '/assets/';//nicht anfassen

    //füge hie rein was du alles laden musst.
    this.load.atlas("pokemon");
}

//wird nach dem laden gestartet
JackDanger.PokemonVadammt.prototype.create = function () {
    Pad.init();//nicht anfassen
}

JackDanger.PokemonVadammt.prototype.mycreate = function () {

    this.addStuff();
}


//wird jeden Frame aufgerufen
JackDanger.PokemonVadammt.prototype.update = function () {
    var dt = this.time.physicsElapsedMS * 0.001;

    this.playerControlls(dt);
    this.updateBall(dt);
    this.bounding();
    this.collision();
    this.updateTime(dt);
}

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
}

var SELECTED_INDICATOR = "-";

JackDanger.PokemonVadammt.prototype.addStuff = function (dt) {
    // Player
    this.player = this.add.sprite(20, 50, "pokemon", "face");

    // Ball
    this.ball = this.add.sprite(600, Math.random() * 300, "pokemon", "ball");
    this.ball.dir = {x: 1, y: 1};

    // Time Text
    this.timeText = game.add.bitmapText(game.width / 2, 20, "testfont", "", 30);
    this.timeText.anchor.set(0.5);

    // Create Menu
    var menuWidth = game.width * 0.5;
    var menuHeight = game.height * 0.25;
    this.createTestMenu(game.width - menuWidth, game.height - menuHeight, menuWidth, menuHeight);
    this.selectMenuItem(MenuItemPositions.UPPER_LEFT);

    // Init values
    this.fightState = FightState.INIT;
    this.selected = MenuItemPositions.UPPER_LEFT;
}

JackDanger.PokemonVadammt.prototype.createTestMenu = function (xPos, yPos, width, height, fontSize) {
    if (isNaN(fontSize)) fontSize = 20;

    var yOffset = height * 0.25;

    // Add Text
    // 1st Row
    var menu1Str = SELECTED_INDICATOR + "  Menu Item 1";
    this.menu1 = game.add.bitmapText(xPos, yPos + yOffset, "testfont", menu1Str, fontSize);
    this.menu1.anchor.x = 0;
    this.menu1.anchor.y = 0.5;

    var menu2Str = "   Menu Item 2";
    this.menu2 = game.add.bitmapText(xPos + width * 0.5, yPos + yOffset, "testfont", menu2Str, fontSize);
    this.menu2.anchor.x = 0;
    this.menu2.anchor.y = 0.5;

    // 2nd Row...
    yOffset *= 3;
    var menu3Str = "   Menu Item 3";
    this.menu3 = game.add.bitmapText(xPos, yPos + yOffset, "testfont", menu3Str, fontSize);
    this.menu3.anchor.x = 0;
    this.menu3.anchor.y = 0.5;

    var menu4Str = "   Menu Item 4";
    this.menu4 = game.add.bitmapText(xPos + width * 0.5, yPos + yOffset, "testfont", menu4Str, fontSize);
    this.menu4.anchor.x = 0;
    this.menu4.anchor.y = 0.5;
}

JackDanger.PokemonVadammt.prototype.selectMenuItem = function (menuItemPos) {
    this.menu1.text = " " + this.menu1.text.substr(1);
    this.menu2.text = " " + this.menu2.text.substr(1);
    this.menu3.text = " " + this.menu3.text.substr(1);
    this.menu4.text = " " + this.menu4.text.substr(1);

    this.selected = this.findMenuItem(menuItemPos);
    this.selected.text = SELECTED_INDICATOR + this.selected.text.substr(1);
}

JackDanger.PokemonVadammt.prototype.findMenuItem = function (menuItemPos) {
    switch (menuItemPos) {
        case MenuItemPositions.UPPER_LEFT:
            return this.menu1;
            break;
        case MenuItemPositions.UPPER_RIGHT:
            return this.menu2;
            break;
        case MenuItemPositions.LOWER_LEFT:
            return this.menu3;
            break;
        case MenuItemPositions.LOWER_RIGHT:
            return this.menu4;
            break;
        default:
            throw new Error("no action for " + menuItem + " defined.");
    }
}

JackDanger.PokemonVadammt.prototype.updateTime = function (dt) {
    this.timeLeft -= dt;
    this.timeText.setText("noch " + this.timeLeft.toFixed(1) + " Sekunden durchhalten!");

    if (this.timeLeft <= 0) onVictory();
}

JackDanger.PokemonVadammt.prototype.updateBall = function (dt) {
    this.ball.x += this.ball.dir.x * dt * this.ball.speed * 1.1;
    this.ball.y += this.ball.dir.y * dt * this.ball.speed;

    this.ball.speed += 30 * dt;

    if (this.ball.x < 0) this.ball.dir.x *= -1;
    if (this.ball.x > (this.game.width - this.ball.width)) this.ball.dir.x *= -1;
    if (this.ball.y < 0) this.ball.dir.y *= -1;
    if (this.ball.y > (this.game.height - this.ball.height)) this.ball.dir.y *= -1;
}

JackDanger.PokemonVadammt.prototype.playerControlls = function (dt) {
    if (Pad.justDown(Pad.LEFT)) {
        // TODO: SMI2 + LEFT -> SMI1
        this.player.x -= this.speed * dt;
        isMoved = true;
    }

    if (Pad.isDown(Pad.RIGHT)) {
        this.player.x += this.speed * dt;
        isMoved = true;
    }

    if (Pad.isDown(Pad.UP)) {
        this.player.y -= this.speed * dt;
        isMoved = true;
    }

    if (Pad.isDown(Pad.DOWN)) {
        this.player.y += this.speed * dt;
        isMoved = true;
    }

    this.speed += 100 * dt;
}

JackDanger.PokemonVadammt.prototype.collision = function () {
    var difX = this.player.x - this.ball.x;
    var difY = this.player.y - this.ball.y;
    if (Math.sqrt(difX * difX + difY * difY) < this.ball.width * 0.8) {
        //LOST
        onLose();
    }
}

JackDanger.PokemonVadammt.prototype.bounding = function () {
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > (this.game.width - this.player.width)) this.player.x = this.game.width - this.player.width;
    if (this.player.y < 0) this.player.y = 0;
    if (this.player.y > (this.game.height - this.player.height)) this.player.y = this.game.height - this.player.height;
}