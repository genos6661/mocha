<?php
session_start();
require '../../config/config.php';
?>
<!doctype html>

<html
  lang="en"
  class="layout-wide"
  dir="ltr"
  data-skin="default"
  data-assets-path="../../assets/"
  data-template="horizontal-menu-template"
  data-bs-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Invoice</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../../assets/img/favicon/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
      rel="stylesheet" />

    <link rel="stylesheet" href="../../assets/vendor/fonts/iconify-icons.css" />

    <!-- Core CSS -->
    <!-- build:css assets/vendor/css/theme.css  -->

    <link rel="stylesheet" href="../../assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="../../assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="../../assets/vendor/css/core.css" />
    <link rel="stylesheet" href="../../assets/css/demo.css" />

    <!-- Vendors CSS -->

    <link rel="stylesheet" href="../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="../../assets/vendor/libs/sweetalert2/sweetalert2.css" />

    <!-- endbuild -->

    <!-- Page CSS -->

    <link rel="stylesheet" href="../../assets/vendor/css/pages/app-invoice-print.css" />

    <!-- Helpers -->
    <script src="../../assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="../../assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
    <script src="../../assets/vendor/libs/sweetalert2/sweetalert2.js"></script>
    <script src="../../assets/js/config.js"></script>
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
      window.token = "<?php echo isset($_SESSION['token']) ? $_SESSION['token'] : ''; ?>";
    </script>
  </head>

  <body>
    <!-- Content -->

    <div class="invoice-print p-12">
      <div class="d-flex justify-content-between flex-row">
        <div class="mb-6">
          <div class="d-flex svg-illustration mb-2 gap-2 flex-column">
            <span class="app-brand-logo demo text-primary" id="boxLogo">
              <span class="text-primary">
                <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                    fill="currentColor" />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                    fill="#161616" />
                  <path
                    opacity="0.06"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                    fill="#161616" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                    fill="currentColor" />
                </svg>
              </span>
            </span>
            <span class="app-brand-text fw-bold fs-4 ms-50" id="judulNota">Jagad Mocha</span>
          </div>
          <p class="mb-1">Forex Transfer</p>
        </div>
        <div>
          <h4 class="mb-5">Number #<span id="nomorTrans"></span></h4>
          <div class="mb-0 text-heading text-end">
            <span>Date Issues:</span>
            <span class="fw-medium" id="tanggalTransaksi"></span>
          </div>
        </div>
      </div>

      <hr class="mb-6" />

      <div class="card-body px-0">
        <div class="row">
          <div class="col-xl-6 col-md-12 col-sm-5 col-12">
            <h5>Transfer From :</h5>
            <p class="mb-1 fw-medium"><span id="namaFrom"></span></p>
            <p class="mb-1 fw-medium"><span id="alamatFrom"></span></p>
            <p class="mb-1 fw-medium"><span id="teleponFrom"></span></p>
            <!-- <p class="mb-0"></p> -->
          </div>
          <div class="col-xl-6 col-md-12 col-sm-7 col-12">
            <h5>Transfer To :</h5>
            <p class="mb-1 fw-medium"><span id="namaTo"></span></p>
            <p class="mb-1 fw-medium"><span id="alamatTo"></span></p>
            <p class="mb-1 fw-medium"><span id="teleponTo"></span></p>
          </div>
        </div>
      </div>

      <div class="table-responsive border border-bottom-0 border-top-0 rounded mt-2">
        <table class="table m-0" id="tabelDetail">
          <thead>
            <tr>
              <th>Currency</th>
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
              <td class="align-top pe-6 ps-0 py-6 text-body">
                  <!-- <p class="mb-1">
                    <span class="me-2 h6">Salesperson:</span>
                    <span>Alfie Solomons</span>
                  </p>
                  <span>Thanks for your business</span> -->
              </td>
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
      <div class="row mb-3">
        <div class="col-12">
          <span class="fw-medium">Note:</span>
          <span id="footer1"></span
          >
          <br>
        </div>
      </div>
      <div class="row">
        <div class="col-3 text-center" id="ttdPelanggan">Pengirim</div>
        <div class="col"></div>
        <div class="col-3 text-center" id="ttdPerusahaan">Mocha</div>
      </div>
      <div class="row">
        <div class="col mb-5">&nbsp;</div>
      </div>
      <div class="row mt-5">
        <div class="col-3 text-center border-bottom">&nbsp;</div>
        <div class="col">&nbsp;</div>
        <div class="col-3 text-center border-bottom">&nbsp;</div>
      </div>
    </div>

    <!-- / Content -->

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/theme.js -->

    <script src="../../assets/vendor/libs/jquery/jquery.js"></script>

    <script src="../../assets/vendor/libs/popper/popper.js"></script>
    <script src="../../assets/vendor/js/bootstrap.js"></script>
    <script src="../../assets/vendor/libs/node-waves/node-waves.js"></script>

    <script src="../../assets/vendor/libs/@algolia/autocomplete-js.js"></script>

    <script src="../../assets/vendor/libs/pickr/pickr.js"></script>

    <script src="../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="../../assets/vendor/libs/select2/select2.js"></script>
    <script src="../../assets/vendor/libs/hammer/hammer.js"></script>

    <script src="../../assets/vendor/libs/i18n/i18n.js"></script>

    <script src="../../assets/vendor/js/menu.js"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->

    <!-- Main JS -->

    <script src="../../assets/js/main.js"></script>

    <script src="../../js/pages/transfer-receipt.js"></script>
    <script>
      
    </script>
  </body>
</html>
