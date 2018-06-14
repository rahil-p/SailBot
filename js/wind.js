function Wind() {

  this.windAngle = random(0, TWO_PI);                     //initial assignment to distribution uniform(0, 2pi)
  this.windVelocity = max(0, randomGaussian(5,.5));        //initial assignment to distribution Normal(4, 2)

  this.show = function() {

    text('Wind Velocity:  ' + placeRound(this.windVelocity), 100, 36);
    text('Wind Angle:  ' + round(degrees(this.windAngle)), 100, 52);

    push();
    stroke(128, 128, 128);
    fill(0, 0, 0, 0);
    ellipse(40, 40, 60, 60);             //draw a circle for the (true) wind vane
    pop();

    push();
    translate(40, 40);
    rotate(this.windAngle);
    stroke(0, 0, 0);
    line(0, 0, 0, -25);                  //draw the line of the wind vane
    triangle(0, -26, -1, -24, 1, -24);
    pop();

  }

  this.update = function() {

    let shiftDir = random([-1,1].concat(Array(28).fill(0)));  //prob .1 of shift and cond. prob. .5 of +/- direction
    let angleShiftCoef = .02;
    let velocityShiftCoef = .01;
    this.windAngle = angleMod(this.windAngle + shiftDir * angleShiftCoef);
    this.windVelocity = angleMod(this.windVelocity + shiftDir * velocityShiftCoef);

  }
}
