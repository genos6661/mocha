<h5 class="mb-3">Branch Data</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-flex mb-2 mb-md-0">
      <button class="btn btn-primary" id="btnModalTambah" data-bs-toggle="modal" data-bs-target="#modalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i>New Branch
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
    <table class="table table-bordered table-hover" id="tabelBranch">
      <thead>
        <tr>
          <th></th>
          <th>Code</th>
          <th>Name</th>
          <th>Address</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Branch : <span id="totalCabang"></span></p>
      </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">New Branch Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formCabangBaru">
        <div class="row">
          <div class="col mb-3">
            <label for="kode" class="form-label">Code</label>
            <input
              type="text"
              id="kode"
              class="form-control"
              placeholder="Input Branch Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="nama" class="form-label">Name</label>
            <input
              type="text"
              id="nama"
              class="form-control"
              placeholder="Input Branch Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="alamat" class="form-label">Address</label>
            <input type="text" id="alamat" class="form-control" placeholder="Input Branch Address" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="telepon" class="form-label">Phone Number</label>
            <input type="text" id="telepon" class="form-control" placeholder="Input Phone Number" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="judul" class="form-label">Receipt's Title</label>
            <input type="text" id="judul" class="form-control" placeholder="Fill Receipt's Title" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer1" class="form-label">Footer 1</label>
            <input type="text" id="footer1" class="form-control" placeholder="Input Footer 1" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer2" class="form-label">Footer 2</label>
            <input type="text" id="footer2" class="form-control" placeholder="Input Footer 2" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer3" class="form-label">Footer 3</label>
            <input type="text" id="footer3" class="form-control" placeholder="Input Branch Footer 3" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="cdHead" class="form-label">Customer Display Header</label>
            <input type="text" id="cdHead" class="form-control" placeholder="Text for branch's Customer Display" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="cdFoot" class="form-label">Customer Display Footer</label>
            <input type="text" id="cdFoot" class="form-control" placeholder="Text for branch's Customer Display" />
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
        <h5 class="modal-title" id="backDropModalTitle">Edit Branch Data</h5>
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
              placeholder="Input Branch Code" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="namaEdit" class="form-label">Name</label>
            <input
              type="text"
              id="namaEdit"
              class="form-control"
              placeholder="Input Branch Name" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="alamatEdit" class="form-label">Address</label>
            <input type="text" id="alamatEdit" class="form-control" placeholder="Input Branch Address" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="teleponEdit" class="form-label">Phone Number</label>
            <input type="text" id="teleponEdit" class="form-control" placeholder="Input Phone Number" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="judulEdit" class="form-label">Receipt's Title</label>
            <input type="text" id="judulEdit" class="form-control" placeholder="Fill Receipt's Title" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer1Edit" class="form-label">Footer 1</label>
            <input type="text" id="footer1Edit" class="form-control" placeholder="Input Footer 1" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer2Edit" class="form-label">Footer 2</label>
            <input type="text" id="footer2Edit" class="form-control" placeholder="Input Footer 2" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="footer3Edit" class="form-label">Footer 3</label>
            <input type="text" id="footer3Edit" class="form-control" placeholder="Input Branch Footer 3" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="cdHeadEdit" class="form-label">Customer Display Header</label>
            <input type="text" id="cdHeadEdit" class="form-control" placeholder="Text for branch's Customer Display" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="cdFootEdit" class="form-label">Customer Display Footer</label>
            <input type="text" id="cdFootEdit" class="form-control" placeholder="Text for branch's Customer Display" />
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
          Tutup
        </button>
        <button type="button" id="sbmEdit" class="btn btn-primary">Simpan</button>
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
        <h5 class="modal-title" id="backDropModalTitle">Delete Branch Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete branch <span id="refHapus"></span>?</h4>
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
        <h5 class="modal-title" id="backDropModalTitle">Branch Detail</h5>
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
            <span class="h6 me-1">Phone :</span>
            <span class="dataDetail" id="teleponDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Address :</span>
            <span class="dataDetail" id="alamatDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Receipt's Title :</span>
            <span class="dataDetail" id="judulDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Footer 1 :</span>
            <span class="dataDetail" id="footer1Detail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Footer 2 :</span>
            <span class="dataDetail" id="footer2Detail"></span>
          </li><li class="mb-2">
            <span class="h6 me-1">Footer 3 :</span>
            <span class="dataDetail" id="footer3Detail"></span>
          </li>
          </li><li class="mb-2">
            <span class="h6 me-1">Customer Display Header :</span>
            <span class="dataDetail" id="cdHeadDetail"></span>
          </li>
          </li><li class="mb-2">
            <span class="h6 me-1">Customer Display Footer :</span>
            <span class="dataDetail" id="cdFootDetail"></span>
          </li>
        </ul>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn d-none mb-2 mb-md-0" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none mb-2 mb-md-0" id="deactivateBtn">Deactivate</button>
        <button class="btn btn-primary mb-2 mb-md-0" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger mb-2 mb-md-0" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mb-2 mb-md-0" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/branch.js" type="text/javascript"></script>