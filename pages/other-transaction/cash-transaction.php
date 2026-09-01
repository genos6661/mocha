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
    <table class="table table-bordered table-hover" id="tabelCash">
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Number</th>
          <th>Name</th>
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
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Cash Transaction Detail</h5>
        <div class="d-flex gap-2">
          <div id="dividenDet"></div>
          <p class="h5 dataDetail" id="nomorDetail"></p>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md">
            <ul class="list-unstyled mb-6">
              <li class="mb-2">
                <span class="h6 ">Branch :</span>
                <span class="dataDetail" id="cabangDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 ">Date :</span>
                <span class="dataDetail" id="tanggalDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 ">From/To :</span>
                <span class="dataDetail" id="kontakDetail"></span>
              </li>
            </ul>
          </div>
          <div class="col-md">
            <ul class="list-unstyled mb-6 text-end">
              <li class="mb-2">
                <span class="h6 ">Description :</span>
                <span class="dataDetail" id="deskripsiDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 ">Cash/Bank Account :</span>
                <span class="dataDetail" id="kasDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 ">User Input :</span>
                <span class="dataDetail" id="userDetail"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="table-responsive" id="itemDetail">
          <table class="table table-sm" id="tabelItemDetail">
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
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn mx-1" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <!-- <a class="btn-outline-primary btn mx-1" target="_blank" id="reprintDetail">Reprint</a> -->
        <button class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger mx-1" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <div class="row w-100">
          <div class="col-md-3">
            <h5 class="modal-title" id="backDropModalTitle">New Cash Transaction</h5>
          </div>
          <div class="col-md-9 d-flex justify-content-end">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="checkbox" name="isDividen" id="dividen" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Dividen</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="in" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Cash In</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="out" class="switch-input" checked>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Cash Out</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formCashBaru">
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
          <div class="col-md-8 mb-3">
            <label for="judul" class="form-label">Cash/Bank Account</label>
            <select name="" id="akunKas" class="form-select"></select>
          </div>
          <div class="col-md-4 mb-3 align-items-end d-grid">
            <button class="btn btn-outline-primary" type="button" id="tambahBaris">Add New Row</button>
          </div>
        </div>
        <div class="table-responsive nowrap">
          <table class="table table-borderless" id="detailBaru">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Account</th>
                <th style="width: 30%; min-width: 200px;">Note</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Amount</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th colspan="2">Total :</th>
                <th class="px-1 pt-2">
                  <input type="text" class="form-control text-end" id="totalBaru" readonly>
                </th>
                <th></th>
              </tr>
            </tfoot>
          </table>
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
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <div class="row w-100">
          <div class="col-md-4 d-flex gap-2">
            <h5 class="modal-title" id="backDropModalTitle">Edit Cash Transaction</h5>
            <p class="h5"><span id="nomorEdit"></span></p>
          </div>
          <div class="col-md-8 d-flex justify-content-end">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="checkbox" name="isDividenEdit" id="dividenEdit" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Dividen</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTransEdit" id="inEdit" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Cash In</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTransEdit" id="outEdit" class="switch-input" checked>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Cash Out</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formCashEdit">
        <input type="hidden" id="idEdit">
        <div class="row">
          <div class="col-md mb-3">
            <label for="kontakEdit" class="form-label">Contact</label>
            <select name="" id="kontakEdit" class="form-select"></select>
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
          <div class="col-md-8 mb-3">
            <label for="akunKasEdit" class="form-label">Cash/Bank Account</label>
            <select name="" id="akunKasEdit" class="form-select"></select>
          </div>
          <div class="col-md-4 mb-3 align-items-end d-grid">
            <button class="btn btn-outline-primary" type="button" id="tambahBarisEdit">Add New Row</button>
          </div>
        </div>
        <div class="table-responsive nowrap">
          <table class="table table-borderless" id="detailEdit">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Account</th>
                <th style="width: 30%; min-width: 200px;">Note</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Amount</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th colspan="2">Total :</th>
                <th class="px-1 pt-2">
                  <input type="text" class="form-control text-end" id="totalEdit" readonly>
                </th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEdit" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
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
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Cash Transaction</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
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

<script src="js/pages/cash-transaction.js" type="text/javascript"></script>