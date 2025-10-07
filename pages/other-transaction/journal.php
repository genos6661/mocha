<h5 class="mb-3">Manual Journal</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-md-flex d-grid mb-2 mb-md-0">
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
    <table class="table table-bordered table-hover" id="tabelJurnal">
      <thead>
        <tr>
          <th>No</th>
          <th>Date</th>
          <th>Number</th>
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

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Journal Detail</h5>
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
        <ul class="list-unstyled mb-6">
          <li class="mb-2">
            <span class="h6 me-1">Branch :</span>
            <span class="dataDetail" id="cabangDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Date :</span>
            <span class="dataDetail" id="tanggalDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">User Input :</span>
            <span class="dataDetail" id="userDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Description :</span>
            <span class="dataDetail" id="deskripsiDetail"></span>
          </li>
        </ul>
        <div class="table-responsive" id="itemDetail">
          <table class="table table-sm" id="tabelItemDetail">
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
      <div class="modal-footer d-flex justify-content-end">
        <!-- <button class="btn-outline-primary btn d-none mx-1" id="processBtn" data-bs-toggle="modal" data-bs-target="#modalProses">Process</button> -->
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
          <div class="col">
            <h5 class="modal-title" id="backDropModalTitle">New Journal</h5>
          </div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formAdjustmentBaru">
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
        <div class="row">
          <div class="col-md d-flex py-2">
            <p class="h6">Detail Adjustment</p>
          </div>
          <div class="col-md d-flex py-2 justify-content-end">
            <button class="btn btn-outline-primary" type="button" id="tambahBaris">Add New Row</button>
          </div>
        </div>
        <div class="table-responsive nowrap">
          <table class="table table-borderless" id="detailBaru">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Account</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Debit</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Credit</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th>Total :</th>
                <th class="px-1 pt-2"><input type="text" class="form-control text-end" id="totalDebit" readonly></th>
                <th class="px-1 pt-2"><input type="text" class="form-control text-end" id="totalKredit" readonly></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between">
        <p class="h6 text-danger"><span id="noteBaru"></span></p>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" id="sbmTambah" class="btn btn-primary px-5">Submit</button>
        </div>
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
            <h5 class="modal-title" id="backDropModalTitle">Edit Journal</h5>
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
        <form id="formEditJurnal">
        <input type="hidden" id="idEdit">
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
        <div class="row">
          <div class="col-md d-flex py-2">
            <p class="h6">Detail Adjustment</p>
          </div>
          <div class="col-md d-flex py-2 justify-content-end">
            <button class="btn btn-outline-primary" type="button" id="tambahBarisEdit">Add New Row</button>
          </div>
        </div>
        <div class="table-responsive nowrap">
          <table class="table table-borderless" id="detailEdit">
            <thead>
              <tr class="border-top border-bottom">
                <th style="width: 30%; min-width: 200px;">Account</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Debit</th>
                <th class="text-end" style="width: 30%; min-width: 200px;">Credit</th>
                <th style="width: 10%"></th>
              </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
              <tr>
                <th>Total :</th>
                <th class="px-1 pt-2"><input type="text" class="form-control text-end" id="totalDebitEdit" readonly></th>
                <th class="px-1 pt-2"><input type="text" class="form-control text-end" id="totalKreditEdit" readonly></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between">
        <p class="h6 text-danger"><span id="noteEdit"></span></p>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" id="sbmEdit" class="btn btn-primary px-5">Submit</button>
        </div>
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
        <h5 class="modal-title" id="backDropModalTitle">Delete Journal</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete journal <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/journal.js" type="text/javascript"></script>