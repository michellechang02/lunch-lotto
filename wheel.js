const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const options = ["", "", "", "", "", "", "", ""];
const colors = ["#990000", "#F2F2F2", "#011F5B", "#F2F2F2"];
let startAngle = 0;
let arc = 2 * Math.PI / options.length;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function isColorDark(color) {
    // Convert hex color to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
  
    // Calculate brightness using the luminance formula
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
    return brightness < 128; // Return true if the color is dark
  }  

function truncateOption(option) {
    if (!option) {
        return "Loading..."; // Provide a fallback for empty options
      }

    if (option.length > 15) {
      return option.slice(0, 12) + "..."; // Keep the first 12 characters and add "..."
    }
    return option; // Return the original string if it's 15 characters or less
  }  

  function setHighDPI(canvas, context) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                              context.mozBackingStorePixelRatio ||
                              context.msBackingStorePixelRatio ||
                              context.oBackingStorePixelRatio ||
                              context.backingStorePixelRatio || 1;
  
    const ratio = devicePixelRatio / backingStoreRatio;
  
    // Save the original canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
  
    // Scale the canvas
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  
    // Scale the drawing context
    context.scale(ratio, ratio);
  }
  
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
    
    // Set the font size and style
    ctx.font = "12px Roboto";
  
    options.forEach((option, i) => {
      const truncatedOption = truncateOption(option); // Truncate the option if necessary
      const angle = startAngle + i * arc;
  
      // Draw the segment
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
  
      // Determine font color based on segment color
      const fontColor = isColorDark(colors[i % colors.length]) ? "white" : "black";
  
      // Draw the text
      ctx.save();
      ctx.fillStyle = fontColor; // Set dynamic font color
      ctx.translate(
        canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 40),
        canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 40)
      );
      ctx.rotate(angle + arc / 2);
      ctx.fillText(truncatedOption, -ctx.measureText(truncatedOption).width / 4 * 3, 0); // Use truncated option
      ctx.restore();
    });
  
    // Draw the pointer
    drawPointer();
  }  

function drawPointer() {
    ctx.fillStyle = "#F2C100";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 0); // Left corner of the pointer
    ctx.lineTo(canvas.width / 2 + 10, 0); // Right corner of the pointer
    ctx.lineTo(canvas.width / 2, 30); // Bottom tip of the pointer
    ctx.closePath();
    ctx.fill();
  }

function rotateWheel() {
  spinTime += 30; // Increment spin time
  if (spinTime >= spinTimeTotal) {
    finalizeWheel(); // Stop spinning and finalize the result
    return;
  }

  spinAngleStart *= 0.98; // Gradually reduce spin speed for a smooth stop
  startAngle += spinAngleStart * Math.PI / 180;
  drawWheel();

  spinTimeout = setTimeout(rotateWheel, 30); // Continue spinning
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