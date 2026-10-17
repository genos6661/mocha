<?php
/**
 * REMEMBER ME (halaman login)
 *
 * Bila "Remember Me" dicentang, token login (JWT 30 hari dari API) disimpan juga di cookie
 * HttpOnly `mocha_remember`. Saat sesi PHP hilang (browser ditutup / sesi kedaluwarsa),
 * login.php memulihkan sesi dari cookie itu setelah token diperiksa ke API, jadi pengguna
 * tidak perlu login ulang. Logout menghapus cookie ini (logout.php).
 *
 * Pakai: require 'remember.php'; (config/config.php harus sudah dimuat)
 */

const REMEMBER_COOKIE = 'mocha_remember';
const REMEMBER_DAYS = 30;

function remember_cookie_options($expires) {
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    return [
        'expires' => $expires,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ];
}

function remember_set($token) {
    setcookie(REMEMBER_COOKIE, $token, remember_cookie_options(time() + REMEMBER_DAYS * 86400));
}

function remember_clear() {
    setcookie(REMEMBER_COOKIE, '', remember_cookie_options(time() - 3600));
    unset($_COOKIE[REMEMBER_COOKIE]);
}

/**
 * Pulihkan sesi dari cookie. Mengembalikan true bila berhasil; cookie yang tidak valid dihapus.
 * Isi $_SESSION['user'] sama dengan respons /login: email, nama, role, level, allow_change_rate.
 */
function remember_restore() {
    global $url_api, $myDomain;

    $token = $_COOKIE[REMEMBER_COOKIE] ?? '';
    if ($token === '') return false;

    $ch = curl_init($url_api . '/login/check');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['token' => $token]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-Client-Domain: ' . $myDomain,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Token ditolak API (kedaluwarsa / sudah logout / login di tempat lain): hapus cookie.
    // Gangguan jaringan atau error server: cookie dibiarkan agar percobaan berikutnya bisa berhasil.
    if ($httpCode === 401 || $httpCode === 400) {
        remember_clear();
        return false;
    }
    if ($httpCode !== 200) return false;

    $result = json_decode($response, true);
    $row = $result['user'] ?? null;
    if (empty($result['valid']) || !$row) {
        remember_clear();
        return false;
    }

    // Level ada di payload JWT (tanda tangannya sudah diperiksa API di atas).
    $parts = explode('.', $token);
    $payload = json_decode(base64_decode(strtr($parts[1] ?? '', '-_', '+/')), true) ?: [];

    session_regenerate_id(true);
    $_SESSION['token'] = $token;
    $_SESSION['user'] = [
        'email' => $row['email'] ?? '',
        'nama' => $row['nama'] ?? '',
        'role' => $row['role'] ?? '',
        'level' => $payload['level'] ?? '',
        'allow_change_rate' => $row['request'] ?? 0,
    ];

    return true;
}
