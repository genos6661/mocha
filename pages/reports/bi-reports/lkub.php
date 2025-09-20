<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
<style>
  #boxSticky {
    display: none;
    position: sticky;
    left: 0;
    top: 118px;
    z-index: 1000;
    width: 100%;
    box-shadow: none;
  }

  @media (max-width: 1199px) {
    #boxSticky {
      top: 55px;
    }
  }

  .dm-serif-text-regular {
    font-family: "DM Serif Text", serif;
    font-weight: 500;
    font-style: normal;
  }

  .national-park {
    font-family: "National Park", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
  }

  .instrument-serif {
    font-family: "Instrument Serif", serif;
    font-weight: 500;
    font-style: normal;
  }

  .spectral {
    font-family: "Spectral", serif;
    font-weight: 500;
    font-style: normal;
  }
</style>

<div class="row mb-2">
  <div class="col-md">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb breadcrumb-custom-icon">
        <li class="breadcrumb-item">
          <a href="/reports">Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item">
          <a href="/bi-reports">BI Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item active">LKUB</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card py-0 px-6" id="boxSticky">
  <div class="card-body p-0 table-responsive">
    <table class="table table-bordered" id="tabelData">
      <thead class="table-dark">
        <tr>
          <th class="text-center align-middle p-2" style="width: 3%; border: 1px solid;">No</th>
          <th class="text-center align-middle p-2" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle p-2" style="width: 5%; border: 1px solid;">Type</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Bg. Balance</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Bg. Balance (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Buy</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Buy (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Sell</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Sell (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Balance</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Middle Rate</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Balance (Rp)</th>
        </tr>
      </thead>
    </table>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header">
    <p class="h4 text-center mb-0 spectral" id="namaPT"></p>
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">LKUB</p>
    <p class="h5 text-center text-secondary spectral mb-1">Laporan Kegiatan Usaha Bulanan</p>
    <p class="h5 text-center mb-1 text-secondary national-park" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
    <p class="h6 text-center text-secondary national-park fst-italic d-none" id="user"></p>
  </div>
  <div class="card-body table-responsive" id="card-body">
    <table class="table table-bordered" id="tabelData">
      <thead class="table-dark">
        <tr>
          <th class="text-center align-middle p-2" style="width: 3%; border: 1px solid;">No</th>
          <th class="text-center align-middle p-2" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle p-2" style="width: 5%; border: 1px solid;">Type</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Bg. Balance</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Bg. Balance (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Buy</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Buy (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Sell</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Sell (Rp)</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Balance</th>
          <th class="text-center align-middle p-2" style="width: 9%; border: 1px solid;">Middle Rate</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Balance (Rp)</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

<div class="btn-group mt-6" role="group" aria-label="First group">
  <button type="button" class="btn btn-outline-primary waves-effect" id="export-pdf"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="export-excel"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="export-csv"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="eksporTXT"><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">LKUB</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <input type="hidden" id="urlToGo">
        <div class="mb-3">
          <label for="rangeFilter" class="form-label">Simple Range</label>
          <select id="rangeFilter" class="form-select">
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
        <div class="mb-3">
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
        <div class="mb-3">
          <label for="cabangFilter" class="form-label">Branch</label>
          <select id="cabangFilter" class="form-select"></select>
        </div>
        <div class="mb-3">
          <label for="showOptionFilter" class="form-label">Displayed Option</label>
          <select id="showOptionFilter" class="form-select">
            <option value="1" selected>Show All Forexs</option>
            <option value="2">Only Show Forexs with balance</option>
            <option value="3">Only Show Forexs with mutation</option>
          </select>
        </div>
        <!-- <div class="d-flex justify-content-end mb-0">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="includeClosed">
            <label class="form-check-label" for="includeClosed">Include Closed</label>
          </div>
        </div> -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/reports/bi-reports/lkub.js" type="text/javascript"></script>