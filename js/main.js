// ======================================
// Game Variables
// ======================================
var gravity = 0.3;
// Ball Variables
var ballhorz = 0;
var ballvelo = 0;
var ballbc = 0;
var posession;
// =====================================
// Interval Tracking
// =====================================

var p1inter;
var p2inter;
var ballinter;
var basketinter;

// ======================================
// Sprite Variables
// ======================================

// Player Tracking
var players = [];
// Other Sprites
var ball;
var bluebasket;
var pinkbasket;

var bluescore = 0;

var pinkscore = 0;

//sounds
var bounceplay = true;
var shootplay = true;
var scoreplay = true;

var settings = {
	birdgravity: 0.3, // Gravity of the bird. Higher to make the bird fall faster.
	birdspeed: 4, // Speed of the bird. Higher to make the bird move faster.
	birdfriction: 0.98, // Friction of bird. 0 to 0.99. Higher to make the bird slide more.
	birdsize: 60, // Size of the Bird. Higher to make the bird bigger.
	ballgravity: 0.6, // Gravity of Ball. Higher makes the Ball fall faster.
	flapwait: 400, // Wait time between flaps in milliseconds. Lower is faster.
	birdloss: 0.5, // The decrease of speed when bird as the ball.
	jumpheight: 8, // Jump height for birds. higher makes the bird jump higher.
	maxpower: 70, // Maximum power for shooting the ball.
	powerspeed: 0.2, // Rate at which the poewr charges for shot.
	maxscore: 7, // Maximum score to win.
	ticks: 20 // the speed of everything in the game.
}

// Set Canvas width and height to screen dimensions
var wark = document.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var hark = document.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
document.getElementById('game').width = wark - 20;
document.getElementById('game').height = hark - 22;

Scratch.init(document.getElementById('game'));
Scratch.importImage("leftbird", "img/leftbird.png");
Scratch.importImage("rightbird", "img/rightbird.png");
Scratch.importImage("ball", "img/ball.png");
Scratch.importImage("pinkbasket", "img/basketpink.png");
Scratch.importImage("bluebasket", "img/basketblue.png");
Scratch.loadImages();

// Add a player to the list.
function addPlayer(){
	var name = $("#userinput").val();
	var newsprite = new Sprite("rightbird");
	newsprite.username = name;
	$("#users").append("<li>" + newsprite.username + "</li>");
	$("#userinput").val("");
	newsprite.bouncecount = 0;
	newsprite.velocity = 0;
	newsprite.horizontalvelo = 0;
	newsprite.flapable = true;
	newsprite.block = false;
	newsprite.power = 0;
	if(players.length === 0){
		newsprite.powerbar = new Sprite("bluebasket");
	} else {
		newsprite.powerbar = new Sprite("pinkbasket");
	}
	newsprite.powerbar.hide();
	newsprite.setSize(settings.birdsize);
	newsprite.goto(Scratch.random(-300, 300), Scratch.random(-300, 300));
	players.push(newsprite);
}

function start() {
	$("#startmodal").hide();
	ball = new Sprite("ball");
	pinkbasket = new Sprite("pinkbasket");
	bluebasket = new Sprite("bluebasket");
	Scratch.stage.image = "#4c4c4c";
	ball.setSize(10);
	pinkbasket.setSize(40);
	bluebasket.setSize(40);
	bluebasket.goto(-(Scratch.width / 2), -(Scratch.height / 3.8));
	pinkbasket.goto((Scratch.width / 2) - pinkbasket.width, -(Scratch.height / 3.8));
	p1inter = setInterval(loopone, settings.ticks);
	p2inter = setInterval(looptwo, settings.ticks);
	ballinter = setInterval(ballLoop, settings.ticks);
	basketinter = setInterval(basketLoop, settings.ticks);
	setInterval(function(){Scratch.drawText("25px 'Nunito', sans-serif", bluescore + " | " + pinkscore, "white", -40, -(Scratch.height / 2) + 60);}, 5);
}

