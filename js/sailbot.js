function Boat() {

  // position
  this.x = 1/2 * width;
  this.y = 3/4 * height;

  // hull size
  this.boatWidth = 12; // 1px ~= 1.5ft (8 ft)
  this.boatLength = 36; // 1px ~= 1.5ft (24 ft)

  // mainsail dimensions
  this.mainSheetLength = 12; //VAR
  this.mainAngle = 0;
  this.mainLength = (2/3 * this.boatLength) - 4; // (20 ft)
  const mainSheetLimit = this.mainLength * sqrt(2);

  // forces
  this.boatAngle = 0;
  this.boatVelocity = 0;

  // destination stats
  this.time = 0;
  this.timePenalty = 0;
  this.cumScore = 0;
  this.cumDests = 0;

  this.img = loadImage("images/boat.png");

  this.show = function() {

    //remove!!!
    text("time: "+this.time, 300, 300);
    text("penalty: "+this.timePenalty, 300, 320);
    text("cumScore: "+this.cumScore, 300, 340);
    text("cumDests: "+this.cumDests, 300, 360);

    let tintLvl = .5

    // draw the hull (rotated by its stern)
    push();
    translate(this.x, this.y);
    rotate(this.boatAngle);
    tint(255, tintLvl * 255)
    image(this.img, -(this.boatWidth / 2), -this.boatLength, this.boatWidth, this.boatLength);

    // draw the mainsail (rotated by its mast)
    push();
    stroke(128, tintLvl * 255);
    translate(0, 10-this.boatLength);
    rotate(this.mainAngle);
    line(0, 0, 0, this.mainLength);
    pop();
    pop();

  }

  this.update = function(windVelocity, windAngle,
                         destX, destY, destRadius, destIndex) {

    if (this.cumDests == destIndex) { // need a way to trigger the reset in destination.js
      return;
    }

    function getDestStatus(destX, destY, destRadius,
                           boatAngle, boatX, boatY, boatLength,
                           cumScore, cumDests,
                           time, timePenalty) {

      boatAngle = HALF_PI - boatAngle;

      let midSternDist = dist(destX, destY, boatX, boatY);
      let midBowDist = dist(destX, destY, boatX + boatLength * cos(boatAngle), boatY - boatLength * sin(boatAngle));

      if (midSternDist < destRadius && midBowDist < destRadius) {

        cumScore += time + 2 * timePenalty;
        cumDests ++;
        time = 0;
        timePenalty = 0;

        return [cumScore, cumDests, time, timePenalty];

      }

      if ((boatX < .05 * height || boatX > .95 * height || boatY < .05 * height || boatY > .95 * height)) {
        timePenalty ++;
      }

      time ++;

      return [cumScore, cumDests,
              time, timePenalty];

    }

    [this.cumScore, this.cumDests,
     this.time, this.timePenalty] = getDestStatus(destX, destY, destRadius,
                                                  this.boatAngle, this.x, this.y, this.boatLength,
                                                  this.cumScore, this.cumDests,
                                                  this.time, this.timePenalty);

    // moves the boat based on its angle and velocity (conversion limits the velocities for reasonable visibility)
    function moveBoat(boatX, boatY, boatVelocity, boatAngle, conversion=3) {

      boatX += boatVelocity * sin(boatAngle) * conversion;
      boatY -= boatVelocity * cos(boatAngle) * conversion;

      return [boatX, boatY];
    }

    [this.x, this.y] = moveBoat(this.x, this.y, this.boatVelocity, this.boatAngle);

    // determining the apparent wind's velocity and angle
    function getAppVector(boatVelocity, boatAngle, wVelocity, wAngle) {

      // using boatVelocity multiplier of 5 (implication of the ad hoc adjustment in the text object above)
      let appVelocity = sqrt(pow(5 * boatVelocity * sin(boatAngle + PI) +
                                 wVelocity * sin(wAngle), 2) +
                             pow(5 * boatVelocity * cos(boatAngle + PI) +
                                 wVelocity * cos(wAngle), 2));
      let appAngle = atan2(5 * boatVelocity * sin(boatAngle + PI) +
                           wVelocity * sin(wAngle),
                           5 *boatVelocity * cos(boatAngle + PI) +
                           wVelocity * cos(wAngle));
      appAngle = angleMod(appAngle);

      return [appVelocity, appAngle];
    }

    [this.appVelocity, this.appAngle] = getAppVector(this.boatVelocity, this.boatAngle, windVelocity, windAngle);

    this.mainSheetLength = (1000 - mouseY) * (mainSheetLimit / 1000);
    //rotating the mainsail on the boat
    function rotateMainsail(appAngle, appVelocity, boatAngle, mainAngle, mainLength, mainSheetLength) {

      //if x greater than 180, then it is 180-(x-180) = 360-x

      mainAngle = angleMod(boatAngle + mainAngle + PI, makePos=0); //gets the actual angle (vs. respective to boatAngle)
      let mainAttack = max(mainAngle, appAngle) - min(mainAngle, appAngle);
      let mainAttack2 = (mainAttack > PI) ? TWO_PI-mainAttack : mainAttack

      let mainArea = pow(mainLength, 2) / 2;

      const sealvlAirDens = .0765;

      function getWindPressure(appVelocity) {  //given .00256 assumption

        let windPressure = .00256 * pow(appVelocity, 2);

        return windPressure;
      }

      let windPressure = getWindPressure(appVelocity);

      function getFluidCoefs(mainAttack2) {

        //based on a degree 2 polynomial regression of estimated data from http://bit.ly/2Jh4mT0
        let dragCoef = max(.16,
                           -.45361 * pow(mainAttack2, 2) +
                           1.64225 * mainAttack2 - .27701);

        //based on a degree 3 polynomial regression of estimated data from http://bit.ly/2Jh4mT0
        let liftCoef = .5626 * pow(mainAttack2, 3) -
                       3.1881 * pow(mainAttack2, 2) +
                       4.4150 * mainAttack2 - .6614;

        return [dragCoef, liftCoef];
      }

      let [dragCoef, liftCoef] = getFluidCoefs(mainAttack2);

      function getAngularVelocity(mainLength, mainArea, windPressure, dragCoef, mainAttack,
                                  sealvlAirDens, appVelocity) {

        function getTorque(mainArea, windPressure, dragCoef, mainAttack) {

          let force = mainArea * windPressure * dragCoef * sin(mainAttack)
          let torque = force * mainLength

          return torque;
        }

        let torque = getTorque(mainArea, windPressure, dragCoef, mainAttack)

        function getWindPower(sealvlAirDens) {

          let windPower = .5 * mainArea * sealvlAirDens * pow(appVelocity, 3);

          return windPower;
        }

        let windPower = getWindPower(sealvlAirDens);

        let angularVelocity = torque / windPower;

        return angularVelocity;
      }

      let angularVelocity = getAngularVelocity(mainLength, mainArea, windPressure, dragCoef, mainAttack,
                                               sealvlAirDens, appVelocity)

      function proposeAngle(mainAngle, appAngle, angularVelocity) {

        if (mainAngle > appAngle) {
          mainAngle = angleMod(mainAngle - boatAngle - PI) //resets the angle relative to the boat
          mainAngle -= angularVelocity
        } else if (mainAngle < appAngle) {
          mainAngle = angleMod(mainAngle - boatAngle - PI) //resets the angle relative to the boat
          mainAngle += angularVelocity
        }

        return mainAngle;
      }

      mainAngle = proposeAngle(mainAngle, appAngle, angularVelocity)

      function limitMainsail(mainSheetLength, mainAngle) {

        let limit = (mainSheetLength / mainSheetLimit) * HALF_PI;
        let flag = true;

        if (mainAngle > limit && mainAngle < PI) {
          mainAngle = limit;
          flag = false;
        } else if (mainAngle > PI && mainAngle < TWO_PI - limit) {
          mainAngle = TWO_PI - limit;
          flag = false;
        }

        return [mainAngle, flag];
      }

      let flag;

      [mainAngle, flag] = limitMainsail(mainSheetLength, mainAngle);

      return [mainAngle, mainAttack2, flag,
              dragCoef, liftCoef,
              mainArea, sealvlAirDens,
              angularVelocity];
    }


    [this.mainAngle, this.mainAttack2, this.flag,
     this.dragCoef, this.liftCoef,
     this.mainArea, this.sealvlAirDens,
     this.angularVelocity] = rotateMainsail(this.appAngle, this.appVelocity,
                                            this.boatAngle,
                                            this.mainAngle, this.mainLength,
                                            this.mainSheetLength)

    function getForces(flag, appAngle, boatAngle,
                       dragCoef, liftCoef,
                       mainArea, sealvlAirDens,
                       appVelocity) {

      let dragForce, liftForce, forwardForce, lateralForce;

      appAngle = angleMod(appAngle + PI, makePos=0);
      let boatAttack = max(appAngle, boatAngle) - min(appAngle, boatAngle);

      if (boatAttack > PI) {
        boatAttack = TWO_PI - boatAttack;
      }

      boatAttack = angleMod(boatAttack);

      if (flag != false) {

        dragForce = 0;
        liftForce = 0;
        forwardForce = 0;
        lateralForce = 0;

      } else {

        dragForce = .5 * mainArea * dragCoef * sealvlAirDens * pow(appVelocity, 2);
        liftForce = .5 * mainArea * liftCoef * sealvlAirDens * pow(appVelocity, 2);

        forwardForce = liftForce * sin(boatAttack) - dragForce * cos(boatAttack);
        lateralForce = liftForce * cos(boatAttack) - dragForce * sin(boatAttack);

      }

      return [dragForce, liftForce,
              forwardForce, lateralForce,
              boatAttack];
    }

    [this.dragForce, this.liftForce,
     this.forwardForce, this.lateralForce,
     this.boatAttack] = getForces(this.flag, this.appAngle, this.boatAngle,
                                  this.dragCoef, this.liftCoef,
                                  this.mainArea, this.sealvlAirDens,
                                  this.appVelocity);

    this.boatAccel = this.forwardForce / 2000; //assumed mass given J24 (similar dimensions)
    this.boatVelocity += this.boatAccel / 60; // 60 pixels per sec (calibrates time)

    this.resistanceForce = 300 * this.boatVelocity; // a makeshift attempt at correcting for resistance
    this.resistanceAccel = this.resistanceForce / 2000;
    this.boatVelocity -= this.resistanceAccel / 60;

    this.boatVelocity = max(-.03, this.boatVelocity); // ad hoc adjustment
  }

  this.rotateBoat = function() {

    if (mouseX < width / 2) {
      this.boatAngle = angleMod(this.boatAngle -= PI/45 * this.boatVelocity);
    } else if (mouseX > width / 2) {
      this.boatAngle = angleMod(this.boatAngle += PI/45 * this.boatVelocity);
    }
  }
}



//complete dashboard of metrics
