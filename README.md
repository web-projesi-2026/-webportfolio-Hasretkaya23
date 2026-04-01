# StudyUp – Hasret Kaya

## Proje Açıklaması

StudyUp, Hasret Kaya tarafından geliştirilen kişisel bir öğrenci verimlilik platformudur. Ders takibi, hedef belirleme, motivasyon ve çalışma rehberi gibi özellikleriyle öğrencilerin akademik hayatlarını düzenlemelerine yardımcı olmayı amaçlar. Kullanıcı kaydı ve girişi PHP + MySQL altyapısıyla desteklenmektedir.

## Hedef Kullanıcı

- Ders takibini düzenlemek isteyen üniversite ve lise öğrencileri
- Hedeflerini kayıt altına almak isteyen bireyler
- Çalışma alışkanlıklarını geliştirmek isteyen herkes

## Temel Özellikler

- **Çoklu Sayfa:** Ana Sayfa, Features, Tasks, Goals, Motivation, Guide
- **Kullanıcı Sistemi:** Giriş yap ve kayıt ol ekranları (PHP + MySQL + bcrypt)
- **Aktif Navigasyon:** Hangi sayfada olunduğu JS ile otomatik tespit edilir
- **Görev (Task) Yönetimi:** Görev ekleme, tamamlama, silme
- **Hedef (Goal) Takibi:** Hedef belirleme ve takip sistemi
- **Motivasyon:** Günlük değişen motivasyon alıntıları
- **Çalışma Serisi (Streak):** Günlük çalışma takibi ve seri sayacı
- **Scroll Reveal:** Sayfa kaydırıldıkça animasyonlu içerik açılımı
- **Mobil Menü:** Hamburger menü ile tam responsive tasarım
- **Scroll to Top:** Sayfanın üstüne dön butonu

## Kullanılan Teknolojiler

- HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6)
- PHP 8+ (PDO ile MySQL bağlantısı)
- MySQL (XAMPP üzerinden)
- Google Fonts: Syne, DM Sans

## Klasör Yapısı

```
hasretkaya/
├── index.html              ← Ana Sayfa
├── README.md               ← Bu dosya
│
├── pages/
│   ├── features.html       ← Özellikler
│   ├── tasks.html          ← Görev Yönetimi
│   ├── goals.html          ← Hedef Takibi
│   ├── motivation.html     ← Motivasyon
│   ├── guide.html          ← Çalışma Rehberi
│   ├── login.html          ← Giriş Yap
│   └── register.html       ← Kayıt Ol
│
├── assets/
│   ├── css/
│   │   └── style.css       ← Tüm stiller
│   ├── js/
│   │   ├── main.js         ← Ana JavaScript (getRootPath, aktif nav, animasyonlar)
│   │   └── auth.js         ← Giriş / Kayıt form işlemleri
│   └── img/                ← Görseller (manuel eklenecek)
│
└── php/
    ├── config.php          ← Veritabanı bağlantısı + yardımcılar
    ├── login.php           ← POST /php/login.php
    ├── register.php        ← POST /php/register.php
    ├── logout.php          ← GET  /php/logout.php
    └── setup.sql           ← Veritabanı kurulum sorgusu
```


## Kurulum

### Gereksinimler

- XAMPP (Apache + MySQL + PHP 8+)
- Modern bir tarayıcı (Chrome, Firefox, Safari)

### Adım Adım Kurulum

1. XAMPP'ı indirip kurun: https://www.apachefriends.org
2. XAMPP Kontrol Paneli → Apache ve MySQL'i başlatın
3. Bu klasörü şuraya kopyalayın:
   - **Windows:** `C:\xampp\htdocs\hasretkaya\`
   - **macOS:** `/Applications/XAMPP/htdocs/hasretkaya/`
   - **Linux:** `/opt/lampp/htdocs/hasretkaya/`
4. Tarayıcıda açın: `http://localhost/hasretkaya/`

### Veritabanı Kurulumu

1. Tarayıcıda `http://localhost/phpmyadmin/` adresine gidin
2. Üst menüde **SQL** sekmesine tıklayın
3. `php/setup.sql` dosyasının tüm içeriğini yapıştırın → **Git** butonuna basın
4. Sonuç: `studyup` veritabanı ve `users` tablosu oluşacak

### Veritabanı Bağlantı Ayarları

`php/config.php` dosyasını açın:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // MySQL kullanıcı adınız
define('DB_PASS', '');            // XAMPP varsayılan: boş
define('DB_NAME', 'studyup');
```

## Güvenlik

- Şifreler `password_hash()` ile **bcrypt** olarak saklanır
- Tüm SQL sorguları **PDO prepared statements** ile korumalı
- `filter_var()` ile e-posta doğrulaması yapılıyor

---

*© 2026 Hasret Kaya – Tüm Hakları Saklıdır*
