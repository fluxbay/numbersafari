// Telegram Mini App Integration
class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.init();
    }
    
    init() {
        if (this.tg) {
            // Expand the app to full height
            this.tg.expand();
            
            // Enable closing confirmation
            this.tg.enableClosingConfirmation();
            
            // Set header color to match app theme
            this.tg.setHeaderColor('#667eea');
            this.tg.setBackgroundColor('#667eea');
            
            // Ready to show
            this.tg.ready();
            
            // Handle back button
            this.tg.BackButton.onClick(() => {
                this.handleBackButton();
            });
            
            console.log('Telegram WebApp initialized');
        }
    }
    
    handleBackButton() {
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');
        const gameOverScreen = document.getElementById('game-over');
        
        if (!gameScreen.classList.contains('hidden')) {
            // Show confirmation before leaving game
            if (confirm('Are you sure you want to quit the game?')) {
                window.location.reload();
            }
        } else if (!gameOverScreen.classList.contains('hidden')) {
            window.location.reload();
        } else {
            this.tg.close();
        }
    }
    
    showBackButton() {
        if (this.tg) {
            this.tg.BackButton.show();
        }
    }
    
    hideBackButton() {
        if (this.tg) {
            this.tg.BackButton.hide();
        }
    }
    
    sendData(data) {
        if (this.tg) {
            this.tg.sendData(JSON.stringify(data));
        }
    }
    
    getUserInfo() {
        if (this.tg) {
            return {
                id: this.tg.initDataUnsafe?.user?.id,
                firstName: this.tg.initDataUnsafe?.user?.first_name,
                lastName: this.tg.initDataUnsafe?.user?.last_name,
                username: this.tg.initDataUnsafe?.user?.username,
                languageCode: this.tg.initDataUnsafe?.user?.language_code
            };
        }
        return null;
    }
    
    showMainButton(text, callback) {
        if (this.tg) {
            this.tg.MainButton.setText(text);
            this.tg.MainButton.show();
            this.tg.MainButton.onClick(callback);
        }
    }
    
    hideMainButton() {
        if (this.tg) {
            this.tg.MainButton.hide();
        }
    }
    
    hapticFeedback(type = 'impact', style = 'medium') {
        if (this.tg && this.tg.HapticFeedback) {
            if (type === 'impact') {
                this.tg.HapticFeedback.impactOccurred(style);
            } else if (type === 'notification') {
                this.tg.HapticFeedback.notificationOccurred(style);
            } else if (type === 'selection') {
                this.tg.HapticFeedback.selectionChanged();
            }
        }
    }
}

// Initialize Telegram integration
window.telegramApp = new TelegramIntegration();
