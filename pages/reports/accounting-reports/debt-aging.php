<link rel="stylesheet" href="/assets/css/segmented.css?v=<?= filemtime(__DIR__ . '/../../../assets/css/segmented.css') ?>" />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
<style>
  .dm-serif-text-regular { font-family: "DM Serif Text", serif; font-weight: 500; font-style: normal; }
  .national-park { font-family: "National Park", sans-serif; font-optical-sizing: auto; font-weight: 500; font-style: normal; }
  .spectral { font-family: "Spectral", serif; font-weight: 500; font-style: normal; }
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
        <li class="breadcrumb-item active">Payable &amp; Receivable Aging</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <div class="seg" role="radiogroup" id="tabTipe" aria-label="Choose Receivable or Payable">
        <input type="radio" name="tipeDebt" id="tipeAR" value="AR" checked>
        <label for="tipeAR"><i class="icon-base ti tabler-trending-up"></i>Receivable/Piutang</label>
        <input type="radio" name="tipeDebt" id="tipeAP" value="AP">
        <label for="tipeAP"><i class="icon-base ti tabler-trending-down"></i>Payable/Hutang</label>
      </div>
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header">
    <p class="h4 text-center mb-0 spectral" id="namaPT"></p>
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary" id="judul">Receivable Aging</p>
    <p class="h5 text-center text-secondary spectral mb-1" id="subjudul">Umur Piutang</p>
    <p class="h5 text-center mb-1 text-secondary national-park" id="asOf"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="infoFilter"></p>
  </div>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-bordered" id="tabelAging">
        <thead>
          <tr>
            <th>Party</th>
            <th class="text-end">Docs</th>
            <th class="text-end">Not Yet Due</th>
            <th class="text-end">1-30 Days</th>
            <th class="text-end">31-60 Days</th>
            <th class="text-end">61-90 Days</th>
            <th class="text-end">&gt; 90 Days</th>
            <th class="text-end">No Due Date</th>
            <th class="text-end">Total (Rp)</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
    </div>
    <div class="d-none mt-4" id="boxAntarCabang">
      <p class="fw-semibold mb-1">Inter-branch</p>
      <p class="text-muted small">Both sides of an inter-branch balance offset each other, so they are shown separately and are not included in the total above.</p>
      <div class="table-responsive">
        <table class="table table-bordered" id="tabelAntarCabang">
          <thead>
            <tr>
              <th>Branches</th>
              <th class="text-end">Docs</th>
              <th class="text-end">Not Yet Due</th>
              <th class="text-end">1-30 Days</th>
              <th class="text-end">31-60 Days</th>
              <th class="text-end">61-90 Days</th>
              <th class="text-end">&gt; 90 Days</th>
              <th class="text-end">No Due Date</th>
              <th class="text-end">Total (Rp)</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
    <p class="text-muted small mt-3 mb-0">Balances are valued in rupiah at the original rate of each document. The report reflects settlements up to the report date.</p>
  </div>
</div>

<div class="btn-group mt-6 export-actions" role="group" aria-label="Export">
  <button type="button" id="export-pdf" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" id="export-excel" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="print"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Payable &amp; Receivable Aging</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <div class="mb-3">
          <label for="tanggalFilter" class="form-label">As of Date</label>
          <input type="date" class="form-control" id="tanggalFilter" value="<?php echo date('Y-m-d'); ?>">
        </div>
        <div class="mb-3">
          <label for="cabangFilter" class="form-label">Branch</label>
          <select id="cabangFilter" class="form-select"></select>
        </div>
        <div class="mb-3">
          <label for="kontakFilter" class="form-label">Contact</label>
          <select id="kontakFilter" class="form-select"></select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/html2canvas-pro@2.3.3/dist/html2canvas-pro.min.js"></script>
<script src="js/reports/accounting-reports/debt-aging.js?v=<?= filemtime(__DIR__ . '/../../../js/reports/accounting-reports/debt-aging.js') ?>" type="text/javascript"></script>
