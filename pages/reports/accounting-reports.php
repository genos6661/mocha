<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />

<div class="settings-page rp-info">
  <a href="/reports" class="rl-back"><i class="icon-base ti tabler-arrow-left"></i>Reports</a>

  <div class="settings-head">
    <span class="settings-head-icon rl-head-icon"><i class="icon-base ti tabler-receipt-dollar"></i></span>
    <div>
      <h4 class="mb-1">Accounting Reports</h4>
      <p class="text-body-secondary mb-0">Ledger and transaction reports. Pick a report to set its filter and open it. <span class="rl-count">3 reports</span></p>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Ledger" data-range="month" data-url="/ledger">
        <span class="rl-icon rl-img"><img src="/assets/img/report/ledger.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">Ledger</h5>
          <p class="rl-desc">Buku Besar</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Transactions Summary" data-range="month" data-url="/transactions-summary">
        <span class="rl-icon"><i class="icon-base ti tabler-list-details"></i></span>
        <div class="rl-text">
          <h5 class="rl-title">Transactions Summary</h5>
          <p class="rl-desc">Summary reports to transaction</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Transactions Detail" data-range="month" data-url="/transactions-detail">
        <span class="rl-icon"><i class="icon-base ti tabler-file-invoice"></i></span>
        <div class="rl-text">
          <h5 class="rl-title">Transactions Detail</h5>
          <p class="rl-desc">Detail reports to transaction (per Valas)</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
  </div>
</div>

<script>
  // kartu laporan bisa dibuka dengan Enter / Spasi
  document.querySelectorAll('.rl-card').forEach(card => card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  }));
</script>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="filter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter"></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <input type="hidden" id="urlToGo">
        <div class="mb-3" id="boxSimpleRange">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month (Default)</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3" id="boxRange">
          <div class="row">
            <div class="col-md">
              <label for="startDate" class="form-label">Date From</label>
              <input type="date" class="form-control" id="startDate">
            </div>
            <div class="col-md">
              <label for="endDate" class="form-label">Until</label>
              <input type="date" class="form-control" id="endDate">
            </div>
          </div>
        </div>
        <div class="mb-3" id="boxCabang">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select"></select>
        </div>
        <div class="mb-3" id="boxAkun">
          <div class="row">
            <div class="col-md">
              <label for="akun_start" class="form-label">Account From</label>
              <select id="akun_start" class="form-select"></select>
            </div>
            <div class="col-md">
              <label for="akun_end" class="form-label">Until</label>
              <select id="akun_end" class="form-select"></select>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end mb-0 gap-4 d-none" id="boxTipeTrans">
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
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <!-- <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button> -->
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/reports/accounting-reports.js?v=<?= filemtime(__DIR__ . '/../../js/reports/accounting-reports.js') ?>" type="text/javascript"></script>
