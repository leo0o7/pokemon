import { charactersMapData } from "./characters.js";
import { Boundary, Character } from "./classes.js";
import { battleZones } from "./data/battleZone.js";
import { collisions } from "./data/collisions.js";
import { OFFSET } from "./index.js";

// check if obj1 is colliding with obj2
export const colliding = ({ obj1, obj2 }) => {
  return (
    obj1.pos.x + obj1.width >= obj2.pos.x &&
    obj1.pos.x <= obj2.pos.x + obj2.width &&
    obj1.pos.y <= obj2.pos.y + obj2.height &&
    obj1.pos.y + obj1.height >= obj2.pos.y
  );
};

// get Overlapping area for spawn rate
export const getOverlappingArea = ({ player, battleZone }) => {
  return (
    (Math.min(
      player.pos.x + player.width,
      battleZone.pos.x + battleZone.width
    ) -
      Math.max(player.pos.x, battleZone.pos.x)) *
    (Math.min(
      player.pos.y + player.height,
      battleZone.pos.y + battleZone.height
    ) -
      Math.max(player.pos.y, battleZone.pos.y))
  );
};

export const getBoundaries = () => {
  // get collisions
  const collisionsArr = [];
  for (let i = 0; i < collisions.length; i += 70) {
    collisionsArr.push(collisions.slice(i, 70 + i));
  }

  const boundaries = [];
  collisionsArr.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 1025) {
        boundaries.push(
          new Boundary({
            pos: {
              x: j * Boundary.width + OFFSET.x,
              y: i * Boundary.height + OFFSET.y,
            },
          })
        );
      }
    });
  });

  return boundaries;
};

export const getBattleZones = () => {
  const battleZonesMap = [];
  for (let i = 0; i < battleZones.length; i += 70) {
    battleZonesMap.push(battleZones.slice(i, 70 + i));
  }
  const battleZonesArr = [];
  battleZonesMap.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 1025) {
        battleZonesArr.push(
          new Boundary({
            pos: {
              x: j * Boundary.width + OFFSET.x,
              y: i * Boundary.height + OFFSET.y,
            },
          })
        );
      }
    });
  });

  return battleZonesArr;
};

export const getCharacters = () => {
  // images
  const villagerImg = new Image();
  villagerImg.src = "./img/villager/Idle.png";
  const oldManImg = new Image();
  oldManImg.src = "./img/oldMan/Idle.png";

  const charactersArr = [];
  for (let i = 0; i < charactersMapData.length; i += 70) {
    charactersArr.push(charactersMapData.slice(i, 70 + i));
  }
  const characters = [];
  charactersArr.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 1026)
        characters.push(
          new Character({
            pos: {
              x: j * Boundary.width + OFFSET.x,
              y: i * Boundary.height + OFFSET.y,
            },
            img: villagerImg,
            frames: {
              max: 4,
              hold: 60,
            },
            scale: 3,
            animate: true,
            dialogue: ["...", "Hey mister, have you seen my Doggochu?"],
          })
        );
      else if (val === 1031)
        characters.push(
          new Character({
            pos: {
              x: j * Boundary.width + OFFSET.x,
              y: i * Boundary.height + OFFSET.y,
            },
            img: oldManImg,
            frames: {
              max: 4,
              hold: 60,
            },
            scale: 3,
            dialogue: ["...", "My bones hurt."],
          })
        );
    });
  });
  return characters;
};
