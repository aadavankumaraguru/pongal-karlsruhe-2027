/**
 * Pongal 2027 - Karlsruhe Tamil Sangam
 * Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPetalsCanvas();
  initMobileMenu();
  initCalendarGenerator();
  initFaqAccordion();
  initSmoothScroll();
  initInteractivePot();
  initRegistrationForm();
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
    description: 'Vanakkam Makkale! Join us for a grand Pongal celebration filled with traditional Pongal cooking & puja, cultural dance & music, games for kids & families, and an authentic traditional feast! Organized with love by Karlsruhe Tamil Sangam.\n\nNote: Exact timings will be confirmed soon.\n\nRegistration Link: https://docs.google.com/spreadsheets/d/1yyDVn4tWpFR0QwoZpiqSF2hNMdnE9YBdH0jOhtTd7BQ/edit?usp=sharing',
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
 * 4. FAQ ACCORDION
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const toggles = document.querySelectorAll('.faq-toggle');

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');

      toggles.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.add('hidden');
          }
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

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

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
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
window.shareWhatsApp = function () {
  const message = '🌾 Vanakkam Makkale! Pongal 2027 Celebration in Karlsruhe Region! 🌾\n\n' +
    '📅 Date: Saturday, 06 February 2027\n' +
    '📍 Venue: Beethovenstraße 4, 76448 Durmersheim-Würmersheim\n' +
    '📝 Register & Volunteer Online: ' + window.location.href + '#register-form-section\n\n' +
    'Karlsruhe Tamil Sangam';
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
};

window.copyEventLink = function () {
  const text = '🌟 Tamil Pongal 2027 - Karlsruhe Tamil Sangam\n' +
    '📅 Saturday, 06 February 2027\n' +
    '📍 Beethovenstraße 4, 76448 Durmersheim-Würmersheim\n' +
    '📝 Register Online: ' + window.location.href + '#register-form-section';

  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Event info & link copied to clipboard!');
  }).catch(() => {
    showToast('Link: ' + window.location.href);
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

/* -------------------------------------------------------------
 * 10. INTERACTIVE PONGAL POT ANIMATION CLICK
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

/* -------------------------------------------------------------
 * 11. ONLINE REGISTRATION & VOLUNTEER FORM HANDLER
 * ----------------------------------------------------------- */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDjeJcuFze4WLNNCCoQ1JuGhX2AmJuJLzsIDfoAXiWEs8E5quwj_QUKbIRE8o8AiDx/exec';

function initRegistrationForm() {
  const form = document.getElementById('pongal-registration-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn');
  const btnIcon = document.getElementById('btn-icon');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-error-banner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkedTeams = [];
    document.querySelectorAll('input[name="volunteer-team"]:checked').forEach((cb) => {
      checkedTeams.push(cb.value);
    });

    const formData = {
      participants: document.getElementById('form-participants')?.value?.trim() || '',
      adults: document.getElementById('form-adults')?.value || '1',
      kidsUnder5: document.getElementById('form-kids-under5')?.value || '0',
      kids5to15: document.getElementById('form-kids-5to15')?.value || '0',
      kidsNamesAges: document.getElementById('form-kids-names')?.value?.trim() || '',
      isStudent: document.getElementById('form-student')?.value || 'No',
      contactNumber: document.getElementById('form-contact')?.value?.trim() || '',
      volunteerTeams: checkedTeams.join(', ')
    };

    if (submitBtn) submitBtn.disabled = true;
    if (btnIcon) btnIcon.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Saving to Sheet... • பதிவு செய்யப்படுகிறது...';
    if (errorBanner) errorBanner.classList.add('hidden');

    try {
      // Send single clean URL-encoded POST request
      const params = new URLSearchParams();
      for (const key in formData) {
        params.append(key, formData[key]);
      }

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (successBanner) {
        successBanner.classList.remove('hidden');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.classList.add('hidden');
      showToast('🎉 உங்கள் பதிவு வெற்றிகரமாக சேர்க்கப்பட்டது! (Registration Saved)');
    } catch (err) {
      console.error('Registration submit error:', err);
      if (errorBanner) {
        errorBanner.classList.remove('hidden');
      }
      showToast('⚠️ Registration failed. Please check internet or try again.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnIcon) btnIcon.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
      if (btnText) btnText.textContent = 'Submit Registration • பதிவு செய்க';
    }
  });
}

window.resetPongalForm = function() {
  const form = document.getElementById('pongal-registration-form');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-error-banner');
  if (form) {
    form.reset();
    form.classList.remove('hidden');
  }
  if (successBanner) successBanner.classList.add('hidden');
  if (errorBanner) errorBanner.classList.add('hidden');
};