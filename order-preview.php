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
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon/logo.svg" />

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

    <link rel="stylesheet" href="/assets/css/demo.css?v=<?= filemtime(__DIR__ . '/assets/css/demo.css') ?>" />
    <link rel="stylesheet" href="/assets/vendor/css/pages/app-invoice.css" />
    <link rel="stylesheet" href="/assets/css/invoice-preview.css?v=<?= filemtime(__DIR__ . '/assets/css/invoice-preview.css') ?>" />

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
    <script src="assets/vendor/libs/export-laporan/jspdf.js"></script>
    <script src="assets/vendor/libs/export-laporan/autotable.js"></script>
  </head>

  <body class="ip-body">
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-navbar-full layout-horizontal layout-without-menu">
      <div class="layout-container">
        <div class="container-xxl flex-grow-1 container-p-y">
          <div class="ip-wrap">
            <!-- Invoice -->
            <div class="ip-card" id="orderDiv">
              <div class="ip-hero">
                <div class="ip-brand">
                  <span class="ip-logo" id="boxLogo"><?php include __DIR__ . '/partials/logo.php'; ?></span>
                  <div>
                    <div class="ip-company" id="namaPT">Jagad Mocha</div>
                    <div class="ip-branch"><span id="namaCabang"></span></div>
                  </div>
                </div>
                <div class="ip-docmeta">
                  <h1 class="ip-doc-title">Order <span id="nomorOrder"></span></h1>
                  <span class="ip-pill" id="jenisTransaksi"></span>
                  <div class="ip-date">
                    <span>Date Issues:</span>
                    <span class="fw-semibold" id="tanggalTransaksi"></span>
                  </div>
                </div>
              </div>

              <div class="ip-contact">
                <span><i class="icon-base ti tabler-map-pin"></i><span id="alamatCabang"></span></span>
                <span><i class="icon-base ti tabler-phone"></i><span id="teleponCabang"></span></span>
              </div>

              <div class="ip-body-pad">
                <div class="ip-grid">
                  <div class="ip-panel">
                    <div class="ip-panel-title">Order From :</div>
                    <div class="ip-customer">
                      <span class="ip-avatar"><i class="icon-base ti tabler-user"></i></span>
                      <div class="ip-customer-lines">
                        <p class="ip-customer-name"><span id="namaPelanggan"></span></p>
                        <p><span id="alamatPelanggan"></span></p>
                        <p><span id="teleponPelanggan"></span></p>
                        <p><span id="emailPelanggan"></span></p>
                      </div>
                    </div>
                  </div>
                  <div class="ip-panel">
                    <div class="ip-panel-title">Customer details</div>
                    <dl class="ip-dl">
                      <dt>Cust. Code :</dt>
                      <dd><span id="kodePelanggan"></span></dd>
                      <dt>ID Number :</dt>
                      <dd><span id="idNumber"></span></dd>
                      <dt>Nationality :</dt>
                      <dd><span id="negara"></span></dd>
                      <dt>Occupation :</dt>
                      <dd><span id="pekerjaan"></span></dd>
                    </dl>
                  </div>
                </div>

                <div class="ip-items">
                  <table class="ip-table" id="tabelDetail">
                    <thead>
                      <tr>
                        <th>Currency / Name</th>
                        <th class="text-end">Amount</th>
                        <th class="text-end">Rate</th>
                        <th class="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>

                <div class="ip-summary">
                  <div class="ip-note">
                    <span class="ip-note-title">Note :</span>
                    <span>Thank you for your trust and business. It has been a pleasure serving you. We look forward to assisting you again in your future currency exchange needs.</span>
                  </div>
                  <div class="ip-totals">
                    <div class="ip-total-row"><span>Subtotal:</span><strong>Rp. <span id="subtotal"></span></strong></div>
                    <div class="ip-total-row"><span>Tax:</span><strong>0</strong></div>
                    <div class="ip-total-row ip-grand"><span>Total:</span><strong>Rp. <span id="total"></span></strong></div>
                  </div>
                </div>
              </div>
              <div class="ip-thanks">Thank you for choosing us.</div>
            </div>
            <!-- /Invoice -->

            <!-- Invoice Actions -->
            <div class="ip-actions">
              <div class="ip-actions-title">Actions</div>
              <button class="btn btn-primary" onclick="downloadPDF()">
                <i class="icon-base ti tabler-download"></i>Download
              </button>
              <div class="ip-actions-row">
                <button class="btn btn-label-secondary" onclick="printDiv('orderDiv')">
                  <i class="icon-base ti tabler-printer"></i>Print
                </button>
                <button class="btn btn-label-secondary" onclick="copyLink()">
                  <i class="icon-base ti tabler-link"></i>Copy link
                </button>
              </div>
              <button class="btn btn-label-secondary" disabled>
                <i class="icon-base ti tabler-edit"></i>Edit
              </button>
              <a id="goToForm" href="/order-form" class="btn btn-label-secondary">
                <i class="icon-base ti tabler-plus"></i>Place New Order
              </a>
              <button class="btn btn-success" id="checkInvoice">
                <i class="icon-base ti tabler-receipt"></i>Check Invoice
              </button>
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

  <script src="js/invoice-pdf.js?v=<?= filemtime(__DIR__ . '/js/invoice-pdf.js') ?>"></script>
  <script src="js/pages/order-preview.js?v=<?= filemtime(__DIR__ . '/js/pages/order-preview.js') ?>"></script>

</html>