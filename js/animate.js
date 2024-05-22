import {
  bg,
  boundaries,
  battleZonesArr,
  player,
  foreground,
  keys,
  colliding,
  MOVEOFFSET,
  lastKey,
  movables,
} from "./index.js";

export function animate() {
  window.requestAnimationFrame(animate);
  bg.draw();
  boundaries.forEach((b) => b.draw());
  battleZonesArr.forEach((battleZoneArr) => {
    battleZoneArr.draw();
  });
  player.draw();
  foreground.draw();
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (const b of battleZonesArr) {
      const overlappingArea =
        (Math.min(player.position.x + player.width, b.position.x + b.width) -
          Math.max(player.position.x, b.position.x)) *
        (Math.min(player.position.y + player.height, b.position.y + b.height) -
          Math.max(player.position.y, b.position.y));
      if (
        colliding({
          obj1: player,
          obj2: { ...b, pos: { ...b.pos, y: b.pos.y + MOVEOFFSET } },
        }) &&
        overlappingArea > (player.width * player.height) / 2
      ) {
        break;
      }
    }
  }

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
