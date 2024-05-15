import { Sprite } from "./classes.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const center = { x: canvas.width / 2, y: canvas.height / 2 };

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};
const img = new Image();
img.src = "./img/Pellet Town.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

const bg = new Sprite({
  pos: {
    x: -735,
    y: -595,
  },
  img: img,
});

function animate() {
  window.requestAnimationFrame(animate);

  bg.draw();
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    center.x - playerImage.width / 8,
    center.y - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  if (keys.w.pressed && lastKey === "w") bg.pos.y += 3;
  if (keys.a.pressed && lastKey === "a") bg.pos.x += 3;
  if (keys.s.pressed && lastKey === "s") bg.pos.y -= 3;
  if (keys.d.pressed && lastKey === "d") bg.pos.x -= 3;
}
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key in keys) {
    keys[key].pressed = true;
    lastKey = key;
    console.log(key);
  }
});

export { c };
