/* ================================================
   StudyUp – Study Tools & Favorites
   assets/js/favorites.js

   Görev kapsamı:
   1. JSON dosyasından veri okuma (fetch)
   2. Verileri dinamik kart olarak listeleme
   3. Favorilere ekle / çıkar işlemi
   4. Favorileri localStorage'da kalıcı saklama
   ================================================ */

var STORAGE_KEY = 'su_favorites'; // localStorage anahtarı

/* ── localStorage yardımcıları ─────────────────── */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function isFavorite(id) {
  return getFavorites().indexOf(id) !== -1;
}

function toggleFavorite(id) {
  var favorites = getFavorites();
  var index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);           // Favorilere ekle
  } else {
    favorites.splice(index, 1);   // Favorilerden çıkar
  }
  saveFavorites(favorites);
  return index === -1; // true = eklendi, false = çıkarıldı
}

/* ── Tek kart HTML üretici ──────────────────────── */
function buildToolCard(tool) {
  var fav = isFavorite(tool.id);
  return (
    '<div class="feat-card ' + tool.color + ' tool-card" data-id="' + tool.id + '">' +
      '<div class="feat-icon"><i class="' + tool.icon + '"></i></div>' +
      '<div class="tool-tag">' + tool.tag + '</div>' +
      '<h3>' + tool.name + '</h3>' +
      '<p>' + tool.description + '</p>' +
      '<button ' +
        'class="fav-btn' + (fav ? ' fav-active' : '') + '" ' +
        'data-id="' + tool.id + '" ' +
        'title="' + (fav ? 'Remove from Favorites' : 'Add to Favorites') + '" ' +
        'aria-label="' + (fav ? 'Remove from Favorites' : 'Add to Favorites') + '">' +
        '<i class="' + (fav ? 'fa-solid' : 'fa-regular') + ' fa-heart"></i> ' +
        '<span>' + (fav ? 'Saved' : 'Save') + '</span>' +
      '</button>' +
    '</div>'
  );
}

/* ── Favori sayacını güncelle ───────────────────── */
function updateFavCount() {
  var countEl = document.getElementById('fav-count');
  if (!countEl) return;
  var n = getFavorites().length;
  countEl.textContent = n;
  countEl.style.display = n > 0 ? 'inline-flex' : 'none';
}

/* ── Favori panelini yeniden çiz ────────────────── */
function renderFavPanel(allTools) {
  var panel = document.getElementById('fav-panel-list');
  if (!panel) return;
  var favIds = getFavorites();
  if (favIds.length === 0) {
    panel.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:1rem 0;">No favorites yet. Click the ♥ button on any tool!</p>';
    return;
  }
  var html = '';
  favIds.forEach(function(id) {
    var tool = allTools.find(function(t) { return t.id === id; });
    if (!tool) return;
    html += (
      '<div class="fav-panel-item" data-id="' + tool.id + '">' +
        '<i class="' + tool.icon + '" style="color:var(--blue);min-width:1.2rem;"></i>' +
        '<span>' + tool.name + '</span>' +
        '<button class="fav-remove-btn" data-id="' + tool.id + '" title="Remove">' +
          '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
      '</div>'
    );
  });
  panel.innerHTML = html;

  // Panel içinden kaldır butonları
  panel.querySelectorAll('.fav-remove-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = parseInt(btn.getAttribute('data-id'));
      toggleFavorite(id);
      syncCardButton(id, allTools);
      renderFavPanel(allTools);
      updateFavCount();
    });
  });
}

/* ── Ana kart butonunu senkronize et ────────────── */
function syncCardButton(id, allTools) {
  var card = document.querySelector('.tool-card[data-id="' + id + '"]');
  if (!card) return;
  var btn = card.querySelector('.fav-btn');
  if (!btn) return;
  var fav = isFavorite(id);
  btn.classList.toggle('fav-active', fav);
  btn.title = fav ? 'Remove from Favorites' : 'Add to Favorites';
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = '<i class="' + (fav ? 'fa-solid' : 'fa-regular') + ' fa-heart"></i> <span>' + (fav ? 'Saved' : 'Save') + '</span>';
}

/* ── Kartları grid'e bas ────────────────────────── */
function renderCards(tools) {
  var grid = document.getElementById('tools-grid');
  if (!grid) return;
  grid.innerHTML = tools.map(buildToolCard).join('');

  // Favori butonlarına tıklama ekle
  grid.querySelectorAll('.fav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = parseInt(btn.getAttribute('data-id'));
      toggleFavorite(id);
      syncCardButton(id, tools);
      renderFavPanel(tools);
      updateFavCount();

      // Kısa animasyon
      btn.classList.add('fav-pulse');
      setTimeout(function() { btn.classList.remove('fav-pulse'); }, 400);
    });
  });
}

/* ── Kategori filtresi ──────────────────────────── */
function initFilter(tools) {
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      var filtered = (cat === 'all') ? tools : tools.filter(function(t) {
        return t.category === cat || t.tag === cat;
      });
      renderCards(filtered);
      // Filtreleme sonrası butonları yeniden bağla (renderCards zaten yapar)
    });
  });
}

/* ── Favori paneli aç/kapat ─────────────────────── */
function initFavPanel(tools) {
  var toggleBtn = document.getElementById('fav-panel-toggle');
  var panel     = document.getElementById('fav-panel');
  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', function() {
    panel.classList.toggle('open');
    renderFavPanel(tools);
  });

  // Panel dışına tıklayınca kapat
  document.addEventListener('click', function(e) {
    if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* ── ANA INIT: JSON oku → kartları çiz ──────────── */
function initStudyTools() {
  var grid = document.getElementById('tools-grid');
  if (!grid) return; // Bu sayfa değilse dur

  // Yükleniyor durumu
  grid.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;grid-column:1/-1;">' +
    '<i class="fa-solid fa-spinner fa-spin"></i> Loading tools...</p>';

  // JSON'u fetch ile oku
  var jsonPath = (window.location.pathname.includes('/pages/')) ? '../data/tools.json' : 'data/tools.json';

  fetch(jsonPath)
    .then(function(res) {
      if (!res.ok) throw new Error('JSON could not be loaded: ' + res.status);
      return res.json();
    })
    .then(function(tools) {
      renderCards(tools);
      initFilter(tools);
      initFavPanel(tools);
      updateFavCount();
    })
    .catch(function(err) {
      grid.innerHTML = '<p style="color:#f87171;text-align:center;grid-column:1/-1;">' +
        '<i class="fa-solid fa-triangle-exclamation"></i> ' + err.message + '</p>';
      console.error('StudyUp favorites.js:', err);
    });
}

/* ── DOMContentLoaded'da başlat ─────────────────── */
document.addEventListener('DOMContentLoaded', initStudyTools);
