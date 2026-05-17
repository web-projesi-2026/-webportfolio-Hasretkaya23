/* ================================================
   StudyUp – auth.js  (Giriş & Kayıt)
   assets/js/auth.js
   ================================================ */

function getAuthRootPath() {
  var path = window.location.pathname;
  if (path.includes('/pages/') || path.includes('/php/')) return '../';
  return '';
}

/* ── Üniversite alanları (kayıt formunda) ─────── */
var DEPARTMANLAR = {
  undergraduate: [
    'Bilgisayar Mühendisliği','Yazılım Mühendisliği','Elektrik-Elektronik Mühendisliği',
    'Makine Mühendisliği','İnşaat Mühendisliği','Endüstri Mühendisliği',
    'Kimya Mühendisliği','Biyomedikal Mühendisliği','Tıp','Diş Hekimliği','Eczacılık',
    'Hemşirelik','Fizyoterapi ve Rehabilitasyon','İşletme Yönetimi','Ekonomi',
    'Hukuk','Psikoloji','Sosyoloji','Uluslararası İlişkiler',
    'Siyaset Bilimi ve Kamu Yönetimi','Matematik Öğretimi','Fen Bilimleri Öğretimi',
    'Türkçe Dil Öğretimi','İngilizce Dil Öğretimi','Okul Öncesi Eğitim',
    'İlkokul Öğretmenliği','Grafik Tasarım','İletişim Tasarımı',
    'Radyo Televizyon ve Sinema','Gazetecilik','Matematik','Fizik','Kimya',
    'Biyoloji','Mimarlık','Veterinerlik','Tarih','Felsefe','Türk Dili ve Edebiyatı'
  ],
  associate: [
    'Bilgisayar Programlama','Web Tasarımı ve Kodlama','Elektrik','Elektronik Teknolojisi',
    'Makine','Yapı Teknolojisi','Mekatronik','Otomotiv Teknolojisi',
    'Tıbbi Laboratuvar Teknikleri','Anestezi','Acil Tıp Teknisyeni',
    'Radyoloji','Eczane Hizmetleri','Diyaliz','Muhasebe ve Vergi Uygulamaları',
    'İşletme Yönetimi','Turizm ve Otelcilik Yönetimi','Turizm ve Seyahat Hizmetleri',
    'Lojistik','Dış Ticaret','Hukuk Bürosu Yönetimi',
    'Ofis Yönetimi ve Yönetici Asistanlığı','Grafik Tasarım','Çocuk Gelişimi','Sosyal Hizmetler'
  ]
};

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
      deptEl.innerHTML = '<option value="">Önce program türünü seçin...</option>';
      return;
    }
    var first = document.createElement('option');
    first.value = ''; first.textContent = 'Bölümünüzü seçin...';
    deptEl.appendChild(first);
    (DEPARTMANLAR[program] || []).forEach(function (d) {
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

/* ── Giriş Formu ──────────────────────────────── */
function initLoginForm() {
  var form      = document.getElementById('login-form');
  var msgEl     = document.getElementById('auth-message');
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
          var userInfo = {
            name:  (data.data && data.data.name) ? data.data.name : email,
            email: email
          };
          sessionStorage.setItem('studyup_user', JSON.stringify(userInfo));
          setTimeout(function () {
            window.location.href = getAuthRootPath() + 'index.html';
          }, 1500);
        } else {
          showMessage(msgEl, data.message, 'error');
          setLoading(submitBtn, false);
        }
      })
      .catch(function () {
        showMessage(msgEl, '⚠️ Sunucuya bağlanılamadı. XAMPP çalışıyor mu?', 'error');
        setLoading(submitBtn, false);
      });
  });
}

/* ── Kayıt Formu ──────────────────────────────── */
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
    var seviye   = document.getElementById('auth-sinif') ? document.getElementById('auth-sinif').value : '';
    var program  = document.getElementById('auth-program')   ? document.getElementById('auth-program').value   : '';
    var bolum    = document.getElementById('auth-bolum')     ? document.getElementById('auth-bolum').value     : '';
    var sinif    = document.getElementById('auth-sinif-uni') ? document.getElementById('auth-sinif-uni').value : '';

    if (!ad || !soyad || !email || !password || !password2) {
      showMessage(msgEl, '⚠️ Lütfen tüm zorunlu alanları doldurun.', 'error'); return;
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
          setTimeout(function () {
            window.location.href = getAuthRootPath() + 'pages/login.html';
          }, 1800);
        } else {
          showMessage(msgEl, data.message, 'error');
          setLoading(submitBtn, false);
        }
      })
      .catch(function () {
        showMessage(msgEl, '⚠️ Sunucuya bağlanılamadı. XAMPP çalışıyor mu?', 'error');
        setLoading(submitBtn, false);
      });
  });
}

/* ── Şifre Göster/Gizle ───────────────────────── */
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

/* ── Yardımcı Fonksiyonlar ────────────────────── */
function showMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.style.color = (type === 'error') ? '#f87171' : '#34d399';
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = 'Lütfen bekleyin...';
  } else {
    btn.textContent = btn.dataset.originalText || 'Gönder';
  }
}

/* ── Başlat ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('button[type="submit"]').forEach(function (btn) {
    btn.dataset.originalText = btn.textContent;
  });
  initUniversityFields();
  initLoginForm();
  initRegisterForm();
  initPasswordToggle();
});