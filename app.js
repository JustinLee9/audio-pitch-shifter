// Audio setup
const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.25;
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.connect(gainNode);
gainNode.connect(audioContext.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Canvas setup
const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 250;

// DOM elements
const fileInput = document.getElementById("audioFile");
const playBtn = document.getElementById("playBtn");
const downloadBtn = document.getElementById("downloadBtn");
const volumeControl = document.querySelector("#volume");
const speedControl = document.querySelector("#speed");
const volumeValue = document.querySelector("#volumeValue");
const speedValue = document.querySelector("#speedValue");

// State
let originalFileName = null;
let audioBuffer = null;
let source = null;
let startTime = 0;
let pausedAt = 0;
let isPlaying = false;
let currentSpeed = 1.25;

// File input
fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    audioBuffer = null;
    originalFileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (source && isPlaying) {
        source.stop();
    }
    startTime = 0;
    pausedAt = 0;
    isPlaying = false;

    console.log("Audio loaded!", audioBuffer);
});

// Play/Pause
playBtn.addEventListener("click", () => {
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

        source.onended = () => {
            const playedFor = (audioContext.currentTime - startTime) * currentSpeed + pausedAt;

            if (playedFor < audioBuffer.duration - 0.01) {
                // Stopped early (pause or new file)
                return;
            }

            // Only runs if audio reached the end
            console.log("Song ended naturally");
            startTime = 0;
            pausedAt = 0;
            isPlaying = false;
        };
        source.start(0, pausedAt);
        startTime = audioContext.currentTime;
        isPlaying = true;
    }
});

// Download
downloadBtn.addEventListener("click", async () => {
    if (!audioBuffer) return;

    const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length / currentSpeed, audioBuffer.sampleRate);
    const offlineSource = offlineCtx.createBufferSource();
    offlineSource.buffer = audioBuffer;
    offlineSource.playbackRate.value = currentSpeed;

    const offlineGain = offlineCtx.createGain();
    offlineGain.gain.value = gainNode.gain.value;

    offlineSource.connect(offlineGain);
    offlineGain.connect(offlineCtx.destination);

    offlineSource.start(0);
    const renderedBuffer = await offlineCtx.startRendering();
    const wavData = audioBufferToWav(renderedBuffer);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = originalFileName + " " + currentSpeed + "x.wav";
    a.click();
    URL.revokeObjectURL(url);
});

// Volume
volumeControl.addEventListener("input", () => {
    gainNode.gain.value = volumeControl.value;
    volumeValue.textContent = parseFloat(volumeControl.value).toFixed(2);
});

// Speed
speedControl.addEventListener("input", () => {
    currentSpeed = speedControl.value;
    if (source && isPlaying) {
        source.playbackRate.value = currentSpeed;
    }
    speedValue.textContent = parseFloat(speedControl.value).toFixed(2) + "x";
});

// Visualizer
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