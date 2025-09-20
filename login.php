<!doctype html>
<?php
session_start();
require 'config/config.php';

// Jika sudah login, langsung ke index.php
if (isset($_SESSION['token'])) {
    echo $_SESSION['token'];
    header("Location: /");
    exit();
}
?>
<html
  lang="en"
  class="layout-wide customizer-hide"
  dir="ltr"
  data-skin="default"
  data-assets-path="assets/"
  data-template="horizontal-menu-template"
  data-bs-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>BERES Mocha Login</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/beres.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="/assets/vendor/css/main-font.css" rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/fonts/iconify-icons.css" />

    <!-- Core CSS -->
    <!-- build:css assets/vendor/css/theme.css  -->

    <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="assets/vendor/css/core.css" />
    <link rel="stylesheet" href="assets/css/demo.css" />

    <!-- Vendors CSS -->

    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />

    <!-- endbuild -->

    <!-- Vendor -->
    <link rel="stylesheet" href="assets/vendor/libs/@form-validation/form-validation.css" />

    <!-- Page CSS -->
    <!-- Page -->
    <link rel="stylesheet" href="assets/vendor/css/pages/page-auth.css" />

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->

    <script src="assets/js/config.js"></script>
    <script src="assets/vendor/libs/jquery/jquery.js"></script>
  </head>

  <body>
    <!-- Content -->

    <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="card">
            <div class="card-body">
              <!-- Logo -->
              <div class="app-brand justify-content-center mb-6">
                <a href="index.html" class="app-brand-link">
                  <span class="app-brand-logo demo">
                    <span class="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg"
                       width="700pt" height="794pt" viewBox="0 0 700 794">

                        <g transform="translate(200,794.000000) scale(0.100000,-0.100000)"
                        fill="currentColor" stroke="none">
                        <path d="M770 7662 c-42 -15 -96 -40 -121 -54 -63 -37 -153 -137 -190 -210
                        -32 -63 -60 -174 -58 -230 1 -18 -3 -67 -8 -108 -4 -41 -6 -1517 -3 -3280 l5
                        -3205 33 -67 c55 -111 161 -204 277 -244 67 -24 228 -24 307 -1 174 52 370
                        248 447 446 l26 66 5 590 c5 581 6 591 29 673 20 72 29 87 69 122 24 22 53 40
                        63 40 10 0 21 5 24 10 3 6 16 10 29 10 12 0 26 4 32 10 6 6 329 11 884 13
                        1000 5 969 2 1141 87 91 45 190 120 273 210 233 249 337 323 516 363 86 19
                        341 9 356 -14 3 -5 14 -9 25 -9 10 0 27 -4 37 -9 9 -5 40 -19 67 -32 163 -76
                        325 -240 401 -405 49 -108 65 -174 71 -304 5 -99 -4 -159 -39 -270 -60 -190
                        -189 -354 -309 -394 -137 -45 -166 -46 -1280 -46 -1173 0 -1103 4 -1216 -69
                        -114 -73 -316 -299 -373 -416 -65 -133 -61 -267 13 -409 69 -134 177 -231 291
                        -260 60 -15 2113 -14 2226 1 233 32 391 76 575 162 188 88 508 288 660 412
                        237 193 462 498 564 764 12 33 27 68 32 77 5 10 9 27 9 37 0 11 4 22 9 25 5 3
                        11 20 14 38 3 18 11 53 17 78 59 234 59 586 0 820 -6 25 -14 60 -17 78 -3 18
                        -9 35 -14 38 -5 3 -9 16 -9 29 0 13 -4 27 -10 30 -5 3 -10 13 -10 22 0 29
                        -117 278 -169 358 -191 296 -428 523 -688 658 -35 17 -63 37 -63 42 0 6 17 22
                        38 36 66 47 383 329 487 434 213 214 371 470 463 750 64 199 77 293 77 580 0
                        249 -8 335 -42 465 -8 30 -18 69 -23 85 -13 51 -40 128 -61 172 -10 24 -19 47
                        -19 52 0 8 -59 125 -99 195 -116 202 -340 453 -534 595 -158 116 -356 218
                        -552 284 -139 46 -178 56 -360 89 -41 7 -726 11 -2155 14 l-2095 3 -75 -27z
                        m3940 -1282 c160 -25 276 -68 401 -151 187 -125 335 -337 382 -549 14 -66 20
                        -331 8 -343 -6 -6 -11 -22 -11 -36 0 -25 -16 -83 -31 -113 -5 -10 -9 -22 -9
                        -28 0 -18 -48 -115 -78 -156 -21 -28 -50 -51 -95 -72 -36 -18 -73 -32 -81 -32
                        -8 0 -17 -4 -20 -9 -14 -21 -223 -40 -336 -30 -90 8 -132 15 -165 29 -11 4
                        -36 14 -55 21 -80 29 -189 117 -355 285 -226 228 -324 293 -545 356 -102 29
                        -165 31 -980 38 -465 3 -858 10 -875 14 -64 16 -123 45 -175 85 -89 68 -144
                        153 -174 268 -19 72 -22 260 -5 297 19 41 119 98 214 122 64 15 2883 19 2985
                        4z m-1440 -2087 c47 -23 102 -56 123 -73 33 -28 117 -139 117 -155 0 -3 9 -24
                        19 -48 26 -57 35 -108 34 -192 0 -73 -8 -125 -24 -162 -34 -84 -47 -95 -136
                        -125 -52 -17 -103 -18 -787 -18 l-731 0 -69 25 c-136 49 -209 114 -271 240
                        -46 91 -58 165 -53 300 7 145 18 167 106 208 37 17 87 34 112 38 25 4 367 6
                        760 5 l715 -1 85 -42z"/>
                        </g>
                      </svg>
                    </span>
                  </span>
                  <span class="app-brand-text demo text-heading fw-bold">BERES Mocha</span>
                </a>
              </div>
              <!-- /Logo -->
              <!-- <h4 class="mb-1">Welcome to Vuexy! 👋</h4> -->
              <!-- <p class="mb-6">Sign-in to your account</p> -->

              <form id="formLogin">
                <div class="mb-6 form-control-validation">
                  <label for="email" class="form-label">Email or Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email or username"
                    autofocus />
                </div>
                <div class="mb-6 form-password-toggle form-control-validation">
                  <label class="form-label" for="password">Password</label>
                  <div class="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      class="form-control"
                      name="password"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      aria-describedby="password" />
                    <span class="input-group-text cursor-pointer"><i class="icon-base ti tabler-eye-off"></i></span>
                  </div>
                </div>
                <div class="my-8">
                  <div class="d-flex justify-content-between">
                    <div class="form-check mb-0 ms-2">
                      <input class="form-check-input" type="checkbox" id="remember-me" />
                      <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                    <a href="auth-forgot-password-basic.html">
                      <p class="mb-0">Forgot Password?</p>
                    </a>
                  </div>
                </div>
                <div><p id="error" class="text-danger"></p></div>
                <div class="mb-6">
                  <button class="btn btn-primary d-grid w-100" type="submit" id="sbmLogin">Login</button>
                </div>
              </form>

              <p class="text-center">
                <span>Are you a customer?</span>
                <a href="/order-form">
                  <span>Place your order</span>
                </a>
              </p>
            </div>
          </div>
          <!-- /Login -->
        </div>
      </div>
    </div>

    <script>
      $(document).ready(function() {
          $("#formLogin").submit(function(event) {
              event.preventDefault();
              const $btn = $('#sbmLogin');
              if ($btn.prop('disabled')) return;
              $btn.prop('disabled', true);

              var email = $("#email").val();
              var password = $("#password").val();
              var apiUrl = url_api + "/login";
              var payload = { email: email, password: password };

              $.ajax({
                  url: apiUrl,
                  type: "POST",
                  contentType: "application/json",
                  headers: {
                    'X-Client-Domain': myDomain
                  },
                  data: JSON.stringify(payload),
                  success: function(response) {
                      if (response.token && response.user) {
                          $.ajax({
                              url: "session_login.php",
                              type: "POST",
                              contentType: "application/json",
                              data: JSON.stringify({ token: response.token, user: response.user }),
                              success: function(sessionResponse) {
                                  if (sessionResponse.success) {
                                      window.location.href = "/";
                                      // console.log(sessionResponse.token2);
                                  } else {
                                      $("#error").text("Error: " + sessionResponse.error);
                                      $btn.removeAttr('disabled');
                                  }
                              }
                          });
                      } else {
                          $("#error").text("Login gagal. Periksa kembali email dan password.");
                          $btn.removeAttr('disabled');
                      }
                  },
                  error: function(xhr) {
                      try {
                          let response = JSON.parse(xhr.responseText);
                          $("#error").text("Error: " + (response.error || "Terjadi kesalahan"));
                          $btn.removeAttr('disabled');
                      } catch (e) {
                          $("#error").text("Error: Login Failed");
                          $btn.removeAttr('disabled');
                      }
                  }
              });
          });
      });
      </script>

    <script src="assets/vendor/libs/popper/popper.js"></script>
    <script src="assets/vendor/js/bootstrap.js"></script>
    <script src="assets/vendor/libs/node-waves/node-waves.js"></script>

    <script src="assets/vendor/libs/@algolia/autocomplete-js.js"></script>

    <script src="assets/vendor/libs/pickr/pickr.js"></script>

    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="assets/vendor/libs/hammer/hammer.js"></script>

    <script src="assets/vendor/libs/i18n/i18n.js"></script>

    <script src="assets/vendor/js/menu.js"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->
    <script src="assets/vendor/libs/@form-validation/popular.js"></script>
    <script src="assets/vendor/libs/@form-validation/bootstrap5.js"></script>
    <script src="assets/vendor/libs/@form-validation/auto-focus.js"></script>

    <!-- Main JS -->

    <script src="assets/js/main.js"></script>

    <!-- Page JS -->
    <script src="assets/js/pages-auth.js"></script>
  </body>
</html>
