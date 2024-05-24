import { attacks } from "./data/attacks.js";
import { monsters } from "./data/monsters.js";
import { Monster } from "./classes.js";
import { animate, battle, battleBackground } from "./index.js";

let draggle;
let emby;
let renderedSprites = [];
let battleAnimationId;
let queue;

export function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  draggle = new Monster({ ...monsters.Draggle, pos: { x: 800, y: 100 } });
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      //  console.log(selectedAttack);

      // attack
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });
      console.log(draggle.health);

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";

              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
            },
          });
        });
      }

      const randoAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack({
          attack: randoAttack,
          recipient: emby,
          renderedSprites,
        });
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userInterface").style.display = "none";

                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
              },
            });
          });
        }
      });
    });
    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
    });
  });
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);

  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
    // instantly executed function
    (function () {
      // disable buttons
      document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
      // re enable buttons after a second
      setTimeout(
        () =>
          document
            .querySelectorAll("button")
            .forEach((button) => (button.disabled = false)),
        1000
      );
    })();
  } else e.currentTarget.style.display = "none";
});
