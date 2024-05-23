import { attacks } from "./attacks.js";

export const monsters = {
  Emby: {
    pos: {
      x: 280,
      y: 325,
    },
    img: {
      src: "./img/embySprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
  },

  Draggle: {
    pos: {
      x: 800,
      y: 100,
    },
    img: {
      src: "./img/draggleSprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};
