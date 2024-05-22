import { Boundary, Sprite } from "./classes.js";
import { collisions } from "./data/collisions.js";
import { atttacks } from "./data/attacks.js";
import { battleBackgroundImage } from "./battleScene.js";
import { battleZones } from "./data/battleZone.js";

console.log(gsap);

// setup canvas
const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

const battleZonesMap = [];
for (let i = 0; i < battleZones.length; i += 70) {
  battleZonesMap.push(battleZones.slice(i, 70 + i));
}
console.log(battleZonesMap);

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const center = { x: canvas.width / 2, y: canvas.height / 2 };

const offset = {
  x: -735,
  y: -615,
};

const MOVEOFFSET = 3;

// get collisions
const collisionsArr = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsArr.push(collisions.slice(i, 70 + i));
}

// create boundaries
const boundaries = [];
collisionsArr.forEach((row, i) => {
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

const battleZonesArr = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((val, j) => {
    if (val === 1025) {
      battleZonesArr.push(
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

// create images for sprites
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

// key object for event listener
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

// create sprites
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
    hold: 10,
  },
  sprites: { ...playerImages },
});

// check if obj1 is colliding with obj2
const colliding = ({ obj1, obj2 }) => {
  return (
    obj1.pos.x + obj1.width >= obj2.pos.x &&
    obj1.pos.x <= obj2.pos.x + obj2.width &&
    obj1.pos.y <= obj2.pos.y + obj2.height &&
    obj1.pos.y + obj1.height >= obj2.pos.y
  );
};

// array of movables objects
const movables = [bg, ...boundaries, foreground, ...battleZonesArr];

const battle = {
  initiated: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  bg.draw();
  boundaries.forEach((b) => b.draw());
  battleZonesArr.forEach((battleZoneArr) => {
    battleZoneArr.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  //attiva battaglia
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (const b of battleZonesArr) {
      const overlappingArea =
        (Math.min(player.pos.x + player.width, b.pos.x + b.width) -
          Math.max(player.pos.x, b.pos.x)) *
        (Math.min(player.pos.y + player.height, b.pos.y + b.height) -
          Math.max(player.pos.y, b.pos.y));
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, y: b.pos.y + MOVEOFFSET } },
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("ciao");

        //disattivazione animazione
        window.cancelAnimationFrame(animate);

        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                //attivazione nuova animazione
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
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
    player.animate = true;
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
    player.animate = true;
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
    player.animate = true;
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
//animate();

// check for key press and set movement on keydown (animate)
let lastKey = "";
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key in keys) {
    keys[key].pressed = true;
    lastKey = key;
  }
});

// reset on key up
window.addEventListener("keyup", (e) => {
  const key = e.key;

  if (key in keys) keys[key].pressed = false;
});
//export { c };