function basketLoop(){
	if(pinkbasket.touching(ball)){
		posession = -1;
		pinkscore++;
		if(scoreplay){
			var aud = new Audio("img/score.wav");
			aud.play();
			scoreplay = false;
			setTimeout(function(){
				scoreplay = true;
			}, 1000)
		}
		resetBall("Pink");
	} else if(bluebasket.touching(ball)){
		if(scoreplay){
			var aud = new Audio("img/score.wav");
			aud.play();
			scoreplay = false;
			setTimeout(function(){
				scoreplay = true;
			}, 1000)
		}
		posession = -1;
		bluescore++;
		resetBall("Blue");
	}
	if(pinkscore === settings.maxscore){
		//fireloop();
		Scratch.drawText("50px 'Nunito', sans-serif", "Pink Wins!", "#ff42fb", -60, 25);
		setTimeout(function(){
			$("#startmodal").empty();
			$("#startmodal").append("<h2 class='text-center' id='header'>Pink Wins!</h2>");
			$("#startmodal").append("<button onclick='window.reload()' class='btn btn-success' id='start'>Play Again!</button>");
		}, 2000);
		clearInterval(ballinter);
		clearInterval(p1inter);
		clearInterval(p2inter);
		clearInterval(basketinter);
	}
	if(bluescore === settings.maxscore){
		//fireloop();
		Scratch.drawText("50px 'Nunito', sans-serif", "Blue Wins!", "#4177ff", -60, 25);
		setTimeout(function(){
			$("#startmodal").empty();
			$("#startmodal").append("<h2 class='text-center' id='header'>Blue Wins!</h2>");
			$("#startmodal").append("<button onclick='location.reload()' class='btn btn-success' id='start'>Play Again!</button>");
			$("#startmodal").show();
		}, 2000);
		clearInterval(ballinter);
		clearInterval(p1inter);
		clearInterval(p2inter);
		clearInterval(basketinter);
	}
	if(players[0].image === "leftbird"){
		players[0].powerbar.goto(players[0].x - (players[0].width), players[0].y);
	} else if(players[0].image === "rightbird"){
		players[0].powerbar.goto(players[0].x + (players[0].width), players[0].y);
	}
	if(players[1].image === "leftbird"){
		players[1].powerbar.goto(players[1].x - (players[1].powerbar.width + players[1].width), players[1].y);
	} else if(players[1].image === "rightbird"){
		players[1].powerbar.goto(players[1].x + (players[1].powerbar.width + players[1].width), players[1].y);
	}
}

function resetBall(color){
	clearInterval(ballinter);
	clearInterval(p1inter);
	clearInterval(p2inter);
	ball.goto(-ball.width, -ball.height);
	players.forEach(function(item){
		item.goto(Scratch.random(-300, 300), Scratch.random(-300, 300));
	});
	Scratch.drawText("50px 'Nunito', sans-serif", color + " Scores!", "white", -80, 25);
	setTimeout(function(){
		ballhorz = 0;
		p1inter = setInterval(loopone, settings.ticks);
		p2inter = setInterval(looptwo, settings.ticks);
		ballinter = setInterval(ballLoop, settings.ticks);
	}, 1000);
}

