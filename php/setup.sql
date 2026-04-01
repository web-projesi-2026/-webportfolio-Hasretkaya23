-- ================================================
-- StudyUp – Veritabanı Kurulum Dosyası
-- Çalıştırma: phpMyAdmin > SQL sekmesine yapıştır
-- ================================================

CREATE DATABASE IF NOT EXISTS studyup
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_turkish_ci;

USE studyup;

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    ad            VARCHAR(100)  NOT NULL,
    soyad         VARCHAR(100)  NOT NULL,
    email         VARCHAR(191)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    egitim_seviye VARCHAR(50)   DEFAULT NULL,   -- lise9, lise10, lise11, lise12, uni
    program       VARCHAR(50)   DEFAULT NULL,   -- undergraduate / associate
    bolum         VARCHAR(150)  DEFAULT NULL,
    sinif         VARCHAR(10)   DEFAULT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
