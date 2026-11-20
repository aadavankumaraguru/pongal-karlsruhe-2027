/**
 * Pongal 2027 - Karlsruhe Tamil Sangam
 * Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPetalsCanvas();
  initFestiveAudio();
  initMobileMenu();
  initCalendarGenerator();
  initFaqAccordion();
  initSmoothScroll();
});

/* -------------------------------------------------------------
 * 1. COUNTDOWN TIMER TO FEB 06, 2027 (10:00 AM CET)
 * ----------------------------------------------------------- */
function initCountdown() {
  // February 6, 2027, 10:00:00 CET
  const targetDate = new Date('2027-02-06T10:00:00+01:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-minutes');
  const secsEl = document.getElementById('count-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      const banner = document.getElementById('countdown-status');
      if (banner) banner.innerText = '🌾 இனிய தைப்பொங்கல் நல்வாழ்த்துகள்! Celebration is Live! 🎉';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(minutes).padStart(2, '0');
    secsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------
 * 2. FLOATING MARIGOLD & JASMINE PETALS (HTML5 CANVAS)
 * ----------------------------------------------------------- */
let petalsActive = true;
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = Math.min(30, Math.floor(width / 35));
  const petals = [];

  const petalColors = [
    { fill: '#f59e0b', stroke: '#d97706', type: 'marigold-orange' },
    { fill: '#fbbf24', stroke: '#d97706', type: 'marigold-yellow' },
    { fill: '#fef08a', stroke: '#facc15', type: 'jasmine-gold' },
    { fill: '#ffffff', stroke: '#fef9c3', type: 'jasmine-white' }
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push(createPetal(width, height, petalColors, true));
  }

  function createPetal(w, h, colors, randomY = false) {
    const colorObj = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -20,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      oscillation: Math.random() * 2,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      color: colorObj
    };
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (petalsActive) {
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.oscillation) * 0.8 + p.speedX;
        p.oscillation += p.oscillationSpeed;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.fillStyle = p.color.fill;
        ctx.strokeStyle = p.color.stroke;
        ctx.lineWidth = 0.5;

        // Draw tear-drop shaped petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.6, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.6, -p.size * 0.8, -p.size * 0.4, 0, -p.size);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // Recycle petal
        if (p.y > height + 25 || p.x < -30 || p.x > width + 30) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });
    }

    requestAnimationFrame(render);
  }

  render();

  // Toggle button setup
  const toggleBtn = document.getElementById('toggle-petals');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsActive = !petalsActive;
      toggleBtn.classList.toggle('opacity-50', !petalsActive);
      toggleBtn.setAttribute('title', petalsActive ? 'Pause falling petals' : 'Play falling petals');
      showToast(petalsActive ? '🌸 Flower shower enabled' : '🌸 Flower shower paused');
    });
  }
}

/* -------------------------------------------------------------
 * 3. FESTIVE WEB-AUDIO HARMONY (NADASWARAM / BELL CHIMES)
 * ----------------------------------------------------------- */
function initFestiveAudio() {
  let audioCtx = null;
  let isPlaying = false;
  let melodyInterval = null;

  const audioBtn = document.getElementById('toggle-audio');
  if (!audioBtn) return;

  // Traditional pentatonic festive scale (Raga Mohanam: C4, D4, E4, G4, A4, C5)
  // Sa, Ri2, Ga3, Pa, Dha2, Sa'
  const mohanamFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];

  function playBellNote(freq, time, duration = 1.2, volume = 0.08) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Harmonics for bell/shehnai resonance
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  function playFestivePhrase() {
    if (!audioCtx || !isPlaying) return;
    const now = audioCtx.currentTime;

    // A cheerful traditional auspicious sequence
    const sequence = [
      { f: mohanamFreqs[0], d: 0.0 },
      { f: mohanamFreqs[1], d: 0.3 },
      { f: mohanamFreqs[2], d: 0.6 },
      { f: mohanamFreqs[3], d: 0.9 },
      { f: mohanamFreqs[4], d: 1.2 },
      { f: mohanamFreqs[5], d: 1.5 }
    ];

    sequence.forEach((note) => {
      playBellNote(note.f, now + note.d, 1.0, 0.05);
    });
  }

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      audioBtn.classList.add('bg-amber-500', 'text-amber-950');
      audioBtn.classList.remove('bg-amber-950/80', 'text-amber-300');
      document.getElementById('audio-icon-path').setAttribute('d', 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z');
      playFestivePhrase();
      melodyInterval = setInterval(playFestivePhrase, 4500);
      showToast('🪕 Traditional festive chime playing');
    } else {
      audioBtn.classList.remove('bg-amber-500', 'text-amber-950');
      audioBtn.classList.add('bg-amber-950/80', 'text-amber-300');
      if (melodyInterval) clearInterval(melodyInterval);
      showToast('🔇 Festive chime paused');
    }
  });
}

