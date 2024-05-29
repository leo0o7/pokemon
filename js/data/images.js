// create images for sprites
export const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
export const backgroundImage = new Image();
backgroundImage.src = "./img/Pellet Town.png";
export const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";
export const playerImages = {
  up: new Image(), // document.createElement("img")
  down: new Image(),
  left: new Image(),
  right: new Image(),
};
playerImages.up.src = "./img/playerUp.png";
playerImages.down.src = "./img/playerDown.png";
playerImages.left.src = "./img/playerLeft.png";
playerImages.right.src = "./img/playerRight.png";
