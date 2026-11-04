<?php
/* Modal "New Contact" bersama (Direct Transaction dan Cash Transaction). Variabel: $kontakReturn = modal yang dibuka kembali setelah
   Close / Save, $kontakSaveId = id tombol Save. Logika: js/pages/contact-new.js */
?>
<!-- modal kontak baru -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalKontakBaru" data-return="<?= $kontakReturn ?>" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">New Contact Data</p>
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
              <input class="form-check-input" type="checkbox" id="pelanggan" value="1" checked />
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
          <button type="button" class="btn btn-label-secondary" data-bs-toggle="modal" data-bs-target="<?= $kontakReturn ?>" data-bs-dismiss="modal">
            Close
          </button>
        </div>
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" id="<?= $kontakSaveId ?>" class="btn btn-primary js-simpan-kontak">Save</button>
        </div>
      </div>
    </div>
  </div>
</div>
