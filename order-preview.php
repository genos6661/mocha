<?php
require 'config/config.php';
?>
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

    <title>Mocha</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
      rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/fonts/iconify-icons.css" />


    <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />

    <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />

    <link rel="stylesheet" href="assets/vendor/css/core.css" />

    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css" />
    <link rel="stylesheet" href="/assets/vendor/libs/sweetalert2/sweetalert2.css" />

    <link rel="stylesheet" href="/assets/css/demo.css" />
    <link rel="stylesheet" href="/assets/vendor/css/pages/app-invoice.css" />

    <!-- endbuild -->

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="assets/vendor/js/template-customizer.js"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->

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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  </head>

  <body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <div class="container-xxl flex-grow-1 container-p-y">
              <div class="row invoice-preview">
                <!-- Invoice -->
                <div class="col-xl-9 col-md-8 col-12 mb-md-0 mb-6">
                  <div class="card invoice-preview-card p-sm-12 p-6" id="orderDiv">
                    <div class="card-body invoice-preview-header p-5 rounded">
                      <div
                        class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column align-items-xl-center align-items-md-start align-items-sm-center align-items-start">
                        <div class="mb-xl-0 mb-2 text-heading">
                          <div class="d-flex svg-illustration mb-2   gap-2 flex-column">
                            <span class="app-brand-logo demo" id="boxLogo">
                              <span class="text-primary">
                                <svg
                                  width="32"
                                  height="22"
                                  viewBox="0 0 32 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
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
                            <span class="app-brand-text fw-bold fs-4 ms-50" id="namaPT">Jagad Mocha</span>
                          </div>
                          <p class="mb-1"><span id="namaCabang"></span></p>
                          <p class="mb-1"><span id="alamatCabang"></span></p>
                          <p class="mb-0"><span id="teleponCabang"></span></p>
                        </div>
                        <div>
                          <h4 class="mb-5">Order <span id="nomorOrder"></span></h4>
                          <div class="mb-1 text-heading text-end">
                            <span>Date Issues:</span>
                            <span class="fw-medium" id="tanggalTransaksi"></span>
                          </div>
                          <div class="text-heading text-end">
                            <span id="jenisTransaksi"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-body px-0">
                      <div class="row">
                        <div class="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-6 mb-sm-0 mb-6">
                          <h6>Order From :</h6>
                          <p class="mb-1 fw-medium"><span id="namaPelanggan"></span></p>
                          <p class="mb-1 fw-medium"><span id="alamatPelanggan"></span></p>
                          <p class="mb-1 fw-medium"><span id="teleponPelanggan"></span></p>
                          <p class="mb-0 fw-medium"><span id="emailPelanggan"></span></p>
                          <!-- <p class="mb-0"></p> -->
                        </div>
                        <div class="col-xl-6 col-md-12 col-sm-7 col-12">
                          <h6> &nbsp; </h6>
                          <table>
                            <tbody>
                              <tr>
                                <td class="pe-4">Cust. Code :</td>
                                <td class="fw-medium"><span id="kodePelanggan"></span></td>
                              </tr>
                              <tr>
                                <td class="pe-4">ID Number :</td>
                                <td><span id="idNumber"></span></td>
                              </tr>
                              <tr>
                                <td class="pe-4">Nationality :</td>
                                <td><span id="negara"></span></td>
                              </tr>
                              <tr>
                                <td class="pe-4">Occupation :</td>
                                <td><span id="pekerjaan"></span></td>
                              </tr>
                              <!-- <tr>
                                <td class="pe-4">SWIFT code:</td>
                                <td>BR91905</td>
                              </tr> -->
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div class="table-responsive border border-bottom-0 border-top-0 rounded">
                      <table class="table m-0" id="tabelDetail">
                        <thead>
                          <tr>
                            <th>Currency</th>
                            <th>Name</th>
                            <th class="text-end">Amount</th>
                            <th class="text-end">Rate</th>
                            <th class="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                        </tbody>
                      </table>
                    </div>
                    <div class="table-responsive">
                      <table class="table m-0 table-borderless">
                        <tbody>
                          <tr>
                            <td class="align-top pe-6 ps-0 py-6 text-body">
                                <!-- <p class="mb-1">
                                  <span class="me-2 h6">Salesperson:</span>
                                  <span>Alfie Solomons</span>
                                </p>
                                <span>Thanks for your business</span> -->
                            </td>
                            <td class="px-0 py-6 w-px-100">
                              <p class="mb-2">Subtotal:</p>
                              <p class="mb-2">Tax:</p>
                              <p class="mb-0">Total:</p>
                            </td>
                            <td class="text-end px-2 py-6 w-px-100 fw-medium text-heading">
                              <p class="fw-medium mb-2 nowrap">Rp. <span id="subtotal"></span></p>
                              <p class="fw-medium mb-2 nowrap">0</p>
                              <p class="fw-medium mb-0 nowrap">Rp. <span id="total"></span></p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <hr class="mt-0 mb-6" />
                    <div class="card-body p-0">
                      <div class="row">
                        <div class="col-12">
                          <span class="fw-medium text-heading">Note : </span>
                          <span
                            >Thank you for your trust and business. It has been a pleasure serving you. We look forward to assisting you again in your future currency exchange needs.</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /Invoice -->

                <!-- Invoice Actions -->
                <div class="col-xl-3 col-md-4 col-12 invoice-actions">
                  <div class="card">
                    <div class="card-body">
                      <a id="goToForm" href="/order-form" class="btn btn-label-secondary d-grid w-100 mb-4">Place New Order</a>
                      <button
                        class="btn btn-primary d-grid w-100 mb-4" onclick="downloadPDF()">
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                          ><i class="icon-base ti tabler-download icon-xs me-2"></i>Download</span
                        >
                      </button>
                      <div class="d-flex mb-4">
                        <button
                          class="btn btn-label-secondary d-grid w-100 me-4"
                          onclick="printDiv('orderDiv')">
                          Print
                        </button>
                        <button class="btn btn-label-secondary d-grid w-100" disabled> Edit </button>
                      </div>
                      <button
                        class="btn btn-success d-grid w-100" id="checkInvoice">
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                          ><i class="icon-base ti tabler-receipt icon-xs me-2"></i>Check Invoice</span
                        >
                      </button>
                    </div>
                  </div>
                </div>
                <!-- /Invoice Actions -->
              </div>

              <!-- Offcanvas -->
              <!-- Send Invoice Sidebar -->
              <div class="offcanvas offcanvas-end" id="sendInvoiceOffcanvas" aria-hidden="true">
                <div class="offcanvas-header mb-6 border-bottom">
                  <h5 class="offcanvas-title">Send Invoice</h5>
                  <button
                    type="button"
                    class="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div class="offcanvas-body pt-0 flex-grow-1">
                  <form>
                    <div class="mb-6">
                      <label for="invoice-from" class="form-label">From</label>
                      <input
                        type="text"
                        class="form-control"
                        id="invoice-from"
                        value="shelbyComapny@email.com"
                        placeholder="company@email.com" />
                    </div>
                    <div class="mb-6">
                      <label for="invoice-to" class="form-label">To</label>
                      <input
                        type="text"
                        class="form-control"
                        id="invoice-to"
                        value="qConsolidated@email.com"
                        placeholder="company@email.com" />
                    </div>
                    <div class="mb-6">
                      <label for="invoice-subject" class="form-label">Subject</label>
                      <input
                        type="text"
                        class="form-control"
                        id="invoice-subject"
                        value="Invoice of purchased Admin Templates"
                        placeholder="Invoice regarding goods" />
                    </div>
                    <div class="mb-6">
                      <label for="invoice-message" class="form-label">Message</label>
                      <textarea class="form-control" name="invoice-message" id="invoice-message" cols="3" rows="8">
