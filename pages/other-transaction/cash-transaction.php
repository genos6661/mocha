<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<h5 class="mb-3">Cash Transaction</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-flex gap-2 mb-2 mb-md-0">
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base ti tabler-filter icon-20px"></i>
      </button>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Cash Transaction
      </button>
    </div>
    <div class="col-md d-flex justify-content-end">
      <div class="input-group input-group-merge filtertabel">
        <span class="input-group-text" id="basic-addon-search31"
          ><i class="icon-base ti tabler-search"></i></span>
        <input
          type="text"
          class="form-control"
          placeholder="Search..."
          aria-label="Search..."
          aria-describedby="basic-addon-search31" />
      </div>
    </div>
  </div>
  <div class="card-datatable table-responsive px-3">
    <table class="table table-bordered table-hover table-cards" id="tabelCash">
      <thead>
        <tr>
          <th></th>
          <th>Date / Number</th>
          <th>Type</th>
          <th>Name</th>
          <th>Branch</th>
          <th>Description</th>
          <th class="text-end">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Transaction : <span id="totalCash"></span></p>
      </div>
  </div>
</div>

<!-- modal filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Filter Cash Transaction</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <div class="mb-3">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select select2">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year (Default)</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="startDate" class="form-label">Date From</label>
            <input type="date" class="form-control" id="startDate">
          </div>
          <div class="col-md mb-3">
            <label for="endDate" class="form-label">Until</label>
            <input type="date" class="form-control" id="endDate">
          </div>
        </div>
        <div class="mb-3">
          <label for="cabangFilter" class="form-label">Branch</label>
          <select id="cabangFilter" class="form-select" multiple></select>
        </div>
        <div class="d-flex justify-content-end mb-0 gap-4">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="cashIn" checked>
            <label class="form-check-label" for="cashIn">Cash In</label>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="cashOut" checked>
            <label class="form-check-label" for="cashOut">Cash Out</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary me-0" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary me-0" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Apply</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash-banknote"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Cash Transaction Detail</h4>
          <p class="mf-sub">Cash or bank money in or out.</p>
        </div>
        <div class="mf-meta"><div id="dividenDet"></div><span class="mf-ref dataDetail" id="nomorDetail"></span></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value dataDetail" id="cabangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Date</span><span class="dl-value dataDetail" id="tanggalDetail"></span></div>
            <div class="dl-item"><span class="dl-label">From/To</span><span class="dl-value dataDetail" id="kontakDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Description</span><span class="dl-value dataDetail" id="deskripsiDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Cash/Bank Account</span><span class="dl-value dataDetail" id="kasDetail"></span></div>
            <div class="dl-item"><span class="dl-label">User Input</span><span class="dl-value dataDetail" id="userDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Items</div>
<div class="table-responsive" id="itemDetail">
          <table class="table table-borderless mf-table mf-detail-table" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Type</th>
                <th>Account</th>
                <th>Alias</th>
                <th>Note</th>
                <th class="text-end">Amount</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-outline-primary btn" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <!-- <a class="btn-outline-primary btn" target="_blank" id="reprintDetail">Reprint</a> -->
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formCashBaru" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash-banknote"></i></span>
        <div>
          <h4 class="mf-title">New Cash Transaction</h4>
          <p class="mf-sub">Record cash or bank money coming in or going out.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title">
            <i class="icon-base ti tabler-arrows-exchange"></i>Transaction type
            <div class="mf-tools">
              <div class="form-check form-switch mf-switch">
                <input type="checkbox" name="isDividen" id="dividen" class="form-check-input">
                <label class="form-check-label" for="dividen">Dividen</label>
              </div>
              <div class="btn-group mf-segment" role="group" aria-label="Cash direction">
                <input type="radio" class="btn-check" name="tipeTrans" id="in">
                <label class="btn btn-outline-success" for="in">Cash In</label>
                <input type="radio" class="btn-check" name="tipeTrans" id="out" checked>
                <label class="btn btn-outline-danger" for="out">Cash Out</label>
              </div>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General</div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="kontak" class="form-label">Contact</label>
              <select name="" id="kontak" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="tanggal" class="form-label">Date</label>
              <input type="date" id="tanggal" class="form-control" value="<?php echo date('Y-m-d'); ?>" />
            </div>
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="cabang" class="form-label">Branch</label>
              <select id="cabang" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="deskripsi" class="form-label">Description</label>
              <input type="text" id="deskripsi" class="form-control" placeholder="Input Description" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 mb-1">
              <label for="akunKas" class="form-label">Cash/Bank Account</label>
              <select name="" id="akunKas" class="form-select"></select>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title">
            <i class="icon-base ti tabler-list-details"></i>Details
            <div class="mf-tools">
              <button class="btn btn-primary" type="button" id="tambahBaris">
                <i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row
              </button>
            </div>
          </div>
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailBaru">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Account</th>
                  <th style="width: 30%; min-width: 200px;">Note</th>
                  <th class="text-end" style="width: 30%; min-width: 200px;">Amount</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <span class="mf-total-label">Total</span>
            <input type="text" class="form-control text-end" id="totalBaru" readonly>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmTambah" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save</button>
      </div>
    </form>
  </div>
