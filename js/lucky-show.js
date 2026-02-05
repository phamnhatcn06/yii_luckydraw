const API = window.__API;

const diceAnim = document.getElementById('diceAnim');
const prizeNameEl = document.getElementById('prizeName');
const remainingEl = document.getElementById('remaining');

const winnerBox = document.getElementById('winnerBox');
const bigCodeEl = document.getElementById('bigCode');
const fullNameEl = document.getElementById('fullName');
const departmentEl = document.getElementById('department');
const companyEl = document.getElementById('company');

let isSpinning = false;
// ===== 3D DICE SETUP =====
const diceWrap = document.getElementById('diceWrap');
const boardWrap = document.getElementById('board');
const cubes = [
    document.getElementById('c1'),
    document.getElementById('c2'),
    document.getElementById('c3'),
];
let prizeLocked = false;   // 🔒 đang khóa, không cho sang giải mới
const PIPS = {
    1: ['p5'],
    2: ['p1', 'p9'],
    3: ['p1', 'p5', 'p9'],
    4: ['p1', 'p3', 'p7', 'p9'],
    5: ['p1', 'p3', 'p5', 'p7', 'p9'],
    6: ['p1', 'p3', 'p4', 'p6', 'p7', 'p9'],
};
const FACE_NUM = { front: 1, back: 6, right: 3, left: 4, top: 2, bottom: 5 };
const FACE_ORDER = ['front', 'right', 'left', 'back', 'top', 'bottom'];

function makeFace(name, num) {
    const f = document.createElement('div');
    f.className = `face ${name}`;
    (PIPS[num] || []).forEach(p => {
        const dot = document.createElement('span');
        dot.className = `pip ${p}`;
        f.appendChild(dot);
    });
    return f;
}

function buildCube(el) {
    if (!el) return;
    el.innerHTML = '';
    FACE_ORDER.forEach(name => el.appendChild(makeFace(name, FACE_NUM[name])));
}

cubes.forEach(buildCube);

const diceState = cubes.map((el, i) => ({
    el,
    rx: -28 + i * 6,
    ry: 35 + i * 10,
    rz: 0,
    tx: 0, ty: 0,       // Translation x, y
    vx: 0, vy: 0, vz: 0, // Rotation velocity
    vtx: 0, vty: 0,      // Translation velocity
    spinning: false,
}));

function applyDice(d) {
    if (!d.el) return;
    // Add translation for "rolling" effect
    d.el.style.transform = `translate3d(${d.tx}px, ${d.ty}px, 0) rotateX(${d.rx}deg) rotateY(${d.ry}deg) rotateZ(${d.rz}deg)`;
}

// function randVel(){
//     const s = () => (Math.random() > 0.5 ? 1 : -1);
//     return {
//         vx: s() * (16 + Math.random()*30),
//         vy: s() * (18 + Math.random()*34),
//         vz: s() * (12 + Math.random()*26),
//     };
// }

function randVel() {
    const s = () => (Math.random() > 0.5 ? 1 : -1);
    return {
        vx: s() * (6 + Math.random() * 10),
        vy: s() * (8 + Math.random() * 14),
        vz: s() * (2 + Math.random() * 6),
    };
}

function startDice3D() {
    diceState.forEach(d => {
        const v = randVel();
        d.vx = v.vx;
        d.vy = v.vy;
        d.vz = v.vz;

        // Random tumbling velocity
        d.vtx = (Math.random() - 0.5) * 40; // Mạnh hơn
        d.vty = (Math.random() - 0.5) * 40;

        d.spinning = true;
    });
}

function stopDice3D() {
    diceState.forEach(d => d.spinning = false);
}

