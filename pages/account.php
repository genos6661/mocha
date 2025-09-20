<div class="nav-align-top">
  <ul class="nav nav-pills flex-column flex-sm-row mb-6 gap-md-0 gap-2">
    <li class="nav-item">
      <button
        id="btnTabKlas"
        type="button"
        class="nav-link active"
        data-bs-toggle="tab"
        data-bs-target="#tab-klas"
        aria-controls="tab-klas"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-chart-cohort icon-sm me-1_5"></i> Classification
      </button>
    </li>
    <li class="nav-item">
      <button
        id="btnTabSubklas"
        type="button"
        class="nav-link"
        data-bs-toggle="tab"
        data-bs-target="#tab-subklas"
        aria-controls="tab-subklas"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-category-plus icon-sm me-1_5"></i> Sub Classification
      </button>
    </li>
    <li class="nav-item">
      <button
        id="btnTabMaster"
        type="button"
        class="nav-link"
        data-bs-toggle="tab"
        data-bs-target="#tab-master"
        aria-controls="tab-master"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-file-analytics icon-sm me-1_5"></i> Master Account
      </button>
    </li>
    <li class="nav-item">
      <button
        id="btnTabAkun"
        type="button"
        class="nav-link"
        data-bs-toggle="tab"
        data-bs-target="#tab-akun"
        aria-controls="tab-akun"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-receipt-dollar icon-sm me-1_5"></i> Accounts
      </button>
    </li>
  </ul>
</div>

<div class="tab-content p-0">
  <!-- ~~~~~~~~~~~~~~~~~~~~~ klasifikasi ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade active show" id="tab-klas" role="tabpanel">
    <div class="card-header border-bottom p-2">
      <div class="row px-3">
        <div class="col-md p-0">
          <h5 class="card-title">Classification</h5>
        </div>
        <div class="col-md p-0">
          <div class="input-group input-group-merge filterKlas">
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
    <div class="card-datatable table-responsive">
      <table class="datatables-users table" id="tabelKlas">
        <thead class="border-top">
          <tr>
            <th>Number/Code</th>
            <th>Name</th>
            <th>Alias</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Classification : <span id="totalKlas"></span></p>
      </div>
    </div>
  </div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~ subklasifikasi ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade" id="tab-subklas" role="tabpanel">
    <div class="card-header border-bottom p-2">
      <div class="row px-3">
        <div class="col-md p-0">
          <h5 class="card-title">Sub Classification</h5>
        </div>
        <div class="col-md p-0 d-flex justify-content-between">
          <div class="input-group input-group-merge filterSubklas">
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
    </div>
    <div class="card-datatable table-responsive">
      <table class="table table-hover" id="tabelSubklas">
        <thead class="border-top">
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Sub Classification : <span id="totalSubklas"></span></p>
      </div>
    </div>
  </div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~ master akun ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade" id="tab-master" role="tabpanel">
    <div class="card-header px-0 pt-0">
      <div class="row px-3">
        <div class="col-md p-0">
          <h5 class="card-title">Master Account</h5>
        </div>
        <div class="col-md p-0 d-flex justify-content-between">
          <div class="input-group input-group-merge filterUtama">
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
    </div>
    <div class="card-datatable table-responsive">
      <table class="datatables-users table" id="tabelUtama">
        <thead class="border-top">
          <tr>
            <th>Code</th>
            <th>Sub Classification</th>
            <th>Name</th>
            <th>Alias</th>
            <th>Cash/Bank</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Master Account : <span id="totalUtama"></span></p>
      </div>
    </div>
  </div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~ akun ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade" id="tab-akun" role="tabpanel">
    <div class="card-header px-0 pt-0">
      <div class="row px-3">
        <div class="col-md-4 p-0">
          <h5 class="card-title">Accounts</h5>
        </div>
        <div class="col-md-2 d-flex justify-content-end py-0 px-2">
          <button class="btn btn-primary nowrap" data-bs-toggle="modal" data-bs-target="#modalTambahAkun" id="btnTambahAkun">
            <i class="icon-base ti tabler-plus icon-16px me-md-2"></i><span class="d-md-inline-block d-none nowrap">New Account</span>
          </button>
        </div>
        <div class="col-md-6 p-0 d-flex justify-content-between">
          <div class="input-group input-group-merge filterAkun">
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
    </div>
    <div class="card-datatable table-responsive">
      <table class="datatables-users table table-hover" id="tabelAkun">
        <thead class="border-top">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Alias</th>
            <th>Sub Classification</th>
            <th>Master Acc.</th>
            <th>Cash/Bank</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Account : <span id="totalAkun"></span></p>
      </div>
    </div>
  </div>
</div>

