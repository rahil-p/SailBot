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

  boats = makeBoats(12)
  //ga.boats = new ga()
  boats.complete = []
  wind = new Wind()
  dest = new Regatta()


}

function draw() {

  background(201, 211, 226)

  if (mouseIsPressed) {
    boats[2].rotateBoat()
  }


  let data = []

  for (let i = 0; i < boats.length; i++) {
    boats[i].update(wind.windVelocity, wind.windAngle,
                    dest.x, dest.y, dest.radius, dest.index)
    boats[i].show()
    if (boats[i].cumDests == dest.index) {
      boats.complete.push(boats[i])
      boats.complete = Array.from(new Set(boats.complete))
    }
    // data[i] = [boats[i].x, boats[i].y,
    //            boats[i].mainSheetLength, boats[i].mainAttack2, //boats.mainAngle
    //            boats[i].boatAttack, boats[i].boatAngle,
    //            boats[i].boatVelocity, boats[i].boatAccel,
    //            dest.x, dest.y]
  }

  wind.update()
  wind.show()

  dest.update()
  dest.show();

  [boats.complete, boats.stop] = checkRegatta(600, 4)
  console.log(boats)

  if (boats.stop == 1) {
    killBoats()


    for (let i = 0; i < boats.length; i++) {
      if (i == 0) {
        if (boats[i].y < .1 * height ||
            boats[i].y > .9 * height ||
            boats[i].x < .1 * width ||
            boats[i].x > .9 * width) {
          boats[i].x = dest.x
          boats[i].y = dest.y
        }
      }

      if (i > 0) {
        boats[i] = Object.create(boats[0])

        //assign old brains
      }

      boats[i].cumDests = 0
    }




    //reproduce (mutation/crossover) & introduce the new gen to boats array


          //create brains (TF ANNs) with randomized brains




    let x = dest.x
    let y = dest.y
    let limit = 200

    while (dist(dest.x, dest.y, x, y) < dest.radius*4) {

      x = random(limit, width - limit)
      y = random(limit, height - limit)

    }

    dest = new Regatta()
    dest.x = x;
    dest.y = y;

    regattaCounter ++
  }

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
