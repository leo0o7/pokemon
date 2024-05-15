import { c } from "./index.js";

export class Sprite {
  constructor({ pos, img }) {
    this.pos = pos;
    this.img = img;
  }
  draw() {
    c.drawImage(this.img, this.pos.x, this.pos.y);
  }
}
