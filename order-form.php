<?php
require 'config/config.php';
session_start();
?>
<script>
  window.token = "<?php echo isset($_SESSION['token']) ? $_SESSION['token'] : ''; ?>";
</script>
<!DOCTYPE html>
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

    <title>Order Form Mocha</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/logo.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
      rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/fonts/iconify-icons.css" />

    <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="assets/vendor/css/core.css" />
    <link rel="stylesheet" href="assets/css/demo.css" />

    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/sweetalert2/sweetalert2.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.0/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/spinkit/spinkit.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/notiflix/notiflix.css" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.14.1/jquery-ui.min.js" crossorigin="anonymous"></script>

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>

    <script src="assets/vendor/js/template-customizer.js"></script>

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

    <style>
      .pilihan:hover {
        background: var(--bs-primary);
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <div class="layout-page">
          <div class="content-wrapper">
            <div class="container-xxl flex-grow-1 container-p-y d-flex justify-content-center align-items-center min-vh-100">

              <div class="card w-100 w-md-50 mx-auto d-none p-4" id="cardProfile">
                <div class="card-body">
                  <div class="app-brand justify-content-center mb-6 boxLogo">
                    <span class="app-brand-logo demo logoForm">
                      <span class="text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="415" height="415" viewBox="-70 0 415 415">
                    <path d="M0 0 C57.4139113 -0.16121214 57.4139113 -0.16121214 81.54101562 -0.1953125 C87.05314176 -0.20314258 92.56526744 -0.21122411 98.07739258 -0.21972656 C98.76813427 -0.22078156 99.45887596 -0.22183655 100.17054921 -0.22292352 C111.28472774 -0.24026436 122.39882249 -0.27176807 133.51295153 -0.30861118 C144.94086004 -0.34617515 156.36870095 -0.36796938 167.796673 -0.37635398 C174.20642365 -0.3815467 180.6159851 -0.39366201 187.02567482 -0.42292023 C193.07245929 -0.45029535 199.11897861 -0.45840073 205.16581917 -0.45243073 C207.37189429 -0.45352115 209.57797932 -0.46134205 211.7840004 -0.4768219 C225.39706147 -0.56757044 237.8050187 0.59348187 251 4 C252.02626904 4.26307827 253.05253809 4.52615654 254.1099062 4.79720688 C256.23610393 5.36163604 258.33610158 5.97512704 260.4375 6.625 C261.12908203 6.82867188 261.82066406 7.03234375 262.53320312 7.2421875 C265.84934752 8.23990886 268.97003141 9.3106569 272 11 C272 11.66 272 12.32 272 13 C273.32 13 274.64 13 276 13 C276 13.66 276 14.32 276 15 C276.88429688 15.25910156 277.76859375 15.51820312 278.6796875 15.78515625 C296.88316551 22.44548762 311.28952155 41.61802289 319.375 58.5 C329.41701176 80.33625461 330.46955425 103.76717376 325 127 C324.70996094 128.24716797 324.70996094 128.24716797 324.4140625 129.51953125 C319.71459803 145.9676569 307.12894197 164.87358837 292.30078125 173.5859375 C289.88378451 174.79255943 289.88378451 174.79255943 289 177 C289.5465625 177.10570312 290.093125 177.21140625 290.65625 177.3203125 C307.77765398 182.28551965 320.23821135 198.59329155 328.75 213.1875 C332.57662227 220.48254475 334.35204825 227.99060011 336 236 C336.1750708 236.77303467 336.3501416 237.54606934 336.53051758 238.3425293 C339.61109471 255.7799095 337.95545042 275.17262095 330 291 C329.68804687 291.96808594 329.37609375 292.93617188 329.0546875 293.93359375 C321.71733564 315.26626489 302.40509463 331.10553417 283 341 C275.6998717 344.36647521 268.11347763 346.64171945 260.375 348.75 C259.6116333 348.96100342 258.8482666 349.17200684 258.06176758 349.3894043 C246.09870732 352.49982549 233.85237031 352.13997555 221.58520508 352.11352539 C219.74124147 352.11324288 217.89727775 352.11340249 216.05331421 352.1139679 C211.0768416 352.11425339 206.10039337 352.10839677 201.1239264 352.10139394 C195.91226467 352.0951191 190.7006023 352.09455334 185.48893738 352.09336853 C175.63303465 352.09026736 165.7771431 352.08207039 155.92124528 352.07201904 C144.69508679 352.06082013 133.46892776 352.05533795 122.24276507 352.05032361 C99.16183577 352.03988671 76.08092177 352.02155639 53 352 C53 364.21 53 376.42 53 389 C34.52 389 16.04 389 -3 389 C-3.020625 382.565 -3.04125 376.13 -3.0625 369.5 C-3.071604 367.58767578 -3.08070801 365.67535156 -3.09008789 363.70507812 C-3.12799249 348.828825 -2.81567208 333.96372471 -2.49389648 319.09179688 C-2.44606827 316.84552207 -2.3983355 314.59924522 -2.35070038 312.35296631 C-2.23489995 306.90195361 -2.11792389 301.45096715 -2 296 C-0.2581639 295.99503478 -0.2581639 295.99503478 1.51886082 295.98996925 C29.13647329 295.91080691 56.7540382 295.82153271 84.37157768 295.71994839 C87.77709644 295.70743079 91.18261551 295.69499782 94.58813477 295.68261719 C95.60502303 295.6789182 95.60502303 295.6789182 96.6424545 295.67514448 C107.59307011 295.63551239 118.54369592 295.60272299 129.49434108 295.57250018 C140.74597682 295.54129293 151.99756947 295.50249995 163.2491588 295.45720994 C169.56256329 295.43203427 175.87593775 295.41022686 182.18937874 295.39665604 C188.14092465 295.38375433 194.09236709 295.36161363 200.04385567 295.33261681 C202.21933366 295.32360408 204.39482828 295.31786568 206.57032394 295.31578636 C218.24227915 295.30264125 229.47104348 294.88493144 241 293 C242.5624946 292.81245497 244.12499319 292.62494325 245.6875 292.4375 C255.11534275 290.16981813 263.00644916 281.96843219 268 274 C268.556875 273.21625 269.11375 272.4325 269.6875 271.625 C275.25850691 260.48298618 275.70544405 247.96291512 272.375 236.0625 C268.27376945 224.48759844 260.74271768 215.97928007 250 210 C248.43493068 209.27188 246.85070002 208.58353416 245.25 207.9375 C244.47140625 207.61652344 243.6928125 207.29554688 242.890625 206.96484375 C233.22724781 203.73936515 223.97303842 203.69360636 213.91381836 203.68115234 C212.18837011 203.67184295 210.46292633 203.66167278 208.73748779 203.65071106 C204.07495574 203.62351101 199.41245373 203.6082914 194.74986339 203.59528303 C189.86914183 203.57960859 184.98848123 203.55283219 180.10780334 203.5272522 C170.87518341 203.48054061 161.6425519 203.44375969 152.4098745 203.41057932 C141.89471321 203.372304 131.37961325 203.32290805 120.86450374 203.27259517 C99.24304223 203.16938866 77.62155475 203.0815595 56 203 C56 216.53 56 230.06 56 244 C37.52 244 19.04 244 0 244 C0 212.98 0 181.96 0 150 C6.71754639 149.9906543 13.43509277 149.98130859 20.35620117 149.97167969 C42.55231052 149.93791082 64.74832731 149.88256281 86.94436169 149.81609726 C89.62591212 149.8081461 92.30746279 149.80027974 94.98901367 149.79248047 C95.65550135 149.7905391 96.32198902 149.78859772 97.00867329 149.78659752 C107.7795856 149.75563396 118.55047664 149.73861268 129.32142504 149.72680578 C140.38550064 149.71436487 151.4494615 149.68650274 162.51346761 149.64538693 C168.72289042 149.62279504 174.93215498 149.60708797 181.14162254 149.60811615 C186.99312063 149.60886408 192.84426919 149.59085916 198.6956768 149.55883217 C200.83651382 149.55035419 202.97739014 149.54856885 205.11823654 149.55419731 C222.74444613 149.59434464 239.61161779 147.66196045 253.1171875 135.00390625 C262.34494006 125.18266753 265.50172556 115.4089107 265.35180664 102.05981445 C264.92723055 89.68834284 261.74030696 80.67116755 253.6875 71.3125 C250.6772643 68.72229719 247.52310895 66.57114439 244.18359375 64.4296875 C242 63 242 63 240.25020027 61.51442432 C231.20941929 55.42981985 217.48476922 56.55589692 206.98876953 56.56762695 C205.33154582 56.55858739 203.67432874 56.54825488 202.01712036 56.53674316 C197.56352779 56.50940441 193.11006287 56.49992046 188.65639734 56.49388909 C183.98522641 56.48444457 179.3141486 56.45823675 174.64303589 56.43388367 C165.81786175 56.39038102 156.99270585 56.3617347 148.16745746 56.33856028 C138.11164728 56.31142109 128.05593154 56.2675153 118.00018907 56.22227156 C97.33349706 56.12965802 76.66681395 56.06008374 56 56 C56 72.5 56 89 56 106 C37.52 106 19.04 106 0 106 C0 71.02 0 36.04 0 0 Z " fill="currentColor" transform="translate(45,17)"/>

                    </svg>
                      </span>
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
                  </div>
                  <div class="row">
                    <div class="col-md">
                      <p class="h4 mt-4">Fill out your profile data</p>
                    </div>
                    <div class="col-md d-flex justify-content-end align-items-end">
                      <div class="form-check form-check-inline">
                        <label class="switch">
                          <input type="radio" name="jk" id="male" class="switch-input" checked>
                          <span class="switch-toggle-slider">
                            <span class="switch-on"></span>
                            <span class="switch-off"></span>
                          </span>
                          <span class="switch-label">Male</span>
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <label class="switch">
                          <input type="radio" name="jk" id="female" class="switch-input">
                          <span class="switch-toggle-slider">
                            <span class="switch-on"></span>
                            <span class="switch-off"></span>
                          </span>
                          <span class="switch-label">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4">
                      <label for="fullname" class="form-label">Full Name</label>
                      <input type="text" class="form-control" id="fullname" name="fullname" placeholder="Enter Your Full Name" autofocus />
                    </div>
                    <div class="col-md mb-4">
                      <label for="tipe" class="form-label">Contact Type</label>
                      <select id="tipe" class="form-select">
                        <option value="101" selected>Personal</option>
                        <option value="204">Company</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4">
                      <label for="id_type" class="form-label">ID Type</label>
                      <select  id="id_type" class="form-select">
                        <option value="PSP" selected>Passport</option>
                        <option value="KTP">KTP</option>
                        <option value="SIM">SIM (Driving License)</option>
                        <option value="OTH">Other</option>
                        <option value="SIU">Surat Izin Usaha</option>
                        <option value="SAP">Akta Pendirian</option>
                        <option value="ADR">Anggaran Dasar</option>
                      </select>
                    </div>
                    <div class="col-md mb-4">
                      <label class="form-label" for="idNumber">Passport/NIK Number</label>
                      <input type="text" id="idNumber" class="form-control" name="idNumber" placeholder="Enter Your ID Number" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4 form-control-validation">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" name="email" placeholder="Enter Your Email (Optional)" />
                    </div>
                    <div class="col-md mb-4">
                      <label class="form-label" for="waNumber">Whatsapp Number</label>
                       <input type="text" id="waNumber" class="form-control" name="waNumber" placeholder="Enter Your Whatsapp Number (Optional)" pattern="[0-9]*" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4 form-control-validation">
                      <label for="nationality" class="form-label">Nationality</label>
                      <select name="" id="nationality" class="form-select"></select>
                    </div>
                    <div class="col-md mb-4">
                      <label for="address" class="form-label">Local Address</label>
                        <input type="text" class="form-control" id="address" name="address" placeholder="Enter Your Local Address" required />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4">
                      <label for="occupation" class="form-label">Occupation</label>
                      <select class="form-select" id="occupation"></select>
                    </div>
                    <div class="col-md mb-4">
                      <label for="paspor" class="form-label">Passport Photo</label>
                      <input type="file" class="form-control" id="paspor" accept="image/*">
                    </div>
                  </div>
                  <div class="row justify-content-center mt-3">
                    <div class="col-md-4 d-grid">
                      <button class="btn btn-primary px-6" id="sbmProfil">Submit</button>
                    </div>
                  </div>
                  <div class="row justify-content-center mt-2">
                    <div class="col-md-4 text-center">
                      <p class="h6">Or <u class="btnCari cursor-pointer">Search Existing Data</u> Instead</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- order details -->
              <div class="card w-100 w-md-50 mx-auto d-none" id="cardOrder">
                <div class="card-body">
                  <div class="text-center mb-3">
                    <p class="h3">Order Details</p>
                  </div>
                  <div class="row">
                    <div class="col-md px-5">
                      <p class="h6">Make an order for : <span id="namaProfil">John Doe</span></p>
                      <input type="hidden" id="idBranch">
                      <input type="hidden" id="indexExisting">
                      <input type="hidden" id="requestUser">
                    </div>
                    <div class="col-md d-flex justify-content-end g-2">
                      <div class="form-check form-check-inline">
                        <label class="switch">
                          <input type="radio" name="tipeTrans" id="buy" class="switch-input" checked>
                          <span class="switch-toggle-slider">
                            <span class="switch-on"></span>
                            <span class="switch-off"></span>
                          </span>
                          <span class="switch-label">Buy Rupiah</span>
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <label class="switch">
                          <input type="radio" name="tipeTrans" id="sell" class="switch-input">
                          <span class="switch-toggle-slider">
                            <span class="switch-on"></span>
                            <span class="switch-off"></span>
                          </span>
                          <span class="switch-label">Sell Rupiah</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="container-fluid mt-3">
                    <div class="row fw-bold border-bottom py-2 d-none d-md-flex">
                      <div class="col-12 col-md-3">Currency</div>
                      <div class="col-6 col-md-2 text-end">Amount</div>
                      <div class="col-6 col-md-3 text-end">Rate</div>
                      <div class="col-6 col-md-3 text-end">Subtotal</div>
                      <div class="col-6 col-md-1"></div>
                    </div>
                    <div id="tabelDetail"></div>
                    <div class="row border-top mt-2 pt-2 align-items-center">
                      <div class="col-12 col-md-9 text-start mb-2 mb-md-0 text-md-end fw-bold">Total :</div>
                      <div class="col-12 col-md-3">
                        <input type="text" class="form-control text-end total" readonly>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md d-grid">
                      <button class="btn btn-outline-primary border-none" data-bs-toggle="modal" data-bs-target="#modalRequest" type="button">
                        &nbsp;
                      </button>
                    </div>
                    <div class="col-md d-grid">
                      <button class="btn btn-outline-primary" type="button" id="tambahBaris">
                        Add New Row
                      </button>
                    </div>
                  </div>
                  <div class="my-4">
                    <button class="btn btn-primary d-grid w-100" type="button" id="btnSubmit">Submit the order</button>
                  </div>
                  <div class="row justify-content-center d-none" id="boxResetProfile">
                    <div class="col-md-4 d-grid">
                      <button class="btn btn-outline-primary" id="resetProfile">Reset Profile</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- modal pilih branch -->
    <div class="modal fade animate__animated animate__fadeInUp" id="modalBranch" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body d-flex flex-column gap-4">
            <div class="app-brand justify-content-center mb-6 boxLogo">
              <span class="app-brand-logo demo logoForm">
                <span class="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="415" height="415" viewBox="-70 0 415 415">
                    <path d="M0 0 C57.4139113 -0.16121214 57.4139113 -0.16121214 81.54101562 -0.1953125 C87.05314176 -0.20314258 92.56526744 -0.21122411 98.07739258 -0.21972656 C98.76813427 -0.22078156 99.45887596 -0.22183655 100.17054921 -0.22292352 C111.28472774 -0.24026436 122.39882249 -0.27176807 133.51295153 -0.30861118 C144.94086004 -0.34617515 156.36870095 -0.36796938 167.796673 -0.37635398 C174.20642365 -0.3815467 180.6159851 -0.39366201 187.02567482 -0.42292023 C193.07245929 -0.45029535 199.11897861 -0.45840073 205.16581917 -0.45243073 C207.37189429 -0.45352115 209.57797932 -0.46134205 211.7840004 -0.4768219 C225.39706147 -0.56757044 237.8050187 0.59348187 251 4 C252.02626904 4.26307827 253.05253809 4.52615654 254.1099062 4.79720688 C256.23610393 5.36163604 258.33610158 5.97512704 260.4375 6.625 C261.12908203 6.82867188 261.82066406 7.03234375 262.53320312 7.2421875 C265.84934752 8.23990886 268.97003141 9.3106569 272 11 C272 11.66 272 12.32 272 13 C273.32 13 274.64 13 276 13 C276 13.66 276 14.32 276 15 C276.88429688 15.25910156 277.76859375 15.51820312 278.6796875 15.78515625 C296.88316551 22.44548762 311.28952155 41.61802289 319.375 58.5 C329.41701176 80.33625461 330.46955425 103.76717376 325 127 C324.70996094 128.24716797 324.70996094 128.24716797 324.4140625 129.51953125 C319.71459803 145.9676569 307.12894197 164.87358837 292.30078125 173.5859375 C289.88378451 174.79255943 289.88378451 174.79255943 289 177 C289.5465625 177.10570312 290.093125 177.21140625 290.65625 177.3203125 C307.77765398 182.28551965 320.23821135 198.59329155 328.75 213.1875 C332.57662227 220.48254475 334.35204825 227.99060011 336 236 C336.1750708 236.77303467 336.3501416 237.54606934 336.53051758 238.3425293 C339.61109471 255.7799095 337.95545042 275.17262095 330 291 C329.68804687 291.96808594 329.37609375 292.93617188 329.0546875 293.93359375 C321.71733564 315.26626489 302.40509463 331.10553417 283 341 C275.6998717 344.36647521 268.11347763 346.64171945 260.375 348.75 C259.6116333 348.96100342 258.8482666 349.17200684 258.06176758 349.3894043 C246.09870732 352.49982549 233.85237031 352.13997555 221.58520508 352.11352539 C219.74124147 352.11324288 217.89727775 352.11340249 216.05331421 352.1139679 C211.0768416 352.11425339 206.10039337 352.10839677 201.1239264 352.10139394 C195.91226467 352.0951191 190.7006023 352.09455334 185.48893738 352.09336853 C175.63303465 352.09026736 165.7771431 352.08207039 155.92124528 352.07201904 C144.69508679 352.06082013 133.46892776 352.05533795 122.24276507 352.05032361 C99.16183577 352.03988671 76.08092177 352.02155639 53 352 C53 364.21 53 376.42 53 389 C34.52 389 16.04 389 -3 389 C-3.020625 382.565 -3.04125 376.13 -3.0625 369.5 C-3.071604 367.58767578 -3.08070801 365.67535156 -3.09008789 363.70507812 C-3.12799249 348.828825 -2.81567208 333.96372471 -2.49389648 319.09179688 C-2.44606827 316.84552207 -2.3983355 314.59924522 -2.35070038 312.35296631 C-2.23489995 306.90195361 -2.11792389 301.45096715 -2 296 C-0.2581639 295.99503478 -0.2581639 295.99503478 1.51886082 295.98996925 C29.13647329 295.91080691 56.7540382 295.82153271 84.37157768 295.71994839 C87.77709644 295.70743079 91.18261551 295.69499782 94.58813477 295.68261719 C95.60502303 295.6789182 95.60502303 295.6789182 96.6424545 295.67514448 C107.59307011 295.63551239 118.54369592 295.60272299 129.49434108 295.57250018 C140.74597682 295.54129293 151.99756947 295.50249995 163.2491588 295.45720994 C169.56256329 295.43203427 175.87593775 295.41022686 182.18937874 295.39665604 C188.14092465 295.38375433 194.09236709 295.36161363 200.04385567 295.33261681 C202.21933366 295.32360408 204.39482828 295.31786568 206.57032394 295.31578636 C218.24227915 295.30264125 229.47104348 294.88493144 241 293 C242.5624946 292.81245497 244.12499319 292.62494325 245.6875 292.4375 C255.11534275 290.16981813 263.00644916 281.96843219 268 274 C268.556875 273.21625 269.11375 272.4325 269.6875 271.625 C275.25850691 260.48298618 275.70544405 247.96291512 272.375 236.0625 C268.27376945 224.48759844 260.74271768 215.97928007 250 210 C248.43493068 209.27188 246.85070002 208.58353416 245.25 207.9375 C244.47140625 207.61652344 243.6928125 207.29554688 242.890625 206.96484375 C233.22724781 203.73936515 223.97303842 203.69360636 213.91381836 203.68115234 C212.18837011 203.67184295 210.46292633 203.66167278 208.73748779 203.65071106 C204.07495574 203.62351101 199.41245373 203.6082914 194.74986339 203.59528303 C189.86914183 203.57960859 184.98848123 203.55283219 180.10780334 203.5272522 C170.87518341 203.48054061 161.6425519 203.44375969 152.4098745 203.41057932 C141.89471321 203.372304 131.37961325 203.32290805 120.86450374 203.27259517 C99.24304223 203.16938866 77.62155475 203.0815595 56 203 C56 216.53 56 230.06 56 244 C37.52 244 19.04 244 0 244 C0 212.98 0 181.96 0 150 C6.71754639 149.9906543 13.43509277 149.98130859 20.35620117 149.97167969 C42.55231052 149.93791082 64.74832731 149.88256281 86.94436169 149.81609726 C89.62591212 149.8081461 92.30746279 149.80027974 94.98901367 149.79248047 C95.65550135 149.7905391 96.32198902 149.78859772 97.00867329 149.78659752 C107.7795856 149.75563396 118.55047664 149.73861268 129.32142504 149.72680578 C140.38550064 149.71436487 151.4494615 149.68650274 162.51346761 149.64538693 C168.72289042 149.62279504 174.93215498 149.60708797 181.14162254 149.60811615 C186.99312063 149.60886408 192.84426919 149.59085916 198.6956768 149.55883217 C200.83651382 149.55035419 202.97739014 149.54856885 205.11823654 149.55419731 C222.74444613 149.59434464 239.61161779 147.66196045 253.1171875 135.00390625 C262.34494006 125.18266753 265.50172556 115.4089107 265.35180664 102.05981445 C264.92723055 89.68834284 261.74030696 80.67116755 253.6875 71.3125 C250.6772643 68.72229719 247.52310895 66.57114439 244.18359375 64.4296875 C242 63 242 63 240.25020027 61.51442432 C231.20941929 55.42981985 217.48476922 56.55589692 206.98876953 56.56762695 C205.33154582 56.55858739 203.67432874 56.54825488 202.01712036 56.53674316 C197.56352779 56.50940441 193.11006287 56.49992046 188.65639734 56.49388909 C183.98522641 56.48444457 179.3141486 56.45823675 174.64303589 56.43388367 C165.81786175 56.39038102 156.99270585 56.3617347 148.16745746 56.33856028 C138.11164728 56.31142109 128.05593154 56.2675153 118.00018907 56.22227156 C97.33349706 56.12965802 76.66681395 56.06008374 56 56 C56 72.5 56 89 56 106 C37.52 106 19.04 106 0 106 C0 71.02 0 36.04 0 0 Z " fill="currentColor" transform="translate(45,17)"/>

                    </svg>
                </span>
              </span>
              <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
            </div>
            <h5 class="modal-title text-center mt-4">Select Which Branch You Are In</h5>
            <select id="selectBranch" class="form-select"></select>
            <button type="button" id="sbmBranch" class="btn btn-primary text-center">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalPilihan" tabindex="-1" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center mb-6">
              <h4 class="mb-0">Seems like this is your first visit</h4>
              <h4 class="mb-2">How Would You Like to proceed?</h4>
              <p>Please choose one of the following options</p>
            </div>
            <div class="row">
              <div class="col-12 mb-6">
                <div class="rounded border py-4 px-6 border-primary pilihan cursor-pointer btnDaftar">
                 <p class="h5 mb-0 text-body">I'm a new customer</p>
                 <small>Register your profile to make an order</small>
                </div>
              </div>
              <div class="col-12">
                <div class="rounded border py-4 px-6 border-primary pilihan cursor-pointer btnCari">
                 <p class="h5 mb-0 text-body">I've been here before</p>
                 <small>Search your profile by entering your passport ID or other ID</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade animate__animated animate__fadeInUp" id="modalKonfirmasi" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body">
            <div class="mb-3 text-center">
              <p class="h4">Confirm Your Profile</p>
            </div>
            <ul class="list-unstyled mb-6">
               <li class="mb-2">
                <span class="h6 me-1">Name :</span>
                <span class="dataDetail" id="namaDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">ID Number :</span>
                <span class="dataDetail" id="idDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Email :</span>
                <span class="dataDetail" id="emailDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Phone :</span>
                <span class="dataDetail" id="teleponDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Address :</span>
                <span class="dataDetail" id="alamatDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Nationality :</span>
                <span class="dataDetail" id="negaraDetail"></span>
              </li>
            </ul>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <p class="h6 nowrap">Is this your profile?</p>
            <div class="d-flex gap-2">
              <button id="btnTidak" class="btn btn-danger">No, it's not me</button>
              <button type="button" id="btnYa" class="btn btn-primary">Yes, it's me</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade animate__animated animate__fadeInUp" id="modalPelanggan" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body text-center">
            <div class="searchBox">
              <p class="h6">Insert Your Full Name, ID Number, Customer Code, Email or Phone Number</p>
              <input type="text" class="form-control mb-3" id="inputCari">
              <button class="btn btn-primary mb-5" id="goSearch">Find My Data</button>
              <p class="h6">Or <span class="text-primary cursor-pointer btnDaftar"><u>Register your profile</u></span> instead</p>
            </div>
            <div class="d-none findBox">
              <table class="table table-sm table-bordered">
                <tbody>
                  <tr>
                    <td class="border">Customer Code</td>
                    <td class="border" id="findKode">7118565151</td>
                  </tr>
                  <tr>
                    <td class="border">Full Name</td>
                    <td class="border" id="findNama">John Doe</td>
                  </tr>
                  <tr>
                    <td class="border">ID Number</td>
                    <td class="border" id="findID">123456789</td>
                  </tr>
                  <tr>
                    <td class="border">Email</td>
                    <td class="border" id="findEmail">john.doe@gmail.com</td>
                  </tr>
                  <tr>
                    <td class="border">Phone</td>
                    <td class="border" id="findTelepon">08123456789</td>
                  </tr>
                  <tr>
                    <td class="border">Address</td>
                    <td class="border" id="findAlamat">Denpasar, Bali</td>
                  </tr>
                  <tr>
                    <td class="border">Nationality</td>
                    <td class="border" id="findNegara">Indonesia</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 d-none findBox">
              <div class="row">
                <div class="col-md">
                  <p class="h6"><i>Is This Your Profile?</i></p>
                </div>
              </div>
              <div class="row">
                <div class="col-md d-flex justify-content-center gap-4">
                  <button class="btn btn-outline-danger" id="btnFindTidak">It's not me</button>
                  <button class="btn btn-primary" id="btnFindYa">Yes, It's me</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade animate__animated animate__fadeInUp" id="modalRequest" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body">
            <h4 class="modal-title text-center mb-6" id="backDropModalTitle">Request Rate</h4>
            <form id="formRequest">
            <div class="mb-6 form-control-validation">
              <label for="emailReq" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="emailReq"
                autofocus />
            </div>
            <div class="mb-6 form-password-toggle form-control-validation">
              <label class="form-label" for="passwordReq">Password</label>
              <!-- <div class="input-group input-group-merge"> -->
                <input
                  type="password"
                  id="passwordReq"
                  class="form-control"
                  aria-describedby="password" />
                <!-- <span class="input-group-text cursor-pointer"><i class="icon-base ti tabler-eye-off"></i></span> -->
              <!-- </div> -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" id="sbmRequest" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalSign" tabindex="-1" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center mb-6">
              <h4 class="mb-4">Transaction exceeded threshold limit</h4>
              <p class="h5">Please fill in and sign the following form for transactions that exceed the monthly limit</p>
            </div>
            <div class="mb-3">
              <label for="npwp" class="form-label">NPWP</label>
              <input type="text" id="npwp" class="form-control">
            </div>
            <div class="mb-3">
              <label for="domisili" class="form-label">Domicile</label>
              <input type="text" id="domisili" class="form-control">
            </div>
            <div class="mb-3">
              <label for="penghasilan" class="form-label">Penghasilan</label>
              <select id="penghasilan" class="form-select"></select>
            </div>
            <div class="mb-3">
              <label for="bentuk_pt" class="form-label">Bentuk PT</label>
              <select id="bentuk_pt" class="form-select"></select>
            </div>
            <div class="mb-3">
              <label for="bidang_usaha" class="form-label">Bidang Usaha</label>
              <input type="text" class="form-control" id="bidang_usaha">
            </div>
            <div class="mb-3">
              <label for="perusahaan" class="form-label">Company Name</label>
              <input type="text" class="form-control" id="perusahaan">
            </div>
            <div class="mb-3">
              <label for="pekerjaan" class="form-label">Pekerjaan</label>
              <select id="pekerjaan" class="form-select"></select>
            </div>
            <div class="mb-3">
              <label for="jabatan" class="form-label">Position</label>
              <input type="text" id="jabatan" class="form-control">
            </div>
            <div class="mb-3">
              <label for="tujuan" class="form-label">Transaction Purpose</label>
              <select id="tujuan" class="form-select"></select>
            </div>
            <div class="mb-3">
              <label for="hubungan" class="form-label">Relation (if represented)</label>
              <input type="text" id="hubungan" class="form-control">
            </div>
            <div class="mb-3">
              <label for="sumber" class="form-label">Source of Funds</label>
              <select id="sumber" class="form-select"></select>
            </div>
            <div class="mb-3">
              <label for="signature-pad" class="form-label">Signature</label>
            </div>
            <canvas id="signature-pad" class="w-100 border rounded" height="300"></canvas>
            <div class="row mt-3">
                <div class="col-md d-flex justify-content-center gap-3">
                  <button class="btn btn-outline-danger" id="btnSignClear">Clear</button>
                  <button class="btn btn-primary" id="btnSignSubmit">Submit</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <script src="assets/vendor/libs/popper/popper.js"></script>
    <script src="assets/vendor/js/bootstrap.js"></script>
    <script src="assets/vendor/libs/node-waves/node-waves.js"></script>

    <!-- <script src="assets/vendor/libs/@algolia/autocomplete-js.js"></script> -->

    <script src="assets/vendor/libs/pickr/pickr.js"></script>

    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>

    <script src="assets/vendor/libs/hammer/hammer.js"></script>
    <script src="/assets/vendor/libs/select2/select2.js"></script>
    <script src="/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
    <script src="/assets/vendor/libs/notiflix/notiflix.js"></script>
    <!-- <script src="/assets/vendor/libs/typeahead-js/typeahead.js"></script> -->

    <script src="assets/vendor/js/menu.js"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->

    <!-- Main JS -->

    <script src="assets/js/main.js"></script>
    <script src="js/pages/order-form.js"></script>
  </body>
</html>