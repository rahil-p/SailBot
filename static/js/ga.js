function gen() {

  this.boats = makeBoats(12)

  this.show = function(windVelocity, windAngle,
                       destX, destY, destRadius, destIndex) {

    function show_track(windVelocity, windAngle,
                        destX, destY, destRadius, destIndex) {
      for (let i = 0; i < this.boats.length; i++) {
        this.boats[i].update(windVelocity, windAngle,
                             destX, destY, destRadius, destIndex)
        this.boats[i].show()
        if (this.boats[i].cumDests == dest.index) {
          this.complete.push(this.boats[i])
          this.complete = Array.from(new Set(this.complete))
        }
      }
    }

    show_track(windVelocity, windAngle,
               destX, destY, destRadius, destIndex)


  }

  //update list of boats
  //show list of boats
  //kill boats
  //reproduce boats



}

function makeBoats(n) {
  let boats = new Array(n)
  for (let i = 0; i < n; i++) {
    boats[i] = new Boat()
    boats[i].id = regattaCounter + "." + String(i)
  }
  return boats
}

function killBoats() {
  boats = boats.complete
  boats.complete = []
}



// data[i] = [boats[i].x, boats[i].y,
//            boats[i].mainSheetLength, boats[i].mainAttack2, //boats.mainAngle
//            boats[i].boatAttack, boats[i].boatAngle,
//            boats[i].boatVelocity, boats[i].boatAccel,
//            dest.x, dest.y]
