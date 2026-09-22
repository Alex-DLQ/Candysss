/* ════════════════════════════════════════════
   PROYECTO DE AMOR — script.js
════════════════════════════════════════════ */

/* ─── Estado global ─────────────────────── */
let vecesNo    = 0;
let siEscala   = 1;
let bloqueado  = false;

/* ─── Pantallas ─────────────────────────── */
const pPregunta = document.getElementById('pantalla-pregunta');
const pAmor     = document.getElementById('pantalla-amor');
const pGalaxia  = document.getElementById('pantalla-galaxia');


/* ════════════════════════════════════════════
   ESTRELLAS DE FONDO (pantallas 1 y 2)
════════════════════════════════════════════ */
function crearEstrellas(contenedorId, cantidad) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  for (let i = 0; i < cantidad; i++) {
    const s   = document.createElement('div');
    s.classList.add('estrella');
    const tam = Math.random() * 2 + 0.5;
    s.style.cssText = `
      width:  ${tam}px;
      height: ${tam}px;
      top:    ${Math.random() * 100}%;
      left:   ${Math.random() * 100}%;
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay:    ${Math.random() * 4}s;
    `;
    contenedor.appendChild(s);
  }
}

crearEstrellas('estrellas-pregunta', 120);
crearEstrellas('estrellas-amor',      80);


/* ════════════════════════════════════════════
   CORAZONES FLOTANTES SVG (pantalla 1)
════════════════════════════════════════════ */
(function lanzarCorazones() {
  const contenedor = document.getElementById('corazones-flotantes');
  if (!contenedor) return;

  function nuevoCorazon() {
    const div = document.createElement('div');
    div.classList.add('corazon-flotante');
    const tam = 12 + Math.random() * 22;
    div.innerHTML = corazonSVG(tam, `rgba(233,30,140,${0.3 + Math.random() * 0.5})`);
    div.style.cssText = `
      left:               ${Math.random() * 100}%;
      bottom:             -60px;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay:    ${Math.random() * 4}s;
    `;
    contenedor.appendChild(div);
    setTimeout(() => div.remove(), 16000);
  }

  setInterval(nuevoCorazon, 900);
  for (let i = 0; i < 5; i++) nuevoCorazon();
})();

