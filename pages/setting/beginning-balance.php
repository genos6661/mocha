<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<link rel="stylesheet" href="/assets/css/beginning-balance.css?v=<?= filemtime(__DIR__ . '/../../assets/css/beginning-balance.css') ?>" />

<div class="settings-page">
  <div class="settings-head">
    <span class="settings-head-icon"><i class="icon-base ti tabler-scale"></i></span>
    <div>
      <h4 class="mb-1">Beginning Balance</h4>
      <p class="text-body-secondary mb-0">Set the opening balance of your accounts and foreign currency stock for each branch.</p>
    </div>
  </div>

  <div class="nav-align-top">
    <ul class="nav nav-pills settings-tabs flex-column flex-sm-row mb-6 gap-md-0 gap-2">
      <li class="nav-item">
        <button
          id="btnTabGeneral"
          type="button"
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#account-tab"
          aria-controls="account-tab"
          role="tab"
          aria-selected="true">
          <i class="icon-base ti tabler-receipt-dollar icon-sm me-1_5"></i> Accounts
        </button>
      </li>
      <li class="nav-item">
        <button
          id="btnTabCD"
          type="button"
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#forex-tab"
          aria-controls="forex-tab"
          role="tab"
          aria-selected="false">
          <i class="icon-base ti tabler-cash icon-sm me-1_5"></i> Forexs
        </button>
      </li>
    </ul>
  </div>

  <div class="tab-content p-0">
    <!-- ~~~~~~~~~~~~~~~~~~~~~ accounts ~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="card settings-card tab-pane fade active show" id="account-tab" role="tabpanel">
      <div class="card-body pb-0">
        <div class="settings-section-title mb-3 pb-3 flex-wrap gap-3">
          <span class="d-flex align-items-center gap-3"><span class="settings-section-icon"><i class="icon-base ti tabler-receipt-dollar"></i></span>Accounts Initial Balance</span>
        </div>
        <p class="settings-hint"><i class="icon-base ti tabler-info-circle"></i><span>Choose a branch to enter its balances. Total <strong>Debit</strong> and <strong>Credit</strong> must be equal before you submit.</span></p>
        <div class="bb-toolbar">
          <div class="bb-branch">
            <select id="filterCabang" class="form-select"></select>
          </div>
          <div class="dt-sort-host bb-sort d-flex align-items-center" id="sortHostAkun"></div>
          <div class="input-group input-group-merge filtertabelAkun bb-search">
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
        <table class="table table-bordered table-hover table-cards bb-acc" id="tabelAkun">
          <thead>
            <tr>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="bb-summary">
        <div class="bb-total">
          <span class="bb-total-label">Total Debit</span>
          <span class="bb-total-value" id="totalDebit">0</span>
        </div>
        <div class="bb-total">
          <span class="bb-total-label">Total Credit</span>
          <span class="bb-total-value" id="totalKredit">0</span>
        </div>
        <div class="bb-note" id="footerNote"></div>
      </div>
      <div class="settings-actions">
        <button class="btn btn-primary" id="sbmAkun" disabled><i class="icon-base ti tabler-device-floppy me-2"></i>Submit Changes</button>
      </div>
    </div>

    <!-- ~~~~~~~~~~~~~~~~~~~~~ forex ~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="card settings-card tab-pane fade" id="forex-tab" role="tabpanel">
      <div class="card-body pb-0">
        <div class="settings-section-title mb-3 pb-3 flex-wrap gap-3">
          <span class="d-flex align-items-center gap-3"><span class="settings-section-icon"><i class="icon-base ti tabler-cash"></i></span>Forexs Initial Balance</span>
          <button class="btn btn-primary nowrap" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
            <i class="icon-base ti tabler-plus icon-16px me-md-2"></i><span class="d-md-inline-block d-none">Add New</span>
          </button>
        </div>
        <div class="bb-toolbar">
          <div class="dt-sort-host bb-sort d-flex align-items-center" id="sortHostValas"></div>
          <div class="input-group input-group-merge filtertabel bb-search">
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
        <table class="table table-bordered table-hover table-cards bb-fx" id="tabelValas">
          <thead>
            <tr>
              <th>Forex</th>
              <th>Branch</th>
              <th>Rates</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="bb-summary">
        <div class="bb-total">
          <span class="bb-total-label">Total (Rp)</span>
          <span class="bb-total-value" id="totalRupiahValas">Rp 0</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog  modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formIBBaru" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">New Initial Balance</h4>
          <p class="mf-sub">Set the opening stock and rate of a forex in a branch.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-cash"></i>Initial balance</div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="cabang" class="form-label">Branch</label>
              <select id="cabang" class="form-select"></select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="valas" class="form-label">Forex</label>
              <select id="valas" class="form-select"></select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="stok" class="form-label">Balance</label>
              <input type="text" id="stok" class="form-control" placeholder="Input Balance" min="0" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="rate" class="form-label">Rate</label>
              <div class="input-group">
                <input type="text" id="rate" class="form-control" placeholder="Input Rate" min="0" />
                <span class="input-group-text">Rupiah</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmTambahForex" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
      </div>
    </form>
  </div>
</div>

<!-- modal edit -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog  modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formEditIB" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-cash"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Edit Initial Balance</h4>
          <p class="mf-sub">Change the opening stock and rate of a forex in a branch.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEdit">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-cash"></i>Initial balance</div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="cabangEdit" class="form-label">Branch</label>
              <select id="cabangEdit" class="form-select"></select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="valasEdit" class="form-label">Forex</label>
              <select id="valasEdit" class="form-select"></select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="stokEdit" class="form-label">Balance</label>
              <input type="text" id="stokEdit" class="form-control" placeholder="Input Balance" min="0" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="rateEdit" class="form-label">Rate</label>
              <div class="input-group">
                <input type="text" id="rateEdit" class="form-control" placeholder="Input Rate" min="0" />
                <span class="input-group-text">Rupiah</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmEditForex" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
      </div>
    </form>
  </div>
</div>

<!-- modal hapus forex -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapus" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Forex Beginning Balance</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete beginning balance <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapus" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog  modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-scale"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Initial Balance Detail</h4>
          <p class="mf-sub">Opening forex stock and rate in a branch.</p>
        </div>
        <div class="mf-meta"><div id="statusDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value dataDetail" id="cabangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Code</span><span class="dl-value dataDetail" id="kodeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Name</span><span class="dl-value dataDetail" id="namaDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Rate</span><span class="dl-value dataDetail" id="rateDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Stock</span><span class="dl-value dataDetail" id="stokDetail"></span></div>
          </div>
        </div>
      </div>

      <div class="modal-footer ">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/setting/beginning-balance.js?v=<?= filemtime(__DIR__ . '/../../js/setting/beginning-balance.js') ?>" type="text/javascript"></script>