function diceRAF() {
    diceState.forEach(d => {
        if (d.spinning) {
            // ROTATION CHAOS
            if (Math.random() < 0.05) { // Frequent changes
                const v = randVel();
                d.vx = v.vx;
                d.vy = v.vy;
                d.vz = v.vz;
            }
            d.rx += d.vx;
            d.ry += d.vy;
            d.rz += d.vz;

            // TRANSLATION CHAOS (ROLLING)
            d.tx += d.vtx;
            d.ty += d.vty;

            // Boundary bounce (keep within ~100px range)
            const LIMIT = 80;
            if (d.tx > LIMIT) { d.tx = LIMIT; d.vtx *= -0.8; }
            if (d.tx < -LIMIT) { d.tx = -LIMIT; d.vtx *= -0.8; }
            if (d.ty > LIMIT) { d.ty = LIMIT; d.vty *= -0.8; }
            if (d.ty < -LIMIT) { d.ty = -LIMIT; d.vty *= -0.8; }

            // Random jostle
            if (Math.random() < 0.1) {
                d.vtx += (Math.random() - 0.5) * 10;
                d.vty += (Math.random() - 0.5) * 10;
            }
        } else {
            // Return to center slowly
            d.tx *= 0.85;
            d.ty *= 0.85;
            if (Math.abs(d.tx) < 0.5) d.tx = 0;
            if (Math.abs(d.ty) < 0.5) d.ty = 0;
        }
        applyDice(d);
    });
    requestAnimationFrame(diceRAF);
}

diceRAF();

// show/hide/scale states
function diceHidden() {
    if (!diceWrap) return;
    diceWrap.classList.add('hidden');
    boardWrap.classList.add('hidden');
    diceWrap.classList.remove('isSpinning', 'isIdle');
}

function diceIdleSmall() {
    if (!diceWrap) return;
    diceWrap.classList.remove('hidden', 'isSpinning');
    boardWrap.classList.remove('hidden', 'isSpinning');
    diceWrap.classList.add('isIdle');
}

function diceSpinningBig() {
    if (!diceWrap) return;
    diceWrap.classList.remove('hidden', 'isIdle');
    diceWrap.classList.add('isSpinning');
}

// ---------- helpers ----------
const screenEl = document.querySelector('.screen');
const lightSweep = document.getElementById('lightSweep');

function flashScreen() {
    if (!screenEl) return;
    screenEl.classList.add('flash', 'shake');
    setTimeout(() => screenEl.classList.remove('flash', 'shake'), 350);
}