function corazonSVG(size, color) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 30" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28 C16 28 2 18 2 9 C2 4.5 5.5 1 10 1 C12.8 1 15 2.8 16 4.5 C17 2.8 19.2 1 22 1 C26.5 1 30 4.5 30 9 C30 18 16 28 16 28Z"
      fill="${color}" />
  </svg>`;
}


/* ════════════════════════════════════════════
   LÓGICA DE BOTONES (pantalla 1)
════════════════════════════════════════════ */
const btnSi = document.getElementById('btn-si');
const btnNo = document.getElementById('btn-no');
const zona  = document.getElementById('zona-botones');

function responderSi() {
  if (bloqueado) return;
  bloqueado = true;

  btnSi.style.transform = `translate(-50%, -50%) scale(${siEscala * 1.3})`;
  btnSi.style.boxShadow = '0 0 60px rgba(233,30,140,1)';

  setTimeout(() => {
    pPregunta.classList.remove('activa');
    setTimeout(() => {
      pAmor.classList.add('activa');
      const musica = document.getElementById('musica-amor');
      if (musica) { musica.volume = 0.5; musica.play().catch(() => {}); }
    }, 400);
  }, 400);
}

function responderNo() {
  vecesNo++;
  moverBotonNo();
  crecerBotonSi();
}

function moverBotonNo() {
  const zonaRect = zona.getBoundingClientRect();
  const siRect   = btnSi.getBoundingClientRect();
  const noRect   = btnNo.getBoundingClientRect();

  const siRelTop  = siRect.top  - zonaRect.top;
  const siRelLeft = siRect.left - zonaRect.left;

  let topPx, leftPx, iter = 0;
  do {
    topPx  = 10 + Math.random() * (zonaRect.height - noRect.height - 20);
    leftPx = 10 + Math.random() * (zonaRect.width  - noRect.width  - 20);
    iter++;
  } while (
    iter < 80 &&
    colisionan(
      leftPx, topPx, noRect.width, noRect.height,
      siRelLeft - siRect.width  * (siEscala - 1) / 2,
      siRelTop  - siRect.height * (siEscala - 1) / 2,
      siRect.width  * siEscala + 20,
      siRect.height * siEscala + 20
    )
  );

  btnNo.style.right     = 'auto';
  btnNo.style.left      = leftPx + 'px';
  btnNo.style.top       = topPx  + 'px';
  const escalaNo        = Math.max(0.5, 1 - vecesNo * 0.04);
  btnNo.style.transform = `scale(${escalaNo})`;
  btnNo.style.opacity   = Math.max(0.3, 1 - vecesNo * 0.06);
}

function crecerBotonSi() {
  siEscala = Math.min(2.6, siEscala + 0.18);
  btnSi.style.transform = `translate(-50%, -50%) scale(${siEscala})`;
  btnSi.style.fontSize  = `${1.3 + (siEscala - 1) * 0.4}rem`;
}

function colisionan(ax, ay, aw, ah, bx, by, bw, bh) {
  const m = 20;
  return !(ax + aw + m < bx || bx + bw + m < ax || ay + ah + m < by || by + bh + m < ay);
}


/* ════════════════════════════════════════════
   NAVEGACIÓN ENTRE PANTALLAS
════════════════════════════════════════════ */
function irAlEspacio() {
  pAmor.classList.remove('activa');
  setTimeout(() => {
    pGalaxia.classList.add('activa');
    iniciarGalaxia();
  }, 600);
}

function volverAlAmor() {
  pGalaxia.classList.remove('activa');
  setTimeout(() => pAmor.classList.add('activa'), 600);
}


/* ════════════════════════════════════════════
   GALAXIA THREE.JS
════════════════════════════════════════════ */
let galaxiaIniciada = false;

function iniciarGalaxia() {
  if (galaxiaIniciada) return;
  galaxiaIniciada = true;

  /* ─── Escena, renderer, cámara ────────── */
  const canvas   = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 16);
  camera.lookAt(0, 0, 0);

  /* ─── Grupo principal ─────────────────── */
  const universe = new THREE.Group();
  scene.add(universe);

  /* ─── Textura de punto circular ─────── */
  function createCircleTexture() {
    const size = 64;
    const c    = document.createElement('canvas');
    c.width    = size;
    c.height   = size;
    const ctx  = c.getContext('2d');
    const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }
  const dotTexture = createCircleTexture();

  /* ─── Galaxia (disco de puntos) ──────── */
  const gp = {
    count:           15000,
    size:            0.15,
    radius:          15,
    branches:        4,
    spin:            1.2,
    randomness:      0.35,
    randomnessPower: 3
  };

  const positions = new Float32Array(gp.count * 3);
  const colors    = new Float32Array(gp.count * 3);

  const colorInside  = new THREE.Color('#ff6b81');  // rosa
  const colorOutside = new THREE.Color('#cc0066');  // rosa oscuro / magenta

  for (let i = 0; i < gp.count; i++) {
    const i3          = i * 3;
    const radius      = Math.pow(Math.random(), 1.5) * gp.radius;
    const branchAngle = ((i % gp.branches) / gp.branches) * Math.PI * 2;
    const spinAngle   = radius * gp.spin;

    const rnd = (power) =>
      Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1);

    const rx = rnd(gp.randomnessPower) * gp.randomness * radius;
    const ry = rnd(gp.randomnessPower) * gp.randomness * radius * 0.5;
    const rz = rnd(gp.randomnessPower) * gp.randomness * radius;

    positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + rx;
    positions[i3 + 1] = ry;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

    const mixed = colorInside.clone().lerp(colorOutside, radius / gp.radius);
    colors[i3]     = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  const galaxyGeo = new THREE.BufferGeometry();
  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size:            gp.size,
    sizeAttenuation: true,
    vertexColors:    true,
    transparent:     true,
    alphaMap:        dotTexture,
    depthWrite:      false,
    blending:        THREE.AdditiveBlending
  });

  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
  universe.add(galaxy);

  /* ─── Corazón central de puntos ──────── */
  function heartPoint(t) {
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y: 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)
    };
  }

  const HEART_COUNT = 3500;
  const HEART_SCALE = 0.2;
  const hPos   = new Float32Array(HEART_COUNT * 3);
  const hColor = new Float32Array(HEART_COUNT * 3);

  const cCore = new THREE.Color('#ffffff');
  const cEdge = new THREE.Color('#ff2d55');

  for (let i = 0; i < HEART_COUNT; i++) {
    const i3   = i * 3;
    const t    = Math.random() * Math.PI * 2;
    const p    = heartPoint(t);
    const fill = Math.pow(Math.random(), 0.6);
    const jitter = (1 - fill) * 0.5 + 0.1;

    hPos[i3]     = (p.x * fill + (Math.random() - 0.5) * jitter) * HEART_SCALE;
    hPos[i3 + 1] = (p.y * fill + (Math.random() - 0.5) * jitter) * HEART_SCALE + 0.6;
    hPos[i3 + 2] = (Math.random() - 0.5) * 0.6;

    const mixed  = cCore.clone().lerp(cEdge, fill);
    hColor[i3]     = mixed.r;
    hColor[i3 + 1] = mixed.g;
    hColor[i3 + 2] = mixed.b;
  }

  const heartGeo = new THREE.BufferGeometry();
  heartGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
  heartGeo.setAttribute('color',    new THREE.BufferAttribute(hColor, 3));

  const heartMat = new THREE.PointsMaterial({
    size:            0.18,
    sizeAttenuation: true,
    vertexColors:    true,
    transparent:     true,
    alphaMap:        dotTexture,
    depthWrite:      false,
    blending:        THREE.AdditiveBlending
  });

  const heart = new THREE.Points(heartGeo, heartMat);
  universe.add(heart);

  /* ─── Objetos flotantes holográficos ─── */
  const holoContainer = document.getElementById('holo-objects');

  const floatingObjects = [
    { symbol: '\u2665', phrase: 'Te amo 3 millones',           angle: 0.3,  radius: 8,    height:  2.5, speed: 0.12 },
    { symbol: '\u2764', phrase: 'Solo te siento a ti',    angle: 1.5,  radius: 10,   height: -2,   speed: 0.10 },
    { symbol: '\u2726', phrase: 'Eres mi flor eterna',      angle: 2.8,  radius: 9,    height:  3.5, speed: 0.14 },
    { symbol: '\u2665', phrase: 'Eres mi sueño hecho realidad',              angle: 4.0,  radius: 11,   height:  1,   speed: 0.09 },
    { symbol: '\u2605', phrase: 'Eres mi persona favorita', angle: 5.2,  radius: 7.5,  height: -3,   speed: 0.13 },
    { symbol: '\u221e', phrase: 'Por siempre tú',           angle: 6.1,  radius: 12,   height:  2,   speed: 0.08 },
    { symbol: '\u2764', phrase: 'Eres mi lugar favorito en el mundo',      angle: 0.9,  radius: 9.5,  height:  1.5, speed: 0.11 },
    { symbol: '\u2605', phrase: 'Te amo hasta la luna',     angle: 2.2,  radius: 10.5, height: -1,   speed: 0.09 },
    { symbol: '\u2665', phrase: 'Nuestro amor es eterno',   angle: 3.6,  radius: 8.5,  height:  3,   speed: 0.13 }
  ];

  floatingObjects.forEach(obj => {
    const div      = document.createElement('div');
    div.className  = 'holo-object holo';
    div.innerHTML  = `<span class="symbol">${obj.symbol}</span><span class="phrase">${obj.phrase}</span>`;
    holoContainer.appendChild(div);
    obj.element = div;
  });

  const tempVec = new THREE.Vector3();

  function updateHoloObjects(elapsed) {
    floatingObjects.forEach(obj => {
      obj.angle += obj.speed * 0.016;

      const x = Math.cos(obj.angle) * obj.radius;
      const z = Math.sin(obj.angle) * obj.radius;
      const y = obj.height + Math.sin(elapsed * 1.5 + obj.angle) * 0.4;

      tempVec.set(x, y, z).applyEuler(universe.rotation).project(camera);

      const sx = (tempVec.x *  0.5 + 0.5) * window.innerWidth;
      const sy = (tempVec.y * -0.5 + 0.5) * window.innerHeight;
      const depth   = 1 - (z + obj.radius) / (obj.radius * 2);
      const scale   = 0.6 + depth * 0.7;
      const opacity = 0.35 + depth * 0.65;

      if (tempVec.z > 1) {
        obj.element.style.opacity = '0';
      } else {
        obj.element.style.opacity   = opacity.toFixed(2);
        obj.element.style.transform =
          `translate(-50%,-50%) translate(${sx}px,${sy}px) scale(${scale.toFixed(2)})`;
      }
    });
  }

  /* ─── Controles (mouse + touch) ──────── */
  let isDragging   = false;
  let prevX        = 0;
  let prevY        = 0;
  let velocityY    = 0;
  let tiltX        = 0;

  canvas.addEventListener('mousedown', e => {
    isDragging = true; prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velocityY = (e.clientX - prevX) * 0.004;
    tiltX     = (e.clientY - prevY) * 0.002;
    prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isDragging = true;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isDragging) return;
    velocityY = (e.touches[0].clientX - prevX) * 0.004;
    tiltX     = (e.touches[0].clientY - prevY) * 0.002;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  /* ─── Redimensionar ───────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─── Loop de animación ───────────────── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    universe.rotation.y += velocityY + 0.003;
    universe.rotation.x += tiltX;
    tiltX *= 0.95;
    if (!isDragging) velocityY *= 0.95;

    // Latido del corazón
    const pulse = 1 + Math.sin(elapsed * 4) * 0.06;
    heart.scale.set(pulse, pulse, pulse);

    updateHoloObjects(elapsed);
    renderer.render(scene, camera);
  }

  animate();
}