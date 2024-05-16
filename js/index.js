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
  y: -615,
};

const MOVEOFFSET = 3;

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

const backgroundImage = new Image();
backgroundImage.src = "./img/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const playerImages = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};
playerImages.up.src = "./img/playerUp.png";
playerImages.down.src = "./img/playerDown.png";
playerImages.left.src = "./img/playerLeft.png";
playerImages.right.src = "./img/playerRight.png";

const bg = new Sprite({
  pos: {
    x: offset.x,
    y: offset.y,
  },
  img: backgroundImage,
});

const foreground = new Sprite({
  pos: {
    x: offset.x,
    y: offset.y,
  },
  img: foregroundImage,
});

const player = new Sprite({
  pos: {
    x: center.x - playerImages.down.width / 8,
    y: center.y - playerImages.down.height / 2,
  },
  img: playerImages.down,
  frames: {
    max: 4,
  },
  sprites: { ...playerImages },
});

const colliding = ({ obj1, obj2 }) => {
  return (
    obj1.pos.x + obj1.width >= obj2.pos.x &&
    obj1.pos.x <= obj2.pos.x + obj2.width &&
    obj1.pos.y <= obj2.pos.y + obj2.height &&
    obj1.pos.y + obj1.height >= obj2.pos.y
  );
};

const movables = [bg, ...boundaries, foreground];

function animate() {
  window.requestAnimationFrame(animate);

  bg.draw();
  boundaries.forEach((b) => b.draw());
  player.draw();
  foreground.draw();

  let moving = true;
  player.moving = false;

  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.img = player.sprites.up;
    for (const b of boundaries) {
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, y: b.pos.y + MOVEOFFSET } },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((obj) => {
        obj.pos.y += MOVEOFFSET;
      });
  }
  if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.img = player.sprites.left;
    for (const b of boundaries) {
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, x: b.pos.x + MOVEOFFSET } },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((obj) => {
        obj.pos.x += MOVEOFFSET;
      });
  }
  if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.img = player.sprites.down;
    for (const b of boundaries) {
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, y: b.pos.y - MOVEOFFSET } },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((obj) => {
        obj.pos.y -= MOVEOFFSET;
      });
  }
  if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.img = player.sprites.right;
    for (const b of boundaries) {
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, x: b.pos.x - MOVEOFFSET } },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((obj) => {
        obj.pos.x -= MOVEOFFSET;
      });
  }
}
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key in keys) {
    keys[key].pressed = true;
    lastKey = key;
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key;

  if (key in keys) keys[key].pressed = false;
});
export { c };