function sweepLight() {
    if (!lightSweep) return;
    lightSweep.classList.add('active');
    setTimeout(() => lightSweep.classList.remove('active'), 700);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function fetchJSON(url, options) {
    const res = await fetch(url, Object.assign({ cache: 'no-store' }, options || {}));
    const json = await res.json().catch(() => null);
    if (!json) throw new Error('Invalid JSON');
    return json;
}

// Dice GIF controls
function showDice() {
    if (!diceAnim) return;
    diceAnim.classList.remove('hidden');
}

function hideDice() {
    if (!diceAnim) return;
    diceAnim.classList.add('hidden');
}

function startDice() {
    if (!diceAnim) return;

    // restart gif animation
    const src = diceAnim.getAttribute('src') || '';
    diceAnim.setAttribute('src', src.split('?')[0] + '?t=' + Date.now());

    showDice();
    diceAnim.classList.add('spinning');
}

function stopDice() {
    if (!diceAnim) return;
    diceAnim.classList.remove('spinning');
}

function hideWinner() {
    winnerBox.classList.add('hidden');
    winnerBox.classList.remove('pop');
}

function showWinner(data) {
    prizeNameEl.textContent = data.prize.name;

    bigCodeEl.textContent = data.winner.code;
    bigCodeEl.classList.add('glow');

    fullNameEl.textContent = data.winner.full_name;
    departmentEl.textContent = data.winner.department;
    companyEl.textContent = data.winner.company;

    winnerBox.classList.remove('hidden');
    winnerBox.classList.remove('pop');
    void winnerBox.offsetWidth;
    winnerBox.classList.add('pop');

    setTimeout(() => bigCodeEl.classList.remove('glow'), 4000);
}

// ---------- fireworks canvas ----------
let fw = null;
if (window.ModernFireworks) {
    fw = new ModernFireworks('fxCanvas');
}

async function fireworksShow(prizeType = 'special') {
    if (!fw) return;
    fw.fireSequence(); // Initial burst
    await sleep(1000);
    fw.startContinuous(); // Keep going until popup is dismissed
}

// async function fireworksShow(){
//     if (!ctx || !canvas) return;
//
//     fxRunning = true;
//     particles = [];
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//
//     const cx = canvas.width/2;
//     const cy = canvas.height*0.38;
//
//     spawnBurst(cx, cy);
//     spawnBurst(cx - canvas.width*0.18, cy + canvas.height*0.06);
//     spawnBurst(cx + canvas.width*0.18, cy + canvas.height*0.06);
//
//     stepFX();
//     await sleep(1200);
// }

// ---------- petals canvas ----------
const petalCanvas = document.getElementById('petalCanvas');
const pctx = petalCanvas ? petalCanvas.getContext('2d') : null;
let petals = [];
let petalRunning = false;

function resizePetal() {
    if (!petalCanvas) return;
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizePetal);
resizePetal();

function spawnPetals() {
    petals = [];
    const count = 80; // Increased from 40
    for (let i = 0; i < count; i++) {
        petals.push({
            x: Math.random() * (petalCanvas ? petalCanvas.width : window.innerWidth),
            y: -Math.random() * 300,
            vy: 3 + Math.random() * 4, // Much faster: 3-7 instead of 1-3.5
            vx: -0.8 + Math.random() * 1.6,
            size: 10 + Math.random() * 12,
            rot: Math.random() * Math.PI,
            vr: -0.03 + Math.random() * 0.06,
        });
    }
}

function drawPetals() {
    if (!petalRunning || !pctx || !petalCanvas) return;

    pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

    petals.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vr;

        pctx.save();
        pctx.translate(p.x, p.y);
        pctx.rotate(p.rot);
        pctx.fillStyle = "rgba(255,223,0,.9)"; // Bright gold for stars

        // Draw star
        pctx.beginPath();
        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size / 2;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        pctx.moveTo(0, 0 - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            pctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            pctx.lineTo(x, y);
            rot += step;
        }
        pctx.lineTo(0, 0 - outerRadius);
        pctx.closePath();
        pctx.fill();
        pctx.restore();
    });

    // Remove petals that have fallen off screen
    petals = petals.filter(p => p.y < petalCanvas.height + 40);

    // Continuously spawn new petals while running - More stars, faster
    if (petals.length < 60) { // Increased threshold from 30 to 60
        for (let i = 0; i < 10; i++) { // Spawn 10 at a time instead of 5
            petals.push({
                x: Math.random() * petalCanvas.width,
                y: -Math.random() * 50,
                vy: 3 + Math.random() * 4, // Much faster: 3-7
                vx: -0.8 + Math.random() * 1.6,
                size: 10 + Math.random() * 12,
                rot: Math.random() * Math.PI,
                vr: -0.03 + Math.random() * 0.06,
            });
        }
    }

    requestAnimationFrame(drawPetals);
}

function petalsShow() {
    if (!pctx || !petalCanvas) return;
    petalRunning = true;
    spawnPetals();
    drawPetals();
}

function stopPetals() {
    petalRunning = false;
    petals = [];
    if (pctx && petalCanvas) {
        pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    }
}

// ---------- load header info ----------
async function refreshPrizeAndStatus() {
    try {
        const p = await fetchJSON(API.prize);
        if (p.ok && p.data) {
            if (p.data.quantity == p.data.awarded) {
                prizeLocked = true;
                prizeNameEl.textContent = 'ĐÃ QUAY XONG GIẢI';
            } else {
                prizeNameEl.textContent = p.data.prize_name;
            }
        }
        if (p.ok && !p.data) prizeNameEl.textContent = 'ĐÃ QUAY XONG';
        const s = await fetchJSON(API.status);
        if (s.ok) remainingEl.textContent = "Còn lại: " + s.data.remaining;
    } catch (e) {
        // ignore
    }
}

// ===== BOOM (confetti) =====
const boomCanvas = document.getElementById('boomCanvas');
const bctx = boomCanvas ? boomCanvas.getContext('2d') : null;
let booms = [];
let boomRun = false;

