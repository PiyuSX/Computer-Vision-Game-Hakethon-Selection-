// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_HEIGHT = 350;
const DINO_SIZE = 60;
const CACTUS_WIDTH = 30;
const CACTUS_HEIGHT = 60;

// Colors
const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GREEN: '#4CAF50',
    RED: '#F44336',
    GRAY: '#757575',
    GROUND: '#8D6E63',
    SKY: '#87CEEB'
};

class Dinosaur {
    constructor() {
        this.x = 100;
        this.y = GROUND_HEIGHT - DINO_SIZE;
        this.width = DINO_SIZE;
        this.height = DINO_SIZE;
        this.velocityY = 0;
        this.isJumping = false;
        this.gravity = 1;
        this.jumpStrength = -18;
        this.groundY = GROUND_HEIGHT - DINO_SIZE;
        this.animationFrame = 0;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
            return true; // Jump was successful
        }
        return false; // Already jumping
    }

    update() {
        if (this.isJumping) {
            this.y += this.velocityY;
            this.velocityY += this.gravity;

            // Check if dinosaur landed
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
        
        this.animationFrame++;
    }

    draw(ctx) {
        // Draw dinosaur body
        ctx.fillStyle = COLORS.GREEN;
        
        // Main body
        ctx.fillRect(this.x + 15, this.y + 20, this.width - 25, this.height - 25);
        
        // Head
        ctx.fillRect(this.x, this.y, 35, 30);
        
        // Tail
        ctx.fillRect(this.x + 45, this.y + 35, 15, 20);
        
        // Legs (with simple animation when running)
        const legOffset = this.isJumping ? 0 : Math.floor(this.animationFrame / 10) % 2 * 3;
        ctx.fillRect(this.x + 20, this.y + 45, 8, 15 + legOffset);
        ctx.fillRect(this.x + 35, this.y + 45, 8, 15 - legOffset);
        
        // Eye
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        
        // Simple shading
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(this.x + 2, this.y + 2, 31, 4);
        ctx.fillRect(this.x + 17, this.y + 22, this.width - 27, 4);
    }

    getCollisionBox() {
        // Slightly smaller collision box for better gameplay
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 5
        };
    }
}

class Cactus {
    constructor(x, type = 'normal') {
        this.x = x;
        this.type = type;
        this.width = CACTUS_WIDTH;
        this.height = CACTUS_HEIGHT + (type === 'tall' ? 20 : 0);
        this.y = GROUND_HEIGHT - this.height;
        this.speed = 5;
    }

    update(gameSpeed) {
        this.speed = gameSpeed;
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.GREEN;
        
        if (this.type === 'tall') {
            // Tall cactus
            ctx.fillRect(this.x + 12, this.y, 6, this.height);
            ctx.fillRect(this.x + 5, this.y + 15, 12, 6);
            ctx.fillRect(this.x + 18, this.y + 25, 12, 6);
        } else {
            // Normal cactus
            ctx.fillRect(this.x + 12, this.y, 6, this.height);
            ctx.fillRect(this.x + 5, this.y + 20, 10, 6);
            ctx.fillRect(this.x + 18, this.y + 30, 10, 6);
        }
        
        // Add some detail/shading
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(this.x + 13, this.y + 2, 2, this.height - 4);
    }

    getCollisionBox() {
        return {
            x: this.x + 5,
            y: this.y,
            width: this.width - 10,
            height: this.height
        };
    }
}

class Cloud {
    constructor(x) {
        this.x = x;
        this.y = 50 + Math.random() * 100;
        this.speed = 1 + Math.random() * 2;
        this.size = 20 + Math.random() * 15;
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.7, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 1.2, this.y, this.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
    }
}

class DinosaurGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.dinosaur = new Dinosaur();
        this.cacti = [];
        this.clouds = [];
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        this.gameSpeed = 5;
        this.spawnTimer = 0;
        this.spawnDelay = 120; // Frames between cactus spawns
        this.gameOver = false;
        this.gameStarted = false;
        this.jumpCount = 0;
        
        // Performance tracking
        this.lastTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        
        this.setupEventListeners();
        this.spawnClouds();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            } else if (e.code === 'KeyR' && this.gameOver) {
                this.resetGame();
            }
        });
    }

    spawnClouds() {
        // Add some initial clouds
        for (let i = 0; i < 3; i++) {
            this.clouds.push(new Cloud(CANVAS_WIDTH + i * 200));
        }
    }

    handleJump() {
        if (!this.gameStarted) {
            this.startGame();
        } else if (!this.gameOver) {
            if (this.dinosaur.jump()) {
                this.jumpCount++;
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        updateStatus('Game started! Jump to avoid cacti!', 'ready');
    }

    spawnCactus() {
        if (this.spawnTimer <= 0) {
            const cactusType = Math.random() < 0.3 ? 'tall' : 'normal';
            this.cacti.push(new Cactus(CANVAS_WIDTH, cactusType));
            this.spawnTimer = this.spawnDelay + Math.random() * 60 - 30;
        } else {
            this.spawnTimer--;
        }
    }

    updateCacti() {
        for (let i = this.cacti.length - 1; i >= 0; i--) {
            const cactus = this.cacti[i];
            cactus.update(this.gameSpeed);
            
            if (cactus.x + cactus.width < 0) {
                this.cacti.splice(i, 1);
                this.score += 10;
            }
        }
    }

    updateClouds() {
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            cloud.update();
            
            if (cloud.x + cloud.size * 2 < 0) {
                this.clouds.splice(i, 1);
            }
        }
        
        // Spawn new clouds
        if (Math.random() < 0.01) {
            this.clouds.push(new Cloud(CANVAS_WIDTH + 50));
        }
    }

    checkCollisions() {
        const dinoBox = this.dinosaur.getCollisionBox();
        
        for (const cactus of this.cacti) {
            const cactusBox = cactus.getCollisionBox();
            
            if (dinoBox.x < cactusBox.x + cactusBox.width &&
                dinoBox.x + dinoBox.width > cactusBox.x &&
                dinoBox.y < cactusBox.y + cactusBox.height &&
                dinoBox.y + dinoBox.height > cactusBox.y) {
                this.endGame();
                break;
            }
        }
    }

    endGame() {
        this.gameOver = true;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
        }
        updateStatus('Game Over! Press R to restart or click Reset Game', 'error');
    }

    update(currentTime) {
        if (!this.gameStarted || this.gameOver) return;

        // Calculate FPS
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        this.frameCount++;

        this.dinosaur.update();
        this.spawnCactus();
        this.updateCacti();
        this.updateClouds();
        this.checkCollisions();

        // Increase difficulty over time
        if (this.score > 0 && this.score % 100 === 0) {
            this.gameSpeed = Math.min(this.gameSpeed + 0.1, 12);
        }
    }

    draw() {
        // Clear canvas with sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, COLORS.SKY);
        gradient.addColorStop(1, '#E1F5FE');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw clouds
        for (const cloud of this.clouds) {
            cloud.draw(this.ctx);
        }

        // Draw ground
        this.ctx.fillStyle = COLORS.GROUND;
        this.ctx.fillRect(0, GROUND_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);
        
        // Draw ground pattern
        this.ctx.fillStyle = '#6D4C41';
        for (let x = 0; x < CANVAS_WIDTH; x += 20) {
            this.ctx.fillRect(x, GROUND_HEIGHT, 2, CANVAS_HEIGHT - GROUND_HEIGHT);
        }

        // Draw game objects
        this.dinosaur.draw(this.ctx);
        for (const cactus of this.cacti) {
            cactus.draw(this.ctx);
        }

        // Draw UI
        this.drawUI();
    }

    drawUI() {
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = COLORS.BLACK;
        
        // Score
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.ctx.fillText(`High Score: ${this.highScore}`, 20, 70);

        // Game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = COLORS.WHITE;
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            this.ctx.fillText(`High Score: ${this.highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
            this.ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
            
            this.ctx.textAlign = 'left';
        } else if (!this.gameStarted) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            this.ctx.fillStyle = COLORS.WHITE;
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Dinosaur Game', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
            
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Raise your hand up to jump!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
            this.ctx.fillText('Or press SPACEBAR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
            this.ctx.fillText('Jump to start!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
            
            this.ctx.textAlign = 'left';
        }
    }

    resetGame() {
        this.dinosaur = new Dinosaur();
        this.cacti = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.spawnTimer = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.jumpCount = 0;
        this.spawnClouds();
        updateStatus('Game reset! Raise your hand or press SPACE to jump and start!', 'waiting');
    }

    getStats() {
        return {
            score: this.score,
            jumpCount: this.jumpCount,
            fps: this.fps,
            gameSpeed: Math.round(this.gameSpeed * 10) / 10
        };
    }
}

// Global game instance
let game = null;

// Initialize game
function initGame() {
    game = new DinosaurGame('gameCanvas');
    return game;
}

// Update status display
function updateStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
}