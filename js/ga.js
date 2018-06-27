function gen() {

  this.boats = makeBoats(16)
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
          //
          if (regattaCounter <= 3) {
            let ok_winners = []
            for (let i = 0; i < winners.length; i++) {
              if (winners[i].input[1] < .1 || winners[i].input[1] > .9) {
                ok_winners.push(i)
              }
            }
            if (ok_winners.length == 0) {
              genCopy.complete = []
              genCopy.boats = makeBoats(12)
              return [genCopy.boats, 2];
            }
          }
          //
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
          boats[i].boatVelocity = max(.3, boats[0].boatVelocity)
        }

        if (i > 0) {
          oldBrain = boats[i].brain.clone()
          oldID = boats[i].id
          boats[i] = Object.create(boats[0])
          boats[i].boatVelocity = max(.3, boats[0].boatVelocity)
          boats[i].brain = oldBrain
          boats[i].id = oldID
        }

        boats[i].cumDests = 0
      }
    }

    function reproduce(boats, nCutoff) {
      let newBoats = new Array((nCutoff * (nCutoff + 1))/2)

      function rep_crossover() {
        let bcolor = color(random(128,255), random(128,255), random(128,255), 64)
        let counter = 0
        let brain1, brain2
        for (let i = 0; i < boats.length; i++) {
          for (let j = 0; j < boats.length; j++) {
            newBoats[counter] = Object.create(boats[i])
            if (i != j) {
              newBoats[counter].brain.crossover(boats[j].brain)
            }
            newBoats[counter].id = (regattaCounter+1) + "." + String(counter)
            newBoats[counter].color = bcolor
            counter++
          }
        }
      }
      function rep_crossover2() {
        for (let i = 0; i < boats.length; i++) {
          newBoats[i] = Object.create(boats[i])
          newBoats[i].id = (regattaCounter+1) + "." + String(i)
        }
      }
      rep_crossover()

      function rep_mutate() {
        for (let i = 0; i < newBoats.length; i++) {
          newBoats[i].brain.mutate(max(0,randomGaussian(.5, .1)))
        }
      }
      rep_mutate()

      nextGen = boats.concat(newBoats)
      return nextGen
    }

    this.nCutoff = 4;
    [this.complete, this.stop] = checkRegatta(300, this.nCutoff, this, destTime)
    if (this.stop == 1) {
      [this.boats, this.complete] = killBoats(this.complete)
      resetBoats(this.boats, destX, destY)
      this.boats = reproduce(this.boats, this.nCutoff)
    } else if (this.stop == 2) {
      [this.boats, this.complete] = killBoats(this.complete)
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
