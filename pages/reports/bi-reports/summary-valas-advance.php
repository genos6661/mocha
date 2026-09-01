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

  /* Summary Valas Advance: visual hierarchy so 14 dense numeric columns
     are easier to scan without changing any computed values or colors.
     Column positions are fixed by the table structure (1=currency,
     2-4=beginning balance, 5-7=buying, 8=middle rate, 9-11=selling,
     12-14=balance), so styling is done purely via nth-child. Extra
     padding/line-height gives the rows breathing room instead of relying
     on background tinting. */
  #tabelData tbody td, #tabelData thead th {
    padding-top: 0.65rem !important;
    padding-bottom: 0.65rem !important;
    padding-left: 0.6rem !important;
    padding-right: 0.6rem !important;
  }
  #tabelData tbody tr {
    line-height: 1.6;
  }
  /* Forex (valas) amount is the headline figure per group */
  #tabelData tbody td:nth-child(2), #tabelData tbody td:nth-child(5),
  #tabelData tbody td:nth-child(9), #tabelData tbody td:nth-child(12) {
    font-weight: 600;
  }
  /* Rate and Rupiah are supporting figures — smaller */
  #tabelData tbody td:nth-child(3), #tabelData tbody td:nth-child(4),
  #tabelData tbody td:nth-child(6), #tabelData tbody td:nth-child(7),
  #tabelData tbody td:nth-child(10), #tabelData tbody td:nth-child(11),
  #tabelData tbody td:nth-child(13), #tabelData tbody td:nth-child(14) {
    font-size: 0.8125rem;
  }
  #tabelData tbody td:nth-child(8) {
    font-weight: 600;
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
        <li class="breadcrumb-item active">Summary Valas Advance</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card py-0 px-6" id="boxSticky">
  <div class="card-body p-0 table-responsive">
    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th class="text-center align-middle py-2 px-1" rowspan="2" style="width: 8%; border: 1px solid;">CURRENCY</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BEGINNING BALANCE</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BUYING BANK NOTES</th>
          <th class="text-center align-middle py-2 px-1" rowspan="2" style="width: 8%; border: 1px solid;">MIDDLE RATE</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">SELLING BANK NOTES</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BALANCE</th>
        </tr>
        <tr>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
        </tr>
      </thead>
    </table>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header border-bottom">
    <p class="h4 text-center mb-0 spectral" id="namaPT"></p>
    <p class="h2 text-center mb-1 dm-serif-text-regular text-primary">Summary Valas Advance</p>
    <p class="h5 text-center mb-1 text-secondary national-park" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
    <p class="h6 text-center text-secondary national-park fst-italic d-none" id="user"></p>
  </div>
  <div class="card-body table-responsive" id="card-body">
    <table class="table table-bordered" id="tabelData">
      <thead class="table-dark">
        <tr>
          <th class="text-center align-middle py-2 px-1" rowspan="2" style="width: 8%; border: 1px solid;">CURRENCY</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BEGINNING BALANCE</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BUYING BANK NOTES</th>
          <th class="text-center align-middle py-2 px-1" rowspan="2" style="width: 8%; border: 1px solid;">MIDDLE RATE</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">SELLING BANK NOTES</th>
          <th class="text-center align-middle py-2 px-1" colspan="3" style="width: 21%; border: 1px solid;">BALANCE</th>
        </tr>
        <tr>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Forex</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rate</th>
          <th class="text-center align-middle py-2 px-1" style="width: 7%; border: 1px solid;">Rupiah</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

<!-- <div class="card p-4 mt-6">
  <div class="row">
    <div class="col-md-4 d-flex gap-3 align-items-middle">
      <p class="h5">Export</p> -->
      <div class="btn-group mt-6" role="group" aria-label="First group">
        <button type="button" class="btn btn-outline-primary waves-effect" id="export-pdf"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
        <button type="button" class="btn btn-outline-primary waves-effect" id="export-excel"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
        <button type="button" class="btn btn-outline-primary waves-effect" id="export-csv"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
        <button type="button" class="btn btn-outline-primary waves-effect" disabled><i class="icon-base ti tabler-file-text"></i>TXT</button>
        <button type="button" class="btn btn-outline-primary waves-effect" id="print"><i class="icon-base ti tabler-printer"></i>Print</button>
      </div>
  <!--   </div>
  </div>
</div> -->

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Summary Valas Advance</h5>
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
            <option value="all">All Time</option>
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
        <div class="mb-3" id="boxUser">
          <label for="userInputFilter" class="form-label">User Input</label>
          <select id="userInputFilter" class="form-select"></select>
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

<script src="https://cdn.jsdelivr.net/npm/html2canvas-pro@2.3.3/dist/html2canvas-pro.min.js"></script>
<script src="js/reports/bi-reports/summary-valas-advance.js" type="text/javascript"></script>