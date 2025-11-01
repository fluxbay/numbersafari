class MathGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.currentQuestion = null;
        this.difficulty = 'easy';
        this.operation = 'add';
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.timer = null;
        this.particles = [];
        this.stars = [];
        this.telegram = window.telegramApp;
        
        this.initElements();
        this.initCanvas();
        this.setupEventListeners();
        this.createStars();
        this.initTelegramFeatures();
    }
    
    initTelegramFeatures() {
        // Get user info from Telegram if available
        if (this.telegram && this.telegram.tg) {
            const userInfo = this.telegram.getUserInfo();
            if (userInfo && userInfo.firstName) {
                console.log(`Welcome ${userInfo.firstName}!`);
            }
        }
    }
    
    initElements() {
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over');
        this.scoreEl = document.getElementById('score');
        this.livesEl = document.getElementById('lives');
        this.timeEl = document.getElementById('time');
        this.questionEl = document.getElementById('question');
        this.answerInput = document.getElementById('answer');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    initCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('[data-level]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.difficulty = e.target.dataset.level;
            });
        });
        
        // Operation selection
        document.querySelectorAll('[data-op]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-op]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.operation = e.target.dataset.op;
            });
        });
        
        // Start game
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        
        // Submit answer - prevent button from stealing focus
        const submitBtn = document.getElementById('submit-answer');
        
        // Prevent button from taking focus on mousedown/touchstart
        submitBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        submitBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.checkAnswer();
            // Immediately refocus input
            setTimeout(() => this.answerInput.focus(), 0);
        });
        
        // Enter key to submit
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkAnswer();
            }
        });
        
        // Prevent input from losing focus during game
        this.answerInput.addEventListener('blur', (e) => {
            // Only refocus if game is active
            if (!this.gameScreen.classList.contains('hidden')) {
                setTimeout(() => this.answerInput.focus(), 0);
            }
        });
        
        // Play again
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.correctAnswers = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.updateDisplay();
        this.generateQuestion();
        this.startTimer();
        this.animate();
        
        // Focus on input and keep keyboard open
        setTimeout(() => {
            this.answerInput.value = '';
            this.answerInput.focus();
        }, 100);
        
        // Show Telegram back button
        if (this.telegram) {
            this.telegram.showBackButton();
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timeEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    generateQuestion() {
        const ranges = {
            easy: 10,
            medium: 50,
            hard: 100
        };
        
        const max = ranges[this.difficulty];
        let num1 = Math.floor(Math.random() * max) + 1;
        let num2 = Math.floor(Math.random() * max) + 1;
        let answer;
        let questionText;
        
        switch(this.operation) {
            case 'add':
                answer = num1 + num2;
                questionText = `${num1} + ${num2} = ?`;
                break;
            case 'subtract':
                if (num1 < num2) [num1, num2] = [num2, num1];
                answer = num1 - num2;
                questionText = `${num1} - ${num2} = ?`;
                break;
            case 'multiply':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                questionText = `${num1} × ${num2} = ?`;
                break;
            case 'divide':
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = Math.floor(Math.random() * 12) + 1;
                num1 = num2 * answer;
                questionText = `${num1} ÷ ${num2} = ?`;
                break;
        }
        
        this.currentQuestion = { answer, questionText };
        this.questionEl.textContent = questionText;
    }
    
    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.shakeInput();
            return;
        }
        
        if (userAnswer === this.currentQuestion.answer) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }
    
    correctAnswer() {
        this.score += 10;
        this.correctAnswers++;
        this.currentStreak++;
        this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        
        // Bonus points for streaks
        if (this.currentStreak >= 3) {
            this.score += 5 * this.currentStreak;
        }
        
        this.updateDisplay();
        this.createParticles(true);
        this.playCorrectAnimation();
        
        // Telegram haptic feedback
        if (this.telegram) {
            this.telegram.hapticFeedback('notification', 'success');
        }
        
        // Clear input and keep focus
        this.answerInput.value = '';
        
        setTimeout(() => {
            this.generateQuestion();
            // Ensure focus stays on input
            this.answerInput.focus();
        }, 800);
    }
    
    wrongAnswer() {
        this.lives--;
        this.currentStreak = 0;
        this.updateDisplay();
        this.createParticles(false);
        this.shakeInput();
        
        // Telegram haptic feedback
        if (this.telegram) {
            this.telegram.hapticFeedback('notification', 'error');
        }
        
        if (this.lives <= 0) {
            this.endGame();
        } else {
            // Clear input and keep focus
            this.answerInput.value = '';
            
            setTimeout(() => {
                this.generateQuestion();
                // Ensure focus stays on input
                this.answerInput.focus();
            }, 800);
        }
    }
    
    updateDisplay() {
        this.scoreEl.textContent = this.score;
        this.livesEl.textContent = '❤️'.repeat(this.lives);
    }
    
    playCorrectAnimation() {
        this.questionEl.classList.add('correct-animation');
        setTimeout(() => this.questionEl.classList.remove('correct-animation'), 500);
    }
    
    shakeInput() {
        this.answerInput.classList.add('wrong-animation');
        setTimeout(() => this.answerInput.classList.remove('wrong-animation'), 500);
    }
    
    createParticles(isCorrect) {
        const colors = isCorrect ? 
            ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'] : 
            ['#FF6B6B', '#C44569', '#FFA07A'];
        
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                life: 1
            });
        }
    }
    
    createStars() {
        for (let i = 0; i < 30; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random()
            });
        }
    }
    
    animate() {
        if (this.gameOverScreen.classList.contains('hidden')) {
            requestAnimationFrame(() => this.animate());
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw and update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            
            star.opacity = Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw and update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.life -= 0.02;
            
            if (p.life > 0) {
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
                return true;
            }
            return false;
        });
        
        // Draw score streak indicator
        if (this.currentStreak >= 3) {
            this.ctx.fillStyle = '#FFD93D';
            this.ctx.font = 'bold 24px Comic Neue';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`🔥 ${this.currentStreak} Streak!`, this.canvas.width / 2, 40);
        }
    }
    
    endGame() {
        clearInterval(this.timer);
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('correct-answers').textContent = this.correctAnswers;
        document.getElementById('best-streak').textContent = this.bestStreak;
    }
    
    resetGame() {
        this.gameOverScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
        this.particles = [];
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new MathGame();
});
