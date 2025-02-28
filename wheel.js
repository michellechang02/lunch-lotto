const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const options = ["", "", "", "", "", "", "", ""];
const colors = ["#F69C9E", "#BCECE6", "#73D5D1", "#FFEED9"];
// #051F20 #0B2B26 #163832 #235347 #8EB69B #DAF1DE #F2F2F2
let startAngle = 0;
let arc = 2 * Math.PI / options.length;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let spinning = false; // Track if wheel is currently spinning

function scaleCanvas(canvas, ctx) {
    const pixelRatio = window.devicePixelRatio || 1;
  
    // Save the original canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
  
    // Set the canvas width and height to the scaled dimensions
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
  
    // Scale the canvas context
    // ctx.scale(pixelRatio, pixelRatio);
  
    // Restore the original canvas dimensions for CSS styling
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
  
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

    if (option.length > 13) {
      return option.slice(0, 10) + "..."; // Keep the first 12 characters and add "..."
    }
    return option; // Return the original string if it's 15 characters or less
  }  
  
  function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
  
    // Set the font size and style
    ctx.font = "bold 24px Poppins";
  
    options.forEach((option, i) => {
      const truncatedOption = truncateOption(option.name); // Truncate the option if necessary
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
        canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 120),
        canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 120)
      );
      ctx.rotate(angle + arc / 2);
      ctx.fillText(truncatedOption, -ctx.measureText(truncatedOption).width / 2, 0); // Use truncated option
      ctx.restore();
    });
  
    // Draw the pointer and center circle
    drawPointer();
    drawCenterCircle();
  }  

  function drawCenterCircle() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    // Set shadow properties
    ctx.save();
    ctx.shadowBlur = 15; // Shadow blur amount
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)"; // Shadow color
  
    // Draw the shadowed circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI); // Adjust radius as needed
    ctx.fillStyle = "white"; // Center circle color
    ctx.fill();
    ctx.restore();
  
    // Add a border to the center circle (optional)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.lineWidth = 5; // Border width
    ctx.strokeStyle = "#fff"; // Border color
    ctx.stroke();
  }

  function drawPointer() {
    const centerX = canvas.width / 2; // Center of the canvas
  
    // Set shadow properties for the pointer
    ctx.save(); // Save the current context state
    ctx.shadowBlur = 15; // Blur amount for the shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)"; // Shadow color (semi-transparent black)
    ctx.shadowOffsetX = 0; // Horizontal shadow offset
    ctx.shadowOffsetY = 5; // Vertical shadow offset
  
    // Draw the pointer
    ctx.beginPath();
    ctx.moveTo(centerX - 30, 0); // Left corner of the pointer
    ctx.lineTo(centerX + 30, 0); // Right corner of the pointer
    ctx.lineTo(centerX, 80); // Bottom tip of the pointer
    ctx.closePath();
  
    // Fill the pointer
    ctx.fillStyle = "#007BFF"; // Pointer color
    ctx.fill();
  
    // Add a border (with shadow)
    ctx.lineWidth = 15; // Border thickness
    ctx.strokeStyle = "#ffffff"; // Border color
    ctx.stroke();
    ctx.restore(); // Restore the context state to remove shadow effects for subsequent drawings
  }  
  
  function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      clearTimeout(spinTimeout);
      spinning = false;
  
      // Calculate the winning segment based on the final angle
      const degrees = startAngle * 180 / Math.PI + 90;
      const arcd = 360 / options.length;
      const index = Math.floor((360 - degrees % 360) / arcd);
      const selectedOption = options[index];
      
      // Display the result
      document.getElementById("selected-restaurant").textContent = selectedOption.name;
      document.getElementById("google-maps-link").href = selectedOption.googleMapsLink;
      document.getElementById("google-maps-link").style.display = "block";
      document.getElementById("result-container").style.display = "block";
      
      // Save to history
      saveHistory(selectedOption.name);
      
      return;
    }
  
    // Slow down the spin gradually
    spinAngleStart = spinAngleStart * 0.97; // Slightly slower deceleration
    
    startAngle += spinAngleStart * Math.PI / 180;
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
  // Prevent multiple spins
  if (spinning) return;
  spinning = true;
  
  // Hide any previous result
  document.getElementById("result-container").style.display = "none";
  
  // Set initial spin speed (higher value = faster spin)
  spinAngleStart = Math.random() * 15 + 25; // Faster initial spin
  spinTime = 0;
  spinTimeTotal = Math.random() * 2000 + 3000; // Spin duration between 3-5 seconds
  rotateWheel();
}

// Make sure spin function is globally accessible
window.spinWheel = spin;

// Initialize the wheel
scaleCanvas(canvas, ctx);
drawWheel();