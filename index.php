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
        $page = 'pages/home.php'; 
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

    <link rel="stylesheet" href="/assets/css/demo.css?v=<?= filemtime(__DIR__ . '/assets/css/demo.css') ?>" />

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

    <script src="/js/main.js"></script>

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
    <?php $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); $array_reports = ['/reports','/bi-reports', '/acc-reports', '/master-reports', '/other-reports', '/summary-valas', '/summary-valas-advance', '/lkub', '/neraca', '/laba-rugi', '/lkpe', '/accounting-reports', '/ledger', '/logs-report', '/master-data-reports', '/customer-report', '/employee-report', '/partner-report', '/other-features', '/dttot-list', '/transactions-summary', '/transactions-detail']; ?>
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
                    <?php include __DIR__ . '/partials/logo.php'; ?>
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
                      <img src="/assets/img/avatars/1.png" alt class="rounded-circle avatarLogin" id="" />
                    </div>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="/profile">
                        <div class="d-flex">
                          <div class="flex-shrink-0 me-3">
                            <div class="avatar avatar-online">
                              <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle avatarLogin" />
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
                    <li id="btnInstallApp" class="d-none">
                      <a class="dropdown-item" href="javascript:;">
                        <i class="icon-base ti tabler-download icon-md me-3"></i><span>Install App</span>
                      </a>
                    </li>
                    <li id="btnBackup">
                      <a class="dropdown-item">
                        <i class="icon-base ti tabler-device-floppy icon-md me-3"></i><span>Backup Data</span>
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
                          <div data-i18n="master">Accounts</div>
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
                  <li class="menu-item <?php if (in_array($current_path, ['/order', '/order/edit', '/transaction', '/transaction/edit'])) { echo 'active'; } ?>">
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
                      <li class="menu-item <?php if($current_path == '/transaction' || $current_path == '/transaction/edit') { echo 'active'; } ?>">
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
            <footer class="content-footer footer bg-footer-theme app-footer">
              <div class="container-xxl">
                <div class="app-footer-inner">
                  <span class="app-footer-copy">&copy; <?= date('Y') ?> <strong>BERES Mocha</strong> &middot; All rights reserved</span>
                  <a href="https://thebrotherhoodlaw.com" target="_blank" rel="noopener" class="app-footer-credit">
                    <span class="app-footer-label">Crafted by</span>
                    <span class="app-footer-brand"><i class="icon-base ti tabler-heart-handshake"></i>The Brotherhood</span>
                    <i class="icon-base ti tabler-arrow-up-right app-footer-arrow"></i>
                  </a>
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

    <!-- Modal proses Backup Data (js/main.js: backupData) -->
    <div class="modal fade" id="modalBackup" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content proc-modal">
          <div class="modal-body text-center">
            <div class="proc-icon" id="backupIcon"><i class="icon-base ti tabler-database-export"></i></div>
            <h4 class="mb-1" id="backupTitle">Backing up data…</h4>
            <p class="text-body-secondary mb-0" id="backupSubtitle">Please keep this window open until the backup file is downloaded.</p>

            <ul class="proc-steps text-start" id="backupSteps">
              <li data-step="dump"><i class="icon-base ti tabler-circle"></i><span>Creating &amp; encrypting backup</span><span class="proc-detail"></span></li>
              <li data-step="download"><i class="icon-base ti tabler-circle"></i><span>Downloading file</span><span class="proc-detail"></span></li>
              <li data-step="save"><i class="icon-base ti tabler-circle"></i><span>Saving to your device</span><span class="proc-detail"></span></li>
            </ul>
            <div class="proc-bar indeterminate" id="backupBarBox"><div id="backupBar"></div></div>

            <div class="proc-actions">
              <button type="button" class="btn btn-label-secondary" id="btnBackupCancel">Cancel</button>
              <button type="button" class="btn btn-label-secondary d-none" id="btnBackupClose" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary d-none" id="btnBackupAgain"></button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
    <script src="/js/export/csv.js" type="text/javascript"></script>
    <script src="/js/export/excel.js" type="text/javascript"></script>
    <script src="/js/export/pdf.js" type="text/javascript"></script>
    <script src="/js/export/print.js" type="text/javascript"></script>
    <script src="/js/responsive-tables.js?v=<?= filemtime(__DIR__ . '/js/responsive-tables.js') ?>"></script>

    <!-- Page JS -->
  </body>
</html>
