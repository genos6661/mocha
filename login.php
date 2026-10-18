<?php
ob_start(); // tahan keluaran supaya header & cookie masih bisa dikirim
echo "<!doctype html>\n";
session_start();
require 'config/config.php';
require 'remember.php';

// Sesi hilang tetapi "Remember Me" aktif: pulihkan sesi dari cookie
if (!isset($_SESSION['token']) && !empty($_COOKIE[REMEMBER_COOKIE])) {
    remember_restore();
}

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
    <!-- PWA: aplikasi bisa di-install (manifest + service worker, lihat js/pwa.js) -->
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#9c3030" />
    <link rel="apple-touch-icon" href="/assets/img/pwa/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="BERES Mocha" />
    <meta name="application-name" content="BERES Mocha" />
    <script src="/js/pwa.js" defer></script>

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
    <link rel="stylesheet" href="assets/css/login.css?v=<?= filemtime(__DIR__ . '/assets/css/login.css') ?>" />

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->

    <script src="assets/js/config.js"></script>
    <script src="assets/vendor/libs/jquery/jquery.js"></script>
  </head>

  <body class="login-page">
    <!-- Content -->

    <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="card login-card">
            <div class="login-hero text-center">
              <span class="login-logo text-white">
                <?php include __DIR__ . '/partials/logo.php'; ?>
              </span>
              <h4 class="fw-bold mb-1">Welcome back</h4>
              <p class="text-body-secondary mb-0">Sign in to continue to <strong class="text-heading">BERES Mocha</strong></p>
            </div>

            <div class="card-body login-body">
              <form id="formLogin" novalidate>
                <div class="mb-5">
                  <label for="email" class="form-label">Email or Username</label>
                  <div class="input-group input-group-merge">
                    <span class="input-group-text"><i class="icon-base ti tabler-user"></i></span>
                    <input
                      type="text"
                      class="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email or username"
                      autocomplete="username"
                      autocapitalize="none"
                      spellcheck="false"
                      autofocus />
                  </div>
                </div>
                <div class="mb-5">
                  <label class="form-label" for="password">Password</label>
                  <div class="input-group input-group-merge">
                    <span class="input-group-text"><i class="icon-base ti tabler-lock"></i></span>
                    <input
                      type="password"
                      id="password"
                      class="form-control"
                      name="password"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      autocomplete="current-password" />
                    <button type="button" class="input-group-text cursor-pointer login-toggle" id="togglePassword" aria-label="Show password">
                      <i class="icon-base ti tabler-eye-off"></i>
                    </button>
                  </div>
                </div>

                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-5">
                  <div class="form-check mb-0">
                    <input class="form-check-input" type="checkbox" id="remember-me" />
                    <label class="form-check-label" for="remember-me" title="Stay signed in on this device for 30 days">Remember Me</label>
                  </div>
                  <small class="text-body-secondary">Forgot password? Contact your administrator.</small>
                </div>

                <div class="login-error d-none" id="error" role="alert">
                  <i class="icon-base ti tabler-alert-circle"></i><span id="errorText"></span>
                </div>

                <button class="btn btn-primary w-100 login-submit" type="submit" id="sbmLogin">
                  <span class="spinner-border spinner-border-sm d-none me-2" role="status" aria-hidden="true"></span>
                  <span class="login-submit-text">Login</span>
                </button>
              </form>

              <div class="login-divider"><span>or</span></div>

              <a href="/order-form" class="btn btn-outline-primary w-100 login-customer">
                <i class="icon-base ti tabler-shopping-cart icon-sm me-2"></i>Customer? Place your order
              </a>
            </div>
          </div>
          <!-- /Login -->
        </div>
      </div>
    </div>

    <footer class="public-footer login-footer">
      &copy; <?= date('Y') ?> BERES Mocha &middot; by <a href="https://thebrotherhoodlaw.com" target="_blank" rel="noopener">The Brotherhood</a>
    </footer>

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

        const $btn = $('#sbmLogin');

        function showError(message) {
          $('#errorText').text(message);
          $('#error').removeClass('d-none');
        }

        function setLoading(loading) {
          $btn.prop('disabled', loading);
          $btn.find('.spinner-border').toggleClass('d-none', !loading);
          $btn.find('.login-submit-text').text(loading ? 'Signing in…' : 'Login');
        }

        $('#togglePassword').on('click', function () {
          const $input = $('#password');
          const show = $input.attr('type') === 'password';
          $input.attr('type', show ? 'text' : 'password');
          $(this).attr('aria-label', show ? 'Hide password' : 'Show password')
            .find('i').toggleClass('tabler-eye', show).toggleClass('tabler-eye-off', !show);
        });

        $("#formLogin").submit(function(event) {
            event.preventDefault();
            if ($btn.prop('disabled')) return;

            var email = $("#email").val().trim();
            var password = $("#password").val();
            var remember = $('#remember-me').is(':checked');

            $('#error').addClass('d-none');
            if (!email || !password) {
              showError('Please enter your email/username and password.');
              return;
            }
            setLoading(true);

            $.ajax({
                url: url_api + "/login",
                type: "POST",
                contentType: "application/json",
                headers: {
                  'X-Client-Domain': myDomain
                },
                data: JSON.stringify({ email: email, password: password, remember: remember }),
                success: function(response) {
                    if (response.token && response.user) {
                        $.ajax({
                            url: "session_login.php",
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({ token: response.token, user: response.user, remember: remember }),
                            success: function(sessionResponse) {
                                if (sessionResponse.success) {
                                    window.location.href = "/";
                                } else {
                                    showError("Error: " + sessionResponse.error);
                                    setLoading(false);
                                }
                            },
                            error: function() {
                                showError("Error: could not start your session");
                                setLoading(false);
                            }
                        });
                    } else {
                        showError("Login failed. Please check your email and password.");
                        setLoading(false);
                    }
                },
                error: function(xhr) {
                    try {
                        let response = JSON.parse(xhr.responseText);
                        showError("Error: " + (response.message || "Something went wrong"));
                    } catch (e) {
                        showError("Error: Login Failed");
                    }
                    setLoading(false);
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
