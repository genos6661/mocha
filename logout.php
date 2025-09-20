<script>
  // hapus localStorage
  localStorage.clear();

  // hapus sessionStorage
  sessionStorage.clear();

  // hapus semua cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
</script>
<?php
session_start();
require 'config/config.php';
// echo "DEBUG: Masuk ke logout.php<br>";
if (isset($_SESSION['token'])) {
    $token = $_SESSION['token'];

    global $url_api;
    $apiUrl = $url_api . "/users/logout";
    // echo "DEBUG: Menghubungi API logout: $apiUrl<br>";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token, 
        'X-Client-Domain:' . $myDomain,
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    // echo "DEBUG: HTTP Code dari API: $httpCode<br>";
    // echo "DEBUG: Response dari API: $response<br>";
    if ($httpCode === 200) {
        session_unset();
        session_destroy();
        // echo "DEBUG: Session dihancurkan, redirect ke login.php<br>";
        echo "<script>window.location.href = 'login.php';</script>"; 
        exit();
    } else {
        session_unset();
        session_destroy();
        // echo "DEBUG: Logout API gagal, redirect ke login.php?error=logout_failed<br>";
        echo "<script>window.location.href = 'login.php?error=logout_failes';</script>"; 
        exit();
    }
} else {
    // echo "DEBUG: Token tidak ada, langsung logout dan redirect ke login.php<br>";
    session_unset();
    session_destroy();
    echo "<script>window.location.href = 'login.php';</script>"; 
    exit();
}

?>