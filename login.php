<!doctype html>
<?php
session_start();
require 'config/config.php';

// Jika sudah login, langsung ke index.php
if (isset($_SESSION['token'])) {
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

    <meta name="description" content="BERES Mocha is an all-in-one system for money changer business" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/logo.svg" />

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
                <a href="/" class="app-brand-link">
                  <span class="app-brand-logo demo">
                    <span class="text-primary">
                      <?php include __DIR__ . '/partials/logo.php'; ?>
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
        if (myDomain === "sample.beresmocha.id") {
            var $userInput = $('#email');
            var $passInput = $('#password');

            $.getJSON('/assets/json/sample-login.json')
              .done(function(data){
                if (!data || !Array.isArray(data.users) || data.users.length === 0) return;
                var users = data.users;
                var rand = Math.floor(Math.random() * users.length);
                var u = users[rand];
                $userInput.val(u.email);
                $passInput.val(u.password);
              })
              .fail(function(jqxhr, textStatus, error){
                console.error('Gagal load users.json:', textStatus, error);
              });
        }
        
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
                          $("#error").text("Error: " + (response.message || "Terjadi kesalahan"));
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
