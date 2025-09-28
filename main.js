// Main application controller
class GameController {
    constructor() {
        this.game = null;
        this.handDetector = null;
        this.gameLoop = null;
        this.isRunning = false;
        this.cameraEnabled = true;
        this.instructionsVisible = true;
    }

    async initialize() {
        try {
            // Initialize game
            this.game = initGame();
            
            // Initialize hand detection
            this.handDetector = initHandDetection();
            
            // Start the game loop
            this.startGameLoop();
            
            // Auto-start camera
            await this.startCamera();
            
            updateStatus('Ready to play! Raise your hand to jump and start the game!', 'ready');
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            updateStatus('Initialization failed. Some features may not work.', 'error');
        }
    }

    async startCamera() {
        if (this.handDetector && this.cameraEnabled) {
            try {
                await this.handDetector.startCamera();
            } catch (error) {
                console.error('Camera start failed:', error);
            }
        }
    }

    async stopCamera() {
        if (this.handDetector) {
            await this.handDetector.stopCamera();
        }
    }

    startGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        this.isRunning = true;
        
        const loop = (currentTime) => {
            if (this.isRunning) {
                // Update game
                if (this.game) {
                    this.game.update(currentTime);
                    this.game.draw();
                    
                    // Update performance display
                    this.updatePerformanceDisplay();
                }
                
                this.gameLoop = requestAnimationFrame(loop);
            }
        };
        
        this.gameLoop = requestAnimationFrame(loop);
    }

    stopGameLoop() {
        this.isRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    updatePerformanceDisplay() {
        if (!this.game) return;
        
        const stats = this.game.getStats();
        
        document.getElementById('scoreDisplay').textContent = stats.score;
        document.getElementById('jumpCount').textContent = stats.jumpCount;
        document.getElementById('fpsDisplay').textContent = stats.fps;
    }

    async toggleCamera() {
        this.cameraEnabled = !this.cameraEnabled;
        
        if (this.cameraEnabled) {
            await this.startCamera();
            updateStatus('Camera enabled', 'ready');
        } else {
            await this.stopCamera();
            updateStatus('Camera disabled - using keyboard controls only', 'waiting');
        }
        
        // Update button text
        const toggleBtn = document.querySelector('button[onclick="toggleCamera()"]');
        toggleBtn.textContent = this.cameraEnabled ? 'Disable Camera' : 'Enable Camera';
    }

    resetGame() {
        if (this.game) {
            this.game.resetGame();
        }
        if (this.handDetector) {
            this.handDetector.reset();
        }
    }
}

// Global controller instance
let gameController = null;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for MediaPipe libraries to load
    const waitForMediaPipe = () => {
        return new Promise((resolve) => {
            const checkLibraries = () => {
                if (typeof Hands !== 'undefined' && typeof Camera !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(checkLibraries, 100);
                }
            };
            checkLibraries();
        });
    };
    
    try {
        // Wait up to 10 seconds for libraries to load
        await Promise.race([
            waitForMediaPipe(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        gameController = new GameController();
        await gameController.initialize();
        
    } catch (error) {
        console.error('Initialization error:', error);
        
        // Initialize without camera if MediaPipe fails
        gameController = new GameController();
        gameController.game = initGame();
        gameController.startGameLoop();
        
        updateStatus('Game loaded in keyboard-only mode. Press SPACEBAR to jump!', 'waiting');
    }
});

// Global functions for HTML button handlers
async function startGame() {
    if (gameController && gameController.game) {
        gameController.game.startGame();
    }
}

function resetGame() {
    if (gameController) {
        gameController.resetGame();
    }
}

async function toggleCamera() {
    if (gameController) {
        await gameController.toggleCamera();
    }
}

function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    const toggleBtn = document.querySelector('button[onclick="toggleInstructions()"]');
    
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
        toggleBtn.textContent = 'Hide Instructions';
    } else {
        instructions.style.display = 'none';
        toggleBtn.textContent = 'Show Instructions';
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (gameController) {
        if (document.hidden) {
            // Pause when tab is not visible
            gameController.stopGameLoop();
        } else {
            // Resume when tab becomes visible
            gameController.startGameLoop();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', async () => {
    if (gameController) {
        gameController.stopGameLoop();
        await gameController.stopCamera();
    }
});

// Error handling for MediaPipe
window.addEventListener('error', (event) => {
    if (event.error && event.error.message.includes('MediaPipe')) {
        console.error('MediaPipe error:', event.error);
        updateStatus('Hand detection error - using keyboard controls', 'error');
    }
});

// Performance monitoring
let performanceWarningShown = false;

function monitorPerformance() {
    if (gameController && gameController.game && !performanceWarningShown) {
        const stats = gameController.game.getStats();
        
        if (stats.fps < 30 && stats.fps > 0) {
            console.warn('Low FPS detected:', stats.fps);
            updateStatus('Low performance detected. Consider closing other applications.', 'error');
            performanceWarningShown = true;
        }
    }
}

// Monitor performance every 5 seconds
setInterval(monitorPerformance, 5000);