function resizeBoom() {
    if (!boomCanvas) return;
    boomCanvas.width = window.innerWidth;
    boomCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeBoom);
resizeBoom();

function boomBurst() {
    if (!bctx || !boomCanvas) return;

    booms = [];
    boomRun = true;

    const cx = boomCanvas.width / 2;
    const cy = boomCanvas.height * 0.45;

    const count = 160;
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 3 + Math.random() * 10;
        booms.push({
            x: cx,
            y: cy,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - (2 + Math.random() * 3),
            g: 0.14,
            life: 50 + Math.random() * 40,
            s: 2 + Math.random() * 4,
            r: Math.random() * Math.PI,
            vr: (-0.2 + Math.random() * 0.4),
            // gold/white/red-ish
            col: (Math.random() < 0.33) ? '255,211,106' : (Math.random() < 0.5 ? '255,255,255' : '255,80,80')
        });
    }
    requestAnimationFrame(stepBoom);
}

function stepBoom() {
    if (!boomRun || !bctx || !boomCanvas) return;

    bctx.clearRect(0, 0, boomCanvas.width, boomCanvas.height);

    booms = booms.filter(p => p.life > 0);

    for (const p of booms) {
        p.life -= 1;
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;

        const alpha = Math.max(0, p.life / 90);
        bctx.save();
        bctx.translate(p.x, p.y);
        bctx.rotate(p.r);
        bctx.fillStyle = `rgba(${p.col},${alpha})`;
        bctx.fillRect(-p.s, -p.s, p.s * 2, p.s * 2);
        bctx.restore();
    }

    if (booms.length === 0) {
        boomRun = false;
        bctx.clearRect(0, 0, boomCanvas.width, boomCanvas.height);
        return;
    }
    requestAnimationFrame(stepBoom);
}

// ===== WINNER POPUP =====
const winnerPopup = document.getElementById('winnerPopup');
const wpPrize = document.getElementById('wpPrize');
const wpCode = document.getElementById('wpCode');
const wpName = document.getElementById('wpName');
const wpDept = document.getElementById('wpDept');
const wpCompany = document.getElementById('wpCompany');

function hidePopup() {
    if (!winnerPopup) return;
    winnerPopup.classList.remove('show');
}

function showPopup(data) {
    if (!winnerPopup) return;
    wpPrize.textContent = data.prize.name;
    wpCode.textContent = data.winner.code;
    wpName.textContent = data.winner.full_name;
    wpDept.textContent = data.winner.department;
    wpCompany.textContent = data.winner.company;

    winnerPopup.classList.add('show');
}

function explodeDice() {
    if (!diceWrap) return;

    // flash
    if (screenEl) {
        screenEl.classList.add('flashBoom');
        setTimeout(() => screenEl.classList.remove('flashBoom'), 220);
    }

    // confetti burst
    boomBurst();

    // animate diceWrap explode then hide
    diceWrap.classList.add('explode');
    setTimeout(() => {
        diceWrap.classList.remove('explode');
        diceHidden();
    }, 560);
}

function showWinner(data) {
    document.getElementById('bigCode').textContent = data.code || '----';
    document.getElementById('fullName').textContent = data.full_name || '—';
    document.getElementById('department').textContent = data.department || '—';
    document.getElementById('company').textContent = data.company || '—';
    document.getElementById('winnerOverlay').classList.remove('hidden');
    const popup = document.getElementById('winnerPopup');
    popup.classList.remove('hidden');
    requestAnimationFrame(() => popup.classList.add('show'));
}

function hideWinner() {
    document.getElementById('winnerOverlay').classList.add('hidden');
    const popup = document.getElementById('winnerPopup');
    popup.classList.remove('show');

    setTimeout(() => popup.classList.add('hidden'), 200);
}
function updateWinnerSides() {
    const left = document.getElementById('winnerListLeft');
    const right = document.getElementById('winnerListRight');

    if (
        (left && left.children.length > 0) ||
        (right && right.children.length > 0)
    ) {
        document.getElementById('winnersLeft')?.classList.remove('hidden');
        document.getElementById('winnersRight')?.classList.remove('hidden');
    }
}

