// constants
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

// declaring variables
let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zombie1, zombie2, zombie3, zombie4, sadzombie;
var breakButton;
var backgroundImage;
// creating array
var stones = [];
// setting collision to false
var collided = false;
function preload() {

  // preloading images
  zombie1 = loadImage("./assets/zombie1.png");
  zombie2 = loadImage("./assets/zombie2.png");
  zombie3 = loadImage("./assets/zombie3.png");
  zombie4 = loadImage("./assets/zombie4.png");
  sadzombie = loadImage("./assets/sad_zombie.png");
  backgroundImage = loadImage("./assets/background.png");

}

function setup() {
  
  // creating canvas
  createCanvas(windowWidth, windowHeight);
  // creating engine
  engine = Engine.create();
  world = engine.world;
  // showing frames
  frameRate(80);

  // using class
  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(30, { x: 50, y: height / 2 - 140 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  // for loop
  for (var i = 0; i <= 8; i++) {

    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    // pushing stone into stone array
    stones.push(stone);

  }

  // creating sprites and adding animation
  zombie = createSprite(width / 2, height - 100, 50, 50);
  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft", zombie3, zombie4, zombie3);
  zombie.addImage("sad", sadzombie);
  zombie.scale = 0.1;
  zombie.velocityX = 10;

  // creating button
  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  // using mousePressed
  breakButton.mousePressed(handleButtonPress);

}

function draw() {
  // background
  background(backgroundImage);
  // updating engine
  Engine.update(engine);

  // showing bridge
  bridge.show();

  // for loop
  for (var stone of stones) {

    // showing the stones
    stone.show();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    // if satement
    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;

    }

  }

  // if statements for collision
  if (zombie.position.x >= width - 300 && !collided) {
    zombie.velocityX = -10;
    zombie.changeAnimation("righttoleft");

  }

  if (zombie.position.x <= 300 && !collided) {
    zombie.velocityX = 10;
    zombie.changeAnimation("lefttoright");

  }

  drawSprites();

}

// handleButtonPress function
function handleButtonPress() {

  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);

}
