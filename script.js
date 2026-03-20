import { animate } from '@in/motion';

// Готические сектора
const SEGMENTS = [
    { name: '🖤 РОЗА', value: 10, color: '#4a1d2d' },
    { name: '💀 ЧЕРЕП', value: 25, color: '#2d1b3a' },
    { name: '🦇 МЫШЬ', value: 50, color: '#1a3a3a' },
    { name: '🗡️ КИНЖАЛ', value: 100, color: '#3a1a2a' },
    { name: '🕯️ СВЕЧА', value: 5, color: '#b8a9c9' },
    { name: '🥀 РОЗА', value: 200, color: '#c0a080' },
    { name: '🔮 ШАР', value: 150, color: '#ff006e' },
    { name: '⚰️ ГРОБ', value: 500, color: '#6a0dad' }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

let currentAngle = 0;
let isSpinning = false;

function drawWheel(angle) {
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) / 2 - 10;
    const angleStep = (Math.PI * 2) / SEGMENTS.length;
    
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < SEGMENTS.length; i++) {
        const start = i * angleStep + angle;
        const end = (i + 1) * angleStep + angle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = SEGMENTS[i].color;
        ctx.fill();
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(start + angleStep / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Playfair Display'";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "black";
        ctx.fillText(SEGMENTS[i].name, radius * 0.7, 8);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#1a0b2e';
    ctx.fill();
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function getWinnerIndex(angle) {
    const pointerAngle = Math.PI / 2;
    let raw = pointerAngle - angle;
    raw = ((raw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return Math.floor((raw / (2 * Math.PI)) * SEGMENTS.length);
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    resultDiv.textContent = '🔄 КРУТИТСЯ...';
    
    const fullRotations = 12 + Math.random() * 8;
    const randomStop = Math.random() * Math.PI * 2;
    const targetDelta = fullRotations * 2 * Math.PI + randomStop;
    const targetAngle = currentAngle + targetDelta;
    
    animate({
        from: currentAngle,
        to: targetAngle,
        duration: 6000,
        easing: 'cubic-bezier(0.15, 0.85, 0.3, 1)',
        onUpdate: (value) => {
            currentAngle = value;
            drawWheel(currentAngle);
        },
        onComplete: () => {
            currentAngle = targetAngle % (Math.PI * 2);
            drawWheel(currentAngle);
            
            const idx = getWinnerIndex(currentAngle);
            const prize = SEGMENTS[idx];
            resultDiv.textContent = `${prize.name} | ${prize.value} 💀`;
            isSpinning = false;
        }
    });
}

// Инициализация
drawWheel(0);
spinBtn.addEventListener('click', spin);
