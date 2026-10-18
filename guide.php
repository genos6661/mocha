<?php
// Kartu anggota guide (halaman publik, tanpa login): /guide?c=<kode>-<token>
require 'config/config.php';
?>
<!doctype html>
<html lang="en" class="layout-wide" dir="ltr" data-bs-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />

    <title>Guide Card</title>

    <link rel="icon" type="image/svg+xml" href="/assets/img/favicon/logo.svg" />
    <link href="/assets/vendor/css/main-font.css" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/vendor/fonts/iconify-icons.css" />
    <link rel="stylesheet" href="/assets/vendor/css/core.css" />
    <link rel="stylesheet" href="/assets/css/guide-card.css?v=<?= filemtime(__DIR__ . '/assets/css/guide-card.css') ?>" />

    <script src="/assets/vendor/js/jquery-3.7.1.js"></script>
  </head>

  <body class="guide-page">
    <main class="guide-wrap">
      <header class="guide-head">
        <span class="guide-eyebrow"><i class="icon-base ti tabler-id-badge-2"></i>Guide Membership Card</span>
        <span class="guide-status d-none" id="guideStatus"></span>
      </header>

      <!-- memuat -->
      <div class="guide-state" id="guideLoading">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Loading the card…</p>
      </div>

      <!-- kartu tidak ditemukan / tidak aktif -->
      <div class="guide-state d-none" id="guideInvalid">
        <span class="guide-state-icon"><i class="icon-base ti tabler-circle-x"></i></span>
        <h4 class="mb-1">This card is not active</h4>
        <p class="mb-0" id="guideInvalidText">The guide card could not be found or is no longer active.</p>
      </div>

      <!-- kartu -->
      <section class="d-none" id="guideCards">
        <figure class="guide-card-box">
          <div class="guide-card-stage">
            <canvas id="cardFront" width="1011" height="638" aria-label="Guide card, front"></canvas>
            <a class="guide-wm" id="wmFront" target="_blank" rel="noopener" aria-label="Powered by BERES Mocha"></a>
          </div>
          <figcaption>Front</figcaption>
        </figure>
        <figure class="guide-card-box">
          <div class="guide-card-stage">
            <canvas id="cardBack" width="1011" height="638" aria-label="Guide card, back"></canvas>
            <a class="guide-wm" id="wmBack" target="_blank" rel="noopener" aria-label="Powered by BERES Mocha"></a>
          </div>
          <figcaption>Back</figcaption>
        </figure>

        <div class="guide-actions">
          <button type="button" class="btn btn-primary" id="btnPdf"><i class="icon-base ti tabler-file-type-pdf me-2"></i>Download PDF</button>
          <button type="button" class="btn btn-outline-primary" id="btnImage"><i class="icon-base ti tabler-photo-down me-2"></i>Download Image</button>
        </div>
        <p class="guide-hint">The PDF contains the front and back of the card. The image contains the front only.</p>

        <!-- komisi: hanya jumlah, tanpa nilai transaksi -->
        <div class="guide-commission" id="guideCommission">
          <div class="guide-commission-head">
            <span class="guide-commission-title"><i class="icon-base ti tabler-coins"></i>My Commission</span>
            <select class="form-select form-select-sm" id="komisiRange" aria-label="Period">
              <option value="all">All time</option>
              <option value="month" selected>This month</option>
              <option value="lastMonth">Last month</option>
              <option value="year">This year</option>
            </select>
          </div>
          <div class="guide-commission-grid">
            <div class="guide-commission-item guide-due"><span>Unpaid</span><strong id="komisiBelum">-</strong></div>
            <div class="guide-commission-item"><span>Paid</span><strong id="komisiDibayar">-</strong></div>
            <div class="guide-commission-item"><span>Total</span><strong id="komisiTotal">-</strong></div>
          </div>
          <p class="guide-commission-note d-none" id="komisiError">The commission could not be loaded.</p>
        </div>
      </section>
    </main>

    <footer class="guide-footer">
      &copy; <?= date('Y') ?> BERES Mocha &middot; by <a href="https://thebrotherhoodlaw.com" target="_blank" rel="noopener">The Brotherhood</a>
    </footer>

    <script src="/assets/vendor/libs/export-laporan/jspdf.js"></script>
    <script src="/assets/vendor/libs/qrcode/qrcode.js"></script>
    <script src="/js/pages/guide-card.js?v=<?= filemtime(__DIR__ . '/js/pages/guide-card.js') ?>"></script>
  </body>
</html>