<!-- modal -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEditKlas" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Edit Classification Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formCabangBaru">
        <input type="hidden" id="idKlas">
        <div class="row">
          <div class="col mb-3">
            <label for="kodeKlas" class="form-label">Code</label>
            <input
              type="text"
              id="kodeKlas"
              class="form-control"
              placeholder="Classification Code" readonly />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaKlas" class="form-label">Name</label>
            <input
              type="text"
              id="namaKlas"
              class="form-control"
              placeholder="Input Classification Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="aliasKlas" class="form-label">Alias</label>
            <input
              type="text"
              id="aliasKlas"
              class="form-control"
              placeholder="Input Alias Name" />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEditKlas" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalEditSubklas" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Edit Sub Classification Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formCabangBaru">
        <input type="hidden" id="idSubklas">
        <div class="row">
          <div class="col mb-3">
            <label for="kodeSubklas" class="form-label">Code</label>
            <input
              type="text"
              id="kodeSubklas"
              class="form-control"
              placeholder="Sub Classification Code" readonly />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="klasSubklas" class="form-label">Classification</label>
            <input
              type="text"
              id="klasSubklas"
              class="form-control" readonly />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaSubklas" class="form-label">Name</label>
            <input
              type="text"
              id="namaSubklas"
              class="form-control"
              placeholder="Input Sub Classification Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="aliasSubklas" class="form-label">Alias</label>
            <input
              type="text"
              id="aliasSubklas"
              class="form-control"
              placeholder="Input Alias Name" />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEditSubklas" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalTambahAkun" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">New Account Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formAkunBaru">
        <div class="row">
          <div class="col mb-3">
            <label for="kodeAkun" class="form-label">Code</label>
            <input
              type="text"
              id="kodeAkun"
              class="form-control"
              placeholder="Account Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaAkun" class="form-label">Name</label>
            <input
              type="text"
              id="namaAkun"
              class="form-control"
              placeholder="Input Account Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="aliasAkun" class="form-label">Alias</label>
            <input
              type="text"
              id="aliasAkun"
              class="form-control"
              placeholder="Input Alias Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="masterAkun" class="form-label">Master Account</label>
            <select id="masterAkun" class="form-select"></select>
          </div>
        </div>
        <div class="row row-cols-2">
          <div class="col">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="kas" value="1" />
              <label class="form-check-label" for="kas">Cash or Equivalents</label>
            </div>
          </div>
          <div class="col">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="bank" value="1" />
              <label class="form-check-label" for="bank">Bank</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmTambahAkun" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalEditAkun" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Edit Account Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="idAkunEdit">
        <div class="row">
          <div class="col mb-3">
            <label for="kodeAkunEdit" class="form-label">Code</label>
            <input
              type="text"
              id="kodeAkunEdit"
              class="form-control"
              placeholder="Account Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaAkunEdit" class="form-label">Name</label>
            <input
              type="text"
              id="namaAkunEdit"
              class="form-control"
              placeholder="Input Account Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="aliasAkunEdit" class="form-label">Alias</label>
            <input
              type="text"
              id="aliasAkunEdit"
              class="form-control"
              placeholder="Input Alias Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="masterAkunEdit" class="form-label">Master Account</label>
            <select id="masterAkunEdit" class="form-select"></select>
          </div>
        </div>
        <div class="row row-cols-2">
          <div class="col">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="kasEdit" value="1" />
              <label class="form-check-label" for="kasEdit">Cash or Equivalents</label>
            </div>
          </div>
          <div class="col">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="bankEdit" value="1" />
              <label class="form-check-label" for="bankEdit">Bank</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" id="sbmEditAkun" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalHapusAkun" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Account Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapusAkun">
        <input type="hidden" id="idHapusAkun">
        <h4>Continue to delete Account <span id="refHapusAkun"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Tutup</button>
        <button type="button" id="sbmHapusAkun" class="btn btn-danger">Delete</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetailAkun" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Account Detail</h5>
        <div id="statusDetailAkun" class=""></div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul class="list-unstyled mb-6">
          <li class="mb-2">
            <span class="h6 me-1">Code :</span>
            <span class="dataDetailAkun" id="kodeDetailAkun"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Name :</span>
            <span class="dataDetailAkun" id="namaDetailAkun"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Alias :</span>
            <span class="dataDetailAkun" id="aliasDetailAkun"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Master Account :</span>
            <span class="dataDetailAkun" id="masterDetailAkun"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Classification :</span>
            <span class="dataDetailAkun" id="klasDetailAkun"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Sub Classification :</span>
            <span class="dataDetailAkun" id="subklasDetailAkun"></span>
          </li>
        </ul>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn d-none mx-1" id="activateBtnAkun">Activate</button>
        <button class="btn-outline-danger btn d-none mx-1" id="deactivateBtnAkun">Deactivate</button>
        <button class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modalEditAkun" id="editBtnAkun">Edit</button>
        <button class="btn btn-danger mx-1" id="deleteBtnAkun" data-bs-toggle="modal" data-bs-target="#modalHapusAkun">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/master-klasifikasi.js" type="text/javascript"></script>
<script src="js/pages/master-subklas.js" type="text/javascript"></script>
<script src="js/pages/master-utama.js" type="text/javascript"></script>
<script src="js/pages/master-akun.js" type="text/javascript"></script>