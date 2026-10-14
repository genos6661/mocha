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

  <body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <div class="container-xxl flex-grow-1 container-p-y">
          <div class="row invoice-preview justify-content-center">
            <!-- Invoice -->
            <div class="col-xl-9 col-md-8 col-12 mb-md-0 mb-6">
              <div class="card invoice-preview-card p-sm-12 p-6" id="invoiceDiv">
                <div class="card-body invoice-preview-header p-5 rounded">
                  <div class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column align-items-xl-center align-items-md-start align-items-sm-center align-items-start">
                    <div class="mb-xl-0 mb-2 text-heading">
                      <div class="d-flex svg-illustration mb-2 gap-2 flex-column">
                        <span class="app-brand-logo demo" id="boxLogo">
                              <span class="text-primary">
                                <?php include __DIR__ . '/partials/logo.php'; ?>
                              </span>
                            </span>
                        <span class="app-brand-text fw-bold fs-4 ms-50" id="judulNota"></span>
                      </div>
                      <p class="mb-1"><span id="namaCabang"></span></p>
                      <p class="mb-1"><span id="alamatCabang"></span></p>
                      <p class="mb-0"><span id="teleponCabang"></span></p>
                    </div>
                    <div>
                      <h4 class="mb-5">Invoice <span id="nomorTrans"></span></h4>
                      <div class="mb-1 text-heading text-end">
                        <span>Date Issues:</span>
                        <span class="fw-medium" id="tanggalTransaksi"></span>
                      </div>
                      <div class="text-heading text-end">
                        <span id="jenisTransaksi"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body px-0">
                  <div class="row">
                    <div class="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-6 mb-sm-0 mb-6">
                      <h6>Invoice To :</h6>
                      <p class="mb-1 fw-medium"><span id="namaPelanggan"></span></p>
                      <p class="mb-0 fw-medium"><span id="teleponPelanggan"></span></p>
                    </div>
                    <div class="col-xl-6 col-md-12 col-sm-7 col-12">
                      <h6> &nbsp; </h6>
                      <table>
                        <tbody>
                          <tr>
                            <td class="pe-4">Cust. Code :</td>
                            <td class="fw-medium"><span id="kodePelanggan"></span></td>
                          </tr>
                          <tr>
                            <td class="pe-4">ID Number :</td>
                            <td><span id="idNumber"></span></td>
                          </tr>
                          <tr>
                            <td class="pe-4">Nationality :</td>
                            <td><span id="negara"></span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="table-responsive border border-bottom-0 border-top-0 rounded">
                  <table class="table m-0" id="tabelDetail">
                    <thead>
                      <tr>
                        <th>Currency</th>
                        <th>Name</th>
                        <th class="text-end">Amount</th>
                        <th class="text-end">Rate</th>
                        <th class="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
                <div class="table-responsive">
                  <table class="table m-0 table-borderless">
                    <tbody>
                      <tr>
                        <td class="align-top pe-6 ps-0 py-6 text-body"></td>
                        <td class="px-0 py-6 w-px-100">
                          <p class="mb-2">Subtotal:</p>
                          <p class="mb-2">Tax:</p>
                          <p class="mb-0">Total:</p>
                        </td>
                        <td class="text-end px-2 py-6 w-px-100 fw-medium text-heading">
                          <p class="fw-medium mb-2 nowrap">Rp. <span id="subtotal"></span></p>
                          <p class="fw-medium mb-2 nowrap">0</p>
                          <p class="fw-medium mb-0 nowrap">Rp. <span id="total"></span></p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr class="mt-0 mb-6" />
                <div class="card-body p-0">
                  <div class="row">
                    <div class="col-12">
                      <span class="fw-medium text-heading">Note : </span>
                      <span id="noteInvoice">Thank you for your trust and business. It has been a pleasure serving you. We look forward to assisting you again in your future currency exchange needs.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /Invoice -->

            <!-- Invoice Actions -->
            <div class="col-xl-3 col-md-4 col-12 invoice-actions">
              <div class="card">
                <div class="card-body">
                  <button class="btn btn-primary d-grid w-100 mb-4" onclick="downloadPDF()">
                    <span class="d-flex align-items-center justify-content-center text-nowrap"><i class="icon-base ti tabler-download icon-xs me-2"></i>Download</span>
                  </button>
                  <button class="btn btn-label-secondary d-grid w-100" onclick="printDiv('invoiceDiv')">Print</button>
                </div>
              </div>
            </div>
            <!-- /Invoice Actions -->
          </div>
        </div>
      </div>
    </div>
  </body>
  <script src="assets/vendor/libs/jquery/jquery.js"></script>
  <script src="assets/vendor/libs/popper/popper.js"></script>
  <script src="assets/vendor/js/bootstrap.js"></script>
  <script src="assets/vendor/libs/node-waves/node-waves.js"></script>
  <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="js/pages/transaction-preview.js?v=<?= filemtime(__DIR__ . '/js/pages/transaction-preview.js') ?>"></script>
</html>
