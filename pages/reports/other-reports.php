<nav aria-label="breadcrumb">
  <ol class="breadcrumb breadcrumb-custom-icon">
    <li class="breadcrumb-item">
      <a href="/reports">Reports</a>
      <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
    </li>
    <li class="breadcrumb-item active">Other Reports</li>
  </ol>
</nav>

<div class="row row-cols-md-3 row-cols-1 justify-content-center">
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Logs Reports" data-range="all" data-url="/logs-report">
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/logs.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0">Logs Report</h5>
        <span>Logging report for audit trail</span>
      </div>
    </div>
  </div>
</div>

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