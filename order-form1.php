<?php
require 'config/config.php';
?>
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
    <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />

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
  </head>

  <body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
              <div class="card w-100 w-md-50 mx-auto">
	            <div class="card-body">
	              <!-- Logo -->
	              <div class="app-brand justify-content-center mb-6" id="boxLogo">
                  <span class="app-brand-logo demo" id="logoForm">
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
	                <span class="app-brand-text demo text-heading fw-bold" id="namaPT">Jagad Mocha</span>
	              </div>
	              <input type="hidden" id="idBranch" name="idBranch">
								<!-- <span id="textBranch"></span> -->
	              <form id="formOrder">
	              	<input type="hidden" id="indexExisting">
	              	<input type="hidden" id="requestUser">
	              	<div class="row">
	              		<div class="col-md mb-4 form-control-validation">
	              			<label for="fullname" class="form-label">Full Name</label>
	                		<input type="text" class="form-control" id="fullname" name="fullname" placeholder="Enter Your Full Name" autofocus />
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
	              	<div class="row">
	              		<div id="divPilihPelanggan" class="col-md mb-4 d-flex gap-3 justify-content-between align-text-end align-items-end">
	              			<label class="col-md col-form-label">OR</label>
				              <div class="col-smd d-grid px-3">
				                <button type="button" data-bs-toggle="modal" data-bs-target="#modalPelanggan" class="btn btn-primary">Select Existing Data</button>
				              </div>
	              		</div>
	              		<div class="col-md mb-4 d-none" id="divKodeExisting">
	              			<label for="kodeExisting" class="form-label">Code Existing</label>
	                  	<div class="input-group">
					              <input type="text" id="kodeExisting" class="form-control" readonly />
					              <button class="btn btn-outline-danger input-group-button" id="btnReset">Reset</span>
					            </div>
	              		</div>
	              	</div>
	              	</form>

	                <hr class="my-2">

	                <div class="row">
	                	<div class="col-md">
	                		<h5>Order Details</h5>
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
	                <div class="table-responsive text-nowrap">
	                	<table class="table table-borderless" id="tabelDetail">
	                		<thead class="border-bottom">
	                			<tr>
	                				<th class="py-1" style="width: 25%; min-width: 200px;">Currency</th>
	                				<th class="py-1" style="width: 20%; min-width: 150px;">Amount</th>
	                				<th class="py-1" style="width: 25%; min-width: 200px;">Rate</th>
	                				<th class="py-1" style="width: 25%; min-width: 200px;">Subtotal</th>
	                				<th class="py-1"></th>
	                			</tr>
	                		</thead>
	                		<tbody>
	                			
	                		</tbody>
	                		<tfoot>
	                			<tr>
	                				<th colspan="3" class="text-end">Total :</th>
	                				<th class="px-1 pt-2">
	                					<input type="text" class="total form-control text-end" readonly>
	                				</th>
	                				<th></th>
	                			</tr>
	                		</tfoot>
	                	</table>
	                </div>
	                <div class="row mt-3">
	                	<div class="col-md d-grid">
	                		<button class="btn btn-outline-primary border-none" data-bs-toggle="modal" data-bs-target="#modalRequest" type="button">
	                			&nbsp;
	                		</button>
	                	</div>
	                	<div class="col-md d-grid">
	                		<button class="btn btn-outline-primary" type="button" id="tambahBaris">
	                			Tambah Baris
	                		</button>
	                	</div>
	                </div>
	                <div class="my-4">
	                  <button class="btn btn-primary d-grid w-100" type="button" id="btnSubmit">Submit the order</button>
	                </div>
	            </div>
	          </div>
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
                    , made with ❤️ by <a href="https://jagadazurateknologi.com" target="_blank" class="footer-link">Jagad Azura Teknologi</a>
                  </div>
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

    <!-- modal cari kontak -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalPelanggan" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <div class="row w-100">
          <div class="col-md-5 p-0 px-md-2 mb-2 mb-md-0">
            <h5 class="modal-title" id="backDropModalTitle">Search Existing Data</h5>
          </div>
          <div class="col-md-7 p-0 boxHeader mb-2 mb-md-0">
              <input type="text" class="form-control" id="filterPelanggan" placeholder="Type at least 5 letters">
          </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="table-responsive">
          <table class="table table-sm table-hover" id="tabelPelanggan">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>ID Number</th>
                <th>Phone</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </div>
  </div>
</div>

<!-- modal pilih branch -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalBranch" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Select Which Branch You Are In</h5>
      </div>
      <div class="modal-body">
        <form id="formBranch">
        <select id="selectBranch" class="form-select"></select>
      </div>
      <div class="modal-footer">
        <button type="button" id="sbmBranch" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalRequest" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Request Rate</h5>
      </div>
      <div class="modal-body">
        <form id="formRequest">
        <div class="mb-6 form-control-validation">
          <label for="emailReq" class="form-label">Email</label>
          <input
            type="text"
            class="form-control"
            id="emailReq" value="cobasapi@gmail.com"
            autofocus />
        </div>
        <div class="mb-6 form-password-toggle form-control-validation">
          <label class="form-label" for="passwordReq">Password</label>
          <!-- <div class="input-group input-group-merge"> -->
            <input
              type="password"
              id="passwordReq"
              class="form-control"
              aria-describedby="password" value="sapi123" />
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

    <!--/ Layout wrapper -->

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/theme.js -->

    <!-- <script src="assets/vendor/libs/jquery/jquery.js"></script> -->

    <script src="assets/vendor/libs/popper/popper.js"></script>
    <script src="assets/vendor/js/bootstrap.js"></script>
    <script src="assets/vendor/libs/node-waves/node-waves.js"></script>

    <!-- <script src="assets/vendor/libs/@algolia/autocomplete-js.js"></script> -->

    <script src="assets/vendor/libs/pickr/pickr.js"></script>

    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

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

    <!-- Page JS -->
  </body>
</html>
