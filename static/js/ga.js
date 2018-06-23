function gen() {

  this.boats = makeBoats(12)
  this.complete = []

  this.show = function(windVelocity, windAngle,
                       destX, destY, destRadius, destIndex) {

    function show_track(windVelocity, windAngle,
                        destX, destY, destRadius, destIndex,
                        boats, complete) {
      for (let i = 0; i < boats.length; i++) {
        boats[i].update(windVelocity, windAngle,
                        destX, destY, destRadius, destIndex)
        boats[i].show()
        if (boats[i].cumDests == destIndex) {
          complete.push(boats[i])
          complete = Array.from(new Set(complete))
        }
      }
      return complete
    }

    this.complete = show_track(windVelocity, windAngle,
                               destX, destY, destRadius, destIndex,
                               this.boats, this.complete)
  }

  this.update = function(destTime, destX, destY) {

    function checkRegatta(timeCutoff, nCutoff,
                          gen, destTime) {
      let genCopy = Object.create(gen)
      let winners
      if (destTime >= timeCutoff) {
        if (gen.complete.length < nCutoff) {
          genCopy.boats.sort(function(a,b) {
            return a.midBowDist - b.midBowDist
          })
          winners = gen.complete
          winners = winners.concat(genCopy.boats.slice(0, nCutoff-genCopy.complete.length))
        } else {
          winners = gen.complete.slice(0, nCutoff)
        }
        return [winners, 1]
      } else if (gen.complete.length >= nCutoff) {
        winners = gen.complete.slice(0, nCutoff)
        return [winners, 1]
      } else {
        return [gen.complete, 0]
      }
    }

    [this.complete, this.stop] = checkRegatta(600, 4, this, destTime)

    function killBoats(genComplete) {
      let boats = genComplete
      genComplete = []
      return [boats, genComplete]
    }

    function resetBoats(boats, destX, destY) {
      for (let i = 0; i < boats.length; i++) {
        if (i == 0) {
          if (boats[i].y < .1 * height ||
              boats[i].y > .9 * height ||
              boats[i].x < .1 * width ||
              boats[i].x > .9 * width) {
            boats[i].x = destX
            boats[i].y = destY
          }
        }

        if (i > 0) {
          boats[i] = Object.create(boats[0])

          //assign old brains
        }

        boats[i].cumDests = 0
      }
    }

    if (this.stop == 1) {
      [this.boats, this.complete] = killBoats(this.complete)
      resetBoats(this.boats, destX, destY)



      //reproduce (mutation/crossover) & introduce the new gen to boats array

            //create brains (TF ANNs) with randomized brains



    }
  }
}

function makeBoats(n) {
  let boats = new Array(n)
  for (let i = 0; i < n; i++) {
    boats[i] = new Boat()
    boats[i].id = regattaCounter + "." + String(i)
  }
  return boats
}
