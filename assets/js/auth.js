/* ================================================
   StudyUp – Auth JavaScript (PHP Backend ile)
   assets/js/auth.js
   ================================================ */

/* getRootPath main.js'de tanımlıdır; auth.js her zaman
   main.js'den SONRA yüklenir. Tek kaynak burası. */
function getAuthRootPath() {
  var path = window.location.pathname;
  if (path.includes('/pages/') || path.includes('/php/')) return '../';
  return '';
}

var DEPARTMENTS = {
  undergraduate: [
    'Computer Engineering','Software Engineering','Electrical-Electronics Engineering',
    'Mechanical Engineering','Civil Engineering','Industrial Engineering',
    'Chemical Engineering','Biomedical Engineering','Medicine','Dentistry','Pharmacy',
    'Nursing','Physiotherapy and Rehabilitation','Business Administration','Economics',
    'Law','Psychology','Sociology','International Relations',
    'Political Science and Public Administration','Mathematics Teaching','Science Teaching',
    'Turkish Language Teaching','English Language Teaching','Pre-School Teaching',
    'Primary School Teaching','Graphic Design','Communication Design',
    'Radio Television and Cinema','Journalism','Mathematics','Physics','Chemistry',
    'Biology','Architecture','Veterinary Medicine','History','Philosophy',
    'Turkish Language and Literature'
  ],
  associate: [
    'Computer Programming','Web Design and Coding','Electrical','Electronics Technology',
    'Machinery','Construction Technology','Mechatronics','Automotive Technology',
    'Medical Laboratory Techniques','Anesthesia','Emergency Medical Technician',
    'Radiology','Pharmacy Services','Dialysis','Accounting and Tax Applications',
    'Business Management','Tourism and Hotel Management','Tourism and Travel Services',
    'Logistics','Foreign Trade','Law Office Management',
    'Office Management and Executive Assistance','Graphic Design','Child Development','Social Services'
  ]
};

/* ---------- Üniversite alanları ---------- */
function initUniversityFields() {
  var levelEl   = document.getElementById('auth-sinif');
  var uniDiv    = document.getElementById('uni-alanlari');
  var programEl = document.getElementById('auth-program');
  var deptEl    = document.getElementById('auth-bolum');
  var classEl   = document.getElementById('auth-sinif-uni');
  if (!levelEl || !uniDiv) return;

  levelEl.addEventListener('change', function () {
    uniDiv.style.display = (levelEl.value === 'uni') ? 'block' : 'none';
    if (levelEl.value !== 'uni') {
      if (programEl) programEl.value = '';
      fillDepartments('');
      if (classEl) classEl.value = '';
    }
  });

  if (programEl) {
    programEl.addEventListener('change', function () {
      fillDepartments(programEl.value);
      updateClassOptions(programEl.value);
    });
  }

  function fillDepartments(program) {
    if (!deptEl) return;
    deptEl.innerHTML = '';
    if (!program) {
      deptEl.innerHTML = '<option value="">Select program type first...</option>';
      return;
    }
    var first = document.createElement('option');
    first.value = ''; first.textContent = 'Select your department...';
    deptEl.appendChild(first);
    (DEPARTMENTS[program] || []).forEach(function (d) {
      var opt = document.createElement('option');
      opt.value = d.toLowerCase().replace(/ /g, '-');
      opt.textContent = d;
      deptEl.appendChild(opt);
    });
  }

  function updateClassOptions(program) {
    if (!classEl) return;
    classEl.querySelectorAll('option').forEach(function (opt) {
      if (opt.value === '3' || opt.value === '4') {
        opt.style.display = (program === 'associate') ? 'none' : '';
        if (program === 'associate' && (classEl.value === '3' || classEl.value === '4')) {
          classEl.value = '';
        }
      }
    });
  }
}

