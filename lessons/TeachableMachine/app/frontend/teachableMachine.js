import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const canvas = document.getElementById('video-canvas');
const url = 'ws://'+document.location.hostname+':3001/stream';
let player = new JSMpeg.Player(url, {canvas: canvas, preserveDrawingBuffer: true});

const button = document.querySelector('#modelStart');
const classDisplayed = document.querySelector('#classDisplayed');

let model, labelContainer, maxPredictions;

async function init() {
    const uploadModel = document.getElementById('upload-model');
    const uploadWeights = document.getElementById('upload-weights');
    const uploadMetadata = document.getElementById('upload-metadata');
    model = await tmImage.loadFromFiles(
                                        uploadModel.files[0], 
                                        uploadWeights.files[0], 
                                        uploadMetadata.files[0]
    );
    maxPredictions = model.getTotalClasses();
    window.requestAnimationFrame(loop);
    // append elements to the DOM
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    await predict();
    window.requestAnimationFrame(loop);
}


async function predict() {
    const prediction = await model.predict(player.renderer.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = 
        `<label 
        for="${prediction[i].className}">${prediction[i].className}: ${prediction[i].probability.toFixed(2)*100}%</label>
        <progress id="${prediction[i].className}" 
        data-name="${prediction[i].className}" 
        min="0" max="100" value="${prediction[i].probability.toFixed(2)*100}"></progress>`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    const progressBars = document.querySelectorAll('#label-container progress');
    let highestValue = 0;
    let progressBarWithHighestValue = progressBars[0];

    progressBars.forEach(progressBar => {
        const value = parseInt(progressBar.value);
        if (value > highestValue) {
            highestValue = value;
            progressBarWithHighestValue = progressBar;
        }
    });

    classDisplayed.innerHTML = `${progressBarWithHighestValue.dataset.name} is on screen!`;
}

button.addEventListener('click', init);