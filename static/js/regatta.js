function Regatta() {

  let limit = 200

  this.x = random(limit, width - limit)
  this.y = random(limit, .5 * height)
  this.radius = 40
  this.ttime = 0
  this.time = 0
  this.index = 1
  this.trigger = false

  this.show = function() {

    push()
    textSize(54)
    textAlign(RIGHT)
    fill(color(64,75))
    text(this.index, 980, 976)
    pop()

    push()
    if (this.ttime % 120 <= 60) {
      stroke(138, 14, 14, 90)
    } else {
      stroke(138, 14, 14, 50)
    }
    fill(0, 0, 0, 0)
    ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius)
    pop()

  }

  this.update = function() {

    this.ttime ++
    this.time ++

    if (this.trigger == true) {

      this.x = x
      this.y = y
      this.index ++
      this.time = 0
      this.trigger = false

    }
  }
}

function checkRegatta(timeCutoff, nCutoff) {
  let boatsCopy = Object.create(boats)

  if (dest.time >= timeCutoff) {
    if (boats.complete.length < nCutoff) {

      boatsCopy.sort(function(a, b) {
        return a.midBowDist - b.midBowDist
      })

      winners = boats.complete
      winners = winners.concat(boatsCopy.slice(0, nCutoff-boatsCopy.complete.length))

    } else {
      winners = boats.complete.slice(0, nCutoff)

    }

    return [winners, 1]

  } else if (boats.complete.length >= nCutoff) {

    winners = boats.complete.slice(0, nCutoff)
    return [winners, 1]

  } else {

    return [boats.complete, 0]

  }

}
