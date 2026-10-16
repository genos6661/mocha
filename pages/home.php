<link rel="stylesheet" href="/assets/css/dashboard.css?v=<?= filemtime(__DIR__ . '/../assets/css/dashboard.css') ?>" />

<div class="text-center d-none" id="boxMisc">
  <div class="misc-wrapper">
    <!-- <h1 class="mb-2 mx-2" style="line-height: 6rem;font-size: 6rem;">401</h1> -->
    <h4 class="mb-1 mx-2">You are not authorized! 🔐</h4>
    <p class="mb-2 mx-2">You don’t have permission to access dashboard</p>
    <!-- <a href="index.html" class="btn btn-primary waves-effect waves-light">Back to home</a> -->
    <div class="mt-2">
      <img src="../../assets/img/illustrations/page-misc-you-are-not-authorized.png" alt="page-misc-not-authorized" width="170" class="img-fluid">
    </div>
  </div>
</div>

<!-- Hero + filter -->
<div class="dash-hero mb-6" id="boxFilter">
  <div class="dash-hero-top">
    <div>
      <div class="dash-hello">Welcome back,</div>
      <h3 class="dash-name" id="dashName">Dashboard</h3>
      <div class="dash-sub"><i class="icon-base ti tabler-calendar"></i><span id="dashDate"></span></div>
    </div>
    <span class="dash-hero-icon"><i class="icon-base ti tabler-chart-line"></i></span>
  </div>
  <div class="dash-filter">
    <div class="row">
      <div class="col-md mb-3">
        <label for="cabang" class="form-label">Branch</label>
        <select id="cabang" class="form-select"></select>
      </div>
      <div class="col-md mb-3">
        <label for="startDate" class="form-label">Start Date</label>
        <input type="date" class="form-control" id="startDate">
      </div>
      <div class="col-md mb-3">
        <label for="endDate" class="form-label">End Date</label>
        <input type="date" class="form-control" id="endDate">
      </div>
    </div>
    <div class="row justify-content-md-between">
      <div class="col-md-4 mb-3">
        <label for="range" class="form-label">Simple Range</label>
        <select id="range" class="form-select">
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
      <div class="col-md-4 mb-3">
        <label for="submit" class="form-label">&nbsp;</label>
        <button class="btn btn-primary w-100" id="goFilter"><i class="icon-base ti tabler-filter me-2"></i>Submit Filter</button>
      </div>
    </div>
  </div>
</div>

<!-- Statistics -->
<div class="row g-4 mb-6" id="boxStatistic">
  <div class="col-12">
    <div class="dash-section-head">
      <h5>Statistics</h5> <small class="text-body-secondary">Updated Just Now</small>
    </div>
  </div>
  <div class="col-6 col-xl-3">
    <div class="dash-kpi dash-kpi-primary">
      <span class="dash-kpi-icon"><i class="icon-base ti tabler-chart-pie-2"></i></span>
      <div>
        <div class="dash-kpi-value" id="statOrder"></div>
        <div class="dash-kpi-label">Orders</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-xl-3">
    <div class="dash-kpi dash-kpi-info">
      <span class="dash-kpi-icon"><i class="icon-base ti tabler-users"></i></span>
      <div>
        <div class="dash-kpi-value" id="statCustomer"></div>
        <div class="dash-kpi-label">Customers</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-xl-3">
    <div class="dash-kpi dash-kpi-danger">
      <span class="dash-kpi-icon"><i class="icon-base ti tabler-cash"></i></span>
      <div>
        <div class="dash-kpi-value" id="statForex"></div>
        <div class="dash-kpi-label">Buying Transactions</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-xl-3">
    <div class="dash-kpi dash-kpi-success">
      <span class="dash-kpi-icon"><i class="icon-base ti tabler-currency-dollar"></i></span>
      <div>
        <div class="dash-kpi-value" id="statTransaction"></div>
        <div class="dash-kpi-label">Selling Transactions</div>
      </div>
    </div>
  </div>
