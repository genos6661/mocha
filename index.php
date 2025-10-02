<?php
session_start();
require 'auth.php'; 
$dispatcher = require 'routes.php';

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$uri = rawurldecode(parse_url($uri, PHP_URL_PATH));

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        $page = '404.php';
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo "Method Not Allowed";
        exit();
    case FastRoute\Dispatcher::FOUND:
        $page = $routeInfo[1]; // ✅ Simpan halaman yang benar
        break;
    default:
        $page = 'pages/home.php'; // ✅ Halaman default
}
?>
<script>
    window.token = "<?php echo isset($_SESSION['token']) ? $_SESSION['token'] : ''; ?>";
    window.level = "<?php echo isset($_SESSION['user']['level']) ? $_SESSION['user']['level'] : ''; ?>";
</script>
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

    <title>Mocha</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/beres.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="/assets/vendor/css/main-font.css" rel="stylesheet" />

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
    <link rel="stylesheet" href="/assets/vendor/libs/spinkit/spinkit.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/notiflix/notiflix.css" />
    <link rel="stylesheet" href="/assets/vendor/fonts/flag-icons.css" />

    <link rel="stylesheet" href="/assets/css/demo.css" />

    <!-- endbuild -->

    <script src="/assets/vendor/js/jquery-3.7.1.js"></script>
    <!-- xlsx -->
    <script src="/assets/vendor/libs/export-laporan/excel.js" crossorigin="anonymous"></script>
    <!-- jsPDF -->
    <script src="/assets/vendor/libs/export-laporan/jspdf.js" crossorigin="anonymous"></script>
    <!-- jsPDF AutoTable -->
    <script src="/assets/vendor/libs/export-laporan/autotable.js"></script>


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
  </head>

  <body>
    <?php $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); $array_reports = ['/reports','/bi-reports', '/acc-reports', '/master-reports', '/other-reports', '/summary-valas', '/lkub', '/neraca', '/laba-rugi', '/lkpe', '/accounting-reports', '/ledger', '/logs-report', '/master-data-reports']; ?>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <!-- Navbar -->

        <nav class="layout-navbar navbar navbar-expand-xl align-items-center" id="layout-navbar">
          <div class="container-xxl">
            <div class="navbar-brand app-brand demo d-none d-xl-flex py-0 me-4 ms-0">
              <a href="/" class="app-brand-link d-flex flex-column flex-md-row">
                <span class="app-brand-logo demo d-none d-md-block">
                  <span class="text-primary">
                    <!-- <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    </svg> -->
                    <svg xmlns="http://www.w3.org/2000/svg"
                       width="700.000000pt" height="794.000000pt" viewBox="0 0 700 794.000000">

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
                <span class="app-brand-text demo text-wrap menu-text fw-bold text-heading cantata-one" id="navbarNamaPT">BERES Mocha</span>
              </a>

              <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-xl-none">
                <i class="icon-base ti tabler-x icon-sm d-flex align-items-center justify-content-center"></i>
              </a>
            </div>

            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a class="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
                <i class="icon-base ti tabler-menu-2 icon-md"></i>
              </a>
            </div>

            <div class="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              <div class="navbar-nav align-items-center">
                <div class="nav-item dropdown me-2 me-xl-0">
                  <a
                    class="nav-link dropdown-toggle hide-arrow"
                    id="nav-theme"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown">
                    <i class="icon-base ti tabler-sun icon-md theme-icon-active"></i>
                    <span class="d-none ms-2" id="nav-theme-text">Toggle theme</span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="nav-theme-text">
                    <li>
                      <button
                        type="button"
                        class="dropdown-item align-items-center active"
                        data-bs-theme-value="light"
                        aria-pressed="false">
                        <span><i class="icon-base ti tabler-sun icon-md me-3" data-icon="sun"></i>Light</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="dropdown-item align-items-center"
                        data-bs-theme-value="dark"
                        aria-pressed="true">
                        <span
                          ><i class="icon-base ti tabler-moon-stars icon-md me-3" data-icon="moon-stars"></i>Dark</span
                        >
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="dropdown-item align-items-center"
                        data-bs-theme-value="system"
                        aria-pressed="false">
                        <span
                          ><i
                            class="icon-base ti tabler-device-desktop-analytics icon-md me-3"
                            data-icon="device-desktop-analytics"></i
                          >System</span
                        >
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <ul class="navbar-nav flex-row align-items-center ms-md-auto">
                <!-- User -->
                <li class="nav-item navbar-dropdown dropdown-user dropdown">
                  <a
                    class="nav-link dropdown-toggle hide-arrow p-0"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown">
                    <div class="avatar avatar-online">
                      <img src="/assets/img/avatars/1.png" alt class="rounded-circle" />
                    </div>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="/profile">
                        <div class="d-flex">
                          <div class="flex-shrink-0 me-3">
                            <div class="avatar avatar-online">
                              <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div class="flex-grow-1">
                            <h6 class="mb-0" id="navbarNama">John Doe</h6>
                            <small class="text-body-secondary" id="NavbarRole">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/settings">
                        <i class="icon-base ti tabler-settings icon-md me-3"></i><span>Settings</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/user-management">
                        <span class="d-flex align-items-center align-middle">
                          <i class="flex-shrink-0 icon-base ti tabler-users icon-md me-3"></i
                          ><span class="flex-grow-1 align-middle">User Management</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/beginning-balance">
                        <i class="icon-base ti tabler-receipt-pound icon-md me-3"></i><span>Beginning Balance</span>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/customer-display" target="_blank">
                        <i class="icon-base ti tabler-device-desktop-share icon-md me-3"></i><span>Customer Display</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/order-form" target="_blank">
                        <i class="icon-base ti tabler-clipboard-text icon-md me-3"></i><span>Form Order</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="logout.php">
                        <i class="icon-base ti tabler-power icon-md me-3"></i><span>Log Out</span>
                      </a>
                    </li>
                    <li>
                      <div class="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/clear">
                        <i class="icon-base ti tabler-refresh icon-md me-3"></i><span>Clear Cache</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <!--/ User -->
              </ul>
            </div>
          </div>
        </nav>

        <!-- / Navbar -->

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Menu -->
            <aside id="layout-menu" class="layout-menu-horizontal menu-horizontal menu flex-grow-0">
              <div class="container-xxl d-flex h-100">
                <ul class="menu-inner py-1 justify-content-lg-center">
                  <!-- Page -->
                  <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/home' || $_SERVER['REQUEST_URI'] == '/') { echo 'active'; } ?>">
                    <a href="/home" class="menu-link">
                      <i class="menu-icon icon-base ti tabler-smart-home"></i>
                      <div data-i18n="Page 1">Home</div>
                    </a>
                  </li>
                  <li class="menu-item <?php if (in_array($_SERVER['REQUEST_URI'], ['/branch', '/contacts', '/account', '/fixed-asset'])) { echo 'active'; } ?>">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon icon-base ti tabler-building-warehouse"></i>
                      <div data-i18n="master">Master Data</div>
                    </a>
                    <ul class="menu-sub">
                      <!-- Tables -->
                      <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/branch') { echo 'active'; } ?>">
                        <a href="/branch" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-building"></i>
                          <div data-i18n="master">Branch</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/contacts') { echo 'active'; } ?>">
                        <a href="/contacts" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-users"></i>
                          <div data-i18n="master">Contacts</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/account') { echo 'active'; } ?>">
                        <a href="/account" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-receipt-dollar"></i>
                          <div data-i18n="master">Account</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/fixed-asset') { echo 'active'; } ?>">
                        <a href="/fixed-asset" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-building-community"></i>
                          <div data-i18n="master">Assets</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item <?php if (in_array($_SERVER['REQUEST_URI'], ['/forex', '/forex-stock', '/forex-mutation'])) { echo 'active'; } ?>">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon icon-base ti tabler-cash"></i>
                      <div data-i18n="forex">Forex</div>
                    </a>
                    <ul class="menu-sub">
                      <!-- Tables -->
                      <li class="menu-item <?php if($_SERVER['REQUEST_URI'] == '/forex') { echo 'active'; } ?>">
                        <a href="/forex" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-cash"></i>
                          <div data-i18n="forex">Forex</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/forex-stock') { echo 'active'; } ?>">
                        <a href="/forex-stock" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-cash-register"></i>
                          <div data-i18n="forex">Forex Stock</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/forex-mutation') { echo 'active'; } ?>">
                        <a href="/forex-mutation" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-presentation"></i>
                          <div data-i18n="forex">Forex Mutation</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item <?php if (in_array($current_path, ['/order', '/order/edit', '/transaction'])) { echo 'active'; } ?>">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon icon-base ti tabler-mail-dollar"></i>
                      <div data-i18n="transaction">Transaction</div>
                    </a>
                    <ul class="menu-sub">
                      <!-- Tables -->
                      <li class="menu-item <?php if($current_path == '/order' || $current_path == '/order/edit') { echo 'active'; } ?>">
                        <a href="/order" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-mail-dollar"></i>
                          <div data-i18n="transaction">Order</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/transaction') { echo 'active'; } ?>">
                        <a href="/transaction" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-file-dollar"></i>
                          <div data-i18n="transaction">Transaction</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item <?php if (in_array($current_path, ['/cash-transaction', '/journal', '/adjustment', '/forex-transfer'])) { echo 'active'; } ?>">
                    <a href="javascript:void(0)" class="menu-link menu-toggle">
                      <i class="menu-icon icon-base ti tabler-shopping-bag"></i>
                      <div data-i18n="other-transaction">Other Transaction</div>
                    </a>
                    <ul class="menu-sub">
                      <li class="menu-item <?php if($current_path == '/cash-transaction') { echo 'active'; } ?>">
                        <a href="/cash-transaction" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-cash-banknote"></i>
                          <div data-i18n="other-transaction">Cash Transaction</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/journal') { echo 'active'; } ?>">
                        <a href="/journal" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-notebook"></i>
                          <div data-i18n="other-transaction">Manual Journal</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/adjustment') { echo 'active'; } ?>">
                        <a href="/adjustment" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-clipboard-text"></i>
                          <div data-i18n="other-transaction">Stock Adjustment</div>
                        </a>
                      </li>
                      <li class="menu-item <?php if($current_path == '/forex-transfer') { echo 'active'; } ?>">
                        <a href="/forex-transfer" class="menu-link">
                          <i class="menu-icon icon-base ti tabler-transfer"></i>
                          <div data-i18n="other-transaction">Forex Transfer</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="menu-item <?php  if(in_array($current_path, $array_reports)) { echo 'active'; } ?>">
                    <a href="/reports" class="menu-link">
                      <i class="menu-icon icon-base ti tabler-report"></i>
                      <div data-i18n="Reports">Reports</div>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
            <!-- / Menu -->

            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
              <?php include_once $page; ?>
            </div>
            <!--/ Content -->

            <!-- Footer -->
            <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl">
                <div
                  class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                  <div class="text-body">
                    ©
                    <script>
                      document.write(new Date().getFullYear());
                    </script>
                    , made with ❤️ by <a href="#" target="_blank" class="footer-link">Brotherhood Software Solutions</a>
                  </div>
                  <!-- <div class="d-none d-lg-inline-block">
                    <a
                      href="https://demos.pixinvent.com/vuexy-html-admin-template/documentation/"
                      target="_blank"
                      class="footer-link me-4"
                      >Documentation</a
                    >
                  </div> -->
                </div>
              </div>
            </footer>
            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!--/ Content wrapper -->
        </div>

        <!--/ Layout container -->
      </div>
    </div>

    <!-- Overlay -->
    <div class="layout-overlay layout-menu-toggle"></div>

    <!-- Drag Target Area To SlideIn Menu On Small Screens -->
    <div class="drag-target"></div>

    <!--/ Layout wrapper -->

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/theme.js -->

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
    <script src="/assets/vendor/libs/notiflix/notiflix.js"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->

    <!-- Main JS -->

    <script src="/assets/js/main.js"></script>
    <script src="/js/main.js"></script>
    <script src="/js/export/csv.js" type="text/javascript"></script>
    <script src="/js/export/excel.js" type="text/javascript"></script>
    <script src="/js/export/pdf.js" type="text/javascript"></script>

    <!-- Page JS -->
  </body>
</html>
