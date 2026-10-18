<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../assets/css/modal-form.css') ?>" />

<h5 class="mb-3">Forex Data</h5>
<div class="card">
  <div class="row p-3 align-items-start">
    <div class="col-md-2 d-grid mb-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Forex
      </button>
    </div>
    <div class="col-md-2 d-grid mb-2">
      <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalRate" id="btnModalRate">
        Update Rates
      </button>
    </div>
    <div class="col-md-3 d-grid mb-2">
      <select id="filterCabang" class="form-select"></select>
    </div>
    <div class="col-md-3 d-flex align-items-start mb-2 dt-sort-host" id="sortHost"></div>
    <div class="col-md filtertabel">
        <input
          type="text"
          class="form-control"
          placeholder="Search..."
          aria-label="Search..." />
    </div>
  </div>
  <div class="card-datatable table-responsive px-3">
    <table class="table table-bordered table-hover table-cards" id="tabelForex">
      <thead>
        <tr>
          <th></th>
          <th>Name / Code</th>
          <th>Buy Rate</th>
          <th>Sell Rate</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Forex Data : <span id="totalForex"></span></p>
      </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">New Forex Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formValasBaru">
        <div class="row">
          <div class="col mb-3">
            <label for="kode" class="form-label">Code</label>
            <input
              type="text"
              id="kode"
              class="form-control"
              placeholder="Input Forex Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="nama" class="form-label">Name</label>
            <input
              type="text"
              id="nama"
              class="form-control"
              placeholder="Input Forex Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="jual" class="form-label">Sell Rate</label>
            <div class="input-group">
              <input type="text" id="jual" class="form-control" placeholder="Input Sale Rate" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="beli" class="form-label">Buy Rate</label>
            <div class="input-group">
              <input type="text" id="beli" class="form-control" placeholder="Input Buy Rate" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmTambah" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal edit -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Edit Forex Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formEditPajak">
        <input type="hidden" id="idEdit">
        <div class="row">
          <div class="col mb-3">
            <label for="kodeEdit" class="form-label">Code</label>
            <input
              type="text"
              id="kodeEdit"
              class="form-control"
              placeholder="Input Forex Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaEdit" class="form-label">Name</label>
            <input
              type="text"
              id="namaEdit"
              class="form-control"
              placeholder="Input Forex Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="jualEdit" class="form-label">Sell Rate</label>
            <div class="input-group">
              <input type="text" id="jualEdit" class="form-control" placeholder="Input Sale Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="beliEdit" class="form-label">Buy Rate</label>
            <div class="input-group">
              <input type="text" id="beliEdit" class="form-control" placeholder="Input Buy Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="aktif">
              <label class="form-check-label" for="aktif">Aktif</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEdit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapusKelompok" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Forex Data</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete forex <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
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
        <span class="mf-icon"><i class="icon-base ti tabler-currency-dollar"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Forex Detail</h4>
          <p class="mf-sub">Forex code and its current buy and sell rate.</p>
        </div>
        <div class="mf-meta"><div id="statusDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Code</span><span class="dl-value dataDetail" id="kodeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Name</span><span class="dl-value dataDetail" id="namaDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Buy Rate</span><span class="dl-value dataDetail" id="beliDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Sell Rate</span><span class="dl-value dataDetail" id="jualDetail"></span></div>
          </div>
        </div>
      </div>

      <div class="modal-footer ">
        <button class="btn-outline-primary btn d-none" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none" id="deactivateBtn">Deactivate</button>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalRate" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-currency-dollar"></i></span>
        <div>
          <h4 class="mf-title">Update Rates</h4>
          <p class="mf-sub">Set the buy and sell rate of each forex, for all branches or a single branch.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-toolbar">
          <div class="mf-branch">
            <select id="cabang" class="form-select"></select>
          </div>
          <div class="input-group input-group-merge mf-search">
            <span class="input-group-text"><i class="icon-base ti tabler-search"></i></span>
            <input type="text" class="form-control" id="searchRate" placeholder="Search...">
          </div>
          <div id="boxResetRateCabang">
            <div class="form-check form-switch mf-switch">
              <input class="form-check-input" type="checkbox" id="resetRateCabang" checked>
              <label class="form-check-label" for="resetRateCabang">Reset Branch's Rate</label>
            </div>
          </div>
        </div>

        <div class="mf-scroll">
          <table class="table table-borderless mf-table mf-rate" id="tabelRate">
            <thead>
              <tr>
                <th class="ps-3">Forex</th>
                <th class="text-end" style="width: 30%;">Buy Rate</th>
                <th class="text-end" style="width: 30%;">Sell Rate</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline-primary" id="resetBtn"><i class="icon-base ti tabler-refresh icon-sm me-2"></i>Reset</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button class="btn btn-primary" id="sbmRate"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Submit</button>
      </div>
    </div>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/pages/forex.js" type="text/javascript"></script>