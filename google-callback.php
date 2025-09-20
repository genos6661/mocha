<?php
session_start();

// Cek apakah respons API memiliki token
if (isset($_GET['token'])) {
    $_SESSION['token'] = $_GET['token']; // Simpan token dalam session

    // Simpan data user ke session (opsional)
    $_SESSION['user'] = [
        'email' => $_GET['email'],
        'nama'  => $_GET['nama'],
        'role'  => $_GET['role'],
    ];

    // Redirect ke halaman utama
    header("Location: /");
    exit();
} else {
    // Jika tidak ada token, kembali ke login dengan pesan error
    header("Location: login.php?error=invalid_oauth");
    exit();
}
?>
