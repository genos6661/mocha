<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<h5 class="mb-3">Manual Journal</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-md-flex d-grid gap-2 mb-2 mb-md-0">
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base ti tabler-filter icon-20px"></i>
      </button>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Journal
      </button>
    </div>
    <div class="col-md d-flex justify-content-end">
      <div class="input-group input-group-merge filtertabel">
        <span class="input-group-text" id="basic-addon-search31"
          ><i class="icon-base ti tabler-search"></i
        ></span>
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
    <table class="table table-bordered table-hover table-cards" id="tabelJurnal">
      <thead>
        <tr>
          <th>No</th>
          <th>Date / Number</th>
          <th>User</th>
          <th>Branch</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Journal : <span id="totalJurnal"></span></p>
      </div>
  </div>
</div>

<!-- modal filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Filter Journal</h5>
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
        <span class="mf-icon"><i class="icon-base ti tabler-notebook"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Journal Detail</h4>
          <p class="mf-sub">Manual journal entry and its account lines.</p>
        </div>
        <div class="mf-meta"><span class="mf-ref dataDetail" id="nomorDetail"></span><div id="tipeDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value dataDetail" id="cabangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Date</span><span class="dl-value dataDetail" id="tanggalDetail"></span></div>
            <div class="dl-item"><span class="dl-label">User Input</span><span class="dl-value dataDetail" id="userDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Description</span><span class="dl-value dataDetail" id="deskripsiDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Items</div>
<div class="table-responsive" id="itemDetail">
          <table class="table table-borderless mf-table mf-detail-table" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Account</th>
                <th>Alias</th>
                <th class="text-end">Debit</th>
                <th class="text-end">Credit</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <!-- <button class="btn-outline-primary btn d-none" id="processBtn" data-bs-toggle="modal" data-bs-target="#modalProses">Process</button> -->
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
    <form class="modal-content mf-modal" id="formAdjustmentBaru" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-notebook"></i></span>
        <div>
          <h4 class="mf-title">New Journal</h4>
          <p class="mf-sub">Record a manual journal entry. Total debit and credit must balance.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="cabang" class="form-label">Branch</label>
              <select id="cabang" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="tanggal" class="form-label">Date</label>
              <input type="date" id="tanggal" class="form-control" value="<?php echo date('Y-m-d'); ?>" />
            </div>
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="deskripsi" class="form-label">Description</label>
              <input type="text" id="deskripsi" class="form-control" placeholder="Input Description (Optional)" />
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Journal details
          <div class="mf-tools">
            <button class="btn btn-primary" type="button" id="tambahBaris"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row</button>
          </div>
          </div>
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailBaru">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Account</th>
                  <th class="text-end" style="width: 30%; min-width: 180px;">Debit</th>
                  <th class="text-end" style="width: 30%; min-width: 180px;">Credit</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <span class="mf-note" id="noteBaru"></span>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Debit</span>
              <input type="text" class="form-control text-end" id="totalDebit" readonly>
            </div>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Credit</span>
              <input type="text" class="form-control text-end" id="totalKredit" readonly>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmTambah" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
      </div>
    </form>
  </div>
</div>

<!-- modal edit -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formEditJurnal" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-notebook"></i></span>
        <div>
          <h4 class="mf-title">Edit Journal</h4>
          <p class="mf-sub">Change the manual journal entry. Total debit and credit must balance.</p>
        </div>
        <span class="mf-ref" id="nomorEdit"></span>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEdit">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="cabangEdit" class="form-label">Branch</label>
              <select id="cabangEdit" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="tanggalEdit" class="form-label">Date</label>
              <input type="date" id="tanggalEdit" class="form-control" />
            </div>
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="deskripsiEdit" class="form-label">Description</label>
              <input type="text" id="deskripsiEdit" class="form-control" placeholder="Input Description (Optional)" />
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Journal details
          <div class="mf-tools">
            <button class="btn btn-primary" type="button" id="tambahBarisEdit"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row</button>
          </div>
          </div>
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailEdit">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Account</th>
                  <th class="text-end" style="width: 30%; min-width: 180px;">Debit</th>
                  <th class="text-end" style="width: 30%; min-width: 180px;">Credit</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <span class="mf-note" id="noteEdit"></span>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Debit</span>
              <input type="text" class="form-control text-end" id="totalDebitEdit" readonly>
            </div>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Credit</span>
              <input type="text" class="form-control text-end" id="totalKreditEdit" readonly>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmEdit" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
      </div>
    </form>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapus" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Journal</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete journal <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
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
<script src="js/pages/journal.js" type="text/javascript"></script>