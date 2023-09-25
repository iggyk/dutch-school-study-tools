function redraw() {
    const container = document.querySelector("#workarea");
    container.innerHTML = "";
    const numOfClocks = document.querySelector("#numClocks").value;
    const drawHours = document.querySelector("#showHours").checked;
    const drawMinutes = document.querySelector("#showMinutes").checked;
    const showLabels = document.querySelector("#showLabels").checked;
    for (let i = 0; i < numOfClocks; i++) {
        draw(container, generateRandomTime(), drawHours, drawMinutes, showLabels)
    }
}

const SIZE = 100;
const MARKSIZE = Math.max(5, SIZE / 50);
const HOURHANDSIZE = SIZE / 3;
const MINUTEHANDSIZE = SIZE / 2 - MARKSIZE - 1;
const STROKE = SIZE / 100;
const HSTROKE = SIZE / 50;
const MSTROKE = SIZE / 80;

function generateRandomTime(minuteStep = 5) {
    const hour = Math.floor(Math.random() * 12);
    const minute = Math.floor(Math.random() * 60);
    const finalMinute = (Math.round(minute / minuteStep) * minuteStep) % 60;
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, finalMinute, 0, 0);
}

function draw(container, time, hourHandle = true, minuteHandle = true, displayText = true) {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    wrapper.appendChild(canvas);
    const context = canvas.getContext("2d");
    drawTime(context, time ? time : generateRandomTime(), hourHandle, minuteHandle);
    if (displayText) {
        const label = document.createElement("div");
        label.className = "label";
        label.innerHTML = dutchify(time);
        wrapper.appendChild(label);
    }
    container.appendChild(wrapper);
}

/**
 * @param {CanvasRenderingContext2D} context 
 */
function drawClockBase(context) {
    context.save();
    context.beginPath();
    context.strokeStyle = "#999999";
    context.lineWidth = STROKE;
    context.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
    context.stroke();
    context.closePath();
    context.restore();
    for (let i = 0; i < 12; i++) {
        context.save();
        context.translate(SIZE / 2, SIZE / 2);
        context.rotate((Math.PI / 6) * i);
        context.beginPath();
        context.strokeStyle = "#999999";
        context.moveTo(SIZE / 2 - 1, 0);
        context.lineTo(SIZE / 2 - 1 - MARKSIZE, 0);
        context.stroke();
        context.closePath();
        context.restore();
    }
}

/**
 * @param {CanvasRenderingContext2D} context 
 * @param {Date} time 
 */
function drawHourHand(context, time) {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const hourSegmentAngle = Math.PI / 6;
    const finalRotation = hourSegmentAngle * (hour + minute / 60) - (Math.PI / 2);
    context.save();
    context.translate(SIZE / 2, SIZE / 2);
    context.rotate(finalRotation);
    context.beginPath();
    context.lineWidth = HSTROKE;
    context.moveTo(0, 0);
    context.lineTo(HOURHANDSIZE, 0);
    context.stroke();
    context.closePath();
    context.lineWidth = 1;
    context.restore();
}

/**
 * @param {CanvasRenderingContext2D} context 
 * @param {Date} time 
 */
function drawMinuteHand(context, time) {
    const minute = time.getMinutes();
    const minuteSegmentAngle = Math.PI / 30;
    const finalRotation = minuteSegmentAngle * minute - (Math.PI / 2);
    context.save();
    context.translate(SIZE / 2, SIZE / 2);
    context.rotate(finalRotation);
    context.beginPath();
    context.lineWidth = MSTROKE;
    context.moveTo(0, 0);
    context.lineTo(MINUTEHANDSIZE, 0);
    context.stroke();
    context.closePath();
    context.lineWidth = 1;
    context.restore();
}

/**
 * @param {CanvasRenderingContext2D} context 
 * @param {Date} time 
 */
function drawTime(context, time, hours = true, minutes = true) {
    console.log("Drawing", time.toTimeString(), dutchify(time));
    drawClockBase(context);
    if (hours) drawHourHand(context, time);
    if (minutes) drawMinuteHand(context, time);
}

/**
 * @param {Date} time 
 */
function dutchify(time) {
    const hour = time.getHours() % 12;
    const minute = time.getMinutes();
    if (minute === 0) return `${hour} uur`;
    if (minute === 15) return `Kwart over ${hour}`;
    if (minute === 30) return `Half ${hour + 1}`;
    if (minute === 45) return `Kwart voor ${hour}`;
    if (minute > 0 && minute < 15) return `${minute} over ${hour}`;
    if (minute > 15 && minute < 30) return `${30 - minute} voor half ${hour + 1}`;
    if (minute > 30 && minute < 45) return `${minute - 30} over half ${hour + 1}`;
    return `${60 - minute} voor ${hour + 1}`;
}