const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const img = new Image();
img.src = "./img/town.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

img.onload = () => {
  c.drawImage(img, -750, -550);
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  c.drawImage(
    playerImage,
    // to center the player move it to center - it's width/height / 2
    center.x - playerImage.width / 2,
    center.y - playerImage.height / 2
  );
};
