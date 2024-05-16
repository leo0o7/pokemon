import { c } from "./index.js";

export class Sprite {
  constructor({ pos, vel, img, frames = { max: 1 }, sprites }) {
    this.pos = pos;
    this.img = img;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.img.onload = () => {
      this.width = this.img.width / this.frames.max;
      this.height = this.img.height;
    };

    this.moving = false;
    this.sprites = sprites;
  }
  draw() {
    c.drawImage(
      this.img,
      this.frames.val * this.width,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.pos.x,
      this.pos.y,
      this.img.width / this.frames.max,
      this.img.height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) this.frames.elapsed++;

    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
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
    c.fillStyle = "rgba(255, 0, 0, 0.3)";
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}
