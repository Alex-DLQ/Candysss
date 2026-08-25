const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const container = document.getElementById('btn-container');
const screenQuestion = document.getElementById('screen-question');
const screenLove = document.getElementById('screen-love');
const heartsContainer = document.querySelector('.hearts-bg');
const iframeMusic = document.getElementById('youtube-music');
const btnPlayMusic = document.getElementById('btn-play-music');

/* ===== 1. CORAZONES DE FONDO ===== */
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = ['❤','💜','💖','💗'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 25 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
}
setInterval(createFloatingHeart, 600);
for (let i = 0; i < 15; i++) createFloatingHeart();

/* ===== 2. VARIABLES ===== */
let yesScale = 1;
const MAX_SCALE = 5;

/* ===== 3. BOTÓN NO: HUYE ===== */
function moveNoButton() {
    btnNo.classList.add('running');
    
    const rect = container.getBoundingClientRect();
    const noW = btnNo.offsetWidth;
    const noH = btnNo.offsetHeight;
    
    const padding = 10;
    const maxX = rect.width - noW - padding;
    const maxY = rect.height - noH - padding;
    
    const x = Math.random() * Math.max(padding, maxX);
    const y = Math.random() * Math.max(padding, maxY);
    
    btnNo.style.left = x + 'px';
    btnNo.style.top = y + 'px';
    
    growYesButton(0.5);
}

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, {passive: false});
btnNo.addEventListener('click', (e) => { e.preventDefault(); moveNoButton(); });

/* ===== 4. BOTÓN SÍ: CRECE ===== */
function growYesButton(amount = 0.6) {
    yesScale += amount;
    btnYes.style.transform = `scale(${yesScale})`;
    if (yesScale >= MAX_SCALE) showLoveScreen();
}

btnYes.addEventListener('click', () => {
    if (yesScale > 2.5) showLoveScreen();
    else growYesButton(1.0);
});

/* ===== 5. MOSTRAR PANTALLA DE AMOR ===== */
function showLoveScreen() {
    screenQuestion.classList.remove('active');
    screenLove.classList.add('active');
    setTimeout(initFireworks, 100);
    loadMusic();
}

/* ===== 6. MÚSICA ===== */
function loadMusic() {
    const videoId = 'DGjE4P4qEp0';
    iframeMusic.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
    btnPlayMusic.style.display = 'none';
}

btnPlayMusic.addEventListener('click', () => {
    loadMusic();
    btnPlayMusic.style.display = 'none';
});

/* ===== 7. FUEGOS ARTIFICIALES ===== */
function initFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const particles = [];
    const colors = ['#ff6b9d','#ff8fab','#c44569','#ffd700','#ff4757','#ff6348','#ffa502','#ff9ff3','#f368e0','#70a1ff'];

    class Particle {
        constructor(x, y, color, vx, vy) {
            this.x = x; this.y = y;
            this.color = color;
            this.vx = vx; this.vy = vy;
            this.alpha = 1;
            this.friction = 0.96;
            this.gravity = 0.05;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.007;
        }
    }

    function createFirework(x, y) {
        const count = 70;
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 4 + 2;
            particles.push(new Particle(x, y, color, Math.cos(angle)*speed, Math.sin(angle)*speed));
        }
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push(new Particle(x, y, colors[Math.floor(Math.random()*colors.length)], Math.cos(angle)*speed, Math.sin(angle)*speed));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(10, 10, 26, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
    }
    animate();

    setTimeout(() => createFirework(canvas.width*0.25, canvas.height*0.35), 400);
    setTimeout(() => createFirework(canvas.width*0.75, canvas.height*0.3), 700);
    setTimeout(() => createFirework(canvas.width*0.5, canvas.height*0.25), 1100);
    setTimeout(() => createFirework(canvas.width*0.35, canvas.height*0.4), 1500);
    
    setInterval(() => {
        createFirework(Math.random()*canvas.width, Math.random()*(canvas.height*0.5)+50);
    }, 1000);
    
    canvas.addEventListener('click', (e) => createFirework(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        createFirework(t.clientX, t.clientY);
    });
}