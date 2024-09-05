let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let model;

// Set up the camera
const setupCamera = async () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 600, height: 400 },
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          resolve(video);
        };
      })
      .catch(reject);
  });
};

// Load the BlazeFace model
const loadModel = async () => {
  model = await blazeface.load();
};

// Detect faces and draw on the canvas
const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Draw the video on the canvas
  ctx.drawImage(video, 0, 0, 600, 400);

  // Draw rectangles around detected faces
  prediction.forEach((pred) => {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "red";
    ctx.rect(
      pred.topLeft[0],
      pred.topLeft[1],
      pred.bottomRight[0] - pred.topLeft[0],
      pred.bottomRight[1] - pred.topLeft[1]
    );
    ctx.stroke();
  });
};

// Main function to initialize the camera and model
const init = async () => {
  await Promise.all([setupCamera(), loadModel()]);

  // Start detection once both camera and model are ready
  setInterval(detectFaces, 40);
};

// Call the init function to start
init();
