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

    <!-- Google Tag Manager + Consent Mode v2 (aktif hanya di host yang terdaftar di js/gtm.js) -->
    <script src="js/gtm.js?v=<?= filemtime(__DIR__ . '/js/gtm.js') ?>"></script>
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
                        <?php include __DIR__ . '/partials/logo.php'; ?>
                      </span>
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
                    <span class="h5 namaCabang">BERES Mocha</span>
                  </div>
                  <div class="row">
                    <div class="col-md">
                      <p class="h5 fw-bold mt-4">Fill out your profile data</p>
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
                      <label for="fullname" class="form-label">
                      Full Name
                      <sup class="text-danger">*required</sup>
                      </label>
                      <input type="text" class="form-control" id="fullname" name="fullname" placeholder="Enter Your Full Name" autofocus />
                    </div>
                    <div class="col-md mb-4">
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
                  <div class="row">
                    <div class="col-md mb-4">
                      <label for="id_type" class="form-label">ID Type<sup class="text-danger"> *required</sup></label>
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
                      <label class="form-label" for="idNumber">Passport/NIK Number<sup class="text-danger"> *mandatory</sup></label>
                      <input type="text" id="idNumber" class="form-control" name="idNumber" placeholder="Enter Your ID Number" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4 form-control-validation">
                      <label for="tempat_lahir" class="form-label">Place of birth</label>
                      <input type="text" class="form-control" id="tempat_lahir" name="tempat_lahir" placeholder="Enter Your Place of Birth" />
                    </div>
                    <div class="col-md mb-4">
                      <label class="form-label" for="tanggal_lahir">Date of birth</label>
                       <input type="date" id="tanggal_lahir" class="form-control" name="tanggal_lahir" placeholder="Enter Your Birth of Date" />
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
                      <label for="nationality" class="form-label">Nationality<sup class="text-danger"> *required</sup></label>
                      <select name="" id="nationality" class="form-select"></select>
                    </div>
                    <div class="col-md mb-4">
                      <label for="address" class="form-label">Local Address<sup class="text-danger"> *required</sup></label>
                        <input type="text" class="form-control" id="address" name="address" placeholder="Enter Your Local Address" required />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md mb-4">
                      <label for="occupation" class="form-label">Occupation<sup class="text-danger"> *required</sup></label>
                      <select class="form-select" id="occupation"></select>
                    </div>
                    <div class="col-md mb-4">
                      <label for="paspor" class="form-label">Passport Photo</label>
                      <input type="file" class="form-control" id="paspor">
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
                  <!-- <div class="text-center mb-3"> -->
                    <div class="app-brand justify-content-center mb-0 boxLogo">
                      <span class="app-brand-logo demo logoForm">
                        <span class="text-primary">
                          <?php include __DIR__ . '/partials/logo.php'; ?>
                        </span>
                      </span>
                      <span class="app-brand-text demo text-heading fw-bold namaPT">BERES Mocha</span>
                      <span class="h5 mb-0 namaCabang">BERES Mocha</span>
                      <p class="h6 mb-2 mt-0">Order Details</p>
                    </div>
                  <!-- </div> -->
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
                  <?php include __DIR__ . '/partials/logo.php'; ?>
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