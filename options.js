// Save / Restore logic
const safeInput = document.getElementById('safeSite');
const whiteInput = document.getElementById('whitelist');
const saveBtn = document.getElementById('save');
const restoreBtn = document.getElementById('restore');
const statusMessage = document.getElementById('statusMessage');

function parseWhitelist(text) {
  return text
    .split(/\r?\n|,/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
    .map(s => {
      try { return new URL(s).hostname.toLowerCase(); }
      catch { 
        try { return new URL('https://' + s).hostname.toLowerCase(); }
        catch { return s.toLowerCase(); }
      }
    });
}

function showStatus(message, duration = 2000) {
  statusMessage.textContent = message;
  statusMessage.classList.add('show', 'success');
  setTimeout(() => {
    statusMessage.classList.remove('show');
  }, duration);
}

saveBtn.addEventListener('click', async () => {
  const safeSite = safeInput.value.trim();
  const raw = whiteInput.value.trim();
  const whitelist = parseWhitelist(raw);
  
  await chrome.storage.sync.set({ safeSite, whitelist });
  showStatus('Settings saved successfully! ✨');
});

restoreBtn.addEventListener('click', async () => {
  const data = await chrome.storage.sync.get(['safeSite', 'whitelist']);
  safeInput.value = data.safeSite || '';
  whiteInput.value = (data.whitelist || []).join('\n');
  showStatus('Settings restored! 🔄');
});

restoreBtn.click();

// GitHub Page button
document.getElementById('github').addEventListener('click', () => {
  const url = 'https://bkeinbest11.github.io/Escape_Button/';
  window.open(url, '_blank');
});

// Detect platform and update shortcut display
function updateShortcutDisplay() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutDisplay = document.getElementById('shortcutDisplay');
  if (isMac) {
    shortcutDisplay.textContent = '⌘ + Shift + Z';
  }
}

updateShortcutDisplay();

// ===== Particle effect =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const colors = ['#6366f1', '#818cf8', '#ec4899', '#f472b6', '#60a5fa', '#3b82f6'];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    this.opacity += (Math.random() - 0.5) * 0.02;
    this.opacity = Math.max(0.1, Math.min(0.6, this.opacity));
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 80; i++) particlesArray.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();
