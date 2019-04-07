import * as cocoSsd from '@tensorflow-models/coco-ssd';

var input = document.getElementById('image');
var context = document.getElementById('canvas').getContext('2d');
var model;
var image = document.createElement('img');
var colors = [];
while (colors.length < 90) {
  do {
    var color = Math.floor(Math.random() * 1000000 + 1);
  } while (colors.indexOf(color) >= 0);
  colors.push('#' + ('000000' + color.toString(16)).slice(-6));
}

window.onload = () => {
  console.log('Loading model...');
  cocoSsd.load().then(res => {
    console.log('Load finished');
    model = res;
  });
};

input.oninput = function() {
  const file = input.files[0];
  image.src = window.URL.createObjectURL(file);
};

image.onload = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);
  console.log('Predicting...');
  model.detect(image).then(result => {
    for (let i = 0; i < result.length; i++) {
      context.beginPath();
      context.rect(...result[i].bbox);
      context.lineWidth = 1;
      context.strokeStyle = colors[i];
      context.fillStyle = colors[i];
      context.stroke();
      context.fillText(
        result[i].score.toFixed(3) + ' ' + result[i].class,
        result[i].bbox[0],
        result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10
      );
    }
  });
};