Dear Queen Consolidated,
          Thank you for your business, always a pleasure to work with you!
          We have generated a new invoice in the amount of $95.59
          We would appreciate payment of this invoice by 05/11/2021</textarea
                      >
                    </div>
                    <div class="mb-6">
                      <span class="badge bg-label-primary">
                        <i class="icon-base ti tabler-link icon-xs"></i>
                        <span class="align-middle">Invoice Attached</span>
                      </span>
                    </div>
                    <div class="mb-6 d-flex flex-wrap">
                      <button type="button" class="btn btn-primary me-4" data-bs-dismiss="offcanvas">Send</button>
                      <button type="button" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- /Send Invoice Sidebar -->

              <!-- Add Payment Sidebar -->
              <div class="offcanvas offcanvas-end" id="addPaymentOffcanvas" aria-modal="true" role="dialog">
                <div class="offcanvas-header border-bottom">
                  <h5 class="offcanvas-title">Add Payment</h5>
                  <button
                    type="button"
                    class="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div class="offcanvas-body flex-grow-1">
                  <div class="d-flex justify-content-between bg-lighter p-2 mb-4">
                    <p class="mb-0">Invoice Balance:</p>
                    <p class="fw-medium mb-0">$5000.00</p>
                  </div>
                  <form>
                    <div class="mb-6">
                      <label class="form-label" for="invoiceAmount">Payment Amount</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="text"
                          id="invoiceAmount"
                          name="invoiceAmount"
                          class="form-control invoice-amount"
                          placeholder="100" />
                      </div>
                    </div>
                    <div class="mb-6">
                      <label class="form-label" for="payment-date">Payment Date</label>
                      <input id="payment-date" class="form-control invoice-date" type="text" />
                    </div>
                    <div class="mb-6">
                      <label class="form-label" for="payment-method">Payment Method</label>
                      <select class="form-select" id="payment-method">
                        <option value="" selected disabled>Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Paypal">Paypal</option>
                      </select>
                    </div>
                    <div class="mb-6">
                      <label class="form-label" for="payment-note">Internal Payment Note</label>
                      <textarea class="form-control" id="payment-note" rows="2"></textarea>
                    </div>
                    <div class="mb-6 d-flex flex-wrap">
                      <button type="button" class="btn btn-primary me-4" data-bs-dismiss="offcanvas">Send</button>
                      <button type="button" class="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- /Add Payment Sidebar -->

              <!-- /Offcanvas -->
            </div>
          </div>
        </div>
      </body>

  <script src="assets/vendor/libs/jquery/jquery.js"></script>

  <script src="assets/vendor/libs/popper/popper.js"></script>
  <script src="assets/vendor/js/bootstrap.js"></script>
  <script src="assets/vendor/libs/node-waves/node-waves.js"></script>

  <script src="assets/vendor/libs/@algolia/autocomplete-js.js"></script>

  <script src="assets/vendor/libs/pickr/pickr.js"></script>

  <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

  <script src="assets/vendor/libs/hammer/hammer.js"></script>
  <script src="/assets/vendor/libs/select2/select2.js"></script>
  <script src="/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
  <script src="/assets/vendor/libs/typeahead-js/typeahead.js"></script>

  <script src="assets/vendor/js/menu.js"></script>

  <!-- endbuild -->

  <!-- Vendors JS -->

  <!-- Main JS -->

  <script src="assets/js/main.js"></script>

  <script src="js/pages/order-preview.js"></script>

</html>