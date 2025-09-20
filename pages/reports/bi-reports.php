<nav aria-label="breadcrumb">
  <ol class="breadcrumb breadcrumb-custom-icon">
    <li class="breadcrumb-item">
      <a href="/reports">Reports</a>
      <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
    </li>
    <li class="breadcrumb-item active">BI Reports</li>
  </ol>
</nav>

<div class="row row-cols-md-3 row-cols-1 justify-content-center">
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Summary Valas" data-range="month" data-url="/summary-valas">
      <!-- <div class="avatar">
        <div class="avatar-initial bg-primary rounded">
          <i class="icon-base ti tabler-building-bank icon-xl"></i>
        </div>
      </div> -->
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/sv.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0 text-black">Summary Forex</h5>
        <span class="text-dark">Ringkasan Mutasi Per Valas</span>
      </div>
    </div>
  </div>
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="LKUB" data-range="month" data-url="/lkub">
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/LKUB.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0 text-black">LKUB</h5>
        <span class="text-dark">Laporan Kegiatan Usaha Bulanan</span>
      </div>
    </div>
  </div>
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Neraca" data-range="today" data-url="/neraca">
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/neraca.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0 text-black">Balance Sheet</h5>
        <span class="text-dark">Laporan Neraca (BI)</span>
      </div>
    </div>
  </div>
</div>

<div class="row row-cols-md-3 row-cols-1 justify-content-center">
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="LKPE" data-range="year" data-url="/lkpe">
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/lkpe.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0 text-black">LKPE</h5>
        <span class="text-dark">Laporan Keuangan Perubahan Ekuitas</span>
      </div>
    </div>
  </div>
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 bg-white p-4 cursor-pointer" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Laba Rugi" data-range="month" data-url="/laba-rugi">
      <div class="avatar avatar-lg">
        <img src="/assets/img/report/labarugi.png" alt="Avatar" class="rounded">
      </div>
      <div>
        <h5 class="mb-0 text-black">Profit & Loss</h5>
        <span class="text-dark">Laporan Keuangan Laba/Rugi</span>
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
        <div class="mb-3">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxUser">
          <label for="userInput" class="form-label">User Input</label>
          <select id="userInput" class="form-select"></select>
        </div>
        <div class="mb-3" id="boxShowing">
          <label for="showOption" class="form-label">Displayed Option</label>
          <select id="showOption" class="form-select">
            <option value="1" selected>Show All Forexs</option>
            <option value="2">Only Show Forexs with balance</option>
            <option value="3">Only Show Forexs with mutation</option>
          </select>
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

<script src="js/reports/bi-reports.js" type="text/javascript"></script>