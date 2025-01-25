const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const options = ["Loading...", "", "", "", "", "", "", ""];
const colors = ["#ffcccb", "#b0e57c", "#fdfd96", "#add8e6"];
let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
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

  // Draw the pointer at the top
  drawPointer();
}

function drawPointer() {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 5); // Left corner of the pointer
    ctx.lineTo(canvas.width / 2 + 10, 5); // Right corner of the pointer
    ctx.lineTo(canvas.width / 2, 30); // Bottom tip of the pointer
    ctx.closePath();
    ctx.fill();
  }

  function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      clearTimeout(spinTimeout);
  
      // Calculate the winning segment based on the final angle
      const degrees = (startAngle * 180) / Math.PI + 90;
      const normalizedDegrees = degrees % 360;
      const selectedIndex = Math.floor(normalizedDegrees / (360 / options.length));
      const selectedOption = options[options.length - 1 - selectedIndex];
  
      // Motivational messages to encourage the user
      const messages = [
        "Time to fuel your body with something nutritious! 🍎",
        "Great choice! Enjoy your healthy meal. 🌱",
        "A healthy lunch keeps the energy flowing! 💪",
        "Your body will thank you for this meal. 🥗",
        "Eating healthy today sets you up for success! 🏆",
        "Tasty and healthy? You've got it! 🍽️",
        "Healthy food, happy mood! 😊",
      ];
  
      // Select a random motivational message
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
      // Show result + motivational message
      alert(`Selected option: ${selectedOption}\n\n${randomMessage}`);
  
      return;
    }
  
    startAngle += (spinAngleStart * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
  }




function finalizeWheel() {
  const degrees = (startAngle * 180) / Math.PI + 90; // Convert radians to degrees
  const index = Math.floor((360 - (degrees % 360)) / (360 / options.length)); // Calculate the selected segment
  const selectedOption = options[index];
  
  alert(`Selected option: ${selectedOption}`); // Display the result
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 3000; // Spin duration between 3-6 seconds
  rotateWheel();
}

document.getElementById("spin").addEventListener("click", () => spin());
drawWheel();