function ballLoop(){
	ballhorz = ballhorz * 0.96;
	ball.changeXBy(ballhorz);
	if(ball.y > Scratch.height / 2 - ball.height){
		if(ballbc < 2){
			ballvelo = ballvelo * 1;
			ball.changeYBy(ballvelo);
			ballvelo = ballvelo / 5;
			ballbc++;
			if(bounceplay){
				new Audio("img/bounce.wav");
				bounceplay = false;
				setTimeout(function(){
					bounceplay = true;
				}, 500)
			}
		} else {
			if(bounceplay){
				new Audio("img/bounce.wav");
				bounceplay = false;
				setTimeout(function(){
					bounceplay = true;
				}, 500)
			}
			ballvelo = 0;
			ball.y = Scratch.height / 2 - ball.height;
		}
	} else {
		ballvelo = ballvelo + settings.ballgravity;
		ball.changeYBy(ballvelo);
	}
	if(ball.touching(players[0])){
		if(!players[0].block){
			posession = 0;
			players[0].block = true;
			setTimeout(function(){
				players[0].block = false;
			}, 1000);
		}
	} else if(ball.touching(players[1])){
		if(!players[1].block){
			posession = 1;
			players[1].block = true;
			setTimeout(function(){
				players[1].block = false;
			}, 1000);
		}
	}
	if(posession > -1){
		ball.goto(players[posession].x, players[posession].y + players[posession].height);
	}
	if(ball.x < (-Scratch.width / 2) || (ball.x + ball.width) > Scratch.width / 2){
		if((ball.x + ball.width) > Scratch.width){
			ball.goto(Scratch.width - ball.width);
		}
		ballhorz = -ballhorz;
		if(bounceplay){
			var aud = new Audio("img/bounce.wav");
			aud.play();
			bounceplay = false;
			setTimeout(function(){
				bounceplay = true;
			}, 300)
		}
	}
	if(ball.y < -(Scratch.height / 2)){
		ballvelo = -ballvelo;
		if(bounceplay){
			var aud = new Audio("img/bounce.wav");
			aud.play();
			bounceplay = false;
			setTimeout(function(){
				bounceplay = true;
			}, 300)
		}
	}
}

$("#userform").on("submit", function(e){
	addPlayer();
	e.preventDefault();
});

function loopone(){
	if(players[0].y > Scratch.height / 2 - players[0].height){
		if(players[0].bouncecount < 2){
			players[0].velocity = players[0].velocity * -1;
			players[0].changeYBy(players[0].velocity);
			players[0].velocity = players[0].velocity / 5;
			players[0].bouncecount++;
		} else {
			players[0].velocity = 0;
		}
	} else {
		players[0].velocity = players[0].velocity + gravity;
		players[0].changeYBy(players[0].velocity);
	}
	if(Scratch.iskeydown[38]){
		if(players[0].flapable){
			var aud = new Audio("img/flap.wav");
			aud.play();
			players[0].flapable = false;
			players[0].velocity = -settings.jumpheight;
			players[0].bouncecount = 0;
			players[0].changeYBy(players[0].velocity);
			setTimeout(function(){players[0].flapable = true;}, settings.flapwait);
		}
	}
	players[0].changeXBy(players[0].horizontalvelo);
	if(Scratch.iskeydown[37]){
		if(posession === 0){
			players[0].horizontalvelo = (-settings.birdspeed) + settings.birdloss;
		} else {
			players[0].horizontalvelo = -settings.birdspeed;
		}
		players[0].changeImage("leftbird");
	}
	if(Scratch.iskeydown[39]){
		if(posession === 0){
			players[0].horizontalvelo = (settings.birdspeed) - settings.birdloss;
		} else {
			players[0].horizontalvelo = settings.birdspeed;
		}
		players[0].changeImage("rightbird");
	}
	if(Scratch.iskeydown[37] === false && Scratch.iskeydown[39] === false){
		players[0].horizontalvelo = players[0].horizontalvelo * settings.birdfriction;
	}
	if(Scratch.iskeydown[190] && posession === 0){
			var keywait = setInterval(function(){
				if(Scratch.iskeydown[190] && posession === 0){
					if (players[0].power < settings.maxpower){
						players[0].power += settings.powerspeed;
						players[0].powerbar.resize(players[0].power / 2, 5);
					}
					players[0].powerbar.show();
					if(players[0].image === "leftbird"){
						players[0].powerbar.goto(players[0].x - 20, players[0].y);
					} else if(players[0].image === "rightbird"){
						players[0].powerbar.goto(players[0].x + 20, players[0].y);
					}
				} else {
					players[0].block = true;
					setTimeout(function(){
						players[0].block = false;
					}, 1500);
					posession = -1;
					players[0].powerbar.hide();

					if(players[0].image === "leftbird"){
						for (var i = 0; i < 3; i++) {
							ballvelo = -(players[0].power / 4);
							ballhorz = -(players[0].power / 2);
						}
					} else if(players[0].image === "rightbird"){
						for (var i = 0; i < 3; i++) {
							ballvelo = -(players[0].power / 4);
							ballhorz = (players[0].power / 2);
						}
					}
					if(shootplay){
						var aud = new Audio("img/shoot.wav");
						aud.play();
						shootplay = false;
						setTimeout(function(){
							shootplay = true;
						}, 500)
					}
					setTimeout(function(){
						players[0].power = 0;
					}, 1000);
					clearInterval(keywait);
				}
			}, 100);
	}
	Scratch.drawText("15px 'Nunito', sans-serif", players[0].username, "white", players.x - 25, players[0].y - (players[0].width + 8));
}

