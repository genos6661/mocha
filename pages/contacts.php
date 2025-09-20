<h5 class="mb-3">Contacts Data</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md mb-3 mb-md-0 d-flex gap-2">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah" id="btnModalTambah">
        <i class="icon-base  ti tabler-plus icon-16px me-md-2"></i><span class="d-md-inline-block nowrap">New Contact</span>
      </button>
      <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base ti tabler-filter icon-16px"></i>
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
    <table class="table table-bordered table-hover" id="tabelContact">
      <thead>
        <tr>
          <th></th>
          <th>Code</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Country</th>
          <th>Type</th>
          <th></th>
        </tr>
      </thead>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Contacts : <span id="totalContact"></span></p>
      </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-md modal-simple">
    <div class="modal-content">
      <div class="modal-body pb-2">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">Filter Contacts Data</p>
        <form id="formFilter">
        <div class="mb-3">
          <label for="filTipe" class="form-label">Type</label>
          <select id="filTipe" class="form-select">
            <option value="" selected>All Types</option>
            <option value="101">Personal</option>
            <option value="204">Company</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="filNegara" class="form-label">Country</label>
          <select id="filNegara" class="form-select"></select>
        </div>
        <div class="row mb-3">
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="filPelanggan" value="1" checked />
              <label class="form-check-label" for="filPelanggan">Customer</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="filVendor" value="1" checked />
              <label class="form-check-label" for="filVendor">Vendor</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="filKaryawan" value="1" checked />
              <label class="form-check-label" for="filKaryawan">Employee</label>
            </div>
          </div>
        </div>
        <div class="w-100 d-flex justify-content-center gap-2">
          <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
          <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal tambah -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambah" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">New Contact Data</p>
        <form id="formCabangBaru">
        <div class="row">
          <div class="col-md mb-3">
            <label for="nama" class="form-label">Name</label>
            <input
              type="text"
              id="nama"
              class="form-control"
              placeholder="Input Fullname" />
          </div>
          <div class="col-md mb-3">
            <label for="tipe" class="form-label">Type</label>
            <select id="tipe" class="form-select">
              <option value="101" selected>Personal</option>
              <option value="204">Company</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="id_type" class="form-label">ID Type</label>
            <select  id="id_type" class="form-select">
              <option value="PSP" selected>Passport</option>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM (Driving License)</option>
              <option value="OTH">Other</option>
              <option value="SIU">Surat Izin Usaha</option>
              <option value="SAP">Akta Pendirian</option>
              <option value="ADR">Anggaran Dasar</option>
            </select>
          </div>
          <div class="col-md mb-3">
            <label for="idNumber" class="form-label">ID Number</label>
            <input type="text" id="idNumber" class="form-control" placeholder="ID Number" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" id="email" class="form-control" placeholder="Input Email (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="telepon" class="form-label">Phone Number</label>
            <input type="text" id="telepon" class="form-control" placeholder="Input Phone Number (Optional)" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="negara" class="form-label">Country</label>
            <select id="negara" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="alamat" class="form-label">Address</label>
            <input type="text" id="alamat" class="form-control" placeholder="Input Address" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="pekerjaan" class="form-label">Occupation</label>
            <select id="pekerjaan" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="paspor" class="form-label">Passport Photo</label>
            <input
              type="file"  accept="image/*" id="paspor" class="form-control" placeholder="Upload Passport Photo (Optional)" />
          </div>
        </div>
        <div class="row row-cols-3">
          <div class="col mb-2">
            <label for="jk" class="form-label">Gender</label>
          </div>
          <div class="col mb-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="jk" id="male" class="switch-input" checked>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Male</span>
              </label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="jk" id="female" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Female</span>
              </label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="pelanggan" value="1" />
              <label class="form-check-label" for="pelanggan">Pelanggan</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="vendor" value="1" />
              <label class="form-check-label" for="vendor">Vendor</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="karyawan" value="1" />
              <label class="form-check-label" for="karyawan">Karyawan</label>
            </div>
          </div>
          <div class="col d-none">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="other" value="1" />
              <label class="form-check-label" for="other">Other</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" id="sbmTambah" class="btn btn-primary">Save</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal edit -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between flex-md-row flex-column">
        <h5 class="modal-title" id="backDropModalTitle">Edit Contact Data</h5>
        <div class="d-flex gap-2">
          <p class="h5" id="kodeEdit"></p>
          <!-- <div id="tipeDetail" class=""></div> -->
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formEditPajak">
        <input type="hidden" id="idEdit">
        <input type="hidden" id="kodeEditVal">
        <div class="row">
          <div class="col-md mb-3">
            <label for="namaEdit" class="form-label">Name</label>
            <input
              type="text"
              id="namaEdit"
              class="form-control"
              placeholder="Input Branch Name" />
          </div>
          <div class="col-md mb-3">
            <label for="tipeEdit" class="form-label">Type</label>
            <select id="tipeEdit" class="form-select">
              <option value="101">Personal</option>
              <option value="204">Company</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="id_typeEdit" class="form-label">ID Type</label>
            <select  id="id_typeEdit" class="form-select">
              <option value="PSP">Passport</option>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM (Driving License)</option>
              <option value="OTH">Other</option>
              <option value="SIU">Surat Izin Usaha</option>
              <option value="SAP">Akta Pendirian</option>
              <option value="ADR">Anggaran Dasar</option>
            </select>
          </div>
          <div class="col-md mb-3">
            <label for="idNumberEdit" class="form-label">ID Number</label>
            <input type="text" id="idNumberEdit" class="form-control" placeholder="ID Number" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="emailEdit" class="form-label">Email</label>
            <input type="text" id="emailEdit" class="form-control" placeholder="Input Email (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="teleponEdit" class="form-label">Phone Number</label>
            <input type="text" id="teleponEdit" class="form-control" placeholder="Input Phone Number" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="negaraEdit" class="form-label">Country</label>
            <select id="negaraEdit" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="alamatEdit" class="form-label">Address</label>
            <input type="text" id="alamatEdit" class="form-control" placeholder="Input Address" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="pekerjaanEdit" class="form-label">Occupation</label>
            <input type="text" id="pekerjaanEdit" class="form-control" placeholder="Occupation" />
          </div>
          <div class="col-md mb-3">
            <label class="form-label" for="pasporEdit">Passport Photo</label>
            <input type="file" class="form-control" id="pasporEdit" accept="image/*">
          </div>
        </div>
        <div class="row row-cols-3">
          <div class="col mb-2">
            <label for="jk" class="form-label">Gender</label>
          </div>
          <div class="col mb-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="jkEdit" id="maleEdit" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Male</span>
              </label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="jkEdit" id="femaleEdit" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Female</span>
              </label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="pelangganEdit" value="1" />
              <label class="form-check-label" for="pelangganEdit">Pelanggan</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="vendorEdit" value="1" />
              <label class="form-check-label" for="vendorEdit">Vendor</label>
            </div>
          </div>
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="karyawanEdit" value="1" />
              <label class="form-check-label" for="karyawanEdit">Karyawan</label>
            </div>
          </div>
          <div class="col d-none">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="otherEdit" value="1" />
              <label class="form-check-label" for="otherEdit">Other</label>
            </div>
          </div>
        </div>
        <img class="img-fluid d-flex mx-auto my-6 rounded cursor-pointer d-none" id="pasporEditView" alt="Passport Photo" title="click to download">
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
        <h5 class="modal-title" id="backDropModalTitle">Delete Contact Data</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapus">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete contact <span id="refHapus"></span>?</h4>
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
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between">
        <h5 class="modal-title" id="backDropModalTitle">Contact Detail</h5>
        <div id="statusDetail" class=""></div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md">
            <ul class="list-unstyled mb-3">
              <li class="mb-2">
                <span class="h6 me-1">Code :</span>
                <span class="dataDetail" id="kodeDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Entity :</span>
                <span class="dataDetail" id="nttDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Name :</span>
                <span class="dataDetail" id="namaDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">ID Type :</span>
                <span class="dataDetail" id="IDTipeDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">ID Number :</span>
                <span class="dataDetail" id="idDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Email :</span>
                <span class="dataDetail" id="emailDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Phone :</span>
                <span class="dataDetail" id="teleponDetail"></span>
              </li>
            </ul>
          </div>
          <div class="col-md">
            <ul class="list-unstyled mb-3 text-md-end">
              <li class="mb-2">
                <span class="h6 me-1">Gender :</span>
                <span class="dataDetail" id="jkDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Occupation/Position :</span>
                <span class="dataDetail" id="pekerjaanDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Address :</span>
                <span class="dataDetail" id="alamatDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Nationality :</span>
                <span class="dataDetail" id="negaraDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Contact Type :</span>
                <span class="dataDetail" id="tipeDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">All Time Transaction :</span>
                <span class="dataDetail" id="transaksiDetail"></span>
              </li>
            </ul>
          </div>
        </div>
        <img class="img-fluid d-flex mx-auto my-6 rounded cursor-pointer d-none" id="pasporDetail" alt="Passport Photo" title="Click to download">
        <hr class="my-3">
        <div class="row" id="boxDokumen">
          <p class="h5">Document</p>
          <div class="col-md">
             <ul class="list-unstyled mb-3">
              <li class="mb-2">
                <span class="h6 me-1">NPWP (TIN) :</span>
                <span class="dataDetail" id="npwpDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Domicile :</span>
                <span class="dataDetail" id="domisiliDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Income :</span>
                <span class="dataDetail" id="penghasilanDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Job :</span>
                <span class="dataDetail" id="pekerjaan2Detail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Company :</span>
                <span class="dataDetail" id="perusahaanDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Company Form :</span>
                <span class="dataDetail" id="bentukPTDetail"></span>
              </li>
            </ul>
          </div>
          <div class="col-md">
             <ul class="list-unstyled mb-3 text-md-end">
              <li class="mb-2">
                <span class="h6 me-1">Position :</span>
                  <span class="dataDetail" id="jabatanDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Business Sector :</span>
                <span class="dataDetail" id="bidangDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Transaction Purpose :</span>
                <span class="dataDetail" id="tujuanDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Relationship (if represented) :</span>
                <span class="dataDetail" id="hubunganDetail"></span>
              </li>
              <li class="mb-2">
                <span class="h6 me-1">Source of funds :</span>
                <span class="dataDetail" id="sumberDetail"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn d-none mx-1" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none mx-1" id="deactivateBtn">Deactivate</button>
        <a class="btn btn-outline-primary mx-1" id="goTrans">View Transactions</a>
        <button class="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger mx-1" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<script src="js/pages/contact.js" type="text/javascript"></script>