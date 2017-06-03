// https://github.com/lostdecade/simple_canvas_game

const config = {
  MIN_WIDTH: 30,
  MAX_WIDTH: 512,
  MIN_HEIGHT: 30,
  MAX_HEIGHT: 414
}

$(function () {

  // Create the canvas
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = config.MAX_WIDTH;
  canvas.height = config.MAX_HEIGHT;
  document.body.appendChild(canvas);

  var createHero = function(id) {
    var hero = {
      temp: 0,
      speed: 256 // movement in pixels per second
    };

    hero.id = id;
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    return hero;
  }
  
  heros = {};

  var restrictMovement = function(hero, requestedUpdate) {
    if (requestedUpdate.x < 30 || requestedUpdate.x > 450 || requestedUpdate.y < 30 || requestedUpdate.y > 414) {
      console.log('no update: out of bounds');
      return;
    }

    // Restrict x
    requestedUpdate.x = Math.max(config.MIN_WIDTH, requestedUpdate.x);
    requestedUpdate.x = Math.min(config.MAX_WIDTH, requestedUpdate.x);

    // Restrict y
    requestedUpdate.y = Math.max(config.MIN_HEIGHT, requestedUpdate.y);
    requestedUpdate.y = Math.min(config.MAX_HEIGHT, requestedUpdate.y);

    hero.x = requestedUpdate.x;
    hero.y = requestedUpdate.y;
  }

  // Background image
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "assets/images/background.png";

  // Hero image
  var heroReady = false;
  var heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "assets/images/hero.png";

  // Monster image
  var monsterReady = false;
  var monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "assets/images/monster.png";

  var monster = {};
  var monstersCaught = 0;

  // Handle keyboard controls
  var keysDown = {};

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  // Reset the game when the player catches a monster
  var reset = function () {
    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
  };

  // Update game objects
  var update = function (modifier) {
    // var hero = heros[0];

    // if (38 in keysDown) { // Player holding up
    //   hero.y -= hero.speed * modifier;
    // }
    // if (40 in keysDown) { // Player holding down
    //   hero.y += hero.speed * modifier;
    // }
    // if (37 in keysDown) { // Player holding left
    //   hero.x -= hero.speed * modifier;
    // }
    // if (39 in keysDown) { // Player holding right
    //   hero.x += hero.speed * modifier;
    // }

    // Are they touching?
    Object.values(heros).forEach(function(hero) {
      if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
      ) {
        ++monstersCaught;
        reset();
      }
    });
  };

  // Draw everything
  var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
      Object.values(heros).forEach(function(hero) {
        ctx.drawImage(heroImage, hero.x, hero.y);
        drawTempIndicator(hero);
      });
    }

    if (monsterReady) {
      ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
  };

  var drawTempIndicator = function (hero) {
    if (!hero.temp) return;
    const diffFromRoomTemp = (23 - hero.temp);
    const differenceScaled = diffFromRoomTemp * 10 / 100 * 255;
    // Calcualte how red the player's temperature indicator should be
    const fillColorPercentageRValue = Math.min(differenceScaled, 255);
    if (diffFromRoomTemp > 0) {
      // Make it red
      ctx.fillStyle = `rgb(${fillColorPercentageRValue}, 0, 0)`;
    } else {
      // Make it blue
      ctx.fillStyle = `rgb(0, 0, ${fillColorPercentageRValue})`;

    }
    ctx.globalAlpha = 0.2;
    ctx.fillRect(hero.x-10, hero.y-12.5, 50, 50);
    ctx.globalAlpha = 1.0;
  }

  // The main game loop
  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
  };

  // Cross-browser support for requestAnimationFrame
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

  // Let's play this game!
  var then = Date.now();
  reset();
  main();

  var getHeroById = function(id) {
    if (heros[event.id]) return heros[event.id];
    // Couldn't find an existing hero with this ID, create a new one
    const newHero = createHero(event.id); 
    heros[newHero.id] = newHero;
    console.log('adding a new hero', newHero.id);
    return newHero;
  }

  var socket = io();
  socket.on('event', function (event) {
    if (event && event.data && event.data.x) {
      console.log(event);
      let currentHero = getHeroById(event.id);
      currentHero.temp = event.data.temp
      let newPosition = {x: currentHero.x, y: currentHero.y};
      newPosition.x += currentHero.speed * event.data.x/100;
      newPosition.y += currentHero.speed * event.data.y/100;
      restrictMovement(currentHero, newPosition);
    }
  });
});
