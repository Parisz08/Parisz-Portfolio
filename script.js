// =============================================
// ⚠️  WEB3FORMS SETUP — ISI ACCESS KEY DI BAWAH
// =============================================
// 1. Buka https://web3forms.com
// 2. Masukkan email kamu → klik "Create Access Key"
// 3. Cek inbox → copy Access Key
// 4. Paste di bawah ini
// =============================================
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // ← ganti
// =============================================

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const links     = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const isOpen    = links.classList.contains('open');

  if (isOpen) {
    links.classList.remove('open');
    hamburger.classList.remove('active');
  } else {
    links.classList.add('open');
    hamburger.classList.add('active');
  }
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  const nav  = document.getElementById('navbar');
  const menu = document.getElementById('navLinks');
  if (!nav.contains(e.target) && menu.classList.contains('open')) {
    menu.classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  }
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + '+';
      if (current >= target) clearInterval(iv);
    }, 25);
  });
}
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); entries[0].target._obs?.disconnect(); }
  }, { threshold: 0.5 }).observe(statsBar);
}

// ===== SKILL BAR ANIMATION =====
const expSection = document.getElementById('experience');
if (expSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.exp-skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }
  }, { threshold: 0.3 }).observe(expSection);
}

// ===== GREETING ROTATION =====
const greetings = ['Hi','Halo','Hola','Hej','Ciao','Bonjour','こんにちは','안녕','你好','مَرْحَبًا'];
let gi = 0;
const greetEl = document.getElementById('greeting-word');
setInterval(() => {
  greetEl.style.opacity = '0';
  greetEl.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    gi = (gi + 1) % greetings.length;
    greetEl.textContent = greetings[gi];
    greetEl.style.opacity = '1';
    greetEl.style.transform = 'translateY(0)';
  }, 350);
}, 2000);

// ===== ACTIVE NAV =====
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--orange)' : '';
  });
});

// ===== DARK MODE =====
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');
  icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
(function () {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  }
})();

// =============================================
// ===== EMAILJS CONTACT FORM =====
// =============================================
function setButtonState(loading) {
  const btn  = document.getElementById('submitBtn');
  const text = btn.querySelector('.btn-submit-text');
  const spin = btn.querySelector('.btn-submit-loading');
  btn.disabled = loading;
  text.style.display = loading ? 'none'  : 'inline-flex';
  spin.style.display = loading ? 'inline-flex' : 'none';
}

function showError(show) {
  document.getElementById('formError').style.display = show ? 'flex' : 'none';
}

function showSuccess() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  form.style.opacity    = '0';
  form.style.transform  = 'translateY(20px)';
  setTimeout(() => {
    form.style.display    = 'none';
    success.style.display = 'flex';
    // trigger animation
    requestAnimationFrame(() => success.classList.add('visible'));
  }, 300);
}

function resetContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  success.classList.remove('visible');
  setTimeout(() => {
    success.style.display = 'none';
    form.style.display    = 'grid';
    form.reset();
    requestAnimationFrame(() => {
      form.style.opacity   = '1';
      form.style.transform = 'translateY(0)';
    });
  }, 300);
}

async function handleSubmit(e) {
  e.preventDefault();

  // Validate all required fields
  const fields = [
    { id: 'name',    hint: 'nameHint',    type: 'text'  },
    { id: 'email',   hint: 'emailHint',   type: 'email' },
    { id: 'phone',   hint: 'phoneHint',   type: 'text'  },
    { id: 'subject', hint: 'subjectHint', type: 'text'  },
    { id: 'message', hint: 'messageHint', type: 'text'  },
  ];

  let firstInvalid = null;

  fields.forEach(({ id, hint, type }) => {
    const el     = document.getElementById(id);
    const hintEl = document.getElementById(hint);
    let valid    = el.value.trim() !== '';

    // Extra check for email format
    if (type === 'email' && valid) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    }

    if (!valid) {
      el.classList.add('invalid');
      hintEl.style.display = 'flex';
      if (!firstInvalid) firstInvalid = el;
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        hintEl.style.display = 'none';
      }, { once: true });
    } else {
      el.classList.remove('invalid');
      hintEl.style.display = 'none';
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  showError(false);
  setButtonState(true);

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    name:       document.getElementById('name').value,
    email:      document.getElementById('email').value,
    phone:      document.getElementById('phone').value || '—',
    subject:    document.getElementById('subject').value || '(No Subject)',
    message:    document.getElementById('message').value,
    botcheck:   '',
  };

  // Debug: cek payload sebelum kirim
  console.log('📤 Sending to Web3Forms...', payload);

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('📬 Web3Forms response:', data);

    if (data.success) {
      setButtonState(false);
      showSuccess();
    } else {
      console.error('❌ Web3Forms rejected:', data.message);
      throw new Error(data.message);
    }
  } catch (err) {
    console.error('❌ Web3Forms error:', err);
    setButtonState(false);
    showError(true);
  }
}