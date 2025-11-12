// Minimal TypeScript source for the POC (keeps things typed for future dev)
var startBtn = document.getElementById('startBtn');
var backBtn = document.getElementById('backBtn');
var serveBtn = document.getElementById('serveBtn');
var menu = document.getElementById('menu');
var canvas = document.getElementById('gameCanvas');
var orderBaseEl = document.getElementById('orderBase');
var orderInEl = document.getElementById('orderIn');
var orderOverEl = document.getElementById('orderOver');
var orderTimerEl = document.getElementById('orderTimer');
var orderStatusEl = document.getElementById('orderStatus');
var ordersServedEl = document.getElementById('ordersServed');
var ORDER_DURATION = 10;
var orderTimerId = null;
var orderTimeRemaining = ORDER_DURATION;
var currentOrder = null;
var currentSelection = { base: null, in: null, over: null };
var bobaInitialized = false;
var pendingOrderTimeout = null;
var ordersServed = 0;
var BASE_FLAVORS = {
    milkTea: { color: '#DAA26E', label: 'Milk Tea' },
    matcha: { color: '#BFDCA3', label: 'Matcha' },
    taro: { color: '#C6BCFF', label: 'Taro' },
    lychee: { color: '#FEC0CE', label: 'Lychee' },
    thaiTea: { color: '#FFCF94', label: 'Thai Tea' }
};
var IN_TOPPINGS = [
    { key: 'pearls', label: 'Pearls' },
    { key: 'jelly', label: 'Jelly' },
    { key: 'pudding', label: 'Pudding' }
];
var OVER_TOPPINGS = [
    { key: 'chocolate', label: 'Chocolate' },
    { key: 'strawberry', label: 'Strawberry' },
    { key: 'cheesefoam', label: 'Cheese Foam' }
];
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
    // ctx.fillStyle = '#fff';
    // ctx.font = '24px sans-serif';
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
    if (!baseDiv)
        return;
    if (!bobaInitialized) {
        if (baseContainer.children.length === 0) {
            Object.entries(BASE_FLAVORS).forEach(function (_a) {
                var key = _a[0], data = _a[1];
                var div = document.createElement('div');
                div.className = 'option';
                div.dataset.value = key;
                div.style.backgroundColor = data.color;
                div.title = data.label;
                div.onclick = function () {
                    if (baseDiv) {
                        baseDiv.style.backgroundColor = data.color;
                    }
                    currentSelection.base = key;
                    markSelected(baseContainer, div);
                    setOrderStatus('');
                };
                baseContainer.appendChild(div);
            });
        }
        if (inContainer.children.length === 0) {
            IN_TOPPINGS.forEach(function (item) {
                var div = document.createElement('div');
                div.className = 'option';
                div.dataset.value = item.key;
                div.title = item.label;
                var img = document.createElement('img');
                img.src = "assets/inToppings/" + item.key + ".png";
                div.appendChild(img);
                div.onclick = function () {
                    if (inImg)
                        inImg.src = "assets/inToppings/" + item.key + ".png";
                    currentSelection.in = item.key;
                    markSelected(inContainer, div);
                    setOrderStatus('');
                };
                inContainer.appendChild(div);
            });
        }
        if (overContainer.children.length === 0) {
            OVER_TOPPINGS.forEach(function (item) {
                var div = document.createElement('div');
                div.className = 'option';
                div.dataset.value = item.key;
                div.title = item.label;
                var img = document.createElement('img');
                img.src = "assets/overToppings/" + item.key + ".png";
                div.appendChild(img);
                div.onclick = function () {
                    if (overImg)
                        overImg.src = "assets/overToppings/" + item.key + ".png";
                    currentSelection.over = item.key;
                    markSelected(overContainer, div);
                    setOrderStatus('');
                };
                overContainer.appendChild(div);
            });
        }
        currentSelection.base = 'milkTea';
        currentSelection.in = 'pearls';
        currentSelection.over = 'chocolate';
        if (baseDiv && BASE_FLAVORS[currentSelection.base]) {
            baseDiv.style.backgroundColor = BASE_FLAVORS[currentSelection.base].color;
        }
        var baseDefaultEl = baseContainer.querySelector('[data-value="' + currentSelection.base + '"]');
        if (baseDefaultEl) {
            baseDefaultEl.classList.add('selected');
        }
        var inDefaultEl = inContainer.querySelector('[data-value="' + currentSelection.in + '"]');
        if (inDefaultEl) {
            inDefaultEl.classList.add('selected');
        }
        var overDefaultEl = overContainer.querySelector('[data-value="' + currentSelection.over + '"]');
        if (overDefaultEl) {
            overDefaultEl.classList.add('selected');
        }
        bobaInitialized = true;
    }
    startNewOrder();
}
function clearGame() {
    if (!canvas)
        return;
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function markSelected(container, selected) {
    var current = container.querySelector('.selected');
    if (current && current !== selected) {
        current.classList.remove('selected');
    }
    if (!selected.classList.contains('selected')) {
        selected.classList.add('selected');
    }
}
function pickRandomKey(keys) {
    if (keys.length === 0)
        return null;
    var index = Math.floor(Math.random() * keys.length);
    return keys[index];
}
function findLabel(collection, key) {
    for (var i = 0; i < collection.length; i++) {
        if (collection[i].key === key) {
            return collection[i].label;
        }
    }
    return key;
}
function updateOrderDisplay() {
    if (!orderBaseEl || !orderInEl || !orderOverEl || !currentOrder)
        return;
    var base = BASE_FLAVORS[currentOrder.base];
    orderBaseEl.textContent = "Base: " + (base ? base.label : currentOrder.base);
    orderInEl.textContent = "In Topping: " + findLabel(IN_TOPPINGS, currentOrder.in);
    orderOverEl.textContent = "Over Topping: " + findLabel(OVER_TOPPINGS, currentOrder.over);
}
function updateTimerDisplay() {
    if (orderTimerEl) {
        orderTimerEl.textContent = String(Math.max(0, orderTimeRemaining));
    }
}
function setOrderStatus(message) {
    if (orderStatusEl) {
        orderStatusEl.textContent = message;
    }
}
function updateOrdersServedDisplay() {
    if (ordersServedEl) {
        ordersServedEl.textContent = String(ordersServed);
    }
}
function clearPendingOrderTimeout() {
    if (pendingOrderTimeout !== null) {
        window.clearTimeout(pendingOrderTimeout);
        pendingOrderTimeout = null;
    }
}
function clearOrderTimer() {
    if (orderTimerId !== null) {
        window.clearInterval(orderTimerId);
        orderTimerId = null;
    }
}
function scheduleNewOrder(delay) {
    clearPendingOrderTimeout();
    pendingOrderTimeout = window.setTimeout(function () {
        pendingOrderTimeout = null;
        startNewOrder();
    }, delay);
}
function startOrderTimer() {
    clearOrderTimer();
    orderTimeRemaining = ORDER_DURATION;
    updateTimerDisplay();
    orderTimerId = window.setInterval(function () {
        orderTimeRemaining -= 1;
        updateTimerDisplay();
        if (orderTimeRemaining <= 0) {
            clearOrderTimer();
            setOrderStatus('Order expired! New customer arriving...');
            currentOrder = null;
            scheduleNewOrder(800);
        }
    }, 1000);
}
function startNewOrder() {
    clearOrderTimer();
    clearPendingOrderTimeout();
    var baseKeys = Object.keys(BASE_FLAVORS);
    var inKeys = IN_TOPPINGS.map(function (item) { return item.key; });
    var overKeys = OVER_TOPPINGS.map(function (item) { return item.key; });
    var basePick = pickRandomKey(baseKeys);
    var inPick = pickRandomKey(inKeys);
    var overPick = pickRandomKey(overKeys);
    if (!basePick || !inPick || !overPick)
        return;
    currentOrder = {
        base: basePick,
        in: inPick,
        over: overPick
    };
    updateOrderDisplay();
    setOrderStatus('');
    startOrderTimer();
}
function handleServeAttempt() {
    if (!currentOrder) {
        return;
    }
    if (!currentSelection.base || !currentSelection.in || !currentSelection.over) {
        setOrderStatus('Complete the drink before serving.');
        return;
    }
    if (currentSelection.base === currentOrder.base &&
        currentSelection.in === currentOrder.in &&
        currentSelection.over === currentOrder.over) {
        setOrderStatus('Order served! Great job!');
        ordersServed += 1;
        updateOrdersServedDisplay();
        currentOrder = null;
        clearOrderTimer();
        scheduleNewOrder(600);
    }
    else {
        setOrderStatus('Order mismatch. Double-check the ingredients.');
    }
}
startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', function () {
    showScreen('gameScreen');
    ordersServed = 0;
    updateOrdersServedDisplay();
    initGame();
    initBoba();
});
backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener('click', function () {
    showScreen('menu');
    clearOrderTimer();
    clearPendingOrderTimeout();
    setOrderStatus('');
    if (!canvas)
        return;
    var ctx = canvas.getContext('2d');
    if (ctx)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
});
serveBtn === null || serveBtn === void 0 ? void 0 : serveBtn.addEventListener('click', function () {
    handleServeAttempt();
});
