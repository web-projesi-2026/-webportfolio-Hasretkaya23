/* ================================================
   StudyUp – Main JavaScript File
   assets/js/main.js
   ================================================ */

/* ── ROOT PATH YARDIMCISI ─────────────────────────
   pages/ veya php/ altındaysak '../' döndürür,
   kök dizindeyse '' döndürür.
   Login/logout yönlendirmeleri ve fetch URL'leri
   bu fonksiyonu kullanır.
─────────────────────────────────────────────────── */
function getRootPath() {
  var path = window.location.pathname;
  if (path.includes('/pages/') || path.includes('/php/')) return '../';
  return '';
}

/* ── AKTİF NAV LİNKİ ─────────────────────────────
   Hangi sayfada olduğumuzu anlayıp ilgili
   nav linkine 'active' class'ı ekler.
─────────────────────────────────────────────────── */
function initActiveNav() {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, #mobile-menu a').forEach(function(link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current) {
      link.classList.add('active');
      // Varsa inline stil ile aktif rengi kaldır (JS yönetsin)
      link.removeAttribute('style');
    }
  });
}

/* ── SCROLL REVEAL (including stagger) ─── */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal, .stagger-children');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { obs.observe(el); });
}

/* ── QUOTES ───────────────────────────── */
var QUOTES = [
  { text: "Success is the sum of small efforts repeated every day.", author: "Robert Collier" },
  { text: "Learning never exhausts the mind. The mind is exhausted by inactivity.", author: "Leonardo da Vinci" },
  { text: "Today's difficult thing will be tomorrow's routine. Don't give up.", author: "StudyUp Team" },
  { text: "Failure is an opportunity to begin again more intelligently.", author: "Henry Ford" },
  { text: "Set a goal, make a plan, work hard. The rest is just time.", author: "StudyUp Team" },
  { text: "Education is the best passport to the future.", author: "Malcolm X" },
  { text: "Hard things become easier over time. What matters is not giving up.", author: "StudyUp Team" },
  { text: "Every great journey begins with a single step.", author: "Lao Tzu" },
  { text: "Do not postpone what you can do today. Tomorrow brings new tasks.", author: "StudyUp Team" },
  { text: "Success depends not on luck, but on planning and determination.", author: "StudyUp Team" }
];

var activeQuoteIndex = 0;

function initMotivation() {
  var textEl   = document.getElementById('quote-text');
  var authorEl = document.getElementById('quote-author');
  var btn      = document.getElementById('quote-btn');
  if (!textEl || !btn) return;
  activeQuoteIndex = new Date().getDay() % QUOTES.length;
  showQuote(activeQuoteIndex);
  btn.addEventListener('click', function() {
    activeQuoteIndex = (activeQuoteIndex + 1) % QUOTES.length;
    textEl.style.opacity = '0'; textEl.style.transform = 'translateY(10px)'; authorEl.style.opacity = '0';
    setTimeout(function() {
      showQuote(activeQuoteIndex);
      textEl.style.opacity = '1'; textEl.style.transform = 'translateY(0)'; authorEl.style.opacity = '1';
    }, 280);
  });
  function showQuote(i) {
    textEl.textContent   = '"' + QUOTES[i].text + '"';
    authorEl.textContent = '— ' + QUOTES[i].author;
  }
}

/* ── STREAK ───────────────────────────── */
function initStreak() {
  var totalEl  = document.getElementById('total-count');
  var streakEl = document.getElementById('streak-count');
  var btn      = document.getElementById('study-btn');
  if (!btn) return;
  var total    = parseInt(localStorage.getItem('su_total')  || '0');
  var streak   = parseInt(localStorage.getItem('su_streak') || '0');
  var lastDate = localStorage.getItem('su_date') || '';
  if (totalEl)  totalEl.textContent  = total;
  if (streakEl) streakEl.textContent = streak;
  btn.addEventListener('click', function() {
    var today = new Date().toDateString();
    if (lastDate !== today) {
      var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      streak = (lastDate === yesterday.toDateString()) ? streak + 1 : 1;
      lastDate = today;
      localStorage.setItem('su_date', lastDate); localStorage.setItem('su_streak', streak);
      if (streakEl) streakEl.textContent = streak;
    }
    total++; localStorage.setItem('su_total', total);
    if (totalEl) {
      totalEl.textContent = total; totalEl.style.transform = 'scale(1.4)'; totalEl.style.color = '#f472b6';
      setTimeout(function() { totalEl.style.transform = 'scale(1)'; totalEl.style.color = 'var(--blue)'; }, 350);
    }
  });
}

