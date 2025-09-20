<?php
require '../config/config.php';
?>
<!doctype html>
<html
  lang="en"
  class="layout-navbar-fixed layout-menu-fixed layout-compact"
  dir="ltr"
  data-skin="default"
  data-assets-path="/assets/"
  data-template="horizontal-menu-template-starter"
  data-bs-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Mocha Display</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/img/favicon/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
      rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/assets/vendor/fonts/iconify-icons.css" />

    <!-- Core CSS -->
    <!-- build:css assets/vendor/css/theme.css  -->
    <link rel="stylesheet" href="/assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="/assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="/assets/vendor/css/core.css" />

    <!-- Vendors CSS -->

    <link rel="stylesheet" href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/sweetalert2/sweetalert2.css" />

    <link rel="stylesheet" href="/assets/css/demo.css" />

    <!-- endbuild -->

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Helpers -->
    <script src="/assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="/assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->

    <script src="/assets/js/config.js"></script>
    <script src="/assets/vendor/libs/sweetalert2/sweetalert2.js"></script>

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
    <style>
      :root {
        --box-size: 30px;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box; 
      }

      .dm-serif-text-regular {
        font-family: "DM Serif Text", serif;
        font-weight: 500;
        font-style: normal;
      }

      .national-park {
        font-family: "National Park", sans-serif;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
      }

      body {
        width: 100%;
        height: 100vh;
        max-height: 100vh;
        padding: 30px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        /*background: url('../img/bg-display-2.jfif');
        background-size: 150% 150%;
        animation: animatedBackground 130s linear infinite;*/
      }

      .boxLogo {
        height: 80px;
      }

      .boxLogo img {
        height: 80%;
      }

      .kiri {
        width: 45%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .kiriatas {
        width: 100%;
        height: 25%;
        background: rgba(255,255,255,0.7);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .kiriatas img {
        max-width: 50%;
        max-height: 60px;
        width: auto;
        height: auto;
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        position: relative;
      }

      .kiriatas .header {
        font-size: 1.6em;
      }

      .kiriatas #slogan {
        font-size: 0.9em;
      }

      .kiritengah {
        width: 100%;
        height: 65%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        background: #000;
        padding: 20px 10px;
      }

      #boxCarousel .slide {
        display: none;
        text-align: center;
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 0;
      }
      #boxCarousel .slide.active {
        display: flex;
        justify-content: center;
        padding: 0;
      }
      #boxCarousel img, #boxCarousel video {
        max-height: 100%;
        max-width: 100%;
      }
      .kiribawah {
        width: 100%;
        height: 10%;
      }

      .kanan {
        width: 55%;
        height: 100%;
        padding: 20px;
      }

      .tabel-wrapper {
        flex: 1 1 100%;
      }
      .half-width {
        flex: 1 1 calc(50% - 1rem);
      }
      table {
        width: 100%;
        font-size: var(--tabel-font-size, 1rem);
      }
      .boxSetup {
        transition: 0.5s;
        opacity: 0;
      }
      .boxSetup:hover {
        opacity: 1;
        transition: 0.5s;
      }
      .boxGambar {
        width: var(--box-size);
        height: var(--box-size);
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
      }
      .boxGambar img {
        height: 100%;
        width: auto;
        clip-path: circle();
      }
    </style>
  </head>
  <body>
      <div class="kiri">
        <div class="kiriatas bg-white rounded d-flex flex-column justify-content-center shadow">
          <div class="text-center boxLogo m-0"></div>
          <div>
            <!-- <h4 class="text-center dm-serif-text-regular m-0 namaPT"></h4> -->
            <p class="text-center dm-serif-text-regular header m-0">Mocha Display</p>
            <p class="text-center national-park m-0" id="slogan">More Than Trusted</p>
          </div>
        </div>
        <div class="kiritengah bg-white rounded shadow" id="boxCarousel">
        </div>
        <div class="kiribawah bg-white rounded shadow d-flex justify-content-center align-items-center">
          <p class="h6 national-park mb-0 text-center" id="footer"></p>
        </div>
      </div>
      <div class="kanan rounded shadow bg-white">
        <div class="card-header d-flex justify-content-between pb-2">
          <h5 class="national-park">Today's Rate</h5>
          <div class="d-flex p-0 gap-2 boxSetup">
            <div class="input-group input-group-sm p-0">
              <span class="input-group-text">Max Rows</span>
              <input type="number" id="maxRows" class="form-control" placeholder="Input Max Rows" min="1" value="10">
            </div>
            <div class="d-flex p-0">
              <button id="fontMinus" class="btn btn-sm btn-outline-primary">A-</button>
              <button id="fontPlus" class="btn btn-sm btn-outline-primary">A+</button>
            </div>
          </div>
          <h5 class="national-park"><?php echo date('d F Y'); ?></h5>
        </div>
        <div class="card-body overflow-auto">
          <div id="tabelContainer" class="d-flex flex-wrap gap-3"></div>
        </div>
      </div>

    <div class="modal fade animate__animated animate__fadeInUp" id="modalBranch" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body d-flex flex-column gap-4">
            <div class="app-brand justify-content-center mb-6 boxLogo">
              <span class="app-brand-logo demo logoForm">
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
              <span class="app-brand-text demo text-heading fw-bold namaPT">Mocha Display</span>
            </div>
            <h5 class="modal-title text-center mt-4">Select Which Branch You Are In</h5>
            <select id="selectBranch" class="form-select"></select>
            <button type="button" id="sbmBranch" class="btn btn-primary text-center">Submit</button>
          </div>
        </div>
      </div>
    </div>

  	<script src="/assets/vendor/libs/jquery/jquery.js"></script>

    <script src="/assets/vendor/libs/popper/popper.js"></script>
    <script src="/assets/vendor/js/bootstrap.js"></script>
    <script src="/assets/vendor/libs/node-waves/node-waves.js"></script>

    <script src="/assets/vendor/libs/@algolia/autocomplete-js.js"></script>

    <script src="/assets/vendor/libs/pickr/pickr.js"></script>

    <script src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="/assets/vendor/libs/hammer/hammer.js"></script>

    <script src="/assets/vendor/js/menu.js"></script>

    <script src="/assets/vendor/libs/select2/select2.js"></script>
    <script src="/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
    <script src="/assets/vendor/libs/typeahead-js/typeahead.js"></script>
    
  	<script src="/js/pages/customer-display.js"></script>
  </body>
  </html>