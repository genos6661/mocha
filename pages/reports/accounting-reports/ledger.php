<link rel="stylesheet" href="/assets/css/ledger.css?v=<?= filemtime(__DIR__ . '/../../../assets/css/ledger.css') ?>" />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
<style>
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
          <a href="/accounting-reports">Accounting Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item active">Ledger</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header lg-hero">
    <div class="lg-hero-main">
      <span class="lg-hero-icon"><i class="icon-base ti tabler-book-2"></i></span>
      <div>
        <p class="lg-hero-company" id="namaPT"></p>
        <h2 class="lg-hero-title text-primary mb-0">Ledger</h2>
        <p class="lg-hero-sub mb-0">Laporan Buku Besar</p>
      </div>
    </div>
    <div class="lg-hero-meta">
      <span class="lg-chip"><i class="icon-base ti tabler-calendar-event"></i><span id="range"></span></span>
      <span class="lg-chip d-none" id="chipCabang"><i class="icon-base ti tabler-building-store"></i><span id="cabang"></span></span>
      <span class="lg-chip d-none" id="chipUser"><i class="icon-base ti tabler-user"></i><span id="user"></span></span>
      <span class="lg-chip d-none" id="chipAkun"><i class="icon-base ti tabler-list-details"></i><span id="jmlAkun"></span></span>
    </div>
  </div>
  <div class="card-body" id="card-body">
    <div class="lg-loading">Loading ledger...</div>
  </div>
</div>

<div class="btn-group mt-6 export-actions" role="group" aria-label="First group">
  <button type="button" id="export-pdf" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" id="export-excel" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect disabled"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect disabled"><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="print"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Ledger</h5>
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
        <div class="mb-3" id="boxAkun">
          <div class="row">
            <div class="col-md">
              <label for="akun_startFilter" class="form-label">Account From</label>
              <select id="akun_startFilter" class="form-select"></select>
            </div>
            <div class="col-md">
              <label for="akun_endFilter" class="form-label">Until</label>
              <select id="akun_endFilter" class="form-select"></select>
            </div>
          </div>
        </div>
        <!-- <div class="mb-3">
          <label for="showOptionFilter" class="form-label">Displayed Option</label>
          <select id="showOptionFilter" class="form-select">
            <option value="1" selected>Show All Forexs</option>
            <option value="2">Only Show Forexs with balance</option>
            <option value="3">Only Show Forexs with mutation</option>
          </select>
        </div> -->
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

<script src="https://cdn.jsdelivr.net/npm/html2canvas-pro@2.3.3/dist/html2canvas-pro.min.js"></script>
<script src="js/export/ledger-pdf.js?v=<?= filemtime(__DIR__ . '/../../../js/export/ledger-pdf.js') ?>" type="text/javascript"></script>
<script src="js/reports/accounting-reports/ledger.js" type="text/javascript"></script>