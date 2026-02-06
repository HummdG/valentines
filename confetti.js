// Optimized Confetti - Single Burst Only
class ConfettiCannon {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.confetti = [];
        this.colors = ['#ff1493', '#da70d6', '#ffd700', '#87ceeb', '#ff69b4'];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createConfetti(x, y, count = 80) {
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                gravity: 0.25,
                opacity: 1,
                life: 1
            });
        }
    }
    
    explode(x, y) {
        this.createConfetti(x, y);
        this.animate();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const p = this.confetti[i];
            
            // Update
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.life -= 0.008;
            p.opacity = Math.max(0, p.life);
            
            // Draw
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
            
            // Remove dead particles
            if (p.y > this.canvas.height || p.opacity <= 0) {
                this.confetti.splice(i, 1);
            }
        }
        
        // Continue if particles exist
        if (this.confetti.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize
let confettiCannon;
document.addEventListener('DOMContentLoaded', () => {
    confettiCannon = new ConfettiCannon();
});
