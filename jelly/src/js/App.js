import Mouse from "./Mouse";
import Ball from "./Ball";
import Balls from "./Balls";

const canvas = document.getElementById("jellyAnimation");
const ctx = canvas.getContext("2d");
const mousePos = new Mouse(canvas);
const mouseBall = new Ball(mousePos.x, mousePos.y, 30, "green");
const balls = new Balls();
const circleBalls = balls.getDotsByCircle(200, 200, 100, 10);

const render = () => {
  window.requestAnimationFrame(render);
  ctx.clearRect(0, 0, 600, 600);
  mouseBall.setPosition(mousePos.x, mousePos.y);
  mouseBall.draw(ctx);
  circleBalls.forEach(ball => {
    ball.think(mousePos);
    // ball.draw(ctx);
  });
  balls.connectFillCircleDots(ctx);
};

render();