</div>

<!-- Branchs Transaction Report -->
<div class="card dash-card mb-6" id="boxBTR">
  <div class="card-body p-0">
    <div class="row row-bordered g-0">
      <div class="col position-relative p-6">
        <div class="card-header d-inline-block p-0 text-wrap position-absolute">
          <div class="dash-card-head">
            <span class="dash-card-icon"><i class="icon-base ti tabler-building-store"></i></span>
            <h5 class="m-0 card-title">Branchs Transaction Report</h5>
          </div>
        </div>
        <div id="totalRevenueChart" class="mt-n1"></div>
      </div>
    </div>
  </div>
</div>

<!-- Forex Trend -->
<div class="row" id="boxForexTrend">
  <div class="col-md mb-4 mb-md-0">
    <div class="card dash-card">
      <div class="card-header d-flex justify-content-between">
        <div class="dash-card-head">
          <span class="dash-card-icon"><i class="icon-base ti tabler-trending-up"></i></span>
          <div class="card-title mb-0">
            <h5 class="mb-1">Forex Trend</h5>
            <p class="card-subtitle">Most Trending Forex Buying or Selling</p>
          </div>
        </div>
        <div class="dropdown">
          <button
            class="btn btn-text-secondary btn-icon rounded-pill text-body-secondary border-0 me-n1"
            type="button"
            id="salesByCountry"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <i class="icon-base ti tabler-dots-vertical icon-22px text-body-secondary"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="salesByCountry">
            <a class="dropdown-item" href="javascript:void(0);">Download</a>
            <a class="dropdown-item" href="javascript:void(0);">Refresh</a>
            <a class="dropdown-item" href="javascript:void(0);">Share</a>
          </div>
        </div>
      </div>
      <div class="card-body">
        <ul class="p-0 m-0" id="boxTrend"></ul>
      </div>
    </div>
  </div>
  <div class="col-md">
    <div class="card dash-card h-100">
      <div class="card-header d-flex justify-content-between">
        <div class="dash-card-head">
          <span class="dash-card-icon"><i class="icon-base ti tabler-chart-bar"></i></span>
          <div class="card-title m-0">
            <h5 class="mb-1">Transactions Reports</h5>
            <p class="card-subtitle">Annually Transactions Overview</p>
          </div>
        </div>
        <div class="dropdown">
          <button
            class="btn btn-text-secondary rounded-pill text-body-secondary border-0 p-2 me-n1"
            type="button"
            id="earningReportsTabsId"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <i class="icon-base ti tabler-dots-vertical icon-md text-body-secondary"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="earningReportsTabsId">
            <a class="dropdown-item" href="javascript:void(0);">View More</a>
            <a class="dropdown-item" href="javascript:void(0);">Delete</a>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col mb-1">
            <select id="cabangTR" class="form-select"></select>
          </div>
          <div class="col mb-1">
            <input type="number" id="tahunTR" step="1" class="form-control" placeholder="Choose Year" value="<?php echo date('Y'); ?>">
          </div>
        </div>
        <div class="tab-content p-0 ms-0 ms-sm-2">
          <div class="tab-pane fade" id="navs-orders-id" role="tabpanel">
            <div id="earningReportsTabsOrders"></div>
          </div>
          <div class="tab-pane fade" id="navs-sales-id" role="tabpanel">
            <div id="earningReportsTabsSales"></div>
          </div>
          <div class="tab-pane fade show active" id="navs-profit-id" role="tabpanel">
            <div id="earningReportsTabsProfit"></div>
          </div>
          <div class="tab-pane fade" id="navs-income-id" role="tabpanel">
            <div id="earningReportsTabsIncome"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="/assets/vendor/libs/apex-charts/apexcharts.js"></script>
<script src="js/pages/home.js" type="text/javascript"></script>
