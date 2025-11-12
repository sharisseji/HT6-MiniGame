// Minimal TypeScript source for the POC (keeps things typed for future dev)
const startBtn = document.getElementById('startBtn') as HTMLButtonElement | null;
const backBtn = document.getElementById('backBtn') as HTMLButtonElement | null;
const menu = document.getElementById('menu') as HTMLElement | null;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;

function showScreen(id: string) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}


function initGame() {
  if (!canvas) return;
  if (!canvas) return;
  // ensure canvas bitmap size matches display size for crisp drawing
  canvas.width = Math.max(1, Math.floor(canvas.clientWidth));
  canvas.height = Math.max(1, Math.floor(canvas.clientHeight));

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = '#fff';
  // ctx.font = '24px sans-serif';
}

// --- Boba mini-game integration ---
function initBoba() {
  const root = document.getElementById('bobaRoot');
  if (!root) return;

  // find containers scoped to the boba root
  const baseContainer = root.querySelector('#base-options') as HTMLElement | null;
  const inContainer = root.querySelector('#in-options') as HTMLElement | null;
  const overContainer = root.querySelector('#over-options') as HTMLElement | null;

  const baseDiv = root.querySelector('.base') as HTMLElement | null;
  const inImg = root.querySelector('.in-topping') as HTMLImageElement | null;
  const overImg = root.querySelector('.over-topping') as HTMLImageElement | null;

  if (!baseContainer || !inContainer || !overContainer || !baseDiv) return;

  const baseFlavors: Record<string, string> = {
    milkTea: '#DAA26E',
    matcha: '#BFDCA3',
    taro: '#C6BCFF',
    lychee: '#FEC0CE',
    thaiTea: '#FFCF94',
  };

  const inToppings = ['pearls', 'jelly', 'pudding'];
  const overToppings = ['cream', 'cheesefoam', 'whippedcream'];

  // guard to avoid double-population
  if (baseContainer.children.length === 0) {
    Object.entries(baseFlavors).forEach(([key, color]) => {
      const div = document.createElement('div');
      div.className = 'option';
      (div as HTMLElement).style.backgroundColor = color;
      div.onclick = () => {
        if (baseDiv) baseDiv.style.backgroundColor = color;
      };
      baseContainer.appendChild(div);
    });
  }

  if (inContainer.children.length === 0) {
    inToppings.forEach((name) => {
      const div = document.createElement('div');
      div.className = 'option';
      const img = document.createElement('img');
      img.src = `assets/inToppings/${name}.png`;
      div.appendChild(img);
      div.onclick = () => {
        if (inImg)
          inImg.src = `assets/inToppings/${name}.png`;
      };
      inContainer.appendChild(div);
    });
  }

  if (overContainer.children.length === 0) {
    overToppings.forEach((name) => {
      const div = document.createElement('div');
      div.className = 'option';
      const img = document.createElement('img');
      img.src = `assets/overToppings/${name}.png`;
      div.appendChild(img);
      div.onclick = () => {
        if (overImg)
          overImg.src = `assets/overToppings/${name}.png`;
      };
      overContainer.appendChild(div);
    });
  }
}

function clearGame() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

startBtn?.addEventListener('click', () => {
  showScreen('gameScreen');
  initGame();
  initBoba();
});

backBtn?.addEventListener('click', () => {
  showScreen('menu');
  clearGame();
});
