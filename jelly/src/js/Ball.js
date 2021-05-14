export default class Ball {
  constructor(x = 0, y = 0, radius = 2, color = "#ff6600") {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.color = color;
    this.mouseRadius = 30;
    this.friction = 0.7;
    this.springFactor = -0.01;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  think(mousePos) {
    // distance between dot and mouse
    let dx = this.x - mousePos.x;
    let dy = this.y - mousePos.y;

    let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    // friction
    if (dist < this.mouseRadius) {
      let angle = Math.atan2(dy, dx);

      // distance between dot and dot on circle with mouse center and radius 30
      let tx = mousePos.x + Math.cos(angle) * this.mouseRadius;
      let ty = mousePos.y + Math.sin(angle) * this.mouseRadius;

      this.vx += tx - this.x;
      this.vy += ty - this.y;
    }

    // spring back
    // distance between original position dot and current position
    const dx1 = this.x - this.originalX;
    const dy1 = this.y - this.originalY;

    this.vx += dx1 * this.springFactor;
    this.vy += dy1 * this.springFactor;

    // friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // actual move
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
