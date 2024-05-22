import { Sprite } from "./classes.js";
import { attacks } from "./data/attacks.js";

export const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  pos: {
    x: 0,
    y: 0,
  },
  img: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./img/draggleSprite.png";
const draggle = new Sprite({
  pos: {
    x: 800,
    y: 100,
  },
  img: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
  name: "Draggle",
});

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";
const emby = new Sprite({
  pos: {
    x: 280,
    y: 325,
  },
  img: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  name: "Emby",
});

const renderedSprites = [draggle, emby];
export function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

// animate();

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    console.log(selectedAttack);
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });
  });
});

document.querySelector("#dialogueBox").addEventListener("click", () => {
  console.log("ok");
});
