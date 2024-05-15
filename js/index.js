import { Boundary, Sprite } from "./classes.js";
import { collisions } from "./data/collisions.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const center = { x: canvas.width / 2, y: canvas.height / 2 };

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const boundaries = [];
const offset = {
  x: -735,
  y: -595,
};
collisionsMap.forEach((row, i) => {
  row.forEach((val, j) => {
    if (val === 1025) {
      boundaries.push(
        new Boundary({
          pos: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

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

const player = new Sprite({
  pos: {
    x: center.x - playerImage.width / 8,
    y: center.y - playerImage.height / 2,
  },
  img: playerImage,
  frames: {
    max: 4,
  },
});

function animate() {
  window.requestAnimationFrame(animate);

  bg.draw();
  player.draw();

  // draw boundaries (TESTING)
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  if (keys.w.pressed && lastKey === "w") {
    bg.pos.y += 12;
    boundaries.forEach((boundary) => {
      boundary.pos.y += 12;
    });
    keys.w.pressed = false;
  }
  if (keys.a.pressed && lastKey === "a") {
    bg.pos.x += 12;
    boundaries.forEach((boundary) => {
      boundary.pos.x += 12;
    });
    keys.a.pressed = false;
  }
  if (keys.s.pressed && lastKey === "s") {
    bg.pos.y -= 12;
    boundaries.forEach((boundary) => {
      boundary.pos.y -= 12;
    });

    keys.s.pressed = false;
  }
  if (keys.d.pressed && lastKey === "d") {
    bg.pos.x -= 12;
    boundaries.forEach((boundary) => {
      boundary.pos.x -= 12;
    });

    keys.d.pressed = false;
  }
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