// ---------- main spin ----------
let currentWinner = null;
let currentPrizeId = null;

async function spin() {
    if (isSpinning) return;
    isSpinning = true;
    const prize = await fetchJSON(API.prize);
    if (prize.data.finished) {
        prizeLocked = true;
        alert('Giải này đã quay đủ, hãy bấm NEXT');
        return;
    }
    hideWinner();

    // 1) hiện dice nhỏ trước (như “chuẩn bị”)
    diceIdleSmall();
    await sleep(80);

    // 2) phóng to + quay
    if (typeof flashScreen === 'function') flashScreen();
    startDice3D();

    try {
        const apiPromise = fetchJSON(API.spin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        // cho quay đủ đã
        await sleep(3200);

        // 3) dừng + thu nhỏ + ẩn
        stopDice3D();
        diceIdleSmall();
        await sleep(180);
        diceHidden();

        const res = await apiPromise;
        if (!res.ok) {
            alert(res.error || 'Quay thất bại');
            await refreshPrizeAndStatus();
            return;
        }

        // 4) pháo hoa + petals + sweep
        await fireworksShow(res.data.prize.code);
        if (typeof petalsShow === 'function') petalsShow();
        if (typeof sweepLight === 'function') sweepLight();
        await sleep(250);

        // 5) show winner
        currentWinner = res.data.winner;
        currentPrizeId = res.data.prize.id;
        showWinner(res.data.winner);
        await refreshPrizeAndStatus();

    } catch (e) {
        diceHidden();
        alert('Lỗi hệ thống');
    } finally {
        isSpinning = false;
    }
}

async function confirmWinner() {
    stopPetals(); // Stop falling stars
    if (fw) fw.stopContinuous(); // Stop fireworks
    await fetchJSON(API.confirm, {
        method: 'POST',
        body: JSON.stringify({
            ...currentWinner,
            prize_id: currentPrizeId
        })
    });
    // 👉 lấy dữ liệu đang hiển thị trên popup
    const winner = {
        code: document.getElementById('bigCode').textContent,
        full_name: document.getElementById('fullName').textContent,
        department: document.getElementById('department').textContent,
        company: document.getElementById('company').textContent
    };

    // ✅ ĐẨY SANG CÁNH GÀ
    addWinnerToSide(winner);
    updateWinnerSides();
    hideWinner();

    // TODO: gọi API confirm nếu cần
    console.log('Đã xác nhận kết quả');
}

function cancelWinner() {
    stopPetals(); // Stop falling stars
    if (fw) fw.stopContinuous(); // Stop fireworks
    hideWinner();
}

// SPACE = spin
document.addEventListener('keydown', function (e) {
    const isSpace = (e.code === 'Space' || e.keyCode === 32);
    if (prizeLocked) {
        console.log('Giải đã hết — cần chuyển giải');
        return;
    }
    if (!isSpace) return;
    e.preventDefault();
    spin();
});

// ✅ Ẩn dice ngay từ đầu
hideDice();
refreshPrizeAndStatus();

let sideToggle = false;

function addWinnerToSide(winner) {
    const li = document.createElement('li');
    li.innerHTML = `
         <span class="numberBlock">
            <b>${winner.code}</b>
            </span>
            <span class="partInfo">
                <span class="partname">${winner.full_name}</span>
                <br/>
                <span class="job">${winner.department}</span>
            </span>
    `;

    if (sideToggle) {
        document.getElementById('winnerListLeft').append(li);
    } else {
        document.getElementById('winnerListRight').append(li);
    }
    sideToggle = !sideToggle;
}
async function nextPrize() {
    const res = await fetchJSON(API.nextPrize, { method: 'POST' });
    if (!res.ok) {
        alert(res.msg);
        return;
    }
    location.reload();
}
function nextPrizeManual() {
    prizeLocked = false;
    nextPrize(); // hàm cũ của bạn
}

document.querySelectorAll('.winners-side')
    .forEach(el => el.classList.add('show'));
document.getElementById('btnNextPrize').onclick = () => {
    if (prizeLocked) {
        nextPrizeManual();
    }
};

