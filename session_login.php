<?php
session_start();
require 'remember.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($input['token']) && !empty($input['user'])) {
        $_SESSION['token'] = $input['token'];
        $_SESSION['user'] = $input['user'];

        // "Remember Me": simpan token di cookie HttpOnly agar sesi bisa dipulihkan (remember.php)
        if (!empty($input['remember'])) {
            remember_set($input['token']);
        } else {
            remember_clear();
        }

        echo json_encode(["success" => true, "token2" => $_SESSION['token']]);
    } else {
        echo json_encode(["success" => false, "error" => "Missing token or user data"]);
    }
}
?>
