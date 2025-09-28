class HandGestureDetector {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.previousY = null;
        this.jumpThreshold = 0.035; // Optimal threshold for comfortable play
        this.smoothingBuffer = [];
        this.bufferSize = 3;
        this.isInitialized = false;
        this.lastJumpTime = 0;
        this.jumpCooldown = 400; // Comfortable cooldown to prevent false triggers
        this.handVisible = false;
        this.velocityBuffer = []; // Track velocity for better detection
        this.minVelocity = 0.015; // Minimum velocity for jump detection
        
        this.initializeHands();
    }

    async initializeHands() {
        try {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults(this.onResults.bind(this));
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Error initializing MediaPipe Hands:', error);
            updateStatus('Error initializing hand detection', 'error');
        }
    }

    async startCamera() {
        try {
            const videoElement = document.getElementById('videoElement');
            
            this.camera = new Camera(videoElement, {
                onFrame: async () => {
                    if (this.hands && this.isInitialized) {
                        await this.hands.send({image: videoElement});
                    }
                },
                width: 320,
                height: 240
            });

            await this.camera.start();
            updateStatus('Camera started! Show your hand to begin gesture control', 'ready');
            
        } catch (error) {
            console.error('Error starting camera:', error);
            updateStatus('Camera access denied. Please allow camera permissions and refresh.', 'error');
        }
    }

    onResults(results) {
        const handStatusElement = document.getElementById('handStatus');
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.handVisible = true;
            handStatusElement.textContent = 'Hand detected ✋';
            
            const landmarks = results.multiHandLandmarks[0];
            this.processHandGesture(landmarks);
            
        } else {
            this.handVisible = false;
            handStatusElement.textContent = 'No hands detected';
            this.previousY = null;
            this.smoothingBuffer = [];
        }
    }

    processHandGesture(landmarks) {
        // Use multiple landmarks for better detection
        const middleFingerTip = landmarks[12];
        const indexFingerTip = landmarks[8];
        const wrist = landmarks[0];
        
        // Calculate average Y position of key points for more stable detection
        const currentY = (middleFingerTip.y + indexFingerTip.y + wrist.y) / 3;
        
        // Add to smoothing buffer
        this.smoothingBuffer.push(currentY);
        if (this.smoothingBuffer.length > this.bufferSize) {
            this.smoothingBuffer.shift();
        }
        
        // Calculate smoothed position
        const smoothedY = this.smoothingBuffer.reduce((a, b) => a + b) / this.smoothingBuffer.length;
        
        if (this.previousY !== null && this.smoothingBuffer.length === this.bufferSize) {
            // Calculate movement and velocity
            const movement = this.previousY - smoothedY;
            
            // Track velocity for more natural detection
            this.velocityBuffer.push(movement);
            if (this.velocityBuffer.length > 2) {
                this.velocityBuffer.shift();
            }
            
            // Calculate average velocity
            const avgVelocity = this.velocityBuffer.reduce((a, b) => a + b) / this.velocityBuffer.length;
            const currentTime = Date.now();
            
            // Check for upward movement that exceeds both threshold and minimum velocity
            if (movement > this.jumpThreshold && 
                avgVelocity > this.minVelocity &&
                currentTime - this.lastJumpTime > this.jumpCooldown) {
                
                this.triggerJump();
                this.lastJumpTime = currentTime;
            }
        }
        
        this.previousY = smoothedY;
    }

    triggerJump() {
        if (game) {
            game.handleJump();
            
            // Visual feedback
            const handStatusElement = document.getElementById('handStatus');
            const originalText = handStatusElement.textContent;
            handStatusElement.textContent = 'JUMP! 🦘';
            handStatusElement.style.color = '#4CAF50';
            handStatusElement.style.fontWeight = 'bold';
            
            setTimeout(() => {
                handStatusElement.textContent = originalText;
                handStatusElement.style.color = '';
                handStatusElement.style.fontWeight = '';
            }, 300);
        }
    }

    async stopCamera() {
        if (this.camera) {
            this.camera.stop();
            this.camera = null;
        }
    }

    reset() {
        this.previousY = null;
        this.smoothingBuffer = [];
        this.velocityBuffer = [];
        this.lastJumpTime = 0;
    }

    isHandVisible() {
        return this.handVisible;
    }
}

// Global hand detector instance
let handDetector = null;

// Initialize hand detection
function initHandDetection() {
    handDetector = new HandGestureDetector();
    return handDetector;
}

// Start hand detection
async function startHandDetection() {
    if (!handDetector) {
        initHandDetection();
    }
    
    try {
        await handDetector.startCamera();
    } catch (error) {
        console.error('Failed to start hand detection:', error);
        updateStatus('Failed to start camera. Game will use keyboard controls only.', 'error');
    }
}

// Stop hand detection
async function stopHandDetection() {
    if (handDetector) {
        await handDetector.stopCamera();
    }
}