// Countdown Timer
let countdownValue = 10;
let countdownInterval;

function startCountdown() {
  const timerElement = document.getElementById('timer');

  countdownInterval = setInterval(() => {
    countdownValue--;
    if (timerElement) {
      timerElement.textContent = countdownValue;
    }

    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
      redirectToApp();
    }
  }, 1000);
}

// Redirect to main app
function redirectToApp() {
  clearInterval(countdownInterval);
  
  // Add fade out animation
  const container = document.querySelector('.launch-container');
  if (container) {
    container.style.animation = 'fadeOutTransition 0.8s ease-out forwards';
  }

  // Redirect after animation
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

// Skip animation
function skipAnimation() {
  clearInterval(countdownInterval);
  
  const container = document.querySelector('.launch-container');
  if (container) {
    container.style.animation = 'fadeOutTransition 0.5s ease-out forwards';
  }

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

// Add fade out animation to CSS (if not already there)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOutTransition {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(1.05);
    }
  }
`;
document.head.appendChild(style);

// Start countdown on page load
window.addEventListener('load', () => {
  startCountdown();
});

// Optional: Analytics tracking
function trackLaunchPageView() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'launch_page_view');
  }
}

function trackCTAClick(buttonType) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'launch_cta_click', {
      button_type: buttonType
    });
  }
}

// Track page view on load
window.addEventListener('load', trackLaunchPageView);

// Add tracking to buttons
document.querySelector('.btn-primary')?.addEventListener('click', () => {
  trackCTAClick('primary');
});

document.querySelector('.btn-secondary')?.addEventListener('click', () => {
  trackCTAClick('secondary');
});

// Prevent accidental back navigation
window.addEventListener('beforeunload', (e) => {
  if (countdownValue > 0) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Add smooth scroll for any future links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
