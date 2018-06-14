function Destination() {

  let limit = 200;

  this.x = random(limit, width - limit);
  this.y = random(limit, .5 * height);
  this.radius = 40;
  this.time = 0;
  this.index = 1
  this.trigger = false;

  this.show = function() {

    push();
    textSize(54);
    textAlign(RIGHT);
    fill(color(64,75));
    text(this.index, 980, 976);
    pop();

    push();
    if (this.time % 120 <= 60) {
      stroke(138, 14, 14, 90);
    } else {
      stroke(138, 14, 14, 50);
    }
    fill(0, 0, 0, 0);
    ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
    pop();

  }

  this.update = function() {

    this.time ++;

    if (this.trigger == true) {

      let x = this.x;
      let y = this.y;

      while (dist(this.x, this.y, x, y) < this.radius*4) {

        x = random(limit, width - limit);
        y = random(limit, height - limit);

      }

      this.x = x;
      this.y = y;
      this.index ++;
      this.trigger = false;

    }
  }
}
