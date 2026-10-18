<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../assets/css/modal-form.css') ?>" />
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
    <table class="table table-bordered table-hover table-cards" id="tabelContact">
      <thead>
        <tr>
          <th></th>
          <th>Name / Code</th>
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
            <option value="201">Money Changer (Company)</option>
            <option value="202">Bank (Company)</option>
            <option value="203">Payment Service Provider (PJP)</option>
            <option value="204">Company (Others)</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="filNegara" class="form-label">Country</label>
          <select id="filNegara" class="form-select"></select>
        </div>
        <div class="row row-cols-2 mb-3">
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
          <div class="col mb-2">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="filMember" value="1" checked />
              <label class="form-check-label" for="filMember">Guide</label>
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
            <label for="nama" class="form-label">Name<sup class="text-danger"> *required</sup></label>
            <input
              type="text"
              id="nama"
              class="form-control"
              placeholder="Input Fullname" />
          </div>
          <div class="col-md mb-3">
            <label for="tipe" class="form-label">Type<sup class="text-danger"> *required</sup></label>
            <select id="tipe" class="form-select">
              <option value="101" selected>Personal</option>
              <option value="201">Money Changer (Company)</option>
              <option value="202">Bank (Company)</option>
              <option value="203">Payment Service Provider (PJP)</option>
              <option value="204">Company (Others)</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="id_type" class="form-label">ID Type<sup class="text-danger"> *required</sup></label>
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
            <label for="idNumber" class="form-label">ID Number<sup class="text-danger"> *mandatory</sup></label>
            <input type="text" id="idNumber" class="form-control" placeholder="ID Number" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="tempat_lahir" class="form-label">Place of Birth</label>
            <input type="text" id="tempat_lahir" class="form-control" placeholder="Input Place of birth" />
          </div>
          <div class="col-md mb-3">
            <label for="tanggal_lahir" class="form-label">Date of Birth</label>
            <input type="date" id="tanggal_lahir" class="form-control" placeholder="Input Place of Birth" />
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
            <label for="negara" class="form-label">Country<sup class="text-danger"> *required</sup></label>
            <select id="negara" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="alamat" class="form-label">Address<sup class="text-danger"> *required</sup></label>
            <input type="text" id="alamat" class="form-control" placeholder="Input Address" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="pekerjaan" class="form-label">Occupation<sup class="text-danger"> *required</sup></label>
            <select id="pekerjaan" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="paspor" class="form-label">Passport Photo</label>
            <input
              type="file" id="paspor" class="form-control" placeholder="Upload Passport Photo (Optional)" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="rekening" class="form-label">Bank Account</label>
            <input type="text" id="rekening" class="form-control" placeholder="Input Bank Account (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="jk" class="form-label">Gender</label>
            <div class="d-flex justify-content-end">
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
          </div>
        </div>
        <div class="row row-cols-2 row-cols-sm-4">
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="pelanggan" value="1" />
              <label class="form-check-label" for="pelanggan">Pelanggan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="vendor" value="1" />
              <label class="form-check-label" for="vendor">Vendor</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="karyawan" value="1" />
              <label class="form-check-label" for="karyawan">Karyawan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="member" value="1" />
              <label class="form-check-label" for="member">Guide</label>
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

