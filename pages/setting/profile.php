<link rel="stylesheet" href="/assets/css/profile.css?v=<?= filemtime(__DIR__ . '/../../assets/css/profile.css') ?>" />

<div class="profile-page" id="profilePage">

  <!-- Header: banner + foto + identitas -->
  <div class="card profile-hero">
    <div class="profile-banner"></div>
    <div class="profile-hero-body">
      <div class="profile-avatar-wrap">
        <img
          src="../../assets/img/avatars/1.png"
          alt="user-avatar"
          class="profile-avatar"
          id="uploadedAvatar" />
        <label for="upload" class="profile-avatar-edit" tabindex="0" title="Upload new photo">
          <i class="icon-base ti tabler-camera"></i>
          <input
            type="file"
            id="upload"
            class="account-file-input"
            hidden
            accept="image/png, image/jpeg" />
        </label>
      </div>

      <div class="profile-identity">
        <h4 class="profile-name" id="heroName">My Profile</h4>
        <div class="profile-meta">
          <span class="profile-chip"><i class="icon-base ti tabler-shield-check"></i><span id="headerInfo"></span></span>
          <span class="profile-chip profile-chip-code"><i class="icon-base ti tabler-hash"></i><span class="h6 mb-0" id="kode"></span></span>
        </div>
      </div>

      <div class="profile-photo-actions">
        <label for="upload" class="btn btn-primary" tabindex="0">
          <i class="icon-base ti tabler-upload me-sm-2"></i><span class="d-none d-sm-inline">Upload new photo</span>
        </label>
        <button type="button" class="btn btn-label-secondary account-image-reset" id="hapusFoto">
          <i class="icon-base ti tabler-trash me-sm-2"></i><span class="d-none d-sm-inline">Delete Photo</span>
        </button>
      </div>
    </div>
  </div>

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
  <input type="hidden" id="idUser">
  <input type="hidden" id="idProfile">

  <div class="profile-edit-hint">
    <i class="icon-base ti tabler-pencil"></i>
    <span>You are editing your profile. Change what you need, then press <strong>Save changes</strong>.</span>
  </div>

  <div class="row g-4 profile-sections">
    <!-- Data pribadi -->
    <div class="col-xl-7">
      <div class="card profile-card h-100">
        <div class="card-body">
          <div class="profile-section-title"><span class="profile-section-icon"><i class="icon-base ti tabler-user"></i></span>Personal information</div>
          <div class="row gy-4 gx-6">
            <div class="col-md-6 form-control-validation">
              <label for="nama" class="form-label"><i class="icon-base ti tabler-user"></i>Full Name</label>
              <input class="form-control" type="text" id="nama" readonly />
            </div>
            <div class="col-md-6">
              <label for="jabatan" class="form-label"><i class="icon-base ti tabler-briefcase"></i>Position</label>
              <input type="text" class="form-control" id="jabatan" readonly />
            </div>
            <div class="col-md-6">
              <label for="nomorID" class="form-label"><i class="icon-base ti tabler-id"></i>ID Number</label>
              <input class="form-control" type="text" id="nomorID" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="telepon"><i class="icon-base ti tabler-phone"></i>Phone</label>
              <input type="text" id="telepon" class="form-control" readonly />
            </div>
            <div class="col-md-6">
              <label for="alamat" class="form-label"><i class="icon-base ti tabler-home"></i>Address</label>
              <input type="text" class="form-control" id="alamat" readonly />
            </div>
            <div class="col-md-6">
              <label for="negara" class="form-label"><i class="icon-base ti tabler-world"></i>Country</label>
              <select id="negara" class="form-select"></select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Akun & keamanan -->
    <div class="col-xl-5">
      <div class="card profile-card h-100">
        <div class="card-body">
          <div class="profile-section-title"><span class="profile-section-icon"><i class="icon-base ti tabler-lock"></i></span>Account &amp; security</div>
          <div class="row gy-4 gx-6">
            <div class="col-12">
              <label for="username" class="form-label"><i class="icon-base ti tabler-at"></i>Username</label>
              <input class="form-control" type="text" id="username" readonly />
            </div>
            <div class="col-12">
              <label for="email" class="form-label"><i class="icon-base ti tabler-mail"></i>Email</label>
              <input class="form-control" type="text" id="email" readonly />
            </div>
            <div class="col-12">
              <label for="password" class="form-label"><i class="icon-base ti tabler-key"></i>Password</label>
              <input type="password" class="form-control" id="password" placeholder="Input to change password" readonly />
            </div>
            <div class="col-12 d-none" id="boxOldPassword">
              <label for="oldPassword" class="form-label"><i class="icon-base ti tabler-shield-lock"></i>Input Old Password</label>
              <input type="password" class="form-control" id="oldPassword">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Aksi -->
  <div class="profile-actions">
    <button type="button" class="btn btn-primary" id="editBtn"><i class="icon-base ti tabler-edit me-2"></i>Click to Update Data</button>
    <button type="button" class="btn btn-dark" id="cancelBtn" style="display: none;">Cancel</button>
    <button type="submit" class="btn btn-primary" id="submitBtn" style="display: none;"><i class="icon-base ti tabler-device-floppy me-2"></i>Save changes</button>
  </div>
</div>

<script src="js/setting/profile.js" type="text/javascript"></script>
