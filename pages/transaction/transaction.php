<?php
$nowHour = date('H');
$reportDate = date('Y-m-d');

if ($nowHour >= 15) {
    $reportDate = date('Y-m-d', strtotime('+1 day'));
}
?>
<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<h5 class="mb-3">Transactions</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md-6 mb-2 mb-md-0">
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base  ti tabler-filter icon-20px"></i><span class="d-md-inline-block d-none"></span>
      </button>
      <button class="btn btn-primary" type="button" id="btnNewTransaction" data-bs-toggle="modal" data-bs-target="#modalTransaksiBaru">
        New Transaction
      </button>
    </div>
    <div class="col-md-6 d-flex justify-content-end">
      <div class="input-group input-group-merge filtertabel">
        <span class="input-group-text" id="basic-addon-search31"
          ><i class="icon-base ti tabler-search"></i
        ></span>
        <input
          type="text"
          class="form-control"
          placeholder="Search..."
          aria-label="Search..."
          aria-describedby="basic-addon-search31" />
      </div>
    </div>
  </div>
  <div class="card-datatable table-responsive px-3">
    <table class="table table-bordered table-hover table-cards" id="tabelTrans">
      <thead>
        <tr>
          <th></th>
          <th>Date / Number</th>
          <th>Type</th>
          <th>Order Number</th>
          <th>Branch</th>
          <th>Name</th>
          <th class="text-end">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Transactions : <span id="totalTrans"></span></p>
      </div>
  </div>
</div>

<!-- modal -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Filter Transactions</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <div class="mb-3">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select select2">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year (Default)</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="startDate" class="form-label">Date From</label>
            <input type="date" class="form-control" id="startDate">
          </div>
          <div class="col-md mb-3">
            <label for="endDate" class="form-label">Until</label>
            <input type="date" class="form-control" id="endDate">
          </div>
        </div>
        <div class="mb-3">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select" multiple></select>
        </div>
        <div class="d-flex justify-content-end mb-0 gap-4">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="buy" checked>
            <label class="form-check-label" for="buy">Buy</label>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="sell" checked>
            <label class="form-check-label" for="sell">Sell</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary me-0" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary me-0" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Apply</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-receipt"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Transaction Detail</h4>
          <p class="mf-sub">Forex buying or selling transaction.</p>
        </div>
        <div class="mf-meta"><span class="mf-ref dataDetail" id="nomorDetail"></span><div id="tipeDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Order Number</span><span class="dl-value dataDetail" id="orderDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value dataDetail" id="cabangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Date</span><span class="dl-value dataDetail" id="tanggalDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Customer</span><span class="dl-value dataDetail" id="pelangganDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Nationality</span><span class="dl-value dataDetail" id="negaraDetail"></span></div>
            <div class="dl-item d-none" id="guideDetailItem"><span class="dl-label">Guide</span><span class="dl-value dataDetail" id="guideDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Items</div>
<div class="table-responsive" id="itemDetail">
          <table class="table table-borderless mf-table mf-detail-table" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Forex</th>
                <th class="text-end">Amount</th>
                <th class="text-end">Rates</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-primary btn" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <a class="btn-outline-primary btn" target="_blank" id="reprintDetail">Reprint</a>
        <button class="btn-outline-success btn btnSendWa" id="waDetail"><i class="icon-base ti tabler-brand-whatsapp me-1"></i>WhatsApp</button>
        <a href="#" class="btn btn-outline-secondary" type="button" id="editBtn">Edit</a>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapusTransaksi" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Transaction</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete transaction <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapus" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<!-- jurnal voucher -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalJurnal" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Journal Voucher <span id="refJurnal"></span></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body table-responsive">
        <table class="table table-sm" id="tabelJurnal">
          <thead class="bg-light">
            <tr>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody></tbody>
          <!-- <tfoot class="bg-light">
            <tr>
              <th colspan="2">Total : </th>
              <th class="text-end" id="totalDebit"></th>
              <th class="text-end" id="totalKredit"></th>
            </tr>
          </tfoot> -->
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<?php $kontakReturn = '#modalTransaksiBaru'; $kontakSaveId = 'sbmTambah'; include __DIR__ . '/../_modal-kontak-baru.php'; ?>

