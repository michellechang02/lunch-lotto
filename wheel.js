const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const options = ["Yes", "No", "Yes", "No", "Yes", "No", "Yes", "No"]; // Temporary
const colors = ["#ffcccb", "#b0e57c", "#fdfd96", "#add8e6"];
let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  options.forEach((option, i) => {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      angle,
      angle + arc
    );
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(
      canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 40),
      canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 40)
    );
    ctx.rotate(angle + arc / 2);
    ctx.fillText(option, -ctx.measureText(option).width / 2, 0);
    ctx.restore();
  });
}

function rotateWheel() {
  spinAngleStart += 10;
  startAngle += spinAngleStart * Math.PI / 180;
  drawWheel();
  if (spinTime < spinTimeTotal) {
    spinTimeout = setTimeout(rotateWheel, 30);
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 3 * 1000;
  rotateWheel();
}

document.getElementById("spin").addEventListener("click", () => spin());
drawWheel();
