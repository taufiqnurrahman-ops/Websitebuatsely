const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const audio = $('#audio'), mBtn = $('#music');

// Opening animation
// Opening: klik "Buka" = interaksi pertama, jadi browser mengizinkan musik langsung main
// Musik otomatis
audio.loop = true;
audio.volume = 0.7;

function startMusic() {
  if (!audio.paused) return;
  audio.play().then(() => mBtn.classList.add('play')).catch(() => {});
}

// 1) Coba langsung autoplay saat halaman dimuat (berhasil di sebagian browser)
window.addEventListener('load', startMusic);

// 2) Kalau diblokir, mulai di interaksi pertama (klik/sentuh/tekan tombol)
['click', 'touchstart', 'keydown'].forEach(ev =>
  document.addEventListener(ev, startMusic, { once: true, passive: true })
);

// Opening animation
function enter() {
  $('#opening').classList.add('done');
  startMusic();
}
$('#enter').addEventListener('click', enter);

// Hamburger menu
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => { burger.classList.toggle('on'); menu.classList.toggle('open'); });
$$('#menu a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('on'); menu.classList.remove('open'); }));

// Active nav + back to top
const sections = $$('main section'), links = $$('#menu a'), toTop = $('#toTop');
function onScroll() {
  const y = window.scrollY + 120;
  let cur = sections[0].id;
  sections.forEach(s => { if (y >= s.offsetTop) cur = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  toTop.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll); onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

// Floating hearts
const hearts = $('#hearts');
setInterval(() => {
  if (document.hidden) return;
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = Math.random() > .5 ? '♥' : '♡';
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 12 + Math.random() * 18 + 'px';
  h.style.animationDuration = 9 + Math.random() * 8 + 's';
  hearts.appendChild(h);
  setTimeout(() => h.remove(), 17000);
}, 1400);

// Gallery filter
$$('.chip').forEach(c => c.addEventListener('click', () => {
  $$('.chip').forEach(x => x.classList.remove('active'));
  c.classList.add('active');
  $$('.shot').forEach(s => s.classList.toggle('hide', c.dataset.f !== 'all' && s.dataset.c !== c.dataset.f));
}));

// Lightbox
const lb = $('#lightbox');
$$('.shot').forEach(s => s.addEventListener('click', () => {
  const img = $('img', s);
  if (img.classList.contains('noimg')) return; // belum ada foto
  $('#lbImg').src = img.src;
  $('#lbCap').textContent = $('figcaption', s).textContent;
  lb.classList.add('open');
}));
const closeLb = () => lb.classList.remove('open');
$('#lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); closeLetter(); } });

// Music
mBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => mBtn.classList.add('play'))
      .catch(() => alert('File musik belum ada. Taruh di assets/music/music.mp3'));
  } else { audio.pause(); mBtn.classList.remove('play'); }
});

// Surprise letter
const wrap = $('#letterWrap'), env = $('#envelope');
function openLetter() {
  wrap.classList.add('open');
  setTimeout(() => env.classList.add('opened'), 300);
  let n = 0;
  const t = setInterval(() => {
    const m = document.createElement('span');
    m.className = 'mini'; m.textContent = '♥';
    m.style.left = 20 + Math.random() * 60 + '%';
    m.style.top = 55 + Math.random() * 30 + '%';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 1400);
    if (++n > 14) clearInterval(t);
  }, 200);
}
function closeLetter() { wrap.classList.remove('open'); env.classList.remove('opened'); }
$('#openSurprise').addEventListener('click', openLetter);
$('#closeLetter').addEventListener('click', closeLetter);

// Custom cursor (desktop)
const cur = $('#cursor');
document.addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
$$('a,button,.shot,.card').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

// Typing effect
const words = ['you in my life.', 'your smile.', 'every moment with you.', 'my favorite person.'];
const typed = $('#typed');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 90);
})();
