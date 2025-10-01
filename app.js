const audioContext = new AudioContext();
const fileInput = document.getElementById("audioFile");
const playButton = document.getElementById("playButton");
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.25;
const analyser = audioContext.createAnalyser();

analyser.fftSize = 2048;
analyser.connect(gainNode);
gainNode.connect(audioContext.destination);
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 250;

let audioBuffer = null;
let source = null;
let startTime = 0;
let pausedAt = 0;
let isPlaying = false;
let currentSpeed = 1.25;

fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log("Audio loaded!", audioBuffer);
});

playButton.addEventListener("click", () => {
    if (!audioBuffer) return;

    if (isPlaying) {
        source.stop();
        pausedAt += audioContext.currentTime - startTime;
        isPlaying = false;
    } else {
        source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = currentSpeed;
        source.connect(analyser);
        source.start(0, pausedAt);
        startTime = audioContext.currentTime;
        isPlaying = true;
    }
});

// Volume and speed controls
const volumeControl = document.querySelector("#volume");
const speedControl = document.querySelector("#speed");
const volumeValue = document.querySelector("#volumeValue");
const speedValue = document.querySelector("#speedValue");

volumeControl.addEventListener("input", () => {
    gainNode.gain.value = volumeControl.value;
    volumeValue.textContent = parseFloat(volumeControl.value).toFixed(2);
});

speedControl.addEventListener("input", () => {
    currentSpeed = speedControl.value;
    if (source && isPlaying) {
        source.playbackRate.value = currentSpeed;
    }
    speedValue.textContent = parseFloat(speedControl.value).toFixed(2) + "x";
});

function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(0 0 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 3;
    canvasCtx.shadowBlur = 10;
    canvasCtx.shadowColor = "rgb(0 255 150)";

    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "purple");
    gradient.addColorStop(1, "cyan");
    canvasCtx.strokeStyle = gradient;

    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

draw();