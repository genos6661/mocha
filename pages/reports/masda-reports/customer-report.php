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

  #card-body {
    max-height: 75vh;
    overflow-y: auto; 
  }

  #tabelData thead th {
    position: sticky;
    top: 0;
    background: var(--bs-primary); 
    color: #fff;
    z-index: 2;
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
          <a href="/master-data-reports">Master Data Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item active">Customer Report</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <input type="text" class="form-control bg-white" id="searchLog" placeholder="Search something ...">
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header">
    <p class="h4 text-center mb-0 spectral" id="namaPT"></p>
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">Customer Report</p>
    <p class="h5 text-center text-secondary spectral mb-1">Laporan data pelanggan</p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
    <p class="h6 text-center text-secondary national-park fst-italic d-none" id="email"></p>
  </div>
  <div class="card-body table-responsive" id="card-body">
    <table class="table table-bordered table-hover" id="tabelData">
      <thead>
        <tr>
          <th class="text-center align-middle p-2" style="width: 5%; border: 1px solid;">No</th>
          <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Name</th>
          <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Country</th>
          <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Occupation</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Phone</th>
          <th class="text-center align-middle p-2" style="width: 16%; border: 1px solid;">Address</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Total Transaction</th>
          <th class="text-center align-middle p-2" style="width: 14%; border: 1px solid;">Total Amount</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="card-footer pt-4">
    <p class="h5 px-3">Total Records : <span id="totalCustomer"></span></p>
  </div>
</div>

<div class="btn-group mt-6" role="group" aria-label="First group">
  <button type="button" id="export-pdf" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Customer Report</h5>
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
          <label for="negara" class="form-label">Country</label>
          <select id="negara" class="form-select"></select>
        </div>
        <div class="mb-3">
          <label for="sort_by" class="form-label">Sort By</label>
          <select id="sort_by" class="form-select">
            <option value="nama">Name</option>
            <option value="nama_int_negara">Country</option>
            <option value="total_transaksi">Transactions Count</option>
            <option value="nilai_transaksi">Transactions Value</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="sort_dir" class="form-label">Sort Direction</label>
          <select id="sort_dir" class="form-select">
            <option value="asc">Ascending (ASC)</option>
            <option value="desc">Descending (DESC)</option>
          </select>
        </div>
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

<div class="modal fade animate__animated animate__fadeInUp" id="modalProgress" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-sm modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal" id="closeModalProgress"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p class="h4 text-center">Fetching data</p>
        <div class="progress w-100" style="height:15px;">
          <div class="progress-bar bg-primary" id="exportProgress" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</div>

<script src="js/reports/masda-reports/customer-report.js" type="text/javascript"></script>