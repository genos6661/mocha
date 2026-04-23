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
    <?php $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); $array_reports = ['/reports','/bi-reports', '/acc-reports', '/master-reports', '/other-reports', '/summary-valas', '/lkub', '/neraca', '/laba-rugi', '/lkpe', '/accounting-reports', '/ledger', '/logs-report', '/master-data-reports', '/customer-report']; ?>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="415" height="415" viewBox="-70 0 415 415">
                    <path d="M0 0 C57.4139113 -0.16121214 57.4139113 -0.16121214 81.54101562 -0.1953125 C87.05314176 -0.20314258 92.56526744 -0.21122411 98.07739258 -0.21972656 C98.76813427 -0.22078156 99.45887596 -0.22183655 100.17054921 -0.22292352 C111.28472774 -0.24026436 122.39882249 -0.27176807 133.51295153 -0.30861118 C144.94086004 -0.34617515 156.36870095 -0.36796938 167.796673 -0.37635398 C174.20642365 -0.3815467 180.6159851 -0.39366201 187.02567482 -0.42292023 C193.07245929 -0.45029535 199.11897861 -0.45840073 205.16581917 -0.45243073 C207.37189429 -0.45352115 209.57797932 -0.46134205 211.7840004 -0.4768219 C225.39706147 -0.56757044 237.8050187 0.59348187 251 4 C252.02626904 4.26307827 253.05253809 4.52615654 254.1099062 4.79720688 C256.23610393 5.36163604 258.33610158 5.97512704 260.4375 6.625 C261.12908203 6.82867188 261.82066406 7.03234375 262.53320312 7.2421875 C265.84934752 8.23990886 268.97003141 9.3106569 272 11 C272 11.66 272 12.32 272 13 C273.32 13 274.64 13 276 13 C276 13.66 276 14.32 276 15 C276.88429688 15.25910156 277.76859375 15.51820312 278.6796875 15.78515625 C296.88316551 22.44548762 311.28952155 41.61802289 319.375 58.5 C329.41701176 80.33625461 330.46955425 103.76717376 325 127 C324.70996094 128.24716797 324.70996094 128.24716797 324.4140625 129.51953125 C319.71459803 145.9676569 307.12894197 164.87358837 292.30078125 173.5859375 C289.88378451 174.79255943 289.88378451 174.79255943 289 177 C289.5465625 177.10570312 290.093125 177.21140625 290.65625 177.3203125 C307.77765398 182.28551965 320.23821135 198.59329155 328.75 213.1875 C332.57662227 220.48254475 334.35204825 227.99060011 336 236 C336.1750708 236.77303467 336.3501416 237.54606934 336.53051758 238.3425293 C339.61109471 255.7799095 337.95545042 275.17262095 330 291 C329.68804687 291.96808594 329.37609375 292.93617188 329.0546875 293.93359375 C321.71733564 315.26626489 302.40509463 331.10553417 283 341 C275.6998717 344.36647521 268.11347763 346.64171945 260.375 348.75 C259.6116333 348.96100342 258.8482666 349.17200684 258.06176758 349.3894043 C246.09870732 352.49982549 233.85237031 352.13997555 221.58520508 352.11352539 C219.74124147 352.11324288 217.89727775 352.11340249 216.05331421 352.1139679 C211.0768416 352.11425339 206.10039337 352.10839677 201.1239264 352.10139394 C195.91226467 352.0951191 190.7006023 352.09455334 185.48893738 352.09336853 C175.63303465 352.09026736 165.7771431 352.08207039 155.92124528 352.07201904 C144.69508679 352.06082013 133.46892776 352.05533795 122.24276507 352.05032361 C99.16183577 352.03988671 76.08092177 352.02155639 53 352 C53 364.21 53 376.42 53 389 C34.52 389 16.04 389 -3 389 C-3.020625 382.565 -3.04125 376.13 -3.0625 369.5 C-3.071604 367.58767578 -3.08070801 365.67535156 -3.09008789 363.70507812 C-3.12799249 348.828825 -2.81567208 333.96372471 -2.49389648 319.09179688 C-2.44606827 316.84552207 -2.3983355 314.59924522 -2.35070038 312.35296631 C-2.23489995 306.90195361 -2.11792389 301.45096715 -2 296 C-0.2581639 295.99503478 -0.2581639 295.99503478 1.51886082 295.98996925 C29.13647329 295.91080691 56.7540382 295.82153271 84.37157768 295.71994839 C87.77709644 295.70743079 91.18261551 295.69499782 94.58813477 295.68261719 C95.60502303 295.6789182 95.60502303 295.6789182 96.6424545 295.67514448 C107.59307011 295.63551239 118.54369592 295.60272299 129.49434108 295.57250018 C140.74597682 295.54129293 151.99756947 295.50249995 163.2491588 295.45720994 C169.56256329 295.43203427 175.87593775 295.41022686 182.18937874 295.39665604 C188.14092465 295.38375433 194.09236709 295.36161363 200.04385567 295.33261681 C202.21933366 295.32360408 204.39482828 295.31786568 206.57032394 295.31578636 C218.24227915 295.30264125 229.47104348 294.88493144 241 293 C242.5624946 292.81245497 244.12499319 292.62494325 245.6875 292.4375 C255.11534275 290.16981813 263.00644916 281.96843219 268 274 C268.556875 273.21625 269.11375 272.4325 269.6875 271.625 C275.25850691 260.48298618 275.70544405 247.96291512 272.375 236.0625 C268.27376945 224.48759844 260.74271768 215.97928007 250 210 C248.43493068 209.27188 246.85070002 208.58353416 245.25 207.9375 C244.47140625 207.61652344 243.6928125 207.29554688 242.890625 206.96484375 C233.22724781 203.73936515 223.97303842 203.69360636 213.91381836 203.68115234 C212.18837011 203.67184295 210.46292633 203.66167278 208.73748779 203.65071106 C204.07495574 203.62351101 199.41245373 203.6082914 194.74986339 203.59528303 C189.86914183 203.57960859 184.98848123 203.55283219 180.10780334 203.5272522 C170.87518341 203.48054061 161.6425519 203.44375969 152.4098745 203.41057932 C141.89471321 203.372304 131.37961325 203.32290805 120.86450374 203.27259517 C99.24304223 203.16938866 77.62155475 203.0815595 56 203 C56 216.53 56 230.06 56 244 C37.52 244 19.04 244 0 244 C0 212.98 0 181.96 0 150 C6.71754639 149.9906543 13.43509277 149.98130859 20.35620117 149.97167969 C42.55231052 149.93791082 64.74832731 149.88256281 86.94436169 149.81609726 C89.62591212 149.8081461 92.30746279 149.80027974 94.98901367 149.79248047 C95.65550135 149.7905391 96.32198902 149.78859772 97.00867329 149.78659752 C107.7795856 149.75563396 118.55047664 149.73861268 129.32142504 149.72680578 C140.38550064 149.71436487 151.4494615 149.68650274 162.51346761 149.64538693 C168.72289042 149.62279504 174.93215498 149.60708797 181.14162254 149.60811615 C186.99312063 149.60886408 192.84426919 149.59085916 198.6956768 149.55883217 C200.83651382 149.55035419 202.97739014 149.54856885 205.11823654 149.55419731 C222.74444613 149.59434464 239.61161779 147.66196045 253.1171875 135.00390625 C262.34494006 125.18266753 265.50172556 115.4089107 265.35180664 102.05981445 C264.92723055 89.68834284 261.74030696 80.67116755 253.6875 71.3125 C250.6772643 68.72229719 247.52310895 66.57114439 244.18359375 64.4296875 C242 63 242 63 240.25020027 61.51442432 C231.20941929 55.42981985 217.48476922 56.55589692 206.98876953 56.56762695 C205.33154582 56.55858739 203.67432874 56.54825488 202.01712036 56.53674316 C197.56352779 56.50940441 193.11006287 56.49992046 188.65639734 56.49388909 C183.98522641 56.48444457 179.3141486 56.45823675 174.64303589 56.43388367 C165.81786175 56.39038102 156.99270585 56.3617347 148.16745746 56.33856028 C138.11164728 56.31142109 128.05593154 56.2675153 118.00018907 56.22227156 C97.33349706 56.12965802 76.66681395 56.06008374 56 56 C56 72.5 56 89 56 106 C37.52 106 19.04 106 0 106 C0 71.02 0 36.04 0 0 Z " fill="currentColor" transform="translate(45,17)"/>

                    </svg>
                    <!-- <svg xmlns="http://www.w3.org/2000/svg"
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
                    </svg> -->
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
            <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl">
                <div
                  class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                  <div class="text-body">
                    ©
                    <script>
                      document.write(new Date().getFullYear());
                    </script>
                    , made with ❤️ by <a href="https://beresmocha.my.id" target="_blank" class="footer-link">The Brotherhood</a>
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
    <script src="/js/export/csv.js" type="text/javascript"></script>
    <script src="/js/export/excel.js" type="text/javascript"></script>
    <script src="/js/export/pdf.js" type="text/javascript"></script>

    <!-- Page JS -->
  </body>
</html>
