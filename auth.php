<?php
require 'config/config.php';
// session_start();

function checkToken() {
    global $url_api;
    global $myDomain;
    $url = $url_api . "/login/check";
    if (!isset($_SESSION['token'])) {
        return false; 
    }

    $token = $_SESSION['token'];
    $data = json_encode(["token" => $token]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-Client-Domain: ' . $myDomain
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        return false;
    }

    $result = json_decode($response, true);

    if (!isset($result['valid']) || !$result['valid']) {
        return false;
    }

    // return $result['user'];
    return $result['message'];
}

// echo $_SESSION['token'];
$currentFile = basename($_SERVER['PHP_SELF']);
if ($currentFile !== 'login.php' && checkToken() === false && isset($_SESSION['token'])) {
    echo "<script>
                alert('Session Expired! Please re-login!');
                window.location.href = 'logout.php';
            </script>";
    exit();
} else if(!isset($_SESSION['token'])) {
    echo "<script>
                window.location.href = 'logout.php';
            </script>";
    exit();
}
?>