<!-- modal transaksi baru -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTransaksiBaru" data-bs-keyboard="false" data-bs-backdrop="static">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-receipt"></i></span>
        <div>
          <h4 class="mf-title">New Transaction</h4>
          <p class="mf-sub">Record a forex buying or selling transaction for a contact.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-user"></i>Contact &amp; date</div>
          <div class="row">
            <div class="col-md-8 mb-3">
              <label for="kontak" class="form-label">Contact</label>
              <select id="kontak" class="form-select"></select>
            </div>
            <div class="col-md-4 mb-3 d-flex flex-column">
              <label for="btnKontakBaru" class="form-label">Or Add New Contact</label>
              <button id="btnKontakBaru" class="btn btn-outline-primary w-100" data-bs-toggle="modal" data-bs-target="#modalKontakBaru" data-bs-dismiss="modal">
                <i class="icon-base ti tabler-user-plus icon-sm me-2"></i>New Contact
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="tanggal" class="form-label">Date</label>
              <input type="date" class="form-control" id="tanggal" value="<?php echo date('Y-m-d'); ?>">
            </div>
            <div class="col-md mb-3">
              <label for="tanggal_laporan" class="form-label">Report Date</label>
              <input type="date" class="form-control" id="tanggal_laporan" value="<?php echo $reportDate; ?>">
            </div>
            <div class="col-md mb-3">
              <label for="cabangTrans" class="form-label">Branch</label>
              <select id="cabangTrans" class="form-select"></select>
            </div>
          </div>
          <div class="row d-none" id="guideField">
            <div class="col-12 mb-3">
              <label for="guideTrans" class="form-label">Guide <span class="text-body-secondary">(optional)</span></label>
              <select id="guideTrans" class="form-select"></select>
              <div class="form-text guide-mode-hint"></div>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title">
            <i class="icon-base ti tabler-list-details"></i>Transaction details
            <div class="mf-tools">
              <div class="btn-group mf-segment" role="group" aria-label="Transaction type">
                <input type="radio" class="btn-check" name="tipeTrans" id="buyTrans" checked>
                <label class="btn btn-outline-success" for="buyTrans">Buy</label>
                <input type="radio" class="btn-check" name="tipeTrans" id="sellTrans">
                <label class="btn btn-outline-danger" for="sellTrans">Sell</label>
              </div>
              <button class="btn btn-primary" id="tambahBaris" type="button" disabled="true">
                <i class="icon-base ti tabler-plus icon-sm me-1"></i>Add Row
              </button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-borderless table-stack mf-table" id="tabelDetail">
              <thead>
                <tr>
                  <th style="width: 25%; min-width: 180px;">Currency</th>
                  <th class="text-end" style="width: 20%; min-width: 130px;">Amount</th>
                  <th class="text-end" style="width: 25%; min-width: 160px;">Rate</th>
                  <th class="text-end" style="width: 25%; min-width: 160px;">Subtotal</th>
                  <th style="width: 5%;"></th>
                </tr>
              </thead>
              <tbody class="tbody-scroll">

              </tbody>
            </table>
          </div>
          <div class="mf-total">
            <span class="mf-total-label">Total</span>
            <input type="text" class="total form-control text-end" readonly>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button class="btn btn-primary" id="btnSubmit"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
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
          <p class="text-body mb-0">Please fill in the following form for transactions exceeding the monthly limit equivalent to 10.000 USD</p>
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
            <label for="pekerjaanSign" class="form-label">Occupation</label>
            <select id="pekerjaanSign" class="form-select"></select>
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

        <!-- <div class="mb-3">
          <label for="signature-pad" class="form-label">Signature</label>
        </div>
        <canvas id="signature-pad" class="w-100 border rounded" height="300"></canvas> -->
        <div class="d-flex justify-content-end gap-3">
          <!-- <button class="btn btn-outline-danger" id="btnSignClear">Clear</button> -->
          <button class="btn btn-primary" id="btnSignSubmit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/country-dial-codes.js?v=<?= filemtime(__DIR__ . '/../../js/pages/country-dial-codes.js') ?>" type="text/javascript"></script>
<script src="js/pages/invoice-wa.js?v=<?= filemtime(__DIR__ . '/../../js/pages/invoice-wa.js') ?>" type="text/javascript"></script>
<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/pages/transaction.js" type="text/javascript"></script>
<script src="js/pages/contact-new.js" type="text/javascript"></script>
<script src="js/pages/guide-rate.js?v=<?= filemtime(__DIR__ . '/../../js/pages/guide-rate.js') ?>" type="text/javascript"></script>
<script src="js/pages/direct-transaction.js?v=<?= filemtime(__DIR__ . '/../../js/pages/direct-transaction.js') ?>" type="text/javascript"></script>