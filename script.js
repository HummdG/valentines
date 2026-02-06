// Optimized Valentine's Day Proposal Script

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2000);
});

// Get elements
const proposalPage = document.getElementById('proposal-page');
const planPage = document.getElementById('plan-page');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// No button cycling messages
let noClickCount = 0;
const noButtonTexts = [
    "No",
    "Wait... are you sure?",
    "Really? 🥺",
    "But think about it!",
    "You know you want to...",
    "Come on! 💕",
    "Pretty please?",
    "The rose is waiting! 🌹",
    "Just say yes already!",
    "I know you want to say yes!",
    "Okay fine, keep clicking... 😤",
    "Still here? Just say yes! 💖"
];

// Handle No button click - cycles through messages
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    noClickCount++;
    
    // Update text
    const textIndex = Math.min(noClickCount, noButtonTexts.length - 1);
    noBtn.textContent = noButtonTexts[textIndex];
    
    // Shrink button after many clicks
    if (noClickCount >= 5) {
        const shrinkFactor = Math.max(0.5, 1 - (noClickCount - 5) * 0.05);
        noBtn.style.transform = `scale(${shrinkFactor})`;
    }
    
    // Add shrinking animation class
    noBtn.classList.add('shrinking');
    setTimeout(() => {
        noBtn.classList.remove('shrinking');
    }, 300);
    
    // Fade out after 10 clicks
    if (noClickCount >= 10) {
        noBtn.style.opacity = '0.3';
        noBtn.style.cursor = 'not-allowed';
    }
});

// Handle Yes button click - THE MAGICAL MOMENT!
yesBtn.addEventListener('click', () => {
    // Grow animation
    yesBtn.style.transform = 'scale(1.2)';
    
    // Get button position for confetti
    const btnRect = yesBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    // CONFETTI EXPLOSION!
    if (confettiCannon) {
        confettiCannon.explode(btnCenterX, btnCenterY);
    }
    
    setTimeout(() => {
        // Hide proposal page
        proposalPage.classList.remove('active');
        
        // Show plan page with rose
        planPage.classList.add('active');
        
        // Initialize 3D Rose - wait for it to be available
        const initRose = () => {
            if (window.rose3D) {
                console.log('Initializing rose from Yes button');
                window.rose3D.init();
            } else {
                console.log('Waiting for rose3D to load...');
                setTimeout(initRose, 50);
            }
        };
        setTimeout(initRose, 100);
        
        // Reset yes button
        yesBtn.style.transform = 'scale(1)';
        
        // Store that she said yes
        localStorage.setItem('saidYes', 'true');
        localStorage.setItem('yesDate', new Date().toISOString());
    }, 800);
});

// Check if she already said yes
window.addEventListener('load', () => {
    const saidYes = localStorage.getItem('saidYes');
    if (saidYes === 'true') {
        const yesDate = localStorage.getItem('yesDate');
        console.log('💕 She said yes on:', new Date(yesDate).toLocaleString());
        
        // If she already said yes and the page is refreshed on the plan page,
        // re-initialize the 3D rose
        if (planPage.classList.contains('active')) {
            const initRose = () => {
                if (window.rose3D) {
                    console.log('Re-initializing rose on page load');
                    window.rose3D.init();
                } else {
                    setTimeout(initRose, 50);
                }
            };
            setTimeout(initRose, 100);
        }
    }
});
