<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />

<div class="settings-page">
  <div class="settings-head">
    <span class="settings-head-icon"><i class="icon-base ti tabler-report-analytics"></i></span>
    <div>
      <h4 class="mb-1">Reports</h4>
      <p class="text-body-secondary mb-0">Choose a report category to see the reports inside it.</p>
    </div>
  </div>

  <div class="row g-4" id="sortable-cards">
    <div class="col-xl-4 col-md-6 col-12">
      <a href="/bi-reports" class="rp-card rp-success">
        <div class="rp-top">
          <span class="rp-icon"><i class="icon-base ti tabler-building-bank"></i></span>
          <span class="rp-count">6 reports</span>
        </div>
        <h5 class="rp-title">BI Reports</h5>
        <div class="rp-chips">
          <span>Summary Forex</span><span>Summary Forex Advance</span><span>LKUB</span><span>LKPE</span><span>Balance Sheet</span><span>Profit &amp; Loss</span>
        </div>
        <span class="rp-open">Open<i class="icon-base ti tabler-arrow-right"></i></span>
      </a>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <a href="/accounting-reports" class="rp-card rp-info">
        <div class="rp-top">
          <span class="rp-icon"><i class="icon-base ti tabler-receipt-dollar"></i></span>
          <span class="rp-count">1 report</span>
        </div>
        <h5 class="rp-title">Accounting Reports</h5>
        <div class="rp-chips">
          <span>Ledger</span>
        </div>
        <span class="rp-open">Open<i class="icon-base ti tabler-arrow-right"></i></span>
      </a>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <a href="/master-data-reports" class="rp-card rp-danger">
        <div class="rp-top">
          <span class="rp-icon"><i class="icon-base ti tabler-layout-dashboard"></i></span>
          <span class="rp-count">3 reports</span>
        </div>
        <h5 class="rp-title">Data Master Reports</h5>
        <div class="rp-chips">
          <span>Customer Data</span><span>Employee Data</span><span>Partner Data</span>
        </div>
        <span class="rp-open">Open<i class="icon-base ti tabler-arrow-right"></i></span>
      </a>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <a href="/other-reports" class="rp-card rp-warning">
        <div class="rp-top">
          <span class="rp-icon"><i class="icon-base ti tabler-chart-infographic"></i></span>
          <span class="rp-count">3 reports</span>
        </div>
        <h5 class="rp-title">Other Reports</h5>
        <div class="rp-chips">
          <span>Transactions Summary</span><span>Transactions Detail</span><span>Logs Report</span>
        </div>
        <span class="rp-open">Open<i class="icon-base ti tabler-arrow-right"></i></span>
      </a>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <a href="/other-features" class="rp-card rp-primary">
        <div class="rp-top">
          <span class="rp-icon"><i class="icon-base ti tabler-device-desktop-star"></i></span>
          <span class="rp-count">DTTOT &amp; PPATK</span>
        </div>
        <h5 class="rp-title">Other Features</h5>
        <div class="rp-chips">
          <span>DTTOT Identification</span><span>DTTOT List</span><span>Threshold Transaction Report</span>
        </div>
        <span class="rp-open">Open<i class="icon-base ti tabler-arrow-right"></i></span>
      </a>
    </div>
  </div>
</div>
