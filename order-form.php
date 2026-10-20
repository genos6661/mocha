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
    <link rel="stylesheet" href="assets/css/demo.css?v=<?= filemtime(__DIR__ . '/assets/css/demo.css') ?>" />

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

    <!-- Google Tag Manager + Consent Mode v2 (aktif hanya di host yang terdaftar di js/gtm.js) -->
    <script src="js/gtm.js?v=<?= filemtime(__DIR__ . '/js/gtm.js') ?>"></script>
  </head>
  <body>
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <div class="layout-page">
          <div class="content-wrapper">
            <div class="container-xxl flex-grow-1 container-p-y d-flex justify-content-center align-items-center min-vh-100">

              <div class="card order-form-card mx-auto d-none" id="cardProfile">
                <div class="order-form-hero text-center">
                  <div class="app-brand justify-content-center mb-3 boxLogo">
                    <span class="app-brand-logo demo logoForm">
                      <span class="text-primary">
                        <?php include __DIR__ . '/partials/logo.php'; ?>
                      </span>
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
                  </div>
                  <span class="badge bg-label-primary rounded-pill px-3 py-2 mb-3">
                    <i class="icon-base ti tabler-map-pin icon-14px me-1"></i><span class="namaCabang">BERES Mocha</span>
                  </span>
                  <h4 class="fw-bold mb-1">Fill out your profile data</h4>
                  <p class="text-body-secondary mb-0">Tell us a little about yourself so we can prepare your currency exchange order.</p>
                </div>

                <div class="card-body order-form-body">

                  <!-- Personal -->
                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-user"></i>Personal information</div>
                    <div class="row">
                      <div class="col-12 mb-4">
                        <label class="form-label d-block">Gender</label>
                        <div class="btn-group order-form-gender" role="group" aria-label="Gender">
                          <input type="radio" class="btn-check" name="jk" id="male" checked>
                          <label class="btn btn-outline-primary" for="male"><i class="icon-base ti tabler-gender-male me-1"></i>Male</label>
                          <input type="radio" class="btn-check" name="jk" id="female">
                          <label class="btn btn-outline-primary" for="female"><i class="icon-base ti tabler-gender-female me-1"></i>Female</label>
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="fullname" class="form-label">Full Name<sup class="text-danger"> *required</sup></label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-user"></i></span>
                          <input type="text" class="form-control" id="fullname" name="fullname" placeholder="Enter Your Full Name" autofocus />
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="tipe" class="form-label">Contact Type<sup class="text-danger"> *required</sup></label>
                        <select id="tipe" class="form-select">
                          <option value="101" selected>Personal</option>
                          <option value="201">Money Changer (Company)</option>
                          <option value="202">Bank (Company)</option>
                          <option value="203">Payment Service Provider (PJP)</option>
                          <option value="204">Company (Others)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Identity -->
                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-id"></i>Identity</div>
                    <div class="row">
                      <div class="col-md-6 mb-4">
                        <label for="id_type" class="form-label">ID Type<sup class="text-danger"> *required</sup></label>
                        <select id="id_type" class="form-select">
                          <option value="PSP" selected>Passport</option>
                          <option value="KTP">KTP</option>
                          <option value="SIM">SIM (Driving License)</option>
                          <option value="OTH">Other</option>
                          <option value="SIU">Surat Izin Usaha</option>
                          <option value="SAP">Akta Pendirian</option>
                          <option value="ADR">Anggaran Dasar</option>
                        </select>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label class="form-label" for="idNumber">Passport/NIK Number<sup class="text-danger"> *mandatory</sup></label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-hash"></i></span>
                          <input type="text" id="idNumber" class="form-control" name="idNumber" placeholder="Enter Your ID Number" />
                        </div>
                      </div>
                      <div class="col-md-6 mb-4 form-control-validation">
                        <label for="tempat_lahir" class="form-label">Place of birth</label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-map-pin"></i></span>
                          <input type="text" class="form-control" id="tempat_lahir" name="tempat_lahir" placeholder="Enter Your Place of Birth" />
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label class="form-label" for="tanggal_lahir">Date of birth</label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-calendar"></i></span>
                          <input type="date" id="tanggal_lahir" class="form-control" name="tanggal_lahir" placeholder="Enter Your Birth of Date" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Contact -->
                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-address-book"></i>Contact</div>
                    <div class="row">
                      <div class="col-md-6 mb-4 form-control-validation">
                        <label for="email" class="form-label">Email</label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-mail"></i></span>
                          <input type="email" class="form-control" id="email" name="email" placeholder="Enter Your Email (Optional)" />
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label class="form-label" for="waNumber">Whatsapp Number</label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-brand-whatsapp"></i></span>
                          <input type="text" id="waNumber" class="form-control" name="waNumber" placeholder="Enter Your Whatsapp Number (Optional)" pattern="[0-9]*" />
                        </div>
                      </div>
                      <div class="col-md-6 mb-4 form-control-validation">
                        <label for="nationality" class="form-label">Nationality<sup class="text-danger"> *required</sup></label>
                        <select name="" id="nationality" class="form-select"></select>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="address" class="form-label">Local Address<sup class="text-danger"> *required</sup></label>
                        <div class="input-group input-group-merge">
                          <span class="input-group-text"><i class="icon-base ti tabler-home"></i></span>
                          <input type="text" class="form-control" id="address" name="address" placeholder="Enter Your Local Address" required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Occupation & document -->
                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-briefcase"></i>Occupation &amp; document</div>
                    <div class="row">
                      <div class="col-md-6 mb-4">
                        <label for="occupation" class="form-label">Occupation<sup class="text-danger"> *required</sup></label>
                        <select class="form-select" id="occupation"></select>
                      </div>
                      <div class="col-md-6 mb-4">
                        <label for="paspor" class="form-label">Passport Photo</label>
                        <input type="file" class="form-control" id="paspor">
                      </div>
                    </div>
                  </div>

                  <div class="d-grid mt-2">
                    <button class="btn btn-primary btn-lg" id="sbmProfil">Submit<i class="icon-base ti tabler-arrow-right ms-2"></i></button>
                  </div>
                  <div class="text-center mt-4">
                    <span class="text-body-secondary">Already registered?</span>
                    <a href="javascript:void(0);" class="btnCari fw-medium ms-1">Search existing data</a>
                  </div>
                </div>
              </div>

              <!-- order details -->
              <div class="card order-form-card order-form-card-wide mx-auto d-none" id="cardOrder">
                <div class="order-form-hero text-center">
                  <div class="app-brand justify-content-center mb-3 boxLogo">
                    <span class="app-brand-logo demo logoForm">
                      <span class="text-primary">
                        <?php include __DIR__ . '/partials/logo.php'; ?>
                      </span>
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
                  </div>
                  <span class="badge bg-label-primary rounded-pill px-3 py-2 mb-3">
                    <i class="icon-base ti tabler-map-pin icon-14px me-1"></i><span class="namaCabang">BERES Mocha</span>
                  </span>
                  <h4 class="fw-bold mb-1">Order details</h4>
                  <p class="text-body-secondary mb-0">Choose the currencies and amounts you would like to exchange.</p>
                </div>

                <div class="card-body order-form-body">
                  <input type="hidden" id="idBranch">
                  <input type="hidden" id="indexExisting">
                  <input type="hidden" id="requestUser">

                  <div class="order-customer">
                    <span class="order-customer-avatar"><i class="icon-base ti tabler-user"></i></span>
                    <div>
                      <div class="small text-body-secondary">Make an order for</div>
                      <div class="fw-semibold" id="namaProfil">John Doe</div>
                    </div>
                  </div>

                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-arrows-exchange"></i>Transaction type</div>
                    <div class="btn-group order-form-gender mb-2" role="group" aria-label="Transaction type">
                      <input type="radio" class="btn-check" name="tipeTrans" id="buy" checked>
                      <label class="btn btn-outline-primary" for="buy"><i class="icon-base ti tabler-arrow-down-left me-1"></i>Buy Rupiah</label>
                      <input type="radio" class="btn-check" name="tipeTrans" id="sell">
                      <label class="btn btn-outline-primary" for="sell"><i class="icon-base ti tabler-arrow-up-right me-1"></i>Sell Rupiah</label>
                    </div>
                  </div>

                  <div class="order-form-section">
                    <div class="order-form-section-title"><i class="icon-base ti tabler-coin"></i>Items</div>
                    <div class="order-items-head row g-2 d-none d-md-flex">
                      <div class="col-md-4">Currency</div>
                      <div class="col-md-2 text-end">Amount</div>
                      <div class="col-md-2 text-end">Rate</div>
                      <div class="col-md-3 text-end">Subtotal</div>
                      <div class="col-md-1"></div>
                    </div>
                    <div id="tabelDetail"></div>

                    <div class="d-flex justify-content-between align-items-center mt-3 gap-2">
                      <button class="btn btn-outline-primary border-none order-secret" data-bs-toggle="modal" data-bs-target="#modalRequest" type="button"><i class="icon-base ti tabler-lock me-1"></i>Request Rate</button>
                      <button class="btn btn-outline-primary" type="button" id="tambahBaris">
                        <i class="icon-base ti tabler-plus me-1"></i>Add New Row
                      </button>
                    </div>
                  </div>

                  <div class="order-total">
                    <span class="order-total-label">Total</span>
                    <div class="input-group input-group-merge order-total-field">
                      <span class="input-group-text">Rp</span>
                      <input type="text" class="form-control text-end total" readonly>
                    </div>
                  </div>

                  <div class="d-grid mt-4">
                    <button class="btn btn-primary btn-lg" type="button" id="btnSubmit">Submit the order<i class="icon-base ti tabler-arrow-right ms-2"></i></button>
                  </div>
                  <div class="row justify-content-center d-none mt-3" id="boxResetProfile">
                    <div class="col-md-4 d-grid">
                      <button class="btn btn-outline-primary" id="resetProfile">Reset Profile</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <footer class="public-footer">
              &copy; <?= date('Y') ?> BERES Mocha &middot; by <a href="https://thebrotherhoodlaw.com" target="_blank" rel="noopener">The Brotherhood</a>
            </footer>
          </div>
        </div>
      </div>
    </div>

    <!-- modal pilih branch -->
    <div class="modal fade animate__animated animate__fadeInUp" id="modalBranch" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content order-modal">
          <div class="modal-body">
            <div class="order-modal-head">
              <div class="app-brand justify-content-center boxLogo mb-3">
                <span class="app-brand-logo demo logoForm">
                  <span class="text-primary">
                    <?php include __DIR__ . '/partials/logo.php'; ?>
                  </span>
                </span>
                <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
              </div>
              <h4 class="fw-bold mb-1">Select your branch</h4>
              <p class="text-body-secondary mb-0">Choose the branch you are visiting. Each branch's address is shown in the list.</p>
            </div>
            <label for="selectBranch" class="form-label">Branch</label>
            <select id="selectBranch" class="form-select"></select>
            <div id="branchSelected" class="order-branch-selected d-none">
              <i class="icon-base ti tabler-map-pin"></i>
              <div>
                <div class="fw-semibold" id="branchSelectedName"></div>
                <div class="small text-body-secondary" id="branchSelectedAddress"></div>
              </div>
            </div>
            <button type="button" id="sbmBranch" class="btn btn-primary btn-lg w-100 mt-4">Continue<i class="icon-base ti tabler-arrow-right ms-2"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- modal pelanggan baru / existing -->
    <div class="modal fade" id="modalPilihan" tabindex="-1" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content order-modal">
          <div class="modal-body">
            <div class="order-modal-head">
              <span class="order-modal-icon"><i class="icon-base ti tabler-hand-stop"></i></span>
              <h4 class="fw-bold mb-1">Seems like this is your first visit</h4>
              <p class="text-body-secondary mb-0">How would you like to proceed? Please choose one of the following options.</p>
            </div>
            <div class="order-choice btnDaftar" role="button" tabindex="0">
              <span class="order-choice-icon"><i class="icon-base ti tabler-user-plus"></i></span>
              <span class="order-choice-text">
                <span class="order-choice-title">I'm a new customer</span>
                <span class="order-choice-desc">Register your profile to make an order</span>
              </span>
              <i class="icon-base ti tabler-chevron-right order-choice-arrow"></i>
            </div>
            <div class="order-choice btnCari" role="button" tabindex="0">
              <span class="order-choice-icon"><i class="icon-base ti tabler-search"></i></span>
              <span class="order-choice-text">
                <span class="order-choice-title">I've been here before</span>
                <span class="order-choice-desc">Search your profile by entering your passport ID or other ID</span>
              </span>
              <i class="icon-base ti tabler-chevron-right order-choice-arrow"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- konfirmasi profil (pelanggan dari cookie) -->
    <div class="modal fade animate__animated animate__fadeInUp" id="modalKonfirmasi" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content order-modal">
          <div class="modal-body">
            <div class="order-modal-head">
              <span class="order-modal-icon"><i class="icon-base ti tabler-user-check"></i></span>
              <h4 class="fw-bold mb-1">Confirm your profile</h4>
              <p class="text-body-secondary mb-0">We found a profile saved on this device.</p>
            </div>
            <ul class="profile-summary list-unstyled">
              <li><i class="icon-base ti tabler-user"></i><span class="profile-label">Name</span><span class="dataDetail profile-value" id="namaDetail"></span></li>
              <li><i class="icon-base ti tabler-id"></i><span class="profile-label">ID Number</span><span class="dataDetail profile-value" id="idDetail"></span></li>
              <li><i class="icon-base ti tabler-mail"></i><span class="profile-label">Email</span><span class="dataDetail profile-value" id="emailDetail"></span></li>
              <li><i class="icon-base ti tabler-phone"></i><span class="profile-label">Phone</span><span class="dataDetail profile-value" id="teleponDetail"></span></li>
              <li><i class="icon-base ti tabler-home"></i><span class="profile-label">Address</span><span class="dataDetail profile-value" id="alamatDetail"></span></li>
              <li><i class="icon-base ti tabler-world"></i><span class="profile-label">Nationality</span><span class="dataDetail profile-value" id="negaraDetail"></span></li>
            </ul>
            <p class="fw-medium text-center mb-3">Is this your profile?</p>
            <div class="d-grid gap-2 d-sm-flex justify-content-center">
              <button id="btnTidak" class="btn btn-outline-danger px-4">No, it's not me</button>
              <button type="button" id="btnYa" class="btn btn-primary px-4">Yes, it's me</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- cari data existing -->
    <div class="modal fade animate__animated animate__fadeInUp" id="modalPelanggan" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-simple">
        <div class="modal-content order-modal">
          <div class="modal-body">
            <div class="searchBox">
              <div class="order-modal-head">
                <span class="order-modal-icon"><i class="icon-base ti tabler-user-search"></i></span>
                <h4 class="fw-bold mb-1">Find your profile</h4>
                <p class="text-body-secondary mb-0">Enter your full name, ID number, customer code, email or phone number.</p>
              </div>
              <div class="input-group input-group-merge mb-3">
                <span class="input-group-text"><i class="icon-base ti tabler-search"></i></span>
                <input type="text" class="form-control form-control-lg" id="inputCari" placeholder="Type here to search" autocomplete="off">
              </div>
              <button class="btn btn-primary btn-lg w-100" id="goSearch">Find my data</button>
              <div class="order-or"><span>or</span></div>
              <button type="button" class="btn btn-outline-primary w-100 btnDaftar"><i class="icon-base ti tabler-user-plus me-2"></i>Register your profile</button>
            </div>
            <div class="d-none findBox">
              <div class="order-modal-head">
                <span class="order-modal-icon"><i class="icon-base ti tabler-user-check"></i></span>
                <h4 class="fw-bold mb-1">We found a match</h4>
                <p class="text-body-secondary mb-0">Please check that the details below are yours.</p>
              </div>
              <ul class="profile-summary list-unstyled">
                <li><i class="icon-base ti tabler-barcode"></i><span class="profile-label">Customer Code</span><span class="profile-value" id="findKode">7118565151</span></li>
                <li><i class="icon-base ti tabler-user"></i><span class="profile-label">Full Name</span><span class="profile-value" id="findNama">John Doe</span></li>
                <li><i class="icon-base ti tabler-id"></i><span class="profile-label">ID Number</span><span class="profile-value" id="findID">123456789</span></li>
                <li><i class="icon-base ti tabler-mail"></i><span class="profile-label">Email</span><span class="profile-value" id="findEmail">john.doe@gmail.com</span></li>
                <li><i class="icon-base ti tabler-phone"></i><span class="profile-label">Phone</span><span class="profile-value" id="findTelepon">08123456789</span></li>
                <li><i class="icon-base ti tabler-home"></i><span class="profile-label">Address</span><span class="profile-value" id="findAlamat">Denpasar, Bali</span></li>
                <li><i class="icon-base ti tabler-world"></i><span class="profile-label">Nationality</span><span class="profile-value" id="findNegara">Indonesia</span></li>
              </ul>
            </div>
            <div class="d-none findBox">
              <p class="fw-medium text-center mb-3">Is this your profile?</p>
              <div class="d-grid gap-2 d-sm-flex justify-content-center">
                <button class="btn btn-outline-danger px-4" id="btnFindTidak">It's not me</button>
                <button class="btn btn-primary px-4" id="btnFindYa">Yes, it's me</button>
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
      <div class="modal-dialog modal-lg modal-dialog-centered modal-simple">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center mb-6">
              <h4 class="mb-1">Transaction Exceeded Threshold Limit</h4>
              <p class="text-body mb-0">Please fill in and sign the following form for transactions that exceed the monthly limit</p>
            </div>

            <h6 class="fw-semibold mb-3">Personal / Business Data</h6>
            <div class="row g-3 mb-5">
              <div class="col-md-6">
                <label for="npwp" class="form-label">NPWP</label>
                <input type="text" id="npwp" class="form-control">
              </div>
              <div class="col-md-6">
                <label for="domisili" class="form-label">Domicile</label>
                <input type="text" id="domisili" class="form-control">
              </div>
              <div class="col-md-6">
                <label for="penghasilan" class="form-label">Income</label>
                <select id="penghasilan" class="form-select"></select>
              </div>
              <div class="col-md-6">
                <label for="bentuk_pt" class="form-label">Company Form</label>
                <select id="bentuk_pt" class="form-select"></select>
              </div>
              <div class="col-md-6">
                <label for="perusahaan" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="perusahaan">
              </div>
              <div class="col-md-6">
                <label for="bidang_usaha" class="form-label">Business Field</label>
                <input type="text" class="form-control" id="bidang_usaha">
              </div>
              <div class="col-md-6">
                <label for="pekerjaan" class="form-label">Occupation</label>
                <select id="pekerjaan" class="form-select"></select>
              </div>
              <div class="col-md-6">
                <label for="jabatan" class="form-label">Position</label>
                <input type="text" id="jabatan" class="form-control">
              </div>
            </div>

            <div class="bg-label-warning rounded p-4 mb-4">
              <h6 class="fw-semibold mb-1">
                <i class="icon-base ti tabler-alert-triangle me-1"></i>
                Transaction-Specific Details
              </h6>
              <p class="mb-3 small">These fields describe this specific transaction and must be filled in every time — they are never pre-filled from a previous submission.</p>
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="tujuan" class="form-label">Transaction Purpose</label>
                  <select id="tujuan" class="form-select"></select>
                </div>
                <div class="col-md-4">
                  <label for="hubungan" class="form-label">Relation (if represented)</label>
                  <input type="text" id="hubungan" class="form-control">
                </div>
                <div class="col-md-4">
                  <label for="sumber" class="form-label">Source of Funds</label>
                  <select id="sumber" class="form-select"></select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <label for="signature-pad" class="form-label">Signature</label>
                <canvas id="signature-pad" class="w-100 border rounded" height="200"></canvas>
              </div>
              <div class="col-md-6 d-flex flex-column justify-content-end align-items-end gap-2">
                <button class="btn btn-outline-danger" id="btnSignClear">Clear</button>
                <button class="btn btn-primary w-100" id="btnSignSubmit">Submit</button>
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