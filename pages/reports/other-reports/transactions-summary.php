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
          <a href="/other-reports">Other Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item active">Transactions Summary Report</li>
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
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">Transactions Details Report</p>
    <p class="h5 text-center text-secondary spectral mb-1">Laporan Rincian Transaksi</p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
    <p class="h6 text-center text-secondary national-park fst-italic d-none" id="pelanggan"></p>
  </div>
  <div class="card-body table-responsive" id="card-body">
    <table class="table table-bordered table-hover" id="tabelData">
      <thead>
        <tr>
          <th class="text-center align-middle p-2" style="width: 5%; border: 1px solid;">No</th>
          <th class="text-center align-middle p-2" style="width: 14%; border: 1px solid;">Date</th>
          <th class="text-center align-middle p-2" style="width: 8%; border: 1px solid;">Number</th>
          <th class="text-center align-middle p-2" style="width: 6%; border: 1px solid;">Type</th>
          <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Branch</th>
          <th class="text-center align-middle p-2" style="width: 20%; border: 1px solid;">Name</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">ID</th>
          <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Country</th>
          <th class="text-center align-middle p-2" style="width: 12%; border: 1px solid;">Amount (Rp)</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="card-footer pt-4">
    <p class="h5 px-3">Total Records : <span id="totalData"></span></p>
  </div>
</div>

<div class="btn-group mt-6" role="group" aria-label="First group">
  <button type="button" id="export-pdf" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" id="export-excel" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect" disabled><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect" disabled><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" id="print" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Transactions Summary Report</h5>
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
          <label for="pelangganFilter" class="form-label">Customer</label>
          <select id="pelangganFilter" class="form-select"></select>
        </div>
        <div class="d-flex justify-content-end mb-0 gap-4" id="boxTipeTrans">
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
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <h5 class="modal-title mb-1" id="backDropModalTitle">Transaction Detail</h5>
          <div class="d-flex align-items-center gap-2">
            <span class="dataDetail fw-medium" id="nomorDetail"></span>
            <span id="tipeDetail"></span>
          </div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2 mb-4">
          <div class="col-6 col-md-3">
            <div class="text-muted small">Date</div>
            <div class="dataDetail fw-medium" id="tanggalDetail"></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-muted small">Branch</div>
            <div class="dataDetail fw-medium" id="cabangDetail"></div>
          </div>
        </div>

        <div class="card bg-light-subtle border mb-4">
          <div class="card-body">
            <h6 class="d-flex align-items-center gap-1 mb-3">
              <i class="icon-base ti tabler-user-circle icon-lg"></i>
              Customer Information
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="text-muted small">Name</div>
                <div class="dataDetail fw-medium" id="pelangganDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Customer Code</div>
                <div class="dataDetail fw-medium" id="kodePelangganDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">ID Number</div>
                <div class="dataDetail fw-medium" id="idNumberDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Nationality</div>
                <div class="dataDetail fw-medium" id="negaraDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Occupation</div>
                <div class="dataDetail fw-medium" id="pekerjaanDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Phone</div>
                <div class="dataDetail fw-medium" id="teleponDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Email</div>
                <div class="dataDetail fw-medium" id="emailDetail"></div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Address</div>
                <div class="dataDetail fw-medium" id="alamatDetail"></div>
              </div>
            </div>
          </div>
        </div>

        <h6 class="mb-2">Forex Detail</h6>
        <div class="table-responsive" id="itemDetail">
          <table class="table table-sm table-bordered" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Forex</th>
                <th class="text-end">Amount</th>
                <th class="text-end">Rates</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between justify-content-md-end">
        <a href="#" class="btn btn-outline-secondary mx-1" type="button" id="editBtn">Edit</a>
        <button class="btn btn-danger mx-1 mb-2 mb-md-0" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1 mb-2 mb-md-0" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Transaction</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapusTransaksi">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete transaction <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
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

<script src="https://cdn.jsdelivr.net/npm/html2canvas-pro@2.3.3/dist/html2canvas-pro.min.js"></script>
<script src="js/reports/other-reports/transactions-summary.js" type="text/javascript"></script>