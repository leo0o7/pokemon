import { c } from "./index.js";

export class Sprite {
  constructor({ pos, vel, img, frames = { max: 1 } }) {
    this.pos = pos;
    this.img = img;
    this.frames = frames;

    this.img.onload = () => {
      this.width = this.img.width / this.frames.max;
      this.height = this.img.height;
    };
  }
  draw() {
    c.drawImage(
      this.img,
      0,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.pos.x,
      this.pos.y,
      this.img.width / this.frames.max,
      this.img.height
    );
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
    c.fillStyle = "red";
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}
