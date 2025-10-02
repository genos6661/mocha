<div class="card">
    <!-- Account -->
    <div class="card-body row">
      <div class="col-md d-flex align-items-start align-items-sm-center gap-6">
        <img
          src="../../assets/img/avatars/1.png"
          alt="user-avatar"
          class="d-block w-px-100 h-px-100 rounded"
          id="uploadedAvatar" />
        <div class="button-wrapper">
          <label for="upload" class="btn btn-primary me-3 mb-4" tabindex="0">
            <span class="d-none d-sm-block">Upload new photo</span>
            <i class="icon-base ti tabler-upload d-block d-sm-none"></i>
            <input
              type="file"
              id="upload"
              class="account-file-input"
              hidden
              accept="image/png, image/jpeg" />
          </label>
          <button type="button" class="btn btn-label-secondary account-image-reset mb-4">
            <i class="icon-base ti tabler-reset d-block d-sm-none"></i>
            <span class="d-none d-sm-block">Delete Photo</span>
          </button>

          <div id="headerInfo"></div>
        </div>
      </div>
      <div class="col-md d-flex justify-content-end align-items-end align-items-sm-center">
      	<p class="h5" id="kode"></p>
      </div>
    </div>
    <div class="card-body pt-4">
      <input type="hidden" id="kodeOld">
      <input type="hidden" id="jkOld">
      <input type="hidden" id="jenisIDOld">
      <input type="hidden" id="tipeKontakOld">
      <input type="hidden" id="rekeningOld">
      <input type="hidden" id="isPelangganOld">
      <input type="hidden" id="isKaryawanOld">
      <input type="hidden" id="isVendorOld">
      <input type="hidden" id="isMemberOld">
      <input type="hidden" id="roleOld">
        <div class="row gy-4 gx-6 mb-6">
          <div class="col-md-6 form-control-validation">
            <label for="nama" class="form-label">Full Name</label>
            <input class="form-control" type="text" id="nama" readonly />
          </div>
          <div class="col-md-6">
            <label for="jabatan" class="form-label">Position</label>
            <input type="text" class="form-control" id="jabatan" readonly />
          </div>
          <div class="col-md-6">
            <label for="nomorID" class="form-label">ID Number</label>
            <input class="form-control" type="text" id="nomorID" readonly />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="telepon">Phone</label>
             <input type="text" id="telepon" class="form-control" readonly />
          </div>
          <div class="col-md-6">
            <label for="alamat" class="form-label">Address</label>
            <input type="text" class="form-control" id="alamat" readonly />
          </div>
          <div class="col-md-6">
            <label for="negara" class="form-label">Country</label>
            <select id="negara" class="form-select"></select>
          </div>
        </div>
        <hr>
        <div class="row gy-4 gx-6">
          <div class="col-md-6 mb-3">
            <label for="username" class="form-label">Username</label>
            <input class="form-control" type="text" id="username" readonly />
          </div>
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label">Email</label>
            <input class="form-control" type="text" id="email" readonly />
          </div>
      	</div>
        <div class="row gy-4 gx-6">
          <div class="col-md-6">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Input to change password" readonly />
          </div>
          <div class="col-md-6 d-none" id="boxOldPassword">
            <label for="oldPassword" class="form-label">Input Old Password</label>
            <input type="password" class="form-control" id="oldPassword">
          </div>
        </div>
        <input type="hidden" id="idUser">
        <input type="hidden" id="idProfile">
        <div class="mt-2 d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-primary" id="editBtn">Click to Update Data</button>
          <button type="button" class="btn btn-dark" id="cancelBtn" style="display: none;">Cancel</button>
          <button type="submit" class="btn btn-primary" id="submitBtn" style="display: none;">Save changes</button>
        </div>
    </div>
    <!-- /Account -->
</div>

<script src="js/setting/profile.js" type="text/javascript"></script>