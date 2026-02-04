class ModernFireworks {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.continuousMode = false;
        this.cw = window.innerWidth;
        this.ch = window.innerHeight;

        // Configuration
        this.gravity = 0.06;
        this.friction = 0.97;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Explode at a random position in center area
    explodeAt(x, y) {
        const particleCount = 80; // Increased for denser fireworks
        const hue = this.random(0, 360);

        for (let i = 0; i < particleCount; i++) {
            const angle = this.random(0, Math.PI * 2);
            const speed = this.random(2, 7);

            const particleHue = hue + this.random(-30, 30);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: particleHue,
                brightness: this.random(50, 80),
                alpha: 1,
                size: this.random(2, 4), // Smaller particles
                decay: this.random(0.02, 0.04) // Faster decay
            });
        }
    }

    // Create explosion at random center position
    randomExplosion() {
        // Center area: 20%-80% width, 20%-60% height
        const x = this.random(this.cw * 0.2, this.cw * 0.8);
        const y = this.random(this.ch * 0.2, this.ch * 0.6);
        this.explodeAt(x, y);
    }

    // Main animation loop
    loop() {
        if (!this.running) {
            this.ctx.clearRect(0, 0, this.cw, this.ch);
            return;
        }

        requestAnimationFrame(() => this.loop());

        // Fade effect
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, this.cw, this.ch);

        this.ctx.globalCompositeOperation = 'lighter';

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Physics
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= this.friction;
            p.vy *= this.friction;
            p.vy += this.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw Particle (no glow for performance)
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
            this.ctx.fill();
        }

        // Reset shadow for performance
        this.ctx.shadowBlur = 0;
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }

    // Launch initial sequence of explosions
    fireSequence() {
        if (!this.running) this.start();

        // Multiple explosions in quick succession
        const count = 8;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.randomExplosion();
            }, i * 200);
        }
    }

    // Continuous explosions - keeps going until stopped
    startContinuous() {
        if (!this.running) this.start();
        this.continuousMode = true;
        this._continuousLoop();
    }

    _continuousLoop() {
        if (!this.continuousMode) return;

        // 2-4 explosions at a time (increased for denser effect)
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.continuousMode) this.randomExplosion();
            }, i * 100); // Faster succession
        }

        // Faster interval for denser fireworks
        setTimeout(() => this._continuousLoop(), 200 + Math.random() * 200);
    }

    stopContinuous() {
        this.continuousMode = false;
        // Let existing particles fade out naturally
        setTimeout(() => {
            if (!this.continuousMode) {
                this.stop();
            }
        }, 2000);
    }
}

// Attach to window
window.ModernFireworks = ModernFireworks;