<div class="modal fade animate__animated animate__fadeInUp" id="modalEdit" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">Edit Contact Data <span id="kodeEdit"></span></p>
        <form id="formEditKontak">
        <input type="hidden" id="idEdit">
        <input type="hidden" id="kodeEditVal">
        <div class="row">
          <div class="col-md mb-3">
            <label for="namaEdit" class="form-label">Name</label>
            <input
              type="text"
              id="namaEdit"
              class="form-control"
              placeholder="Input Fullname" />
          </div>
          <div class="col-md mb-3">
            <label for="tipeEdit" class="form-label">Type</label>
            <select id="tipeEdit" class="form-select">
              <option value="101" selected>Personal</option>
              <option value="201">Money Changer (Company)</option>
              <option value="202">Bank (Company)</option>
              <option value="203">Payment Service Provider (PJP)</option>
              <option value="204">Company (Others)</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="id_typeEdit" class="form-label">ID Type</label>
            <select  id="id_typeEdit" class="form-select">
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
            <label for="idNumberEdit" class="form-label">ID Number</label>
            <input type="text" id="idNumberEdit" class="form-control" placeholder="ID Number" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="tempat_lahirEdit" class="form-label">Place of Birth</label>
            <input type="text" id="tempat_lahirEdit" class="form-control" placeholder="Input Place of birth" />
          </div>
          <div class="col-md mb-3">
            <label for="tanggal_lahirEdit" class="form-label">Date of Birth</label>
            <input type="date" id="tanggal_lahirEdit" class="form-control" placeholder="Input Place of Birth" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="emailEdit" class="form-label">Email</label>
            <input type="text" id="emailEdit" class="form-control" placeholder="Input Email (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="teleponEdit" class="form-label">Phone Number</label>
            <input type="text" id="teleponEdit" class="form-control" placeholder="Input Phone Number (Optional)" />
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
            <select id="pekerjaanEdit" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="pasporEdit" class="form-label">Passport Photo</label>
            <input
              type="file" id="pasporEdit" class="form-control" placeholder="Upload Passport Photo (Optional)" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="rekeningEdit" class="form-label">Bank Account</label>
            <input type="text" id="rekeningEdit" class="form-control" placeholder="Input Bank Account (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="jkEdit" class="form-label">Gender</label>
            <div class="d-flex justify-content-end">
              <div class="form-check form-check-inline">
                <label class="switch">
                  <input type="radio" name="jkEdit" id="maleEdit" class="switch-input" checked>
                  <span class="switch-toggle-slider">
                    <span class="switch-on"></span>
                    <span class="switch-off"></span>
                  </span>
                  <span class="switch-label">Male</span>
                </label>
              </div>
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
          </div>
        </div>
        <div class="row row-cols-2 row-cols-sm-4">
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="pelangganEdit" value="1" />
              <label class="form-check-label" for="pelangganEdit">Pelanggan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="vendorEdit" value="1" />
              <label class="form-check-label" for="vendorEdit">Vendor</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="karyawanEdit" value="1" />
              <label class="form-check-label" for="karyawanEdit">Karyawan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="memberEdit" value="1" />
              <label class="form-check-label" for="memberEdit">Guide</label>
            </div>
          </div>
        </div>
        <div id="pasporEditView" class="w-100 rounded d-flex justify-content-center align-items-center overflow-hidden mt-2" style="height:40vh;" title="click to delete image">
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" id="sbmEdit" class="btn btn-primary">Save</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapus" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Contact Data</h4>
        <input type="hidden" id="idHapus">
        <p class="mb-1">Continue to delete contact <span class="fw-semibold text-heading" id="refHapus"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapus" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-address-book"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Contact Detail</h4>
          <p class="mf-sub">Identity, contact and document data of this contact.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-id"></i>Identity</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Code</span><span class="dl-value dataDetail" id="kodeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Entity</span><span class="dl-value dataDetail" id="nttDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Name</span><span class="dl-value dataDetail" id="namaDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Contact Type</span><span class="dl-value dataDetail" id="tipeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Gender</span><span class="dl-value dataDetail" id="jkDetail"></span></div>
            <div class="dl-item"><span class="dl-label">ID Type</span><span class="dl-value dataDetail" id="IDTipeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">ID Number</span><span class="dl-value dataDetail" id="idDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Nationality</span><span class="dl-value dataDetail" id="negaraDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Place of Birth</span><span class="dl-value dataDetail" id="tempat_lahirDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Date of Birth</span><span class="dl-value dataDetail" id="tanggal_lahirDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-address-book"></i>Contact</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Email</span><span class="dl-value dataDetail" id="emailDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Phone</span><span class="dl-value dataDetail" id="teleponDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Address</span><span class="dl-value dataDetail" id="alamatDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Occupation/Position</span><span class="dl-value dataDetail" id="pekerjaanDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Bank Account</span><span class="dl-value dataDetail" id="rekeningDetail"></span></div>
            <div class="dl-item"><span class="dl-label">All Time Transaction</span><span class="dl-value dataDetail" id="transaksiDetail"></span></div>
          </div>
        </div>
        <div class="mf-section d-none" id="boxGuide">
          <div class="mf-section-title"><i class="icon-base ti tabler-id-badge-2"></i>Guide Card</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Guide Code</span><span class="dl-value" id="guideKodeDetail"></span></div>
            <div class="dl-item">
              <span class="dl-label">Photo on public card</span>
              <div class="form-check form-switch mb-0 mt-1">
                <input class="form-check-input" type="checkbox" id="guideFotoPublik">
                <label class="form-check-label" for="guideFotoPublik">Show the passport photo</label>
              </div>
            </div>
            <div class="dl-item dl-wide"><span class="dl-label">Public link</span><span class="dl-value text-break" id="guideLinkDetail"></span></div>
          </div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <a class="btn btn-primary btn-sm" id="btnGuideOpen" target="_blank" rel="noopener"><i class="icon-base ti tabler-external-link icon-sm me-1"></i>Open Card</a>
            <button type="button" class="btn btn-outline-primary btn-sm" id="btnGuideCopy"><i class="icon-base ti tabler-copy icon-sm me-1"></i>Copy Link</button>
            <button type="button" class="btn btn-outline-primary btn-sm guide-manage" id="btnGuideGenerate"><i class="icon-base ti tabler-sparkles icon-sm me-1"></i>Generate Code</button>
            <button type="button" class="btn btn-outline-secondary btn-sm guide-manage" id="btnGuideEditCode"><i class="icon-base ti tabler-pencil icon-sm me-1"></i>Edit Code</button>
            <button type="button" class="btn btn-outline-danger btn-sm guide-manage" id="btnGuideRegen"><i class="icon-base ti tabler-refresh icon-sm me-1"></i>New Link</button>
          </div>
        </div>
        <div class="mf-section" id="boxDokumen">
          <div class="mf-section-title"><i class="icon-base ti tabler-file-certificate"></i>Document</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">NPWP (TIN)</span><span class="dl-value dataDetail" id="npwpDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Domicile</span><span class="dl-value dataDetail" id="domisiliDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Income</span><span class="dl-value dataDetail" id="penghasilanDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Job</span><span class="dl-value dataDetail" id="pekerjaan2Detail"></span></div>
            <div class="dl-item"><span class="dl-label">Company</span><span class="dl-value dataDetail" id="perusahaanDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Company Form</span><span class="dl-value dataDetail" id="bentukPTDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Position</span><span class="dl-value dataDetail" id="jabatanDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Business Sector</span><span class="dl-value dataDetail" id="bidangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Transaction Purpose</span><span class="dl-value dataDetail" id="tujuanDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Relationship (if represented)</span><span class="dl-value dataDetail" id="hubunganDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Source of funds</span><span class="dl-value dataDetail" id="sumberDetail"></span></div>
          </div>
          <div id="pasporDetail"
               class="w-100 rounded d-flex justify-content-center align-items-center overflow-hidden d-none mt-3" style="height:40vh;">
          </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-outline-primary btn d-none" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none" id="deactivateBtn">Deactivate</button>
        <a class="btn btn-outline-primary" id="goTrans">View Transactions</a>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEdit" id="editBtn">Edit</button>
        <button class="btn btn-danger" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/pages/contact.js" type="text/javascript"></script>
<script src="js/pages/contact-new.js" type="text/javascript"></script>