// Minimal TypeScript source for the POC (keeps things typed for future dev)
var startBtn = document.getElementById('startBtn');
var backBtn = document.getElementById('backBtn');
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
    // size canvas to its displayed size
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight));
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText('Game running (POC)', 50, 50);
}

// --- Boba mini-game integration ---
function initBoba() {
    var root = document.getElementById('bobaRoot');
    if (!root)
        return;
    var baseContainer = root.querySelector('#base-options');
    var inContainer = root.querySelector('#in-options');
    var overContainer = root.querySelector('#over-options');
    var baseDiv = root.querySelector('.base');
    var inImg = root.querySelector('.in-topping');
    var overImg = root.querySelector('.over-topping');
    if (!baseContainer || !inContainer || !overContainer || !baseDiv)
        return;
    var baseFlavors = {
        milkTea: '#d1a66e',
        matcha: '#9bcb6a',
        taro: '#bfa0d6',
        strawberry: '#f497b7',
        coffee: '#a37552'
    };
    var inToppings = ['pearls', 'jelly', 'pudding'];
    var overToppings = ['cream', 'cheesefoam', 'whippedcream'];
    if (baseContainer.children.length === 0) {
        Object.entries(baseFlavors).forEach(function (_a) {
            var key = _a[0], color = _a[1];
            var div = document.createElement('div');
            div.className = 'option';
            div.style.backgroundColor = color;
            div.onclick = function () {
                if (baseDiv)
                    baseDiv.style.backgroundColor = color;
            };
            baseContainer.appendChild(div);
        });
    }
    if (inContainer.children.length === 0) {
        inToppings.forEach(function (name) {
            var div = document.createElement('div');
            div.className = 'option';
            var img = document.createElement('img');
            img.src = "assets/inToppings/" + name + ".png";
            div.appendChild(img);
            div.onclick = function () {
                if (inImg)
                    inImg.src = "assets/inToppings/" + name + ".png";
            };
            inContainer.appendChild(div);
        });
    }
    if (overContainer.children.length === 0) {
        overToppings.forEach(function (name) {
            var div = document.createElement('div');
            div.className = 'option';
            var img = document.createElement('img');
            img.src = "assets/overToppings/" + name + ".png";
            div.appendChild(img);
            div.onclick = function () {
                if (overImg)
                    overImg.src = "assets/overToppings/" + name + ".png";
            };
            overContainer.appendChild(div);
        });
    }
}
function clearGame() {
    if (!canvas)
        return;
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', function () {
    showScreen('gameScreen');
    initGame();
    initBoba();
});
backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener('click', function () {
    showScreen('menu');
    if (!canvas)
        return;
    var ctx = canvas.getContext('2d');
    if (ctx)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
});
