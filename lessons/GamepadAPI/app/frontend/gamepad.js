import io from 'socket.io-client';

const socket = io('http://localhost:6767');

var start;
var rAF = window.requestAnimationFrame;
var rAFStop = window.cancelRequestAnimationFrame;

let stickControl = document.querySelector('#stickMode');

window.addEventListener("gamepadconnected", function() {
    var gp = navigator.getGamepads()[0];
    console.log(`Gamepad connected at index ${gp.index}: ${gp.id}.
     It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`);
    gameLoop();
});
  
window.addEventListener("gamepaddisconnected", function() {
    console.log("Waiting for gamepad.");

    rAFStop(start);
});

function buttonPressed(b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
}

const buttonCommands = {
    12: { command: 'forward 50', label: 'forward' },
    13: { command: 'back 50', label: 'back' },
    15: { command: 'right 50', label: 'right' },
    14: { command: 'left 50', label: 'left' },
    4: { command: 'ccw 90', label: 'rotate counterclockwise' },
    5: { command: 'cw 90', label: 'rotate clockwise' },
    6: { command: 'down 50', label: 'descend' },
    7: { command: 'up 50', label: 'raise up' },
    0: { command: 'takeoff', label: 'takeoff' },
    3: { command: 'land', label: 'land' },
    1: { command: 'emergency', label: 'emergency' },
    2: { command: 'command', label: 'command' },
};

function gameLoop() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() :
     (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
      return;
  
    var gp = gamepads[0];

    let stickDeadZone = 0.1;

    let leftRightMove = 
        gp.axes[0] >= stickDeadZone || gp.axes[0] <= -stickDeadZone 
        ? gp.axes[0] * 50 : 0;

    let forwardBackwardMove = 
        gp.axes[1] >= stickDeadZone || gp.axes[1] <= -stickDeadZone 
        ? gp.axes[1] * -50 : 0;

    let rotateMove = 
        gp.axes[2] >= stickDeadZone || gp.axes[2] <= -stickDeadZone 
        ? gp.axes[2] * 100 : 0;

    let upDownMove = 
        gp.axes[3] >= stickDeadZone || gp.axes[3] <= -stickDeadZone 
        ? gp.axes[3] * -50 : 0;

    if(stickControl.checked) {
            socket.emit('command', `rc ${leftRightMove} ${forwardBackwardMove} ${upDownMove} ${rotateMove}`);
    }

    for (const buttonIndex in buttonCommands) {
        if (buttonPressed(gp.buttons[buttonIndex])) {
            const { command, label } = buttonCommands[buttonIndex];
            socket.emit('command', command);
            console.log(label);
        }
    }

    start = rAF(gameLoop);
};

/*
    let stickDeadZone = 0.1;

    let leftRightMove = 
        gp.axes[0] >= stickDeadZone || gp.axes[0] <= -stickDeadZone 
        ? gp.axes[0] * 50 : 0;

    let forwardBackwardMove = 
        gp.axes[1] >= stickDeadZone || gp.axes[1] <= -stickDeadZone 
        ? gp.axes[1] * -50 : 0;

    let rotateMove = 
        gp.axes[2] >= stickDeadZone || gp.axes[2] <= -stickDeadZone 
        ? gp.axes[2] * 100 : 0;

    let upDownMove = 
        gp.axes[3] >= stickDeadZone || gp.axes[3] <= -stickDeadZone 
        ? gp.axes[3] * -50 : 0;

    if(stickControl.checked && gp.axes.some(axisValue => axisValue > stickDeadZone || axisValue < -stickDeadZone)) {
        socket.emit('command', `rc ${leftRightMove} ${forwardBackwardMove} ${upDownMove} ${rotateMove}`);
    }
    
    
    if (buttonPressed(gp.buttons[12])) {
        socket.emit('command', 'forward 50');
        console.log("forward");
    } else if (buttonPressed(gp.buttons[13])) {
        socket.emit('command', 'back 50');
        console.log("back");
    }
    if(buttonPressed(gp.buttons[15])) {
        socket.emit('command', 'right 50');
        console.log("right");
    } else if(buttonPressed(gp.buttons[14])) {
        socket.emit('command', 'left 50');
        console.log("left");
    }

    if (buttonPressed(gp.buttons[4])) {
        socket.emit('command', 'ccw 90');
        console.log("rotate counterclockwise");
    } else if (buttonPressed(gp.buttons[5])) {
        socket.emit('command', 'cw 90');
        console.log("rotate clockwise");
    }

    if (buttonPressed(gp.buttons[6])) {
        socket.emit('command', 'down 50');
        console.log("descend");
    } else if (buttonPressed(gp.buttons[7])) {
        socket.emit('command', 'up 50');
        console.log("raise up");
    }

    if (buttonPressed(gp.buttons[0])) {
        socket.emit('command', 'takeoff');
        console.log("takeoff");
    } else if (buttonPressed(gp.buttons[3])) {
        socket.emit('command', 'land');
        console.log("land");
    }

    if (buttonPressed(gp.buttons[1])) {
        socket.emit('command', 'emergency');
        console.log('emergency');
    }

    if (buttonPressed(gp.buttons[2])) {
        socket.emit('command', 'command');
        console.log('command');
    }
    */