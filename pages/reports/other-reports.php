<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />

<div class="settings-page rp-warning">
  <a href="/reports" class="rl-back"><i class="icon-base ti tabler-arrow-left"></i>Reports</a>

  <div class="settings-head">
    <span class="settings-head-icon rl-head-icon"><i class="icon-base ti tabler-chart-infographic"></i></span>
    <div>
      <h4 class="mb-1">Other Reports</h4>
      <p class="text-body-secondary mb-0">Transaction summaries and activity logs. Pick a report to set its filter and open it. <span class="rl-count">3 reports</span></p>
    </div>
  </div>

  <div class="row g-4">
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
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Logs Reports" data-range="all" data-url="/logs-report">
        <span class="rl-icon"><i class="icon-base ti tabler-report"></i></span>
        <div class="rl-text">
          <h5 class="rl-title">Logs Report</h5>
          <p class="rl-desc">Logging report for audit trail</p>
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
        <div class="mb-3 d-none" id="boxSimpleRange">
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
        <div class="mb-3 d-none" id="boxSimpleDate">
          <label for="simpleDate" class="form-label">Simple Date</label>
          <select id="simpleDate" class="form-select">
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxRange">
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
        <div class="mb-3 d-none" id="boxSingleDate">
          <label for="singleDate" class="form-label">Date</label>
          <input type="date" class="form-control" id="singleDate">
        </div>
        <div class="mb-3 d-none" id="boxCabang">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxCabang">
          <label for="pelanggan" class="form-label">Customer</label>
          <select id="pelanggan" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxTipeLog">
          <label for="tipeLog" class="form-label">Type</label>
          <select id="tipeLog" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxAktivitasLog">
          <label for="aktivitasLog" class="form-label">Activity</label>
          <select id="aktivitasLog" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxEmailLog">
          <label for="emailLog" class="form-label">Email</label>
          <select id="emailLog" class="form-select"></select>
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

<script src="js/reports/other-reports.js" type="text/javascript"></script>