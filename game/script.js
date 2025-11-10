"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Minimal TypeScript source for the POC (keeps things typed for future dev)
var startBtn = document.getElementById('startBtn');
var menu = document.getElementById('menu');
var canvas = document.getElementById('gameCanvas');
function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function (s) { return s.classList.add('hidden'); });
    var el = document.getElementById(id);
    if (el)
        el.classList.remove('hidden');
}
function initGame() {
    if (!canvas)
        return;
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText('Game running (POC)', 50, 50);
}
startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', function () {
    showScreen('gameCanvas');
    initGame();
});
