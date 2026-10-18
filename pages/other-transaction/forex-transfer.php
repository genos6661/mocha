<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<h5 class="mb-3">Forex Transfer</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-flex gap-2 mb-2 mb-md-0">
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter" id="btnModalFilter">
        <i class="icon-base ti tabler-filter icon-20px"></i>
      </button>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Transfer
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
    <table class="table table-bordered table-hover table-cards" id="tabelTransfer">
      <thead>
        <tr>
          <th>No</th>
          <th>Date / Number</th>
          <th>User</th>
          <th>From &rarr; To</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Transfer : <span id="totalTransfer"></span></p>
      </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-transfer"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Transfer Detail</h4>
          <p class="mf-sub">Transfer of forex or rupiah between branches.</p>
        </div>
        <div class="mf-meta"><span class="mf-ref dataDetail" id="nomorDetail"></span><div id="tipeDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-info-circle"></i>Information</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">From</span><span class="dl-value dataDetail" id="fromDetail"></span></div>
            <div class="dl-item"><span class="dl-label">To</span><span class="dl-value dataDetail" id="toDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Date</span><span class="dl-value dataDetail" id="tanggalDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Description</span><span class="dl-value dataDetail" id="deskripsiDetail"></span></div>
            <div class="dl-item"><span class="dl-label">From Account</span><span class="dl-value dataDetail" id="akunFromDetail"></span></div>
            <div class="dl-item"><span class="dl-label">To Account</span><span class="dl-value dataDetail" id="akunToDetail"></span></div>
            <div class="dl-item"><span class="dl-label">User Input</span><span class="dl-value dataDetail" id="userDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Items</div>
