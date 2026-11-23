/**
 * Pongal 2027 - Karlsruhe Tamil Sangam
 * Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPetalsCanvas();
  initMobileMenu();
  initCalendarGenerator();
  initSmoothScroll();
  initInteractivePot();
});

/* -------------------------------------------------------------
 * 1. COUNTDOWN TIMER TO FEB 06, 2027 (10:00 AM CET)
 * ----------------------------------------------------------- */
function initCountdown() {
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
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let petalsRunning = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const petalCount = window.innerWidth < 768 ? 20 : 38;
  const petals = [];

  const petalTypes = [
    { color: '#f59e0b', stroke: '#d97706', type: 'marigold' },
    { color: '#fde047', stroke: '#eab308', type: 'yellow' },
    { color: '#fffbeb', stroke: '#fef08a', type: 'jasmine' },
    { color: '#ea580c', stroke: '#c2410c', type: 'orange' }
  ];

  for (let i = 0; i < petalCount; i++) {
    const pType = petalTypes[Math.floor(Math.random() * petalTypes.length)];
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      radius: Math.random() * 5 + 4,
      d: Math.random() * petalCount,
      color: pType.color,
      stroke: pType.stroke,
      tilt: Math.random() * 10 - 10,
      tiltAngleInc: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
      opacity: Math.random() * 0.5 + 0.4
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = p.stroke;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle);

      ctx.ellipse(0, 0, p.radius, p.radius * 1.6, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function update() {
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(p.d) + 1.2 + p.radius / 3.5) * 0.8;
      p.x += Math.sin(p.d) * 0.9;

      if (p.y > canvas.height) {
        petals[i].x = Math.random() * canvas.width;
        petals[i].y = -20;
      }
    }
  }

  function loop() {
    if (!petalsRunning) return;
    draw();
    update();
    animationFrameId = requestAnimationFrame(loop);
  }

  loop();

  const toggleBtn = document.getElementById('toggle-petals');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsRunning = !petalsRunning;
      if (petalsRunning) {
        toggleBtn.innerText = '🌸';
        toggleBtn.setAttribute('title', 'Pause Flower Shower');
        loop();
      } else {
        toggleBtn.innerText = '🚫';
        toggleBtn.setAttribute('title', 'Resume Flower Shower');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrameId);
      }
    });
  }
}

/* -------------------------------------------------------------
 * 3. CALENDAR EXPORT (GOOGLE CALENDAR & ICAL / .ICS DOWNLOAD)
 * ----------------------------------------------------------- */
function initCalendarGenerator() {
  const gCalBtn = document.getElementById('add-to-gcal');
  const iCalBtn = document.getElementById('download-ical');

  const eventDetails = {
    title: '🌟 Tamil Pongal Celebration 2027 | Karlsruhe Tamil Sangam',
    description: 'Vanakkam Makkale! Join us for a grand Pongal celebration starting with auspicious lamp lighting & Iraivanakkam prayer, followed by cultural dance & music, games for kids & families, and an authentic traditional feast! Organized with love by Karlsruhe Tamil Sangam.\n\nNote: Exact timings will be confirmed soon.\n\nEvent & Registration: Beethovenstraße 4, 76448 Durmersheim-Würmersheim',
    location: 'Beethovenstraße 4, 76448 Durmersheim-Würmersheim, Germany',
    startISO: '20270206',
    endISO: '20270207'
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
      link.setAttribute('download', 'Tamil_Pongal_Karlsruhe_2027.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/* -------------------------------------------------------------
 * 5. MOBILE NAVIGATION MENU
 * ----------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
  }

  window.closeMobileMenu = closeMenu;

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* -------------------------------------------------------------
 * 6. SMOOTH SCROLLING FOR ALL ANCHORS
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
 * 7. SHARE & COPY EVENT FUNCTIONS
 * ----------------------------------------------------------- */
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1yyDVn4tWpFR0QwoZpiqSF2hNMdnE9YBdH0jOhtTd7BQ/edit?usp=sharing';

window.shareWhatsApp = function () {
  const message = '🌾 Vanakkam Makkale! Pongal 2027 Celebration in Karlsruhe Region! 🌾\n\n' +
    '📅 Date: Saturday, 06 February 2027\n' +
    '📍 Venue: Beethovenstraße 4, 76448 Durmersheim-Würmersheim\n' +
    '📊 Register on Google Sheet: ' + SPREADSHEET_URL + '\n\n' +
    'Karlsruhe Tamil Sangam';
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
};

window.copyEventLink = function () {
  const text = '🌟 Tamil Pongal 2027 - Karlsruhe Tamil Sangam\n' +
    '📅 Saturday, 06 February 2027\n' +
    '📍 Beethovenstraße 4, 76448 Durmersheim-Würmersheim\n' +
    '📊 Register on Google Sheet: ' + SPREADSHEET_URL;

  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Event info & spreadsheet link copied to clipboard!');
  }).catch(() => {
    showToast('Spreadsheet Link: ' + SPREADSHEET_URL);
  });
};

/* -------------------------------------------------------------
 * 8. CUSTOM TOAST NOTIFICATIONS
 * ----------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('festive-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'festive-toast';
    toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-maroon-950/95 text-amber-200 border-2 border-amber-400 px-6 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold transition-all duration-300 opacity-0 pointer-events-none text-center max-w-sm';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');

  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 4000);
}

/* -------------------------------------------------------------
 * 9. INTERACTIVE PONGAL POT ANIMATION CLICK
 * ----------------------------------------------------------- */
function initInteractivePot() {
  const pot = document.getElementById('pongal-hero-interactive');
  if (!pot) return;

  pot.addEventListener('click', () => {
    showToast('🌾 பொங்கலோ பொங்கல்! பால் பொங்கி வரட்டும், வாழ்வு செழிக்கட்டும்! 🌾');
    pot.classList.add('scale-105');
    setTimeout(() => {
      pot.classList.remove('scale-105');
    }, 350);
  });
}