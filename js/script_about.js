
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('earthVideo');

    if (video) {
        video.muted = true; 
        
        video.play().catch(error => {
            console.log("자동 재생이 차단되어 클릭 대기 상태로 전환합니다.");
            
            
            document.addEventListener('click', () => {
                video.play();
            }, { once: true });
        });
    }
});







const marsVideo = document.getElementById('marsVideo');
const marsStats = document.getElementById('marsStats');
let statsTriggered = false;

const marsVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            marsVideo.classList.add('visible');
            marsVideo.play();
            marsVideoObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

marsVideoObserver.observe(marsVideo);

marsVideo.addEventListener('ended', () => {
    if (!statsTriggered) {
        statsTriggered = true;
        marsStats.classList.add('visible');
        triggerScramble();
    }
});

function triggerScramble() {
    document.querySelectorAll('.about__number').forEach(el => {
        if (el.id === 'yearNumber') scrambleYear(el);
        else scrambleNumber(el);
    });
}

function scrambleNumber(el) {
    const target   = el.dataset.target;
    const suffix   = el.dataset.suffix || '';
    const decimal  = parseInt(el.dataset.decimal) || 0;
    const chars    = '0123456789';
    const duration = 1200;
    const interval = 40;
    let elapsed    = 0;

    const timer = setInterval(() => {
        elapsed += interval;
        if (elapsed / duration >= 1) {
            el.textContent = formatNumber(target, decimal) + suffix;
            clearInterval(timer);
            return;
        }
        el.textContent = target.split('').map(char => {
            if (char === '.' || char === ',') return char;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('') + suffix;
    }, interval);
}

function formatNumber(val, decimal) {
    const num = parseFloat(val);
    if (decimal > 0) return num.toFixed(decimal);
    return Math.round(num).toLocaleString();
}

function scrambleYear(el) {
    const target   = el.dataset.target;
    const chars    = '0123456789';
    const duration = 1200;
    const interval = 40;
    let elapsed    = 0;

    const timer = setInterval(() => {
        elapsed += interval;
        if (elapsed / duration >= 1) {
            el.textContent = target;
            clearInterval(timer);
            return;
        }
        el.textContent = target.split('').map(() =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }, interval);
}

