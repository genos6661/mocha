<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />
<link rel="stylesheet" href="/assets/css/guide-report.css?v=<?= filemtime(__DIR__ . '/../../assets/css/guide-report.css') ?>" />

<div class="settings-page rp-danger">
  <a href="/guide-reports" class="rl-back"><i class="icon-base ti tabler-arrow-left"></i>Guide Reports</a>

  <div class="settings-head">
    <span class="settings-head-icon rl-head-icon"><i class="icon-base ti tabler-id-badge-2"></i></span>
    <div>
      <h4 class="mb-1">Guide Commission</h4>
      <p class="text-body-secondary mb-0">Commission earned by each guide, and what is still unpaid. Select unpaid commissions of one guide to pay them through a Cash Transaction.</p>
    </div>
  </div>

  <!-- filter -->
  <div class="card settings-card gr-filter">
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grRange" class="form-label">Period</label>
          <select id="grRange" class="form-select">
            <option value="month" selected>This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grStart" class="form-label">From</label>
          <input type="date" id="grStart" class="form-control">
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grEnd" class="form-label">Until</label>
          <input type="date" id="grEnd" class="form-control">
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grGuide" class="form-label">Guide</label>
          <select id="grGuide" class="form-select"></select>
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grCabang" class="form-label">Branch</label>
          <select id="grCabang" class="form-select"></select>
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <label for="grStatus" class="form-label">Status</label>
          <select id="grStatus" class="form-select">
            <option value="all" selected>All</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- ringkasan angka -->
  <div class="row g-4 gr-stats">
    <div class="col-md-4 col-12">
      <div class="gr-stat">
        <span class="gr-stat-icon"><i class="icon-base ti tabler-percentage"></i></span>
        <div><div class="gr-stat-label">Total commission</div><div class="gr-stat-value" id="grTotal">-</div><div class="gr-stat-sub" id="grCount"></div></div>
      </div>
    </div>
    <div class="col-md-4 col-6">
      <div class="gr-stat gr-paid">
        <span class="gr-stat-icon"><i class="icon-base ti tabler-circle-check"></i></span>
        <div><div class="gr-stat-label">Paid</div><div class="gr-stat-value" id="grPaid">-</div></div>
      </div>
    </div>
    <div class="col-md-4 col-6">
      <div class="gr-stat gr-unpaid">
        <span class="gr-stat-icon"><i class="icon-base ti tabler-hourglass-high"></i></span>
        <div><div class="gr-stat-label">Outstanding</div><div class="gr-stat-value" id="grUnpaid">-</div></div>
      </div>
    </div>
  </div>

  <!-- per guide -->
  <div class="card settings-card">
    <div class="card-body">
      <div class="settings-section mb-0">
        <div class="settings-section-title"><span class="settings-section-icon"><i class="icon-base ti tabler-users-group"></i></span>By guide</div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 settings-table table-stack" id="tabelGuideSummary">
            <thead>
              <tr>
                <th>Guide</th>
                <th class="text-end">Transactions</th>
                <th class="text-end">Transaction value</th>
                <th class="text-end">Commission</th>
                <th class="text-end">Paid</th>
                <th class="text-end">Outstanding</th>
                <th></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- per transaksi -->
  <div class="card settings-card">
    <div class="card-body">
      <div class="settings-section mb-0">
        <div class="settings-section-title"><span class="settings-section-icon"><i class="icon-base ti tabler-list-details"></i></span>Transactions</div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 settings-table table-stack" id="tabelGuideRows">
            <thead>
              <tr>
                <th style="width: 2.5rem;"></th>
                <th>Date</th>
                <th>Number</th>
                <th>Type</th>
                <th>Branch</th>
                <th>Customer</th>
                <th>Guide</th>
                <th class="text-end">Value</th>
                <th class="text-end">Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="gr-pay-bar d-none" id="grPayBar">
      <div class="gr-pay-info"><span id="grSelCount">0</span> selected<span class="gr-pay-sep">&middot;</span><strong id="grSelTotal">Rp 0</strong></div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-label-secondary" id="grClear">Clear</button>
        <button type="button" class="btn btn-primary" id="grPay"><i class="icon-base ti tabler-cash icon-sm me-2"></i>Pay Selected</button>
      </div>
    </div>
  </div>
</div>

<!-- modal bayar komisi -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalPay" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash"></i></span>
        <div>
          <h4 class="mf-title">Pay Commission</h4>
          <p class="mf-sub">Records one Cash Transaction (out) for the selected commissions.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Guide</span><span class="dl-value" id="payGuide"></span></div>
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value" id="payCabang"></span></div>
            <div class="dl-item"><span class="dl-label">Transactions</span><span class="dl-value" id="payCount"></span></div>
            <div class="dl-item"><span class="dl-label">Total to pay</span><span class="dl-value gr-pay-total" id="payTotal"></span></div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-receipt"></i>Payment</div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="payTanggal" class="form-label">Date</label>
              <input type="date" id="payTanggal" class="form-control">
            </div>
            <div class="col-md-8 mb-3">
              <label for="payKas" class="form-label">Paid from (Cash / Bank)</label>
              <select id="payKas" class="form-select"></select>
            </div>
          </div>
          <div class="mb-3">
            <label for="payBeban" class="form-label">Commission expense account</label>
            <select id="payBeban" class="form-select"></select>
          </div>
          <div class="mb-0">
            <label for="payDeskripsi" class="form-label">Description <span class="text-body-secondary">(optional)</span></label>
            <input type="text" id="payDeskripsi" class="form-control" maxlength="200" placeholder="Guide commission ...">
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="payConfirm"><i class="icon-base ti tabler-check icon-sm me-2"></i>Pay</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/reports/guide-report.js?v=<?= filemtime(__DIR__ . '/../../js/reports/guide-report.js') ?>" type="text/javascript"></script>
