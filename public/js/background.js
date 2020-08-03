const body = document.querySelector("body");

const IMG_NUMBER = 3;

function getImage(imgNumber) {
  const img = new Image();
  img.src = `../img/${imgNumber + 1}.jpg`;
  img.classList.add("bgImage");
  body.prepend(img);
}

function getRandom() {
  const number = Math.floor(Math.random() * 3);
  return number;
}
(function bgInit() {
  const randomNumber = getRandom();
  getImage(randomNumber);
})();
 