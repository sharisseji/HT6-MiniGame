// Minimal TypeScript source for the POC (keeps things typed for future dev)
const startBtn = document.getElementById('startBtn') as HTMLButtonElement | null;
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
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  ctx.fillText('Game running (POC)', 50, 50);
}

startBtn?.addEventListener('click', () => {
  showScreen('gameCanvas');
  initGame();
});

export {};