/* ---------- Giriş Formu ---------- */
function initLoginForm() {
  var form    = document.getElementById('login-form');
  var msgEl   = document.getElementById('auth-message');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email    = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;

    if (!email || !password) {
      showMessage(msgEl, '⚠️ E-posta ve şifre boş bırakılamaz.', 'error');
      return;
    }

    setLoading(submitBtn, true);

    fetch(getAuthRootPath() + 'php/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showMessage(msgEl, data.message, 'success');
          // Kullanıcı bilgisini sessionStorage'a kaydet
          var userInfo = { name: (data.data && data.data.name) ? data.data.name : email, email: email };
          sessionStorage.setItem('studyup_user', JSON.stringify(userInfo));
          setTimeout(function () { window.location.href = getAuthRootPath() + 'index.html'; }, 1500);
        } else {
          showMessage(msgEl, data.message, 'error');
          setLoading(submitBtn, false);
        }
      })
      .catch(function () {
        showMessage(msgEl, '⚠️ Sunucuya bağlanılamadı. XAMPP/WAMP çalışıyor mu?', 'error');
        setLoading(submitBtn, false);
      });
  });
}

/* ---------- Kayıt Formu ---------- */
function initRegisterForm() {
  var form      = document.getElementById('register-form');
  var msgEl     = document.getElementById('auth-message');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var ad       = document.getElementById('auth-ad').value.trim();
    var soyad    = document.getElementById('auth-soyad').value.trim();
    var email    = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;
    var password2= document.getElementById('auth-password2').value;
    var seviye   = document.getElementById('auth-sinif').value;
    var program  = document.getElementById('auth-program') ? document.getElementById('auth-program').value : '';
    var bolum    = document.getElementById('auth-bolum')   ? document.getElementById('auth-bolum').value   : '';
    var sinif    = document.getElementById('auth-sinif-uni') ? document.getElementById('auth-sinif-uni').value : '';

    // İstemci tarafı ön kontrol
    if (!ad || !soyad || !email || !password || !password2) {
      showMessage(msgEl, '⚠️ Lütfen tüm alanları doldurun.', 'error'); return;
    }
    if (password.length < 6) {
      showMessage(msgEl, '⚠️ Şifre en az 6 karakter olmalıdır.', 'error'); return;
    }
    if (password !== password2) {
      showMessage(msgEl, '⚠️ Şifreler eşleşmiyor.', 'error'); return;
    }

    setLoading(submitBtn, true);

    fetch(getAuthRootPath() + 'php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ad: ad, soyad: soyad, email: email,
        password: password, password2: password2,
        egitim_seviye: seviye, program: program,
        bolum: bolum, sinif: sinif
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showMessage(msgEl, data.message, 'success');
          setTimeout(function () { window.location.href = getAuthRootPath() + 'pages/giris.html'; }, 1800);
        } else {
          showMessage(msgEl, data.message, 'error');
          setLoading(submitBtn, false);
        }
      })
      .catch(function () {
        showMessage(msgEl, '⚠️ Sunucuya bağlanılamadı. XAMPP/WAMP çalışıyor mu?', 'error');
        setLoading(submitBtn, false);
      });
  });
}

/* ---------- Şifre Göster/Gizle ---------- */
function initPasswordToggle() {
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-target'));
      if (!el) return;
      el.type = (el.type === 'password') ? 'text' : 'password';
      btn.textContent = (el.type === 'password') ? '👁️' : '🙈';
    });
  });
}

/* ---------- Yardımcı Fonksiyonlar ---------- */
function showMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.style.color = (type === 'error') ? '#f87171' : '#34d399';
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Lütfen bekleyin...' : (btn.dataset.originalText || 'Gönder');
  if (!loading && btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
}

/* ---------- Başlat ---------- */
document.addEventListener('DOMContentLoaded', function () {
  // Buton orijinal metinlerini kaydet
  document.querySelectorAll('button[type="submit"]').forEach(function(btn) {
    btn.dataset.originalText = btn.textContent;
  });
  initUniversityFields();
  initLoginForm();
  initRegisterForm();
  initPasswordToggle();
});
