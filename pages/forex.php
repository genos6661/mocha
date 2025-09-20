<style>
  .table-scroll {
    max-height: 60vh;
    overflow-y: auto;
  }

  .table-scroll thead th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

<h5 class="mb-3">Forex Data</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-flex gap-3 mb-2 mb-md-0">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Forex
      </button>
      <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalRate" id="btnModalRate">
        Update Rates
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
    <table class="table table-bordered table-hover" id="tabelForex">
      <thead>
        <tr>
          <th></th>
          <th>Code</th>
          <th>Name</th>
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
              <input type="number" id="jual" class="form-control" placeholder="Input Sale Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="beli" class="form-label">Buy Rate</label>
            <div class="input-group">
              <input type="number" id="beli" class="form-control" placeholder="Input Buy Rate" min="0" />
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
              <input type="number" id="jualEdit" class="form-control" placeholder="Input Sale Rate" min="0" />
              <span class="input-group-text">Rupiah</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="beliEdit" class="form-label">Buy Rate</label>
            <div class="input-group">
              <input type="number" id="beliEdit" class="form-control" placeholder="Input Buy Rate" min="0" />
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
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Forex Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapusKelompok">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete forex <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
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
        <h5 class="modal-title" id="backDropModalTitle">Forex Detail</h5>
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
            <span class="h6 me-1">Code :</span>
            <span class="dataDetail" id="kodeDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Name :</span>
            <span class="dataDetail" id="namaDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Buy Rate :</span>
            <span class="dataDetail" id="beliDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Sell Rate :</span>
            <span class="dataDetail" id="jualDetail"></span>
          </li>
        </ul>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn d-none mx-1" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none mx-1" id="deactivateBtn">Deactivate</button>
        <button class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger mx-1" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalRate" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between row">
        <div class="row w-100">
          <div class="col-md">
            <h5 class="modal-title" id="backDropModalTitle">Update Forex's Rate</h5>
          </div>
          <div class="col-md">
            <input type="text" class="form-control" id="searchRate" placeholder="Search...">
          </div>
        </div>
      </div>
      <div class="modal-body table-responsive">
        <div class="table-scroll">
          <table class="table table-borderless" id="tabelRate">
            <thead class="table-dark position-sticky top-0">
              <tr class="border-bottom">
                <th class="p-4">Forex</th>
                <th class="p-4 text-end" style="width: 30%;">Buy Rate</th>
                <th class="p-4 pe-4 text-end" style="width: 30%;">Sell Rate</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn btn-outline-primary mx-1" id="resetBtn">Reset</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
        <button class="btn btn-primary mx-1" id="sbmRate">Submit</button>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/forex.js" type="text/javascript"></script>