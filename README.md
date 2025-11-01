Access here: https://moonlit-parfait-d74a31.netlify.app/

# Math Adventure - Kids Learning App

A fun and interactive mathematics learning game designed for children under 12 years old, featuring smooth animations and engaging gameplay.

## Features

### 🎮 Game Modes
- **Three Difficulty Levels:**
  - Easy (1-10)
  - Medium (1-50)
  - Hard (1-100)

### ➕ Four Operations
- Addition
- Subtraction
- Multiplication
- Division

### 🌟 Engaging Features
- **Smooth Animations:** Canvas-based particle effects and floating elements
- **Scoring System:** Earn points for correct answers with streak bonuses
- **Lives System:** 3 lives to keep the challenge fun
- **Timer:** 60-second countdown to add excitement
- **Streak Bonuses:** Extra points for consecutive correct answers
- **Colorful UI:** Kid-friendly design with bright colors and fun characters

## How to Play

1. **Choose Your Level:** Select Easy, Medium, or Hard difficulty
2. **Pick an Operation:** Choose Addition, Subtraction, Multiplication, or Division
3. **Click "Start Adventure!"** to begin
4. **Answer Questions:** Type your answer and press Enter or click Submit
5. **Watch Your Score:** Earn points and try to beat your high score!

## Installation & Running

### Option 1: Direct Browser Opening
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then open your browser and navigate to `http://localhost:8000`

## Files Structure

```
windsurf-project/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── game.js         # Game logic and canvas animations
└── README.md       # This file
```

## Educational Benefits

- **Mental Math Practice:** Improves calculation speed
- **Pattern Recognition:** Helps identify number relationships
- **Problem Solving:** Encourages quick thinking
- **Confidence Building:** Positive reinforcement through animations
- **Progressive Learning:** Multiple difficulty levels to grow with the child

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

You can easily customize:
- **Time Limit:** Change `this.timeLeft = 60` in `game.js`
- **Lives:** Modify `this.lives = 3` in `game.js`
- **Colors:** Edit the gradient values in `styles.css`
- **Number Ranges:** Adjust the `ranges` object in `generateQuestion()` method

## Tips for Parents

- Start with Easy difficulty and Addition
- Encourage children to beat their own high scores
- Use the streak system to motivate consistent practice
- Take breaks between sessions to avoid fatigue
- Celebrate achievements and progress!

## Future Enhancements (Ideas)

- Sound effects for correct/wrong answers
- More character animations
- Achievement badges
- Progress tracking over time
- Mixed operations mode
- Multiplayer mode

---

Made with ❤️ for young learners