</div>

<!-- modal edit -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formCashEdit" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash-banknote"></i></span>
        <div>
          <h4 class="mf-title">Edit Cash Transaction</h4>
          <p class="mf-sub">Change a cash or bank transaction.</p>
        </div>
        <span class="mf-ref" id="nomorEdit"></span>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEdit">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-arrows-exchange"></i>Transaction type
            <div class="mf-tools">
              <div class="form-check form-switch mf-switch">
                <input type="checkbox" name="isDividenEdit" id="dividenEdit" class="form-check-input">
                <label class="form-check-label" for="dividenEdit">Dividen</label>
              </div>
              <div class="btn-group mf-segment" role="group" aria-label="Cash direction">
                <input type="radio" class="btn-check" name="tipeTransEdit" id="inEdit">
                <label class="btn btn-outline-success" for="inEdit">Cash In</label>
                <input type="radio" class="btn-check" name="tipeTransEdit" id="outEdit" checked>
                <label class="btn btn-outline-danger" for="outEdit">Cash Out</label>
              </div>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="kontakEdit" class="form-label">Contact</label>
              <select id="kontakEdit" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="tanggalEdit" class="form-label">Date</label>
              <input type="date" id="tanggalEdit" class="form-control" value="<?php echo date('Y-m-d'); ?>" />
            </div>
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="cabangEdit" class="form-label">Branch</label>
              <select id="cabangEdit" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="deskripsiEdit" class="form-label">Description</label>
              <input type="text" id="deskripsiEdit" class="form-control" placeholder="Input Description" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="akunKasEdit" class="form-label">Cash/Bank Account</label>
              <select id="akunKasEdit" class="form-select"></select>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Details
          <div class="mf-tools">
            <button class="btn btn-primary" type="button" id="tambahBarisEdit"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row</button>
          </div>
          </div>
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailEdit">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Account</th>
                  <th style="width: 30%; min-width: 200px;">Note</th>
                  <th class="text-end" style="width: 30%; min-width: 180px;">Amount</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <div class="mf-total-group">
              <span class="mf-total-label">Total</span>
              <input type="text" class="form-control text-end" id="totalEdit" readonly>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmEdit" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save</button>
      </div>
    </form>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalJurnal" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Journal Voucher <span id="refJurnal"></span></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body table-responsive">
        <table class="table table-sm" id="tabelJurnal">
          <thead class="bg-light">
            <tr>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody></tbody>
          <!-- <tfoot class="bg-light">
            <tr>
              <th colspan="2">Total : </th>
              <th class="text-end" id="totalDebit"></th>
              <th class="text-end" id="totalKredit"></th>
            </tr>
          </tfoot> -->
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapus" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Cash Transaction</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete transaction <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapus" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/pages/cash-transaction.js" type="text/javascript"></script>