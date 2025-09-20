<div class="nav-align-top">
  <ul class="nav nav-pills flex-column flex-sm-row mb-6 gap-md-0 gap-2">
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
        aria-selected="true">
        <i class="icon-base ti tabler-cash icon-sm me-1_5"></i> Forexs
      </button>
    </li>
  </ul>
</div>

<div class="tab-content p-0">
  <!-- ~~~~~~~~~~~~~~~~~~~~~ accounts ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade active show" id="account-tab" role="tabpanel">
    <div class="card-header p-2">
      <div class="row px-3">
        <div class="col-md">
          <h5 class="card-title">Accounts Initial Balance</h5>
        </div>
        <div class="col-md mb-2 mb-md-0">
          <select id="filterCabang" class="form-select"></select>
        </div>
        <div class="col-md">
          <div class="input-group input-group-merge filtertabelAkun">
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
    </div>
    <div class="card-body p-2 table-responsive">
      <table class="table table-hover table-bordered dt-responsive" id="tabelAkun">
        <thead>
          <tr>
            <!-- <th>Branch</th> -->
            <th>Code</th>
            <th>Name</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <th>Total :</th>
            <th id="footerNote"></th>
            <th>
              <input type="number" class="form-control text-end" id="totalDebit" readonly>
            </th>
            <th>
              <input type="number" class="form-control text-end" id="totalKredit" readonly>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button class="btn btn-primary" id="sbmAkun" disabled>Submit Changes</button>
    </div>
  </div>
  <!-- ~~~~~~~~~~~~~~~~~~~~~ forex ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade" id="forex-tab" role="tabpanel">
    <div class="card-header p-2">
      <div class="row px-3">
        <div class="col-md-5 p-0">
          <h5 class="card-title">Forexs Initial Balance</h5>
        </div>
        <div class="col-md-7 d-flex  gap-2">
          <button class="btn btn-primary nowrap" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
            <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i><span class="d-md-inline-block d-none">Add New</span>
          </button>
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
    </div>
    <div class="card-body p-2 table-responsive">
      <table class="table table-hover table-bordered dt-responsive" id="tabelValas">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Rates</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">New Initial Balance</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formIBBaru">
        <div class="row">
          <div class="col mb-3">
            <label for="cabang" class="form-label">Branch</label>
            <select id="cabang" class="form-select"></select>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="valas" class="form-label">Forex</label>
            <select id="valas" class="form-select"></select>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="stok" class="form-label">Balance</label>
            <input type="number" id="stok" class="form-control" placeholder="Input Balance" min="0" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="rate" class="form-label">Rate</label>
            <div class="input-group">
              <input type="number" id="rate" class="form-control" placeholder="Input Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmTambahForex" class="btn btn-primary">Submit</button>
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
        <h5 class="modal-title" id="backDropModalTitle">Edit Initial Balance</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formEditIB">
        <input type="hidden" id="idEdit">
        <div class="row">
          <div class="col mb-3">
            <label for="cabangEdit" class="form-label">Branch</label>
            <select id="cabangEdit" class="form-select"></select>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="valasEdit" class="form-label">Forex</label>
            <select id="valasEdit" class="form-select"></select>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="stokEdit" class="form-label">Balance</label>
            <input type="number" id="stokEdit" class="form-control" placeholder="Input Balance" min="0" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="rateEdit" class="form-label">Rate</label>
            <div class="input-group">
              <input type="number" id="rateEdit" class="form-control" placeholder="Input Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEditForex" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus forex -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Forex Beginning Balance</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete beginning balance <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Tutup</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Initial Balance Detail</h5>
        <div id="statusDetail" class=""></div>
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
            <span class="h6 me-1">Code :</span>
            <span class="dataDetail" id="kodeDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Name :</span>
            <span class="dataDetail" id="namaDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Rate :</span>
            <span class="dataDetail" id="rateDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Stock :</span>
            <span class="dataDetail" id="stokDetail"></span>
          </li>
        </ul>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger mx-1" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/setting/beginning-balance.js" type="text/javascript"></script>