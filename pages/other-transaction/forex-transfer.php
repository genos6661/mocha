<h5 class="mb-3">Forex Transfer</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-flex mb-2 mb-md-0">
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
    <table class="table table-bordered table-hover" id="tabelTransfer">
      <thead>
        <tr>
          <th>No</th>
          <th>Date</th>
          <th>Number</th>
          <th>User</th>
          <th>From</th>
          <th>To</th>
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
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Transfer Detail</h5>
        <div class="d-flex gap-2">
          <p class="h5 dataDetail" id="nomorDetail"></p>
          <div id="tipeDetail" class=""></div>
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
                <span class="h6 me-1">From :</span>
                <span class="dataDetail" id="fromDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">To :</span>
                <span class="dataDetail" id="toDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Date :</span>
                <span class="dataDetail" id="tanggalDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Description :</span>
                <span class="dataDetail" id="deskripsiDetail"></span>
              </li>
            </ul>
          </div>
          <div class="col-md">
            <ul class="list-unstyled mb-6 text-end">
              <li class="mb-2">
                <span class="h6 me-1">From Account :</span>
                <span class="dataDetail" id="akunFromDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">To Account :</span>
                <span class="dataDetail" id="akunToDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">User Input :</span>
                <span class="dataDetail" id="userDetail"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="table-responsive" id="itemDetail">
          <table class="table table-sm" id="tabelItemDetail">
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
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn mx-1" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <a class="btn-outline-primary btn mx-1" target="_blank" id="reprintDetail">Reprint</a>
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
          <div class="col-md">
            <h5 class="modal-title" id="backDropModalTitle">New Transfer</h5>
          </div>
          <div class="col-md d-flex justify-content-end g-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="tipeForex" value="tipeForex" class="switch-input" checked>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Forex</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="tipeRupiah" value="tipeRupiah" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Rupiah</span>
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
        <form id="formTransferBaru">
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
        <div class="row">
          <div class="col-md mb-3">
            <label for="akunFrom" class="form-label">Account From</label>
            <select id="akunFrom" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="akunTo" class="form-label">Account To</label>
            <select id="akunTo" class="form-select"></select>
          </div>
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
        <p class="h6">Detail Transfer</p>
        <div class="row d-none mb-4" id="boxRupiah">
          <div class="col-md">
            <label for="valRupiah" class="form-label">Transfer Amount</label>
            <input type="number" class="form-control text-center" id="valRupiah">
          </div>
        </div>
        <div class="table-responsive nowrap" id="boxTabelDetail">
          <table class="table table-borderless" id="detailBaru">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Forex</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Amount</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Rate</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Subtotal</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th>Total :</th>
                <th class="px-1 pt-2"><input type="number" class="form-control text-end" id="totalAmount" readonly></th>
                <th></th>
                <th class="px-1 pt-2"><input type="number" class="form-control text-end" id="totalSub" readonly></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="row" id="boxNewRow">
          <div class="col-md d-flex justify-content-end">
            <button class="btn btn-outline-primary" type="button" id="tambahBaris">Add New Row</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmTambah" class="btn btn-primary px-5">Submit</button>
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
          <div class="col d-flex justify-content-between">
            <h5 class="modal-title" id="backDropModalTitle">Edit Transfer</h5>
            <p class="h5" id="nomorEdit"></p>
          </div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col d-flex justify-content-end g-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTransEdit" id="tipeForexEdit" value="tipeForex" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Forex</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTransEdit" id="tipeRupiahEdit" value="tipeRupiah" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Rupiah</span>
              </label>
            </div>
          </div>
        </div>
        <form id="formAdjustmentEdit">
          <input type="hidden" id="idEdit">
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
        <div class="row">
          <div class="col-md mb-3">
            <label for="akunFromEdit" class="form-label">Account From</label>
            <select id="akunFromEdit" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="akunToEdit" class="form-label">Account To</label>
            <select id="akunToEdit" class="form-select"></select>
          </div>
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
        <p class="h6">Detail Transfer</p>
        <div class="row d-none mb-4" id="boxRupiahEdit">
          <div class="col-md">
            <label for="valRupiahEdit" class="form-label">Transfer Amount</label>
            <input type="number" class="form-control text-center" id="valRupiahEdit">
          </div>
        </div>
        <div class="table-responsive nowrap" id="boxDetailEdit">
          <table class="table table-borderless" id="detailEdit">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Forex</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Amount</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Rate</th>
                <th class="text-end" style="width: 20%; min-width: 200px;">Subtotal</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th>Total :</th>
                <th class="px-1 pt-2"><input type="number" class="form-control text-end" id="totalAmountEdit" readonly></th>
                <th></th>
                <th class="px-1 pt-2"><input type="number" class="form-control text-end" id="totalSubEdit" readonly></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="row" id="boxNewRowEdit">
          <div class="col-md d-flex justify-content-end">
            <button class="btn btn-outline-primary" type="button" id="tambahBarisEdit">Add New Row</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEdit" class="btn btn-primary px-5">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Adjustment</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete adjustment <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
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

<script src="js/pages/forex-transfer.js" type="text/javascript"></script>