<div class="table-responsive" id="itemDetail">
          <table class="table table-borderless mf-table mf-detail-table" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Forex</th>
                <th class="text-end">Qty</th>
                <th class="text-end">Rates</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-outline-primary btn" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <a class="btn-outline-primary btn" target="_blank" id="reprintDetail">Reprint</a>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Filter Transfer</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterTransfer">
        <div class="mb-3">
          <label for="rangeFilter" class="form-label">Simple Range</label>
          <select id="rangeFilter" class="form-select">
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
          <label for="cabangFromFilter" class="form-label">Branch From</label>
          <select id="cabangFromFilter" class="form-select"></select>
        </div>
        <div class="mb-3">
          <label for="cabangToFilter" class="form-label">Branch To</label>
          <select id="cabangToFilter" class="form-select"></select>
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

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formTransferBaru" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-transfer"></i></span>
        <div>
          <h4 class="mf-title">New Transfer</h4>
          <p class="mf-sub">Move forex or rupiah stock between branches.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-arrows-exchange"></i>Transfer type
            <div class="mf-tools">
            <div class="btn-group mf-segment" role="group" aria-label="Transfer type">
              <input type="radio" class="btn-check" name="tipeTrans" id="tipeBoth" value="tipeBoth" checked>
              <label class="btn btn-outline-primary" for="tipeBoth">Inter-branchs Transaction</label>
              <input type="radio" class="btn-check" name="tipeTrans" id="tipeForex" value="tipeForex">
              <label class="btn btn-outline-primary" for="tipeForex">Forex</label>
              <input type="radio" class="btn-check" name="tipeTrans" id="tipeRupiah" value="tipeRupiah">
              <label class="btn btn-outline-primary" for="tipeRupiah">Rupiah</label>
            </div>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-building-store"></i>Branches
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="from" class="form-label">From</label>
              <select id="from" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="to" class="form-label">To</label>
              <select id="to" class="form-select"></select>
            </div>
          </div>
          <div class="row d-none" id="boxAkunLawan">
            <div class="col-md mb-3">
              <label for="akunFrom" class="form-label">Account From</label>
              <select id="akunFrom" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="akunTo" class="form-label">Account To</label>
              <select id="akunTo" class="form-select"></select>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="tanggal" class="form-label">Date</label>
              <input type="date" id="tanggal" class="form-control" value="<?php echo date('Y-m-d'); ?>" />
            </div>
            <div class="col-md mb-3">
              <label for="deskripsi" class="form-label">Description</label>
              <input type="text" id="deskripsi" class="form-control" placeholder="Input Description (Optional)" />
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Transfer details
          <div class="mf-tools">
          <span id="boxNewRow">
            <button class="btn btn-primary" type="button" id="tambahBaris"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row</button>
          </span>
          </div>
          </div>
          <div class="row d-none mb-3" id="boxRupiah">
            <div class="col-md">
              <label for="valRupiah" class="form-label">Transfer Amount</label>
              <input type="text" class="form-control text-center" id="valRupiah">
            </div>
          </div>
          <div id="boxTabelDetail">
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailBaru">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Forex</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Amount</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Rate</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Subtotal</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <div class="mf-total-group">
              <span class="mf-total-label">Total Amount</span>
              <input type="text" class="form-control text-end" id="totalAmount" readonly>
            </div>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Subtotal</span>
              <input type="text" class="form-control text-end" id="totalSub" readonly>
            </div>
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
    <form class="modal-content mf-modal" id="formAdjustmentEdit" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-transfer"></i></span>
        <div>
          <h4 class="mf-title">Edit Transfer</h4>
          <p class="mf-sub">Change a forex or rupiah transfer between branches. The transfer type cannot be changed.</p>
        </div>
        <span class="mf-ref" id="nomorEdit"></span>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEdit">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-arrows-exchange"></i>Transfer type
            <div class="mf-tools">
            <div class="btn-group mf-segment mf-readonly" role="group" aria-label="Transfer type">
              <input type="radio" class="btn-check" name="tipeTransEdit" id="tipeBothEdit" value="tipeBoth">
              <label class="btn btn-outline-primary" for="tipeBothEdit">Inter-branchs Transaction</label>
              <input type="radio" class="btn-check" name="tipeTransEdit" id="tipeForexEdit" value="tipeForex">
              <label class="btn btn-outline-primary" for="tipeForexEdit">Forex</label>
              <input type="radio" class="btn-check" name="tipeTransEdit" id="tipeRupiahEdit" value="tipeRupiah">
              <label class="btn btn-outline-primary" for="tipeRupiahEdit">Rupiah</label>
            </div>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-building-store"></i>Branches
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="fromEdit" class="form-label">From</label>
              <select id="fromEdit" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="toEdit" class="form-label">To</label>
              <select id="toEdit" class="form-select"></select>
            </div>
          </div>
          <div class="row" id="boxAkunLawanEdit">
            <div class="col-md mb-3">
              <label for="akunFromEdit" class="form-label">Account From</label>
              <select id="akunFromEdit" class="form-select"></select>
            </div>
            <div class="col-md mb-3">
              <label for="akunToEdit" class="form-label">Account To</label>
              <select id="akunToEdit" class="form-select"></select>
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-description"></i>General
          </div>
          <div class="row">
            <div class="col-md mb-3">
              <label for="tanggalEdit" class="form-label">Date</label>
              <input type="date" id="tanggalEdit" class="form-control" />
            </div>
            <div class="col-md mb-3">
              <label for="deskripsiEdit" class="form-label">Description</label>
              <input type="text" id="deskripsiEdit" class="form-control" placeholder="Input Description (Optional)" />
            </div>
          </div>
        </div>

        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Transfer details
          <div class="mf-tools">
          <span id="boxNewRowEdit">
            <button class="btn btn-primary" type="button" id="tambahBarisEdit"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add New Row</button>
          </span>
          </div>
          </div>
          <div class="row d-none mb-3" id="boxRupiahEdit">
            <div class="col-md">
              <label for="valRupiahEdit" class="form-label">Transfer Amount</label>
              <input type="text" class="form-control text-center" id="valRupiahEdit">
            </div>
          </div>
          <div id="boxDetailEdit">
          <div class="table-responsive nowrap">
            <table class="table table-borderless table-stack mf-table" id="detailEdit">
              <thead>
                <tr>
                  <th style="width: 30%; min-width: 200px;">Forex</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Amount</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Rate</th>
                  <th class="text-end" style="width: 20%; min-width: 160px;">Subtotal</th>
                  <th style="width: 10%"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mf-total">
            <div class="mf-total-group">
              <span class="mf-total-label">Total Amount</span>
              <input type="text" class="form-control text-end" id="totalAmountEdit" readonly>
            </div>
            <div class="mf-total-group">
              <span class="mf-total-label">Total Subtotal</span>
              <input type="text" class="form-control text-end" id="totalSubEdit" readonly>
            </div>
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
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Transfer</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete transfer <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapus" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
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
              <th class="text-end">Debit</th>
              <th class="text-end">Credit</th>
              <th class="text-center">Branch</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/pages/forex-transfer.js" type="text/javascript"></script>