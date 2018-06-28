function Regatta() {

  let limit = 200

  this.x = 500
  while (this.x > 400 && this.x < 600) {
    this.x = random(limit, width - limit)
  }
  this.y = random(limit, .5 * height)
  this.radius = 40
  this.time = 0
  this.index = 1
  this.trigger = false

  this.show = function() {
    push()
    fill(64,64,64,192)
    text("time:  ", 916, 61)
    textAlign(RIGHT)
    text(this.time, 976, 61)
    pop()

    push()
    textSize(54)
    textAlign(RIGHT)
    fill(color(64,75))
    text(regattaCounter, 980, 47)
    pop()

    push()
    if (this.time % 120 <= 60) {
      stroke(138, 14, 14, 90)
    } else {
      stroke(138, 14, 14, 50)
    }
    fill(0, 0, 0, 0)
    ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius)
    pop()
  }

  this.update = function(stop, boat0) {

    if (stop == 1) {
      let x = dest.x
      let y = dest.y
      let limit = 200

      while (dist(x, y, boat0.x, boat0.y) < dest.radius*6 || dist(x, y, dest.x, dest.y) < dest.radius*4) {
        x = random(limit, width - limit)
        y = random(limit, height - limit)
      }
      
      dest = new Regatta()
      dest.x = x;
      dest.y = y;
      regattaCounter ++

    } else if (stop == 2) {
      dest = new Regatta()
      regattaCounter = 1
    } else {
      this.time ++
    }
  }
}
