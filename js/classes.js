import { c } from "./index.js";
import {} from "./battleScene.js";
import { audio } from "./data/audio.js";

export class Sprite {
  constructor({
    pos,
    img,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    scale = 1,
    rotation = 0,
  }) {
    this.pos = pos;
    this.img = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.img.onload = () => {
      this.width = (this.img.width / this.frames.max) * scale;
      this.height = this.img.height * scale;
    };
    this.img.src = img.src;

    this.animate = animate;
    this.sprites = sprites;
    this.scale = scale;
    this.rotation = rotation;
    this.opacity = 1;
  }
  draw() {
    c.save();
    c.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.pos.x - this.width / 2, -this.pos.y - this.height / 2);
    c.globalAlpha = this.opacity;

    const crop = {
      pos: {
        x: this.frames.val * (this.width / this.scale),
        y: 0,
      },
      width: this.img.width / this.frames.max,
      height: this.img.height,
    };

    const image = {
      pos: {
        x: this.pos.x,
        y: this.pos.y,
      },
      width: this.img.width / this.frames.max,
      height: this.img.height,
    };

    c.drawImage(
      this.img,
      crop.pos.x,
      crop.pos.y,
      crop.width,
      crop.height,
      image.pos.x,
      image.pos.y,
      image.width * this.scale,
      image.height * this.scale
    );

    c.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) this.frames.elapsed++;

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}
export class Player extends Sprite {
  constructor({
    pos,
    img,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    scale = 1,
    rotation = 0,
    interactionAsset = null,
    isInteracting = false,
  }) {
    super({
      pos,
      img,
      frames,
      sprites,
      animate,
      scale,
      rotation,
    });
    this.interactionAsset = interactionAsset;
    this.isInteracting = isInteracting;
  }
}

export class Monster extends Sprite {
  constructor({
    pos,
    img,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({
      pos,
      img,
      frames,
      sprites,
      animate,
    });

    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " " + "fainted!!";
    gsap.to(this.pos, {
      y: this.pos.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });

    audio.battle.stop();
    audio.victory.play();
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " " + "used" + " " + attack.name;
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";

    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Fireball":
        audio.initFireball.play();
        const fireballImage = new Image();
        fireballImage.src = "./img/fireball.png";
        const fireball = new Sprite({
          pos: {
            x: this.pos.x,
            y: this.pos.y,
          },
          img: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.pos, {
          x: recipient.pos.x,
          y: recipient.pos.y,
          onComplete: () => {
            audio.fireballHit.play();
            gsap.to(healthBar, {
              width: recipient.health >= 0 ? recipient.health + "%" : 0 + "%",
            });

            gsap.to(recipient.pos, {
              x: recipient.pos.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            }),
              renderedSprites.splice(1, 1);
          },
        });

        break;
      case "Tackle":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.pos, {
          x: this.pos.x - movementDistance,
        })
          .to(this.pos, {
            x: this.pos.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });

              gsap.to(recipient.pos, {
                x: recipient.pos.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.pos, {
            x: this.pos.x,
          });
        break;
    }
  }
}

export class Boundary {
  static width = 48;
  static height = 48;
  constructor({ pos }) {
    this.pos = pos;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}

export class Character extends Sprite {
  constructor({
    pos,
    velocity,
    img,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    dialogues = [""],
  }) {
    super({
      pos,
      velocity,
      img,
      frames,
      sprites,
      animate,
      rotation,
      scale,
    });

    this.dialogues = dialogues;
    this.dialogueIndex = 0;
  }
}
