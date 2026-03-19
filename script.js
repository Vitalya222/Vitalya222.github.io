class GothicRoulette {
    constructor() {
        this.canvas = document.getElementById('rouletteWheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultText = document.getElementById('resultText');
        
        this.isSpinning = false;
        this.currentAngle = 0;
        
        this.segments = [
            { label: '🖤 ЧЁРНАЯ РОЗА', value: 10, color: '#4a1d2d' },
            { label: '💀 ЧЕРЕП', value: 25, color: '#2d1b3a' },
            { label: '🦇 ЛЕТУЧАЯ МЫШЬ', value: 50, color: '#1a3a3a' },
            { label: '🗡️ КИНЖАЛ', value: 100, color: '#3a1a2a' },
            { label: '🕯️ СВЕЧА', value: 5, color: '#b8a9c9' },
            { label: '🥀 ЧЁРНАЯ РОЗА', value: 200, color: '#c0a080' },
            { label: '🔮 ХРУСТАЛЬНЫЙ ШАР', value: 150, color: '#ff006e' },
            { label: '⚰️ ГРОБ', value: 500, color: '#6a0dad' }
        ];
        
        this.init();
    }
    
    init() {
        this.drawWheel();
        this.spinBtn.addEventListener('click', () => this.spin());
    }
    
    drawWheel() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.2;
        
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < this.segments.length; i++) {
            const startAngle = (i * 2 * Math.PI) / this.segments.length + this.currentAngle;
            const endAngle = ((i + 1) * 2 * Math.PI) / this.segments.length + this.currentAngle;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = this.segments[i].color;
            ctx.fill();
            
            ctx.strokeStyle = '#c0c0c0';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
        ctx.fillStyle = '#2d1b3a';
        ctx.fill();
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.resultText.textContent = '🔄 КРУТИТСЯ...';
        
        const spins = 25 + Math.floor(Math.random() * 16);
        const targetAngle = this.currentAngle + (spins * 2 * Math.PI) + (Math.random() * 2 * Math.PI);
        const startTime = performance.now();
        const duration = 7000;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 5);
            
            this.currentAngle = this.currentAngle + (targetAngle - this.currentAngle) * easeOutQuart;
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Анимация завершена
                this.isSpinning = false;
                
                // Фиксируем финальный угол и перерисовываем
                this.currentAngle = targetAngle % (2 * Math.PI);
                this.drawWheel();
                
                // Мгновенно вычисляем и показываем результат
                const pointerAngle = (3 * Math.PI / 2) - this.currentAngle;
                let normalizedAngle = ((pointerAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                const segmentIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * this.segments.length);
                
                const prize = this.segments[segmentIndex];
                this.resultText.textContent = `${prize.label} | ${prize.value} 💀`;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GothicRoulette();
});
