import { Sprite } from "./classes.js";
import { animateBattle } from "./battleScene.js";
import { initBattle } from "./battleScene.js";
import { audio } from "./audio.js";
import {
  colliding,
  getBattleZones,
  getBoundaries,
  getCharacters,
  getOverlappingArea,
} from "./utils.js";
import {
  backgroundImage,
  battleBackgroundImage,
  foregroundImage,
  playerImages,
} from "./data/images.js";

// setup canvas
const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// create constants
const CENTER = { x: canvas.width / 2, y: canvas.height / 2 };
export const OFFSET = {
  x: -735,
  y: -620,
};
const SPAWNRATE = 0.025;
const MOVEOFFSET = 3;

// create arrays of movable objects
const battleZones = getBattleZones();
const boundaries = getBoundaries();
const characters = getCharacters();

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
    x: OFFSET.x,
    y: OFFSET.y,
  },
  img: backgroundImage,
});
const foreground = new Sprite({
  pos: {
    x: OFFSET.x,
    y: OFFSET.y,
  },
  img: foregroundImage,
});
const player = new Sprite({
  pos: {
    x: CENTER.x - playerImages.down.width / 8,
    y: CENTER.y - playerImages.down.height / 2,
  },
  img: playerImages.down,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: { ...playerImages },
});
export const battleBackground = new Sprite({
  pos: {
    x: 0,
    y: 0,
  },
  img: battleBackgroundImage,
});

// array of movables objects
const movables = [bg, ...boundaries, foreground, ...battleZones, ...characters];
const renderables = [
  bg,
  ...boundaries,
  ...battleZones,
  ...characters,
  player,
  foreground,
];

export const battle = {
  initiated: false,
};

export function animate() {
  const animationId = window.requestAnimationFrame(animate);

  renderables.forEach((r) => {
    r.draw();
  });

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    //attiva battaglia
    for (const b of battleZones) {
      const overlappingArea = getOverlappingArea({
        player,
        battleZone: b,
      });

      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, y: b.pos.y + MOVEOFFSET } },
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < SPAWNRATE
      ) {
        //disattivazione animazione
        window.cancelAnimationFrame(animationId);

        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();

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
                initBattle();
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

animate();

// check for key press and set movement on keydown (animate)
let lastKey = "";
window.addEventListener("keydown", (e) => {
  const mapArrow = {
    ArrowUp: "w",
    ArrowDown: "s",
    ArrowLeft: "a",
    ArrowRight: "d",
  };
  const key = e.key.startsWith("Arrow") ? mapArrow[e.key] : e.key;

  if (key in keys) {
    keys[key].pressed = true;
    lastKey = key;
  }
});

// reset on key up
window.addEventListener("keyup", (e) => {
  const mapArrow = {
    ArrowUp: "w",
    ArrowDown: "s",
    ArrowLeft: "a",
    ArrowRight: "d",
  };
  const key = e.key.startsWith("Arrow") ? mapArrow[e.key] : e.key;

  if (key in keys) keys[key].pressed = false;
});

let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
