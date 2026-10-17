<?php
/**
 * PENDUKUNG "CLEAR CACHE" (dipakai clear.html, menu profil -> Clear Cache)
 *
 *   clear-cache.php?list=1  -> daftar file CSS/JS/font aplikasi (JSON) beserta versi ?v= yang
 *                              dipakai halaman, supaya clear.html bisa menyegarkan cache-nya
 *                              (cadangan untuk browser yang belum mendukung Clear-Site-Data).
 *   clear-cache.php         -> halaman penutup dengan header Clear-Site-Data: browser menghapus
 *                              cache HTTP (termasuk css/js), storage, dan cookie situs ini,
 *                              lalu menuju beranda. Header hanya berlaku di HTTPS / localhost.
 */
header('Cache-Control: no-store');

if (isset($_GET['list'])) {
    $roots = ['js', 'libs', 'dist', 'assets/css', 'assets/js', 'assets/vendor'];
    $ext = '/\.(css|js|woff2?|ttf|otf)$/i';
    $files = [];

    foreach ($roots as $root) {
        $dir = __DIR__ . '/' . $root;
        if (!is_dir($dir)) continue;

        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
        foreach ($iterator as $file) {
            if (!$file->isFile() || !preg_match($ext, $file->getFilename())) continue;

            $url = '/' . str_replace('\\', '/', substr($file->getPathname(), strlen(__DIR__) + 1));
            $files[] = $url;
            // Halaman memanggil file milik aplikasi dengan ?v=<waktu ubah>; itu entri cache yang berbeda.
            if (strpos($url, '/assets/vendor/') !== 0) $files[] = $url . '?v=' . $file->getMTime();
        }
    }

    header('Content-Type: application/json');
    echo json_encode($files);
    exit;
}

header('Content-Type: text/html; charset=utf-8');
header('Clear-Site-Data: "cache", "cookies", "storage"');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="1;url=/">
  <title>Cache cleared</title>
</head>
<body>
  <script>location.replace('/');</script>
</body>
</html>