/* ── TASK DEMO ────────────────────────── */
function initTaskDemo() {
  window.demoToggle = function(btn) {
    var task = btn.closest('.gdemo-task');
    task.classList.toggle('completed'); btn.classList.toggle('checked');
    btn.textContent = task.classList.contains('completed') ? '✔' : '○';
    updateDemo();
  };
  window.demoDelete = function(btn) {
    var task = btn.closest('.gdemo-task');
    task.style.opacity = '0'; task.style.transform = 'translateX(20px)'; task.style.transition = 'opacity .25s, transform .25s';
    setTimeout(function() { task.remove(); updateDemo(); }, 260);
  };
  window.demoAdd = function() {
    var input = document.getElementById('demo-input');
    var text  = input ? input.value.trim() : '';
    if (!text) return;
    var list = document.getElementById('demo-task-list');
    var div  = document.createElement('div');
    div.className = 'gdemo-task';
    div.innerHTML = '<button class="gtask-check-btn" onclick="demoToggle(this)">○</button><div class="gtask-info"><span class="gtask-title">' + escHTML(text) + '</span><span class="gtask-meta mid">🟡 Medium · Today</span></div><button class="gtask-del-btn" onclick="demoDelete(this)">×</button>';
    div.style.opacity = '0'; div.style.transform = 'translateY(-8px)';
    list.appendChild(div);
    requestAnimationFrame(function() { div.style.transition = 'opacity .3s, transform .3s'; div.style.opacity = '1'; div.style.transform = 'translateY(0)'; });
    input.value = ''; updateDemo();
  };
  var inp = document.getElementById('demo-input');
  if (inp) { inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') window.demoAdd(); }); }
  function updateDemo() {
    var list = document.getElementById('demo-task-list'); if (!list) return;
    var all = list.querySelectorAll('.gdemo-task'); var completed = list.querySelectorAll('.gdemo-task.completed');
    var pct = all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0;
    var fillEl = document.getElementById('demo-fill'); var pctEl = document.getElementById('demo-pct'); var doneEl = document.getElementById('demo-completed');
    if (fillEl) fillEl.style.width = pct + '%'; if (pctEl) pctEl.textContent = pct + '%'; if (doneEl) doneEl.textContent = completed.length;
  }
}

function escHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── NAV SCROLL SHADOW ─────────────────── */
function initNavScroll() {
  var nav = document.getElementById('navbar'); if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 40 ? '0 4px 30px rgba(0,0,0,.4)' : 'none';
  });
}

/* ── SMOOTH SCROLL ────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── HAMBURGER MENU ───────────────────── */
function initHamburger() {
  var btn  = document.getElementById('hamburger-btn');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL TO TOP ────────────────────── */
function initScrollTop() {
  var btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── DARK / LIGHT THEME TOGGLE ───────── */
function initThemeToggle() {
  var btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  // Kaydedilmiş tercihi uygula
  if (localStorage.getItem('su_theme') === 'light') {
    document.body.classList.add('light-mode');
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  btn.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    btn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('su_theme', isLight ? 'light' : 'dark');
    // Spin animasyonu
    btn.classList.add('spin');
    setTimeout(function() { btn.classList.remove('spin'); }, 420);
  });
}

/* ── POMODORO TIMER ───────────────────── */
function initPomodoro() {
  var timeEl    = document.getElementById('pomo-time');
  var fillEl    = document.getElementById('pomo-fill');
  var startBtn  = document.getElementById('pomo-start-btn');
  var resetBtn  = document.getElementById('pomo-reset-btn');
  var sessionNumEl  = document.getElementById('pomo-session-num');
  var sessionLblEl  = document.getElementById('pomo-session-label');
  var modeBtns  = document.querySelectorAll('.pomo-mode-btn');
  if (!timeEl || !startBtn) return;

  var totalTime    = 1500;
  var timeLeft     = totalTime;
  var isRunning    = false;
  var interval     = null;
  var sessionCount = 1;

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updateDisplay() {
    timeEl.textContent = formatTime(timeLeft);
    var pct = ((totalTime - timeLeft) / totalTime) * 100;
    fillEl.style.width = (100 - pct) + '%';
  }

  function stopTimer() {
    clearInterval(interval);
    isRunning = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
  }

  function startTimer() {
    isRunning = true;
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    interval = setInterval(function() {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        stopTimer();
        sessionCount++;
        if (sessionNumEl) sessionNumEl.textContent = sessionCount;
        timeLeft = 0;
        updateDisplay();
      }
    }, 1000);
  }

  startBtn.addEventListener('click', function() {
    if (isRunning) { stopTimer(); } else { startTimer(); }
  });

  resetBtn.addEventListener('click', function() {
    stopTimer();
    timeLeft = totalTime;
    updateDisplay();
  });

  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      stopTimer();
      totalTime = parseInt(btn.getAttribute('data-time'));
      timeLeft  = totalTime;
      var mode  = btn.getAttribute('data-mode');
      if (sessionLblEl) {
        sessionLblEl.textContent = mode === 'pomodoro' ? 'Focus time' : mode === 'short' ? 'Short break' : 'Long break';
      }
      updateDisplay();
    });
  });

  updateDisplay();
}

/* ── INIT ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initActiveNav();
  initScrollReveal();
  initMotivation();
  initStreak();
  initTaskDemo();
  initNavScroll();
  initSmoothScroll();
  initHamburger();
  initScrollTop();
  initThemeToggle();
  initPomodoro();
});
