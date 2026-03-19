class GothicRoulette {
    constructor() {
        this.canvas = document.getElementById('rouletteWheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultText = document.getElementById('resultText');
        
        this.isSpinning = false;
        this.currentAngle = 0;
        
        // Готические призы
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
        
        // Внешнее свечение
        ctx.shadowColor = '#b8860b';
        ctx.shadowBlur = 30;
        
        // Рисуем сектора
        for (let i = 0; i < this.segments.length; i++) {
            const startAngle = (i * 2 * Math.PI) / this.segments.length + this.currentAngle;
            const endAngle = ((i + 1) * 2 * Math.PI) / this.segments.length + this.currentAngle;
            
            // Сектор
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Основной цвет с металлическим отливом
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, this.segments[i].color);
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Обводка металликом
            ctx.strokeStyle = '#c0c0c0';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Рисуем текст
            ctx.save();
            ctx.translate(
                centerX + (radius * 0.7) * Math.cos(startAngle + Math.PI / this.segments.length),
                centerY + (radius * 0.7) * Math.sin(startAngle + Math.PI / this.segments.length)
            );
            ctx.rotate(startAngle + Math.PI / this.segments.length + Math.PI / 2);
            
            ctx.font = 'bold 16px "Playfair Display", serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 10;
            ctx.fillText(this.segments[i].label.substring(0, 3), 0, 0);
            ctx.restore();
        }
        
        // Внутреннее кольцо
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
        ctx.fillStyle = '#2d1b3a';
        ctx.shadowColor = '#b8860b';
        ctx.fill();
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        // Показываем процесс вращения
        this.resultText.textContent = '🔄 КРУТИТСЯ...';
        
        // Звук (опционально)
        try {
            const sound = document.getElementById('spinSound');
            if (sound) sound.play();
        } catch (e) {}
        
        // Супер-инертное вращение: 25-40 оборотов, 7 секунд
        const spins = 25 + Math.floor(Math.random() * 16);
        const targetAngle = this.currentAngle + (spins * 2 * Math.PI) + (Math.random() * 2 * Math.PI);
        const startTime = performance.now();
        const duration = 7000; // 7 секунд
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Очень плавное замедление (easeOutQuart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 5);
            
            this.currentAngle = this.currentAngle + (targetAngle - this.currentAngle) * easeOutQuart;
            
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Анимация завершена — теперь показываем результат
                this.isSpinning = false;
                this.currentAngle = targetAngle % (2 * Math.PI);
                this.drawWheel();
                
                // Вычисляем и показываем выигрыш
                const pointerAngle = (3 * Math.PI / 2) - this.currentAngle;
                let normalizedAngle = ((pointerAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                const segmentIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * this.segments.length);
                
                const prize = this.segments[segmentIndex];
                this.resultText.textContent = `${prize.label} | ${prize.value} 💀`;
                
                // Эффект свечения
                this.resultText.style.textShadow = '0 0 30px #b8860b';
                setTimeout(() => {
                    this.resultText.style.textShadow = 'none';
                }, 1000);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new GothicRoulette();
});
