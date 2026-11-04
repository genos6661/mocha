<link rel="stylesheet" href="/assets/css/segmented.css?v=<?= filemtime(__DIR__ . '/../../assets/css/segmented.css') ?>" />
<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<h5 class="mb-3">Payable &amp; Receivable</h5>

<div class="row mb-3">
  <div class="col-md-6 mb-2 mb-md-0">
    <div class="card h-100"><div class="card-body">
      <small class="text-muted text-uppercase" id="labelTotal">Outstanding</small>
      <h4 class="mb-1" id="cardTotal">-</h4>
      <small class="text-muted" id="cardTotalNote"></small>
    </div></div>
  </div>
  <div class="col-md-6">
    <div class="card h-100"><div class="card-body">
      <small class="text-muted text-uppercase">Overdue</small>
      <h4 class="mb-1 text-danger" id="cardOverdue">-</h4>
      <small class="text-muted" id="cardOverdueNote"></small>
    </div></div>
  </div>
</div>
<p class="text-muted small mb-3 d-none" id="noteAntarCabang"></p>

<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-flex gap-2 mb-2 mb-md-0">
      <div class="seg" role="radiogroup" id="tabTipe" aria-label="Choose Receivable or Payable">
        <input type="radio" name="tipeDebt" id="tipeAR" value="AR" checked>
        <label for="tipeAR"><i class="icon-base ti tabler-trending-up"></i>Receivable/Piutang</label>
        <input type="radio" name="tipeDebt" id="tipeAP" value="AP">
        <label for="tipeAP"><i class="icon-base ti tabler-trending-down"></i>Payable/Hutang</label>
      </div>
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base ti tabler-filter icon-20px"></i>
      </button>
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" id="btnNew">
          <i class="icon-base ti tabler-plus icon-16px me-md-2"></i>New
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" data-act="new" data-href="/cash-transaction?debt=baru&tipe=AR" data-perm="add_cash">Receivable (Cash Transaction)</a></li>
          <li><a class="dropdown-item" data-act="new" data-href="/cash-transaction?debt=baru&tipe=AP" data-perm="add_cash">Payable (Cash Transaction)</a></li>
          <li><a class="dropdown-item" data-act="new" data-href="/adjustment?debt=baru" data-perm="add_adjustment">Foreign currency (Adjustment)</a></li>
          <li><a class="dropdown-item" data-act="new" data-href="/forex-transfer?debt=baru" data-perm="add_transfer">Inter-branch (Forex Transfer)</a></li>
        </ul>
      </div>
    </div>
    <div class="col-md d-flex justify-content-end">
      <div class="input-group input-group-merge filtertabel">
        <span class="input-group-text"><i class="icon-base ti tabler-search"></i></span>
        <input type="text" class="form-control" id="searchDebt" placeholder="Search document, contact or branch..." aria-label="Search" />
      </div>
    </div>
  </div>
  <div class="table-responsive px-3">
    <table class="table table-hover" id="tabelDebt">
      <thead>
        <tr>
          <th>Document</th>
          <th>Party</th>
          <th>Due</th>
          <th>Currency</th>
          <th class="text-end">Amount</th>
          <th class="text-end">Remaining</th>
          <th class="text-end">Remaining (Rp)</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3 pb-3">
    <div class="col-md"><span class="text-muted" id="infoDebt"></span></div>
    <div class="col-md text-md-end"><button class="btn btn-outline-primary d-none" type="button" id="btnMore">Load more</button></div>
  </div>
</div>

<!-- modal filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Filter Payable &amp; Receivable</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <div class="mb-3">
          <label for="statusFilter" class="form-label">Status</label>
          <select id="statusFilter" class="form-select">
            <option value="open">Open</option>
            <option value="overdue">Overdue</option>
            <option value="settled">Settled</option>
            <option value="all">All</option>
          </select>
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
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" class="btn btn-primary" id="sbmFilter">Apply</button>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-receipt-2"></i></span>
        <div>
          <h4 class="mf-title" id="detailTitle">Payable / Receivable</h4>
          <p class="mf-sub">Balance and settlement history.</p>
        </div>
        <div class="mf-meta"><span class="mf-ref" id="detailNomor"></span><div id="detailBadge"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Party</span><span class="dl-value" id="dParty"></span></div>
            <div class="dl-item"><span class="dl-label">Branch</span><span class="dl-value" id="dCabang"></span></div>
            <div class="dl-item"><span class="dl-label">Date</span><span class="dl-value" id="dTanggal"></span></div>
            <div class="dl-item"><span class="dl-label">Due</span><span class="dl-value" id="dJatuhTempo"></span></div>
            <div class="dl-item"><span class="dl-label">Amount</span><span class="dl-value" id="dJumlah"></span></div>
            <div class="dl-item"><span class="dl-label">Remaining</span><span class="dl-value" id="dSisa"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Description</span><span class="dl-value" id="dDeskripsi"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-history"></i>Settlements</div>
          <div class="table-responsive">
            <table class="table table-borderless mf-table mf-detail-table" id="tabelBayar">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th class="text-end">Settled</th>
                  <th class="text-end">Rate</th>
                  <th class="text-end">Exchange Gain/Loss (Rp)</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <p class="text-muted small mb-0">To change or remove this document, edit its source transaction. Settled documents are locked until the settlement is removed.</p>
      </div>
      <div class="modal-footer flex-wrap" id="detailActions">
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/debt-form.js?v=<?= filemtime(__DIR__ . '/../../js/pages/debt-form.js') ?>" type="text/javascript"></script>
<script src="js/pages/debt.js?v=<?= filemtime(__DIR__ . '/../../js/pages/debt.js') ?>" type="text/javascript"></script>
