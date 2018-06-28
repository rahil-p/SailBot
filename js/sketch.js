let ga,
    boats,
    wind,
    dest,
    font,
    regattaCounter

function preload() {
  font = loadFont('fonts/Muli-SemiBold.ttf')
}

function setup() {
  createCanvas(1000, 1000)
  frameRate(60)

  textFont(font)
  textSize(11)

  regattaCounter = 1
  gen = new gen()
  wind = new Wind()
  dest = new Regatta()
}

function draw() {
  background(201, 211, 226)

  let data = []

  dest.update(gen.stop, gen.boats[0])
  gen.show(wind.windVelocity, wind.windAngle,
           dest.x, dest.y, dest.radius, dest.index)
  wind.update()
  wind.show()
  dest.show()
  gen.update(dest.time, dest.x, dest.y)
}

function placeRound(measure, nDigits = 2) {
  let rounded = round(measure * pow(10, nDigits)) / pow(10, nDigits)
  return rounded
}

function angleMod(someAngle, makePos=1) {
  someAngle %= (TWO_PI)
  if (makePos==1) {
    while (someAngle < 0) {
      someAngle += TWO_PI
    }
  }
  return someAngle
}
