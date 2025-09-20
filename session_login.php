<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($input['token']) && !empty($input['user'])) {
        $_SESSION['token'] = $input['token'];
        $_SESSION['user'] = $input['user'];

        echo json_encode(["success" => true, "token2" => $_SESSION['token']]);
    } else {
        echo json_encode(["success" => false, "error" => "Missing token or user data"]);
    }
}
?>