function looptwo(){
	if(players[1].y > Scratch.height / 2 - players[1].height){
		if(players[1].bouncecount < 2){
			players[1].velocity = players[1].velocity * -1;
			players[1].changeYBy(players[1].velocity);
			players[1].velocity = players[1].velocity / 5;
			players[1].bouncecount++;
		} else {
			players[1].velocity = 0;
		}
	} else {
		players[1].velocity = players[1].velocity + settings.birdgravity;
		players[1].changeYBy(players[1].velocity);
	}
	if(Scratch.iskeydown[87]){
		if(players[1].flapable){
			var aud = new Audio("img/flap.wav");
			aud.play();
			players[1].flapable = false;
			players[1].velocity = -settings.jumpheight;
			players[1].bouncecount = 0;
			players[1].changeYBy(players[1].velocity);
			setTimeout(function(){players[1].flapable = true;}, settings.flapwait);
		}
	}
	players[1].changeXBy(players[1].horizontalvelo);
	if(Scratch.iskeydown[65]){
		if(posession === 1){
			players[1].horizontalvelo = (-settings.birdspeed) + settings.birdloss;
		} else {
			players[1].horizontalvelo = -settings.birdspeed;
		}
		players[1].changeImage("leftbird");
	}
	if(Scratch.iskeydown[68]){
		if(posession === 1){
			players[1].horizontalvelo = (settings.birdspeed) - settings.birdloss;
		} else {
			players[1].horizontalvelo = settings.birdspeed;
		}
		players[1].changeImage("rightbird");
	}
	if(Scratch.iskeydown[65] === false && Scratch.iskeydown[68] === false){
		players[1].horizontalvelo = players[1].horizontalvelo * settings.birdfriction;
	}
	if(Scratch.iskeydown[81] && posession === 1){
		var keywait = setInterval(function(){
			if(Scratch.iskeydown[81] && posession === 1){
				if (players[1].power < settings.maxpower){
					players[1].power += settings.powerspeed;
					players[1].powerbar.resize(players[1].power / 2, 5);
				}
				players[1].powerbar.show();
				if(players[1].image === "leftbird"){
					players[1].powerbar.goto(players[1].x - 20, players[1].y);
				} else if(players[1].image === "rightbird"){
					players[1].powerbar.goto(players[1].x + 20, players[1].y);
				}
			} else {
				players[1].block = true;
				setTimeout(function(){
					players[1].block = false;
				}, 1500);
				posession = -1;
				players[1].powerbar.hide();
				
				if(players[1].image === "leftbird"){
					for (var i = 0; i < 3; i++) {
						ballvelo = -(players[1].power / 4);
						ballhorz = -(players[1].power / 2);
					}
				} else if(players[1].image === "rightbird"){
					for (var i = 0; i < 3; i++) {
						ballvelo = -(players[1].power / 4);
						ballhorz = (players[1].power / 2);
					}
				}
				if(shootplay){
					var aud = new Audio("img/shoot.wav");
					aud.play();
					shootplay = false;
					setTimeout(function(){
						shootplay = true;
					}, 500)
				}
				setTimeout(function(){
					players[1].power = 0;
				}, 1000);
				clearInterval(keywait);
			}
		}, 100);
	}
	Scratch.drawText("15px 'Nunito', sans-serif", players[1].username, "white", players.x - 25, players[1].y - (players[1].width + 8));
}
