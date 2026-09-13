// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Flip cards (Picture Stories)
  document.querySelectorAll('.flip-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const front = card.querySelector('.flip-front .cap-title');
    card.setAttribute('aria-label', front ? front.textContent : 'Photo, tap to read the story');

    const toggleFlip = () => card.classList.toggle('flipped');

    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  // Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox){
    const content = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (item) => {
      const videoSrc = item.getAttribute('data-video');
      content.innerHTML = '';
      if (videoSrc){
        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        content.appendChild(video);
      } else {
        const img = item.querySelector('img');
        const big = document.createElement('img');
        big.src = img.src;
        big.alt = img.alt || '';
        content.appendChild(big);
      }
      lightbox.classList.add('open');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      const video = content.querySelector('video');
      if (video) video.pause();
      content.innerHTML = '';
    };

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Do You Love Me — the "no" button that can't be caught
  const yesBtn = document.getElementById('loveYes');
  const noBtn = document.getElementById('loveNo');
  if (yesBtn && noBtn){
    const stage = document.getElementById('loveButtons');
    const hint = document.getElementById('loveHint');
    const round = document.getElementById('loveRound');
    const reveal = document.getElementById('loveReveal');
    const dodgeMessages = ['nice try', 'nope', 'so close', 'not happening', 'try again?', 'almost had it'];
    let dodges = 0;

    const dodge = (e) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const maxX = Math.max(rect.width - btnRect.width, 0);
      const maxY = Math.max(rect.height - btnRect.height, 0);
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      noBtn.style.left = x + 'px';
      noBtn.style.top = y + 'px';
      noBtn.style.transform = 'none';
      dodges += 1;
      const scale = Math.min(1 + dodges * 0.05, 1.5);
      yesBtn.style.transform = 'scale(' + scale + ')';
      if (dodges >= 2 && hint){
        hint.textContent = dodgeMessages[Math.min(dodges - 2, dodgeMessages.length - 1)];
      }
    };

    noBtn.addEventListener('pointerenter', dodge);
    noBtn.addEventListener('touchstart', dodge, { passive: false });
    noBtn.addEventListener('click', dodge);

    yesBtn.addEventListener('click', () => {
      round.classList.add('hidden');
      reveal.classList.remove('hidden');
    });
  }
});

// Happy Birthday: countdown lock, candles, confetti
(function(){
  const lockedEl = document.getElementById('bdayLocked');
  const unlockedEl = document.getElementById('bdayUnlocked');
  if (!lockedEl || !unlockedEl) return;

  const target = new Date('2026-09-30T00:00:00');

  function launchConfetti(){
    const colors = ['#A8425A', '#C89B5C', '#F3C9D4', '#E7DCC6', '#7E2E42'];
    for (let i = 0; i < 70; i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
      p.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4200);
    }
  }

  function showUnlocked(){
    lockedEl.classList.add('hidden');
    unlockedEl.classList.remove('hidden');
    launchConfetti();
  }

  function pad2(n){
    n = Math.floor(n);
    return n < 10 ? '0' + n : String(n);
  }

  function tick(){
    const now = new Date();
    const diff = target - now;
    if (diff <= 0){
      showUnlocked();
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');
    if (dEl) dEl.textContent = d;
    if (hEl) hEl.textContent = pad2(h);
    if (mEl) mEl.textContent = pad2(m);
    if (sEl) sEl.textContent = pad2(s);
  }

  if (new Date() >= target){
    lockedEl.classList.add('hidden');
    unlockedEl.classList.remove('hidden');
  } else {
    tick();
    setInterval(tick, 1000);
  }

  const candles = document.querySelectorAll('.candle');
  const letterSection = document.getElementById('bdayLetter');
  const cakeHint = document.getElementById('cakeHint');
  let remaining = candles.length;
  candles.forEach(c => {
    c.addEventListener('click', () => {
      if (c.classList.contains('out')) return;
      c.classList.add('out');
      remaining -= 1;
      if (remaining === 0 && letterSection){
        if (cakeHint) cakeHint.textContent = 'happy birthday, Rajvieeeee 🎂';
        letterSection.classList.remove('hidden');
        launchConfetti();
        letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
