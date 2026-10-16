<?php
require 'config/config.php';
?>
<html
  lang="en"
  class="layout-navbar-fixed layout-menu-fixed layout-compact"
  dir="ltr"
  data-skin="default"
  data-assets-path="assets/"
  data-template="horizontal-menu-template-starter"
  data-bs-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Invoice</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/logo.svg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
      rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/fonts/iconify-icons.css" />


    <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="assets/vendor/css/core.css" />

    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/sweetalert2/sweetalert2.css" />

    <link rel="stylesheet" href="/assets/css/demo.css?v=<?= filemtime(__DIR__ . '/assets/css/demo.css') ?>" />
    <link rel="stylesheet" href="/assets/vendor/css/pages/app-invoice.css" />
    <link rel="stylesheet" href="/assets/css/invoice-preview.css?v=<?= filemtime(__DIR__ . '/assets/css/invoice-preview.css') ?>" />

    <!-- endbuild -->

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->

    <script src="assets/js/config.js"></script>
    <script src="assets/vendor/libs/sweetalert2/sweetalert2.js"></script>

    <script>
      const notif = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
    </script>
    <script src="assets/vendor/libs/export-laporan/jspdf.js"></script>
    <script src="assets/vendor/libs/export-laporan/autotable.js"></script>
  </head>

  <body class="ip-body">
    <div class="ip-wrap">
      <!-- Invoice -->
      <div class="ip-card" id="invoiceDiv">
        <div class="ip-hero">
          <div class="ip-brand">
            <span class="ip-logo" id="boxLogo"><?php include __DIR__ . '/partials/logo.php'; ?></span>
            <div>
              <div class="ip-company" id="judulNota"></div>
              <div class="ip-branch"><span id="namaCabang"></span></div>
            </div>
          </div>
          <div class="ip-docmeta">
            <h1 class="ip-doc-title">Invoice <span id="nomorTrans"></span></h1>
            <span class="ip-pill" id="jenisTransaksi"></span>
            <div class="ip-date">
              <span>Date Issues:</span>
              <span class="fw-semibold" id="tanggalTransaksi"></span>
            </div>
          </div>
        </div>

        <div class="ip-contact">
          <span><i class="icon-base ti tabler-map-pin"></i><span id="alamatCabang"></span></span>
          <span><i class="icon-base ti tabler-phone"></i><span id="teleponCabang"></span></span>
        </div>

        <div class="ip-body-pad">
          <div class="ip-grid">
            <div class="ip-panel">
              <div class="ip-panel-title">Invoice To :</div>
              <div class="ip-customer">
                <span class="ip-avatar"><i class="icon-base ti tabler-user"></i></span>
                <div class="ip-customer-lines">
                  <p class="ip-customer-name"><span id="namaPelanggan"></span></p>
                  <p><span id="teleponPelanggan"></span></p>
                </div>
              </div>
            </div>
            <div class="ip-panel">
              <div class="ip-panel-title">Customer details</div>
              <dl class="ip-dl">
                <dt>Cust. Code :</dt>
                <dd><span id="kodePelanggan"></span></dd>
                <dt>ID Number :</dt>
                <dd><span id="idNumber"></span></dd>
                <dt>Nationality :</dt>
                <dd><span id="negara"></span></dd>
              </dl>
            </div>
          </div>

          <div class="ip-items">
            <table class="ip-table" id="tabelDetail">
              <thead>
                <tr>
                  <th>Currency / Name</th>
                  <th class="text-end">Amount</th>
                  <th class="text-end">Rate</th>
                  <th class="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div class="ip-summary">
            <div class="ip-note">
              <span class="ip-note-title">Note :</span>
              <span id="noteInvoice">Thank you for your trust and business. It has been a pleasure serving you. We look forward to assisting you again in your future currency exchange needs.</span>
            </div>
            <div class="ip-totals">
              <div class="ip-total-row"><span>Subtotal:</span><strong>Rp. <span id="subtotal"></span></strong></div>
              <div class="ip-total-row"><span>Tax:</span><strong>0</strong></div>
              <div class="ip-total-row ip-grand"><span>Total:</span><strong>Rp. <span id="total"></span></strong></div>
            </div>
          </div>
        </div>
        <div class="ip-thanks">Thank you for choosing us.</div>
      </div>
      <!-- /Invoice -->

      <!-- Invoice Actions -->
      <div class="ip-actions">
        <div class="ip-actions-title">Actions</div>
        <button class="btn btn-primary" onclick="downloadPDF()">
          <i class="icon-base ti tabler-download"></i>Download
        </button>
        <div class="ip-actions-row">
          <button class="btn btn-label-secondary" onclick="printDiv('invoiceDiv')">
            <i class="icon-base ti tabler-printer"></i>Print
          </button>
          <button class="btn btn-label-secondary" onclick="copyLink()">
            <i class="icon-base ti tabler-link"></i>Copy link
          </button>
        </div>
      </div>
      <!-- /Invoice Actions -->
    </div>
  </body>
  <script src="assets/vendor/libs/jquery/jquery.js"></script>
  <script src="assets/vendor/libs/popper/popper.js"></script>
  <script src="assets/vendor/js/bootstrap.js"></script>
  <script src="assets/vendor/libs/node-waves/node-waves.js"></script>
  <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="js/invoice-pdf.js?v=<?= filemtime(__DIR__ . '/js/invoice-pdf.js') ?>"></script>
  <script src="js/pages/transaction-preview.js?v=<?= filemtime(__DIR__ . '/js/pages/transaction-preview.js') ?>"></script>
</html>
