function Regatta() {

  let limit = 200

  this.x = random(limit, width - limit)
  this.y = random(limit, .5 * height)
  this.radius = 40
  this.time = 0
  this.index = 1
  this.trigger = false

  this.show = function() {

    text("time: "+this.time, 200, 500)

    push()
    textSize(54)
    textAlign(RIGHT)
    fill(color(64,75))
    text(this.index, 980, 976)
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

  this.update = function(stop) {
    if (stop == 1) {

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

    } else {
      this.time ++
    }
  }


}
