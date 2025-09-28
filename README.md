# Google Dinosaur Game - Hand Gesture Control 🦕

A web-based recreation of the classic Google Chrome dinosaur game with **hand gesture control** using computer vision! Control the dinosaur by raising your hand up quickly to make it jump over obstacles.

## 🚀 Features

- **Hand Gesture Control**: Use MediaPipe to detect hand gestures for jumping
- **Classic Gameplay**: Faithful recreation of the original dinosaur game mechanics
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Monitoring**: Real-time FPS and game statistics
- **Fallback Controls**: Keyboard support (spacebar) when camera is unavailable
- **Visual Feedback**: Camera feed with hand detection visualization
- **Progressive Difficulty**: Game speed increases as score gets higher
- **High Score Tracking**: Saves your best score locally

## 🎮 How to Play

1. **Allow Camera Access**: The game needs camera permissions to detect hand gestures
2. **Position Your Hand**: Keep your hand visible in the camera feed area
3. **Jump Gesture**: Raise your hand up quickly to make the dinosaur jump
4. **Alternative Control**: Press the spacebar as a backup control method
5. **Avoid Obstacles**: Jump over cacti to increase your score
6. **Survive**: The game gets faster as your score increases!

## 🛠️ Technology Stack

- **HTML5 Canvas**: For game rendering and animations
- **JavaScript**: Core game logic and controls
- **MediaPipe**: Advanced hand gesture recognition
- **WebRTC**: Camera access and video processing
- **CSS3**: Modern responsive design with gradients and animations

## 📁 Project Structure

```
Computer Vision/
├── index.html          # Main HTML file with game interface
├── game.js            # Core game logic (Dinosaur, Cactus, Game classes)
├── hand-detection.js  # Hand gesture detection using MediaPipe
├── main.js           # Application controller and initialization
└── README.md         # This file
```

## 🚀 Getting Started

1. **Open the Game**: Simply open `index.html` in a modern web browser
2. **Allow Permissions**: Grant camera access when prompted
3. **Start Playing**: Click "Start Game" or raise your hand to begin!

## 🎯 Game Controls

| Control | Action |
|---------|--------|
| **Hand Gesture** | Raise hand up quickly to jump |
| **Spacebar** | Alternative jump control |
| **R Key** | Restart game (when game over) |

## 📊 Game Mechanics

- **Scoring**: 10 points per cactus avoided
- **Speed**: Increases every 100 points
- **Jump Physics**: Realistic gravity and jump mechanics
- **Collision Detection**: Precise hit-box collision system
- **Obstacle Variety**: Different types and heights of cacti

## 🔧 Technical Features

### Hand Gesture Detection
- Uses MediaPipe Hands solution for real-time hand tracking
- Smoothing algorithm to reduce false positives
- Jump cooldown to prevent multiple jumps from single gesture
- Visual feedback when jump gesture is detected

### Game Engine
- 60 FPS game loop with requestAnimationFrame
- Efficient object pooling for performance
- Canvas-based rendering with hardware acceleration
- Responsive design that adapts to different screen sizes

### Performance Optimizations
- Efficient collision detection algorithms
- Smart object culling for off-screen elements
- Frame rate monitoring and performance warnings
- Optimized rendering pipeline

## 🌟 Advanced Features

- **Cloud Background**: Animated clouds for visual appeal
- **Ground Texture**: Detailed ground rendering with patterns
- **Dinosaur Animation**: Running animation with leg movement
- **Multiple Cactus Types**: Various obstacle shapes and sizes
- **Score Persistence**: High score saved in browser storage
- **Pause/Resume**: Automatic pause when tab is not active

## 🔍 Troubleshooting

### Camera Issues
- **No Camera Access**: Check browser permissions in settings
- **Poor Detection**: Ensure good lighting and clear background
- **High CPU Usage**: Close other applications for better performance

### Performance Issues
- **Low FPS**: Try disabling camera if performance is poor
- **Lag**: Use a modern browser with hardware acceleration enabled
- **Mobile Issues**: Some mobile browsers may have limited MediaPipe support

## 🌐 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Limited MediaPipe support
- **Edge**: Full support
- **Mobile**: Varies by device and browser

## 🎨 Customization

The game is highly customizable! You can modify:

- **Game Speed**: Adjust difficulty in `game.js`
- **Jump Sensitivity**: Modify threshold in `hand-detection.js`
- **Visual Style**: Update colors and styling in `index.html`
- **Game Physics**: Tweak gravity and jump strength in `game.js`

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Power-ups and special abilities
- Multiple dinosaur characters
- Different environments and themes
- Multiplayer support
- Mobile app version

## 📝 License

This project is open source and available under the MIT License.

## 🎮 Have Fun!

Enjoy playing the Dinosaur Game with hand gesture controls! This project demonstrates the exciting possibilities of combining classic gaming with modern computer vision technology.

---

**Made with ❤️ using MediaPipe, HTML5 Canvas, and JavaScript**