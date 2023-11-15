let controllerIndex = null;

window.addEventListener('gamepadconnected', (e) => {
    handleConnectDisconnect(e, true);
});

window.addEventListener('gamepaddisconnected', (e) => {
    handleConnectDisconnect(e, false);
});

function handleConnectDisconnect(event, connected) {
    const controllerAreaNotConnected = document.querySelector('#controller-not-connected-area');
    const controllerAreaConnected = document.querySelector('#controller-connected-area');
    const gamepad = event.gamepad;

    if(connected) {
        controllerIndex = gamepad.index;
        controllerAreaNotConnected.style.display = "none";
        controllerAreaConnected.style.display = "block";
        createButtonLayout(gamepad.buttons);
        createAxesLayout(gamepad.axes);
    } else {
        controllerIndex = null;
        controllerAreaNotConnected.style.display = "block";
        controllerAreaConnected.style.display = "none";
    }
}

function createAxesLayout(axes) {
    const buttonsArea = document.querySelector('#buttons');
    for(let i = 0; i < axes.length; i++) {
        buttonsArea.innerHTML += `<div id="axis-${i}" class="axis">
                                    <div class="axis-name">AXIS ${i}</div>
                                    <div class="axis-value">${axes[i].toFixed(4)}</div>
                                  </div>`
    }
}

function createButtonLayout(buttons) {
    const buttonArea = document.querySelector('#buttons');
    buttonArea.innerHTML = '';
    for(let i = 0; i < buttons.length; i++) {
        buttonArea.innerHTML += createButtonHtml(i, 0);
    }
}

function createButtonHtml(index, value) {
    return `<div class="button" id="button-${index}">
                <svg width="10px" height="50px">
                    <rect width="10px" height="50px" fill="grey"></rect>
                    <rect
                    class="button-meter"
                    width="10px"
                    x="0"
                    y="50"
                    data-original-y-position="50"
                    height="50px"
                    fill="rgb(60, 61, 60)"
                    ></rect>
                </svg>
                <div class= 'button-text-area'>
                    <div class="button-name">B${index}</div>
                    <div class="button-value">${value.toFixed(2)}</div>
                </div> 
            </div>`;
}

function updateButtonOnGrid(index, value) {
    const buttonArea = document.querySelector(`#button-${index}`);
    const buttonValue = buttonArea.querySelector('.button-value');
    buttonValue.innerHTML = value.toFixed(2);
    const buttonMeter = buttonArea.querySelector('.button-meter');
    const meterHeight = Number(buttonMeter.dataset.originalYPosition);
    const meterPosition = meterHeight - (meterHeight / 100) * (value * 100);
    buttonMeter.setAttribute('y', meterPosition);
}

function handleButtons(buttons) {
    for(let i = 0; i < buttons.length; i++) {
        const buttonValue = buttons[i].value;
        updateButtonOnGrid(i, buttonValue);
    }
}

function handleSticks(axes) {
    updateAxesGrid(axes);
}

function updateAxesGrid(axes) {
    for (let i = 0; i < axes.length; i++) {
        const axis = document.querySelector(`#axis-${i} .axis-value`);
        const value = axes[i];
        axis.innerHTML = value.toFixed(4);
    }
}

function handleRumble(gamepad) {
    const rumbleOnButtonPress = document.querySelector('#rumble-on-button-press');
    if(rumbleOnButtonPress.checked) {
        if(gamepad.buttons.some(button => button.value > 0)) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 25,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            });
        }
    }
}

function gameLoop() {
    if(controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
        handleSticks(gamepad.axes);
        handleRumble(gamepad);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();