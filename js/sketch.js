let boat,
    wind,
    dest,
    font;

function preload() {
  font = loadFont('fonts/Muli-SemiBold.ttf');
}

function setup() {

  createCanvas(1000, 1000);
  frameRate(60);

  textFont(font);
  textSize(11);

  boat = new Boat();
  wind = new Wind();
  dest = new Destination();

}

function draw() {

  background(201, 211, 226);

  if (mouseIsPressed) {
    boat.rotateBoat();
  }

  // fix/update
  if (boat.cumDests == dest.index) {
    dest.trigger = true;
  }
  //

  boat.update(wind.windVelocity, wind.windAngle,
              dest.x, dest.y, dest.radius, dest.index);
  wind.update();
  dest.update(); //

  boat.show();
  wind.show();
  dest.show();

}

function placeRound(measure, nDigits = 2) {
  let rounded = round(measure * pow(10, nDigits)) / pow(10, nDigits);
  return rounded;
}

function angleMod(someAngle, makePos=1) {
  someAngle %= (TWO_PI);
  if (makePos==1) {
    while (someAngle < 0) {
      someAngle += TWO_PI;
    }
  }
  return someAngle;
}