/* -------------------------------------------------------------
 * 4. CALENDAR EXPORT (GOOGLE CALENDAR & ICAL / .ICS DOWNLOAD)
 * ----------------------------------------------------------- */
function initCalendarGenerator() {
  const gCalBtn = document.getElementById('add-to-gcal');
  const iCalBtn = document.getElementById('download-ical');

  const eventDetails = {
    title: '🌟 Tamil Pongal Celebration 2027 | Karlsruhe Tamil Sangam',
    description: 'Vanakkam Makkale! Join us for a grand Pongal celebration filled with traditional Pongal cooking, cultural dance, Kolam competition, games, and a festive traditional feast on banana leaf! Organized with love by Karlsruhe Tamil Sangam.\n\nSpreadsheet Registration & Volunteer Link: https://docs.google.com/spreadsheets/d/1yyDVn4tWpFR0QwoZpiqSF2hNMdnE9YBdH0jOhtTd7BQ/edit?usp=sharing',
    location: 'Beethovenstraße 4, 76448 Durmersheim-Würmersheim, Germany',
    startISO: '20270206T090000Z', // 10:00 CET = 09:00 UTC
    endISO: '20270206T170000Z'    // 18:00 CET = 17:00 UTC
  };

  if (gCalBtn) {
    gCalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startISO}/${eventDetails.endISO}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
      window.open(gcalUrl, '_blank');
    });
  }

  if (iCalBtn) {
    iCalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Karlsruhe Tamil Sangam//Pongal 2027//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${eventDetails.location}`,
        `DTSTART:${eventDetails.startISO}`,
        `DTEND:${eventDetails.endISO}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Tamil_Pongal_2027_Karlsruhe.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📅 Calendar invite (.ics) downloaded!');
    });
  }
}

/* -------------------------------------------------------------
 * 5. FAQ ACCORDION
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other accordions
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.add('hidden');
          }
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle clicked
      btn.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('hidden', isExpanded);
      }
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 6. MOBILE MENU
 * ----------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* -------------------------------------------------------------
 * 7. TOAST NOTIFICATION & SHARE
 * ----------------------------------------------------------- */
window.showToast = function (message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-amber-500 text-amber-950 font-semibold px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-2 border border-amber-300';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.remove('translate-y-12', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
};

window.copyEventLink = function () {
  const shareData = {
    title: '🌟 Pongal 2027 in Karlsruhe',
    text: '🌾 Vanakkam Makkale! Let’s celebrate Pongal 2027 together with Karlsruhe Tamil Sangam on Saturday, 06 February 2027 at Beethovenstraße 4, 76448 Durmersheim-Würmersheim. Register & volunteer here:',
    url: 'https://docs.google.com/spreadsheets/d/1yyDVn4tWpFR0QwoZpiqSF2hNMdnE9YBdH0jOhtTd7BQ/edit?usp=sharing'
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).then(() => {
      showToast('📋 Event info & Spreadsheet link copied to clipboard!');
    });
  }
};

window.shareWhatsApp = function () {
  const text = encodeURIComponent(
    '🌟 *PONGAL 2027 CELEBRATION* 🌟\n' +
    '🙏 *Vanakkam Makkale!* 🙏\n' +
    'Get ready for Pongal celebration! 🌾🎉 Let’s come together with family and friends to celebrate our traditions. ❤️\n\n' +
    '📅 *Date:* Saturday, 06 February 2027\n' +
    '📍 *Venue:* Beethovenstraße 4, 76448 Durmersheim-Würmersheim\n' +
    '📝 *Register & Volunteer:* https://docs.google.com/spreadsheets/d/1yyDVn4tWpFR0QwoZpiqSF2hNMdnE9YBdH0jOhtTd7BQ/edit?usp=sharing\n\n' +
    'அன்புடன்,\n*Karlsruhe Tamil Sangam*'
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
};

/* -------------------------------------------------------------
 * 8. SMOOTH SCROLL FOR IN-PAGE ANCHORS
 * ----------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 9. SPREADSHEET MODAL / VOLUNTEER ASSISTANT
 * ----------------------------------------------------------- */
window.openSpreadsheetModal = function (roleType = '') {
  const modal = document.getElementById('spreadsheet-guide-modal');
  if (!modal) return;
  const roleSpan = document.getElementById('modal-suggested-role');
  if (roleSpan) {
    roleSpan.innerText = roleType ? `Selected Role: ${roleType}` : '';
  }
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeSpreadsheetModal = function () {
  const modal = document.getElementById('spreadsheet-guide-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};
