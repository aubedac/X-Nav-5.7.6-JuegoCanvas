// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

//stone image
var nStones = 2;
var stones = [];
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function() {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var nMonsters = 3;
var monsters = [];
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var lifes = 3;

for(var i = 0; i < nStones; i++){
	stones[i] = {};
};
var baseSpeed = 156;
for(var i = 0; i < nMonsters; i++){
	monsters[i] = {
		speed: baseSpeed
	};
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function setXY(object){
	object.x = 32 + (Math.random() * (canvas.width - 100));
	object.y = 32 + (Math.random() * (canvas.height - 100));
}

function avoidCollisions(){
	var flag = true;

	while(flag){
		flag = false;
		for(var i = 0; i < nStones; i++){
			for(var j = 0; j < nStones; j++){
				if(i == j){
					continue
				}
				if(areTouching(stones[i], stones[j])){
					setXY(stones[i]);
					flag = true;
				}
			}
			for(var k = 0; k < nMonsters; k++){
				if(areTouching(stones[i], monsters[k])){
					setXY(stones[i]);
					flag = true;
				}
			}
			if(areTouching(stones[i], hero) || areTouching(stones[i], princess)){
				setXY(stones[i]);
				flag = true;
			}
		}
		for(var i = 0; i < nMonsters; i++){
			for(var j = 0; j < nMonsters; j++){
				if(i == j){
					continue;
				}
				if(areTouching(monsters[i], monsters[j])){
					setXY(monsters[i]);
					flag = true;
				}
			}
			if(areTouching(monsters[i], hero) || areTouching(monsters[i], princess)){
				setXY(monsters[i]);
				flag = true;
			}
		}
		if(areTouching(hero, princess)){
			setXY(princess);
			flag = true;
		}
	}
}

function areTouching(target1, target2) {
	return (target1.x <= target2.x + 30) && (target2.x <= target1.x + 30) && (target1.y <= target2.y + 30) && (target2.y <= target1.y + 30);
};


// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	if((princessesCaught % 2) == 0){
		var newSpeed = (baseSpeed * 0.1) + baseSpeed;
		for(var i = 0; i < nMonsters; i++){
			setXY(monsters[i] = {
				speed: newSpeed
			});
		}
		baseSpeed = newSpeed;
	} else {
		for(var i = 0; i < nMonsters; i++){
			setXY(monsters[i]);
		};
	}

	setXY(princess);

	for(var i = 0; i < nStones; i++){
		setXY(stones[i]);
	};

	avoidCollisions();
};

// Update game objects
var update = function (modifier) {
	var beforeX = hero.x;
	var beforeY = hero.y;
	var monstersBX = [];
	var monstersBY = [];

	for(var i = 0; i < nMonsters; i++){
		monstersBX[i] = monsters[i].x;
		monstersBY[i] = monsters[i].y;
	}

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		for(var i = 0; i < nMonsters; i++){
			monsters[i].y -= monsters[i].speed * modifier;
			if(monsters[i].y <= 15){
				monsters[i].y = 15;
			}
		}
		if(hero.y <= 15){
			hero.y = 15;
		}
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		for(var i = 0; i < nMonsters; i++){
			monsters[i].y += monsters[i].speed * modifier;
			if(monsters[i].y >= canvas.height - 60){
				monsters[i].y = canvas.height - 60;
			}
		}
		if(hero.y >= canvas.height - 60){
			hero.y = canvas.height - 60;
		}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		for(var i = 0; i < nMonsters; i++){
			monsters[i].x -= monsters[i].x * modifier;
			if(monsters[i].x <= 15){
				monsters[i].x = 15;
			}
		}
		if(hero.x <= 15){
			hero.x = 15;
		}
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		for(var i = 0; i < nMonsters; i++){
			monsters[i].x += monsters[i].speed * modifier;
			if(monsters[i].x >= canvas.width - 60){
				monsters[i].x = canvas.width - 60;
			}
		}
		if(hero.x >= canvas.width - 60){
			hero.x = canvas.width - 60;
		}
	}

	// Are they touching?
	for(var i = 0; i < nStones; i++){
		for(var j = 0; j < nMonsters; j++){
			if(areTouching(stones[i], monsters[j])){
				monsters[j].x = monstersBX[j];
				monsters[j].y = monstersBY[j];
				break;
			}
		}
		if(areTouching(hero, stones[i])){
			hero.x = beforeX;
			hero.y = beforeY;
			break;
		}
	}
	for(var i = 0; i < nMonsters; i++){
		if(areTouching(monsters[i], hero)){
			--lifes;
			if(lifes == 0){
				save();
				lifes = 3;
			}
			reset();
		}
	}
	if (areTouching(hero, princess)){
		++princessesCaught;
		reset();
	}

};

// Draw everything
var render = function () {

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if(stoneReady){
		for(var i = 0; i < nStones; i++){
				ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		};
	}

	if(monsterReady){
		for(var i = 0; i < nMonsters; i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		};
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText("Lifes: " + lifes, canvas.width - 60, 32);
};

var save = function(){
	localStorage.setItem("princessesCaught", princessesCaught);
	localStorage.setItem("nMonsters", nMonsters);
	localStorage.setItem("nStones", nStones);
}

var load = function(){
	if(localStorage.princessesCaught){
		princessesCaught = localStorage.princessesCaught;
		nMonsters = localStorage.nMonsters;
		nStones = localStorage.nStones;
	}else{
		reset();
	}
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
load();
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
