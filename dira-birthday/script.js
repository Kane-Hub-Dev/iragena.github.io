'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  mobileNav.hidden = isOpen;
});
$$('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}));

// Scroll progress
const progress = $('#scrollProgress');
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Scroll reveal (gracefully visible when reduced motion is preferred)
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Small toast helper
let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

// A short, anchored birthday burst: confetti and a few birthday emojis.
function launchCelebration(source) {
  if (reduceMotion) return;
  const rect = source && source.getBoundingClientRect ? source.getBoundingClientRect() : {
    left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0
  };
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const layer = document.createElement('div');
  layer.className = 'celebration-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const palette = ['#E7BE78', '#F7DCA9', '#D98C82', '#B97187', '#6CC3C7', '#F3E7D5'];
  for (let i = 0; i < 34; i += 1) {
    const piece = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 34 + (Math.random() - .5) * .24;
    const distance = 70 + Math.random() * 145;
    piece.className = 'celebration-confetti';
    if (i % 3 === 1) piece.classList.add('is-circle');
    if (i % 3 === 2) piece.classList.add('is-ribbon');
    piece.style.left = originX + 'px';
    piece.style.top = originY + 'px';
    piece.style.background = palette[i % palette.length];
    piece.style.setProperty('--dx', (Math.cos(angle) * distance) + 'px');
    piece.style.setProperty('--dy', (Math.sin(angle) * distance - 45) + 'px');
    piece.style.setProperty('--spin', Math.round(Math.random() * 620 - 310) + 'deg');
    piece.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
    layer.appendChild(piece);
  }

  const birthdayEmojis = ['🎂', '🎉', '🎈', '🎁', '💗', '✨'];
  birthdayEmojis.forEach((emoji, index) => {
    const sticker = document.createElement('span');
    const angle = (Math.PI * 2 * index) / birthdayEmojis.length - Math.PI / 2;
    sticker.className = 'celebration-emoji';
    sticker.textContent = emoji;
    sticker.style.left = originX + 'px';
    sticker.style.top = originY + 'px';
    sticker.style.setProperty('--dx', (Math.cos(angle) * 95) + 'px');
    sticker.style.setProperty('--dy', (Math.sin(angle) * 80 - 28) + 'px');
    sticker.style.setProperty('--spin', (index % 2 ? 12 : -12) + 'deg');
    sticker.style.animationDelay = (index * .035).toFixed(2) + 's';
    layer.appendChild(sticker);
  });

  window.setTimeout(() => layer.remove(), 2500);
}

function highlightGift(targetSelector) {
  const target = $(targetSelector);
  if (!target) return;
  target.classList.add('gift-highlight');
  window.setTimeout(() => target.classList.remove('gift-highlight'), 1450);
}

$('#openGift')?.addEventListener('click', () => {
  launchCelebration($('#openGift'));
  highlightGift('#letter .letter-card');
  $('#letter').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  showToast('A little gift, from my heart to yours. ♡');
});

// Birthday countdown uses November 27 in the visitor's local time zone.
// It never assumes Dira's age or a birth year.
function updateBirthdayNote() {
  const now = new Date();
  const isBirthday = now.getMonth() === 10 && now.getDate() === 27;
  if (isBirthday) {
    const kicker = $('.hero-kicker');
    if (kicker) kicker.innerHTML = '27 NOVEMBER <span>✦</span> TODAY IS YOUR DAY';
  }
}
updateBirthdayNote();

// Gallery lightbox
const galleryItems = $$('.gallery-item');
const galleryImages = galleryItems.map(item => ({
  src: $('img', item).getAttribute('src'),
  alt: $('img', item).getAttribute('alt'),
  caption: $('strong', item).textContent
}));
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
let activePhoto = 0;
let previousFocus = null;
function showPhoto(index) {
  activePhoto = (index + galleryImages.length) % galleryImages.length;
  const photo = galleryImages[activePhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
  lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
}
galleryItems.forEach(item => item.addEventListener('click', () => {
  previousFocus = document.activeElement;
  showPhoto(Number(item.dataset.galleryIndex));
  if (typeof lightbox.showModal === 'function') lightbox.showModal();
  else lightbox.setAttribute('open', '');
  $('#lightboxClose').focus();
}));
$('#lightboxClose')?.addEventListener('click', () => lightbox.close());
$('#lightboxPrev')?.addEventListener('click', () => showPhoto(activePhoto - 1));
$('#lightboxNext')?.addEventListener('click', () => showPhoto(activePhoto + 1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => previousFocus?.focus());
document.addEventListener('keydown', event => {
  if (!lightbox?.open) return;
  if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
  if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
});

// Birthday song. Playback remains user-initiated; there is no autoplay.
const backgroundMusic = $('#backgroundMusic');
const musicToggle = $('#musicToggle');
const musicLabel = $('#musicLabel');
let musicAvailable = false;
let birthdaySongObjectUrl = null;
let giftPlaybackRequested = false;

async function prepareBirthdaySong() {
  const source = $('source', backgroundMusic);
  const directUrl = source?.src || new URL('assets/audio/happy-birthday-song.mp3', document.baseURI).href;
  const probe = new Audio();
  probe.preload = 'metadata';
  const directAvailable = await new Promise(resolve => {
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(value);
    };
    const timeout = window.setTimeout(() => finish(false), 6500);
    probe.addEventListener('canplay', () => finish(true), { once: true });
    probe.addEventListener('error', () => finish(false), { once: true });
    probe.src = directUrl;
    probe.load();
  });

  if (directAvailable) {
    backgroundMusic.src = directUrl;
    backgroundMusic.load();
    return true;
  }

  // GitHub Pages can serve the song as small text chunks if the binary MP3
  // is not present. Reassemble it locally into a playable audio Blob.
  musicLabel.textContent = 'Loading birthday song…';
  const partCount = 13;
  const paths = Array.from({ length: partCount }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `assets/audio/data/song-${number}.txt`;
  });
  const responses = await Promise.all(paths.map(path => fetch(path, { cache: 'force-cache' })));
  const failed = responses.find(response => !response.ok);
  if (failed) throw new Error(`Birthday song data could not be loaded (${failed.status}).`);

  const encodedSong = (await Promise.all(responses.map(response => response.text()))).join('').trim();
  if (!encodedSong || encodedSong.length % 4 !== 0) throw new Error('Birthday song data is incomplete.');
  const binarySong = atob(encodedSong);
  const songBytes = new Uint8Array(binarySong.length);
  for (let index = 0; index < binarySong.length; index += 1) {
    songBytes[index] = binarySong.charCodeAt(index);
  }
  birthdaySongObjectUrl = URL.createObjectURL(new Blob([songBytes], { type: 'audio/mpeg' }));
  backgroundMusic.src = birthdaySongObjectUrl;
  backgroundMusic.load();
  return true;
}

if (backgroundMusic && musicToggle) {
  musicToggle.disabled = true;
  prepareBirthdaySong().then(() => {
    musicAvailable = true;
    musicToggle.disabled = false;
    musicLabel.textContent = 'Play birthday song';
    musicToggle.setAttribute('aria-label', 'Play the birthday song');
    musicToggle.title = 'Tap to play Dira’s birthday song.';
    if (giftPlaybackRequested) startBirthdaySongFromGift();
  }).catch(error => {
    musicAvailable = false;
    musicToggle.disabled = true;
    musicLabel.textContent = 'Song unavailable';
    musicToggle.title = 'The birthday song could not be loaded. Check the audio files.';
    console.error(error);
  });

  musicToggle.addEventListener('click', async () => {
    if (!musicAvailable) return;
    try {
      if (backgroundMusic.paused) {
        await backgroundMusic.play();
        musicToggle.classList.add('is-playing');
        musicLabel.textContent = 'Pause song';
        musicToggle.setAttribute('aria-label', 'Pause the birthday song');
      } else {
        backgroundMusic.pause();
        musicToggle.classList.remove('is-playing');
        musicLabel.textContent = 'Play birthday song';
        musicToggle.setAttribute('aria-label', 'Play the birthday song');
      }
    } catch (error) {
      showToast('Your browser could not play that audio file.');
    }
  });
  backgroundMusic.addEventListener('ended', () => {
    musicToggle.classList.remove('is-playing');
    musicLabel.textContent = 'Play birthday song';
    musicToggle.setAttribute('aria-label', 'Play the birthday song');
  });
  window.addEventListener('pagehide', () => {
    if (birthdaySongObjectUrl) URL.revokeObjectURL(birthdaySongObjectUrl);
  }, { once: true });
}

// The special gift promise rotates gently while the card is on the page.
const futureGiftCard = $('#futureGiftCard');
const futureGiftPanel = $('#futureGiftPanel');
const futureGiftReveal = $('#futureGiftReveal');
const futureGiftActionLabel = $('#futureGiftActionLabel');
const futureGiftRotatingLine = $('#futureGiftRotatingLine');

const futureGiftMessages = [
  'Something special is being prepared just for you.',
  'Every little detail is being put together with care.',
  'Your special gift will reach you no later than February 14, 2027.',
  'Because someone as important as you deserves something beautiful.'
];
let futureGiftMessageIndex = 0;

if (futureGiftRotatingLine) {
  window.setInterval(() => {
    if (document.hidden) return;
    futureGiftRotatingLine.classList.add('is-changing');
    window.setTimeout(() => {
      futureGiftMessageIndex = (futureGiftMessageIndex + 1) % futureGiftMessages.length;
      futureGiftRotatingLine.textContent = futureGiftMessages[futureGiftMessageIndex];
      futureGiftRotatingLine.classList.remove('is-changing');
    }, 240);
  }, 3900);
}

function startBirthdaySongFromGift() {
  if (!backgroundMusic) return;
  giftPlaybackRequested = true;
  try {
    // Called directly from the user's card click so browser playback is user-initiated.
    const playRequest = backgroundMusic.play();
    if (playRequest && typeof playRequest.then === 'function') {
      playRequest.then(() => {
        musicToggle?.classList.add('is-playing');
        if (musicLabel) musicLabel.textContent = 'Pause song';
        musicToggle?.setAttribute('aria-label', 'Pause the birthday song');
      }).catch(error => {
        console.warn('Birthday song could not start yet:', error);
        if (!musicAvailable) {
          showToast('Your birthday song is getting ready. Please keep the page open.');
        } else {
          showToast('Tap “Play birthday song” if your browser blocked playback.');
        }
      });
    }
  } catch (error) {
    console.warn('Birthday song playback error:', error);
    showToast('The birthday song could not start in this browser.');
  }
}

futureGiftCard?.addEventListener('click', () => {
  const isOpen = futureGiftCard.getAttribute('aria-expanded') === 'true';
  const willOpen = !isOpen;
  futureGiftCard.setAttribute('aria-expanded', String(willOpen));
  futureGiftCard.classList.toggle('is-open', willOpen);
  if (futureGiftReveal) futureGiftReveal.hidden = !willOpen;
  futureGiftPanel?.classList.toggle('is-open', willOpen);

  if (willOpen) {
    if (futureGiftActionLabel) futureGiftActionLabel.textContent = 'YOUR SPECIAL GIFT IS IN THE MAKING';
    launchCelebration(futureGiftCard);
    startBirthdaySongFromGift();
    showToast('A special promise, just for you, Dira. ♥');
  } else {
    if (futureGiftActionLabel) futureGiftActionLabel.textContent = 'CLICK ON TO VIEW IT';
  }
});

// Final surprise reveal
const revealSurprise = $('#revealSurprise');
const surpriseMessage = $('#surpriseMessage');
revealSurprise?.addEventListener('click', () => {
  const isOpen = revealSurprise.getAttribute('aria-expanded') === 'true';
  revealSurprise.setAttribute('aria-expanded', String(!isOpen));
  surpriseMessage.hidden = isOpen;
  revealSurprise.querySelector('span:first-child').textContent = isOpen ? 'Reveal your surprise' : 'Close your surprise';
  if (!isOpen) {
    launchCelebration(revealSurprise);
    highlightGift('#surpriseMessage .surprise-envelope');
    window.setTimeout(() => surpriseMessage.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }), 80);
  }
});

// A playful random wish drawn only from the ten wishes already on this page.
const wishes = [
  'May your faith in God grow stronger every day.',
  'May you never lack peace in your heart.',
  'May God bless your education and your dreams.',
  'May your family always be surrounded by love.',
  'May you find strength in difficult moments.',
  'May your beautiful heart never lose its kindness.',
  'May you discover more of your purpose.',
  'May happiness find you in unexpected ways.',
  'May God guide every decision you make.',
  'May your future be more beautiful than you imagine.'
];
let lastWishIndex = -1;
$('#blessingButton')?.addEventListener('click', () => {
  let nextIndex = Math.floor(Math.random() * wishes.length);
  if (wishes.length > 1 && nextIndex === lastWishIndex) nextIndex = (nextIndex + 1) % wishes.length;
  lastWishIndex = nextIndex;
  $('#blessingResult').textContent = `A little blessing for you: ${wishes[nextIndex]}`;
});