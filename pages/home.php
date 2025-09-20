<div class="card mb-4">
  <div class="card-body">
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
      <div class="col-md-4 mb-0">
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
      <div class="col-md-4 mb-0">
        <label for="submit" class="form-label">&nbsp;</label>
        <button class="btn btn-primary w-100" id="goFilter">Submit Filter</button>
      </div>
    </div>
  </div>
</div>
<div class="row mb-4">
  <!-- Statistics -->
  <div class="col-md">
    <div class="card h-100">
      <div class="card-header d-flex justify-content-between">
        <h5 class="card-title mb-0">Statistics</h5> <small class="text-body-secondary">Updated Just Now</small>
      </div>
      <div class="card-body d-flex align-items-end">
        <div class="w-100">
          <div class="row gy-3">
            <div class="col-md-3 col-6">
              <div class="d-flex align-items-center">
                <div class="badge rounded bg-label-primary me-4 p-2"> <i
                    class="icon-base ti tabler-chart-pie-2 icon-lg"></i> </div>
                <div class="card-info">
                  <h5 class="mb-0" id="statOrder"></h5> <small>Orders</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="d-flex align-items-center">
                <div class="badge rounded bg-label-info me-4 p-2"> <i class="icon-base ti tabler-users icon-lg"></i>
                </div>
                <div class="card-info">
                  <h5 class="mb-0" id="statCustomer"></h5> <small>Customers</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="d-flex align-items-center">
                <div class="badge rounded bg-label-danger me-4 p-2"> <i
                    class="icon-base ti tabler-cash icon-lg"></i> </div>
                <div class="card-info">
                  <h5 class="mb-0" id="statForex"></h5> <small>Forex Available</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="d-flex align-items-center">
                <div class="badge rounded bg-label-success me-4 p-2"> <i
                    class="icon-base ti tabler-currency-dollar icon-lg"></i> </div>
                <div class="card-info">
                  <h5 class="mb-0" id="statTransaction">Rp. 975k</h5> <small>Transactions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card mb-4">
  <div class="card-body p-0">
    <div class="row row-bordered g-0">
      <div class="col position-relative p-6">
        <div class="card-header d-inline-block p-0 text-wrap position-absolute">
          <h5 class="m-0 card-title">Branchs Transaction Report</h5>
        </div>
        <div id="totalRevenueChart" class="mt-n1"></div>
      </div>
    </div>
  </div>
</div>

<!-- Forex Trend -->
<div class="row">
  <div class="col-md mb-4 mb-md-0">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title mb-0">
          <h5 class="mb-1">Forex Trend</h5>
          <p class="card-subtitle">Most Trending Forex Buying or Selling</p>
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
        <ul class="p-0 m-0" id="boxTrend">
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <img src="/assets/img/flags/us.png" class="rounded-circle fs-2" alt="">
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">USD - US Dollar</h6>
                </div>
                <small class="text-body">2 Transactions</small>
              </div>
              <div class="user-progress">
                <p class="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                  Rp. 181K
                </p>
              </div>
            </div>
          </li>
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <i class="fis fi fi-eu rounded-circle fs-2"></i>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">EUR</h6>
                </div>
                <small class="text-body">Euro</small>
              </div>
              <div class="user-progress">
                <p class="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                  1.200
                </p>
              </div>
            </div>
          </li>
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <i class="fis fi fi-in rounded-circle fs-2"></i>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">$865k</h6>
                </div>
                <small class="text-body">India</small>
              </div>
              <div class="user-progress">
                <p class="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                  <i class="icon-base ti tabler-chevron-up"></i>
                  12.4%
                </p>
              </div>
            </div>
          </li>
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <i class="fis fi fi-au rounded-circle fs-2"></i>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">$745k</h6>
                </div>
                <small class="text-body">Australia</small>
              </div>
              <div class="user-progress">
                <p class="text-danger fw-medium mb-0 d-flex align-items-center gap-1">
                  <i class="icon-base ti tabler-chevron-down"></i>
                  11.9%
                </p>
              </div>
            </div>
          </li>
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <i class="fis fi fi-sg rounded-circle fs-2"></i>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">SGD - Singapore Dollar</h6>
                </div>
                <small class="text-body">995k Transactions</small>
              </div>
              <div class="user-progress">
                <p class="text-danger fw-medium mb-0 d-flex align-items-center gap-1">
                  150 in stock
                </p>
              </div>
            </div>
          </li>
          <li class="d-flex align-items-center">
            <div class="avatar flex-shrink-0 me-4">
              <i class="fis fi fi-cn rounded-circle fs-2"></i>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">CNY - China Yuan</h6>
                </div>
                <small class="text-body">1.2M Transactions</small>
              </div>
              <div class="user-progress">
                <p class="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                  1.400 in stock
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="col-md">
    <div class="card h-100">
      <div class="card-header d-flex justify-content-between">
        <div class="card-title m-0">
          <h5 class="mb-1">Transactions Reports</h5>
          <p class="card-subtitle">Annually Transactions Overview</p>
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