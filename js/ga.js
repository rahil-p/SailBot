function gen() {

  this.boats = makeBoats(16)
  this.complete = []
  this.logArr = []

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

    function show_log(logArr) {

      logArr.sort(function(a,b) {
        if (a[1]===b[1]) {
          return 0;
        } else {
          return (a[1] < b[1] ? -1 : 1)
        }
      })
      let logStartY = 80
      let inc = 16
      let boxHeight = logArr.length * inc + 8
      let boxWidth = 105
      let logX = 940

      push()
      noStroke()
      fill(64, 64, 64, 128)
      rect(logX-40, logStartY-12, boxWidth, boxHeight)
      pop()

      for (let i = 0; i < logArr.length; i++) {
        let y = logStartY + (i * inc)
        let col = logArr[i][2].levels.slice(0,3)

        push()
        stroke(255, 255, 255)
        col[3] = 255
        fill(col)
        ellipse(logX, y, 8, 8)
        textAlign(LEFT)
        noStroke()
        fill(col)
        textSize(10)
        text(logArr[i][0], logX+10, y+3.5)
        pop()

        push()
        textAlign(RIGHT)
        textSize(10)
        text(round(logArr[i][1]), logX-10, y+3.5)
        pop()
      }
    }

    this.complete = show_track(windVelocity, windAngle,
                               destX, destY, destRadius, destIndex,
                               this.boats, this.complete)
    show_log(this.logArr)
  }

  this.update = function(destTime, destX, destY) {

    function getLog(gener) {
      let logArr = []
      for (let i = 0; i < gener.boats.length; i++) {
        logArr.push([gener.boats[i].id, (gener.boats[i].input[0] * 1000), gener.boats[i].color])
      }
      return logArr
    }

    function checkRegatta(timeCutoff, nCutoff,
                          gener, destTime) {
      let generCopy = Object.create(gener)
      let winners
      if (destTime >= timeCutoff) {
        if (gener.complete.length < nCutoff) {
          generCopy.boats.sort(function(a,b) {
            return a.midBowDist - b.midBowDist
          })
          winners = gener.complete
          winners = winners.concat(generCopy.boats.slice(0, nCutoff-generCopy.complete.length))
          //
          if (regattaCounter <= 5) {
            let ok_winners = []
            for (let i = 0; i < winners.length; i++) {
              if (winners[i].input[1] < .1 || winners[i].input[1] > .9) {
                ok_winners.push(i)
              }
            }
            if (ok_winners.length == 0) {
              generCopy.complete = []
              generCopy.boats = makeBoats(16, gen_delta=-regattaCounter+1)
              return [generCopy.boats, 2];
            }
          }
          //
        } else {
          winners = gener.complete.slice(0, nCutoff)
        }
        return [winners, 1];

      } else if (gener.complete.length >= nCutoff) {
        winners = gener.complete.slice(0, nCutoff)
        return [winners, 1];

      } else {
        return [gener.complete, 0];
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
          boats[i].boatVelocity = max(.3, boats[0].boatVelocity);
          boats[i].cumDests = 0;
        }

        if (i > 0) {
          oldBrain = boats[i].brain.clone()
          oldID = boats[i].id
          oldCol = boats[i].color
          boats[i] = Object.create(boats[0])
          boats[i].boatVelocity = max(.3, boats[0].boatVelocity);
          boats[i].brain = oldBrain;
          boats[i].id = oldID;
          boats[i].color = oldCol
          boats[i].cumDests = 0;
        }
      }
    }

    function reproduce(boats, nCutoff) {
      let newBoats = new Array(pow(nCutoff, 2))
      let colRand = regattaCounter % 7

      function rep_crossover() {
        let bcolorOpts = [color(255,155,122,96),
                          color(185,239,254,96),
                          color(217,180,254,96),
                          color(220,236,195,96),
                          color(253,177,178,96),
                          color(254,208,171,96),
                          color(255,242,174,96)]
        let bcolor = bcolorOpts[colRand]
        let counter = 0
        for (let i = 0; i < boats.length; i++) {
          for (let j = 0; j < boats.length; j++) {
            newBoats[counter] = Object.create(boats[i])
            if (i != j) {
              newBoats[counter].brain.crossover(boats[j].brain)
            }
            newBoats[counter].generation = regattaCounter+1
            newBoats[counter].cumDests = 0
            newBoats[counter].id = (regattaCounter+1) + "." + String(counter)
            newBoats[counter].color = bcolor
            counter++
          }
        }
      }
      rep_crossover()

      function rep_mutate() {
        for (let i = 0; i < newBoats.length; i++) {
          newBoats[i].brain.mutate(max(.25,randomGaussian(.5, .25)))
        }
      }
      rep_mutate()

      nextGen = boats.concat(newBoats)
      return nextGen
    }

    this.logArr = getLog(this)
    this.nCutoff = 4;
    [this.complete, this.stop] = checkRegatta(500, this.nCutoff, this, destTime)
    if (this.stop == 1) {
      [this.boats, this.complete] = killBoats(this.complete)
      resetBoats(this.boats, destX, destY)
      this.boats = reproduce(this.boats, this.nCutoff)
    } else if (this.stop == 2) {
      [this.boats, this.complete] = killBoats(this.complete)
    }
  }
}

function makeBoats(n, gen_delta = 0) {
  let boats = new Array(n)
  for (let i = 0; i < n; i++) {
    boats[i] = new Boat()
    boats[i].generation = regattaCounter + gen_delta
    boats[i].id = (regattaCounter + gen_delta) + "." + String(i)
  }
  return boats
}
