import Ball from "./Ball";

export default class Balls {
  constructor() {
    this.balls = [];
  }

  setBalls(balls) {
    this.balls = balls;
  }

  getBalls() {
    return this.balls;
  }
  getRandomDots(amount) {
    const balls = [];
    for (let i = 0; i < amount; i++) {
      balls.push(new Ball(Math.random() * 600, Math.random() * 600));
    }

    this.setBalls(balls);

    return balls;
  }

  getDotsByCircle(x, y, radius, amount) {
    const balls = [];
    for (let i = 0; i < amount; i++) {
      balls.push(
        new Ball(
          x + radius * Math.cos((i * 2 * Math.PI) / amount),
          y + radius * Math.sin((i * 2 * Math.PI) / amount)
        )
      );
    }

    this.setBalls(balls);

    return balls;
  }

  connectCircleDots(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.balls[0].x, this.balls[0].y);
    this.balls.forEach(ball => ctx.lineTo(ball.x, ball.y));
    ctx.closePath();
    ctx.stroke();
  }

  connectFillCircleDots(ctx) {
    const amount = this.balls.length;
    ctx.beginPath();
    for (let i = 0; i <= amount; ++i) {
      const p0 = this.balls[i >= amount ? i - amount : i];
      const p1 = this.balls[i + 1 >= amount ? i + 1 - amount : i + 1];
      ctx.quadraticCurveTo(
        p0.x,
        p0.y,
        (p0.x + p1.x) * 0.5,
        (p0.y + p1.y) * 0.5
      );
    }
    ctx.closePath();
    ctx.fill();
  }
}
