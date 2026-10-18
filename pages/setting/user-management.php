<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/user-management.css?v=<?= filemtime(__DIR__ . '/../../assets/css/user-management.css') ?>" />

<div class="settings-page">
  <div class="settings-head">
    <span class="settings-head-icon"><i class="icon-base ti tabler-users-group"></i></span>
    <div>
      <h4 class="mb-1">User Management</h4>
      <p class="text-body-secondary mb-0">Manage users, roles with their access rights, and register new users.</p>
    </div>
  </div>

  <div class="nav-align-top">
    <ul class="nav nav-pills settings-tabs flex-column flex-sm-row mb-6 gap-md-0 gap-2">
      <li class="nav-item">
        <button
          id="btnTabUsers"
          type="button"
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#tab-users"
          aria-controls="tab-users"
          role="tab"
          aria-selected="true">
          <i class="icon-base ti tabler-users icon-sm me-1_5"></i> Users
        </button>
      </li>
      <li class="nav-item">
        <button
          id="btnTabRoles"
          type="button"
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#tab-roles"
          aria-controls="tab-roles"
          role="tab"
          aria-selected="true">
          <i class="icon-base ti tabler-users-group icon-sm me-1_5"></i> Roles
        </button>
      </li>
      <li class="nav-item">
        <button
          id="btnTabRegister"
          type="button"
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#tab-register"
          aria-controls="tab-register"
          role="tab"
          aria-selected="true">
          <i class="icon-base ti tabler-user-plus icon-sm me-1_5"></i> Register
        </button>
      </li>
    </ul>
  </div>

  <div class="tab-content p-0">
    <!-- ~~~~~~~~~~~~~~~~~~~~~ users ~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="card settings-card tab-pane fade active show" id="tab-users" role="tabpanel">
      <div class="row p-3">
        <div class="col-md d-flex align-items-center gap-3 mb-2 mb-md-0">
          <h5 class="card-title mb-0">All Users</h5>
          <button id="btnReloadUsers" class="btn btn-primary" type="button">
            <i class="icon-base ti tabler-reload icon-sm me-1_5"></i> Reload
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
        <table class="datatables-users table table-bordered table-hover table-cards" id="tabelUser">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="row mt-2 px-3 pb-3">
        <div class="col-md">
            <p class="mb-0">Total Users : <span id="totalUser"></span></p>
        </div>
      </div>
    </div>

    <!-- ~~~~~~~~~~~~~~~~~~~~~ roles ~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="card settings-card tab-pane fade" id="tab-roles" role="tabpanel">
      <div class="row p-3">
        <div class="col-md d-flex align-items-center flex-wrap gap-2 mb-2 mb-md-0">
          <h5 class="card-title mb-0 me-1">All Roles</h5>
          <button class="btn btn-primary nowrap" id="btnShowLevel">
            Level Tree
          </button>
          <button class="btn btn-primary nowrap" data-bs-toggle="modal" data-bs-target="#modalTambahRole" id="btnTambahRole">
            <i class="icon-base ti tabler-plus icon-16px me-md-2"></i><span class="d-md-inline-block d-none nowrap">New Role</span>
          </button>
        </div>
        <div class="col-md d-flex justify-content-end flex-wrap">
          <div class="dt-sort-host d-flex align-items-center" id="sortHostRole"></div>
          <div class="input-group input-group-merge filtertabelRole">
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
      <div class="card-datatable table-responsive px-3">
        <table class="datatables-users table table-bordered table-hover table-cards" id="tabelRole">
          <thead>
            <tr>
              <th>No</th>
              <th>Name / Code</th>
              <th>Level</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="row mt-2 px-3 pb-3">
        <div class="col-md">
            <p class="mb-0">Total Roles : <span id="totalRole"></span></p>
        </div>
      </div>
    </div>

    <!-- ~~~~~~~~~~~~~~~~~~~~~ register ~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="card settings-card tab-pane fade" id="tab-register" role="tabregister">
      <div class="card-body">
        <form id="formRegister">
          <div class="nav-align-top mb-4">
            <ul class="nav nav-pills um-subtabs" role="tablist">
              <li class="nav-item">
                <button
                  type="button"
                  class="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#register-personal"
                  aria-controls="register-personal"
                  role="tab"
                  aria-selected="true">
                  <i class="icon-base ti tabler-user icon-sm me-1_5"></i>Personal Info
                </button>
              </li>
              <li class="nav-item">
                <button
                  type="button"
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#register-account"
                  aria-controls="register-account"
                  role="tab"
                  aria-selected="false">
                  <i class="icon-base ti tabler-user-cog icon-sm me-1_5"></i>Account Details
                </button>
              </li>
            </ul>
          </div>

          <div class="tab-content p-0">
            <!-- Personal Info -->
            <div class="tab-pane fade active show" id="register-personal" role="tabregister">
              <div class="settings-section mb-0">
                <div class="settings-section-title"><span class="settings-section-icon"><i class="icon-base ti tabler-user"></i></span>Personal information</div>
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label" for="namaReg">Full Name</label>
                    <input type="text" id="namaReg" class="form-control" placeholder="Full Name" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="nomorIDReg">ID Number</label>
                    <input type="text" id="nomorIDReg" class="form-control" placeholder="NIK/Passport Number" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="teleponReg">Phone</label>
                    <input type="text" id="teleponReg" class="form-control" placeholder="Phone Number" />
                  </div>
                  <div class="col-md-6 select2-primary">
                    <label class="form-label" for="negaraReg">Country</label>
                    <select id="negaraReg" class="form-select"></select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="alamatReg">Address</label>
                    <input type="text" id="alamatReg" class="form-control" placeholder="Address" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="pekerjaanReg">Occupation / Position</label>
                    <input type="text" id="pekerjaanReg" class="form-control" placeholder="Position on job" />
                  </div>
                  <div class="col-12">
                    <label class="form-label d-block" for="jkReg">Gender</label>
                    <div class="btn-group um-gender" role="group" aria-label="Gender">
                      <input type="radio" class="btn-check" name="jkReg" id="male" checked>
                      <label class="btn btn-outline-primary" for="male"><i class="icon-base ti tabler-gender-male me-1"></i>Male</label>
                      <input type="radio" class="btn-check" name="jkReg" id="female">
                      <label class="btn btn-outline-primary" for="female"><i class="icon-base ti tabler-gender-female me-1"></i>Female</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Details -->
            <div class="tab-pane fade" id="register-account" role="tabregister">
              <div class="settings-section mb-0">
                <div class="settings-section-title"><span class="settings-section-icon"><i class="icon-base ti tabler-user-cog"></i></span>Account details</div>
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label" for="usernameReg">Username</label>
                    <input type="text" id="usernameReg" class="form-control" placeholder="Username" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="roleReg">Role</label>
                    <select id="roleReg" class="form-select"></select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="emailReg">Email</label>
                    <div class="input-group input-group-merge">
                      <input type="email" id="emailReg" class="form-control" placeholder="Email" />
                      <span class="input-group-text" id="formtabs-email2">@example.com</span>
                    </div>
                  </div>
                  <div class="col-md-6 form-password-toggle">
                    <label class="form-label" for="passwordReg">Password</label>
                    <div class="input-group input-group-merge">
                      <input
                        type="password"
                        id="passwordReg"
                        class="form-control"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                      <span class="input-group-text cursor-pointer" id="formtabs-password2"
                        ><i class="icon-base ti tabler-eye-off"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="cabangReg">Branchs Limitation</label>
                    <select id="cabangReg" class="form-select" multiple></select>
                  </div>
                  <div class="col-md-6 d-flex align-items-end">
                    <div class="form-check form-switch mb-2">
                      <input class="form-check-input" type="checkbox" id="request" value="1" />
                      <label class="form-check-label" for="request">Allow Rate Request</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="um-form-actions">
            <button type="reset" class="btn btn-label-secondary">Cancel</button>
            <button type="button" id="sbmReg" class="btn btn-primary"><i class="icon-base ti tabler-user-plus me-2"></i>Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal role -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTambahRole" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formRoleBaru" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-shield-lock"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">New Role Data</h4>
          <p class="mf-sub">Create a role and choose its access rights.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-shield-lock"></i>Role</div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="kode" class="form-label">Code</label>
              <input type="text" id="kode" class="form-control" placeholder="Input Role Code" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="nama" class="form-label">Name</label>
              <input type="text" id="nama" class="form-control" placeholder="Input Role Name" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="level" class="form-label">Level</label>
              <input type="number" id="level" class="form-control" min="2" value="2" />
            </div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-lock-access"></i>Access rights</div>
          <p class="mf-hint mb-3"><i class="icon-base ti tabler-info-circle"></i>Tick a category or sub-category to select everything inside it. Click its name to expand.</p>
          <div id="permissionsContainer"></div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmTambahRole" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save</button>
      </div>
    </form>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalEditRole" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formEditRole" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-shield-lock"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Edit Role Data</h4>
          <p class="mf-sub">Change the role and its access rights.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEditRole">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-shield-lock"></i>Role</div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="kodeEdit" class="form-label">Code</label>
              <input type="text" id="kodeEdit" class="form-control" placeholder="Input Role Code" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="namaEdit" class="form-label">Name</label>
              <input type="text" id="namaEdit" class="form-control" placeholder="Input Role Name" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="levelEdit" class="form-label">Level</label>
              <input type="number" id="levelEdit" class="form-control" min="2" />
            </div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-lock-access"></i>Access rights</div>
          <p class="mf-hint mb-3"><i class="icon-base ti tabler-info-circle"></i>Tick a category or sub-category to select everything inside it. Click its name to expand.</p>
          <div id="permissionsContainerEdit"></div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmEditRole" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save</button>
      </div>
    </form>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalHapusRole" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapus" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete Role Data</h4>
        <input type="hidden" id="idHapusRole">
        <p class="mb-1">Continue to delete Role <span class="fw-semibold text-heading" id="refHapusRole"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapusRole" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalDetailRole" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog  modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-shield-lock"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Role Detail</h4>
          <p class="mf-sub">Role, level and its access rights.</p>
        </div>
        <div class="mf-meta"><div id="statusDetailRole"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-shield-lock"></i>Role</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Code</span><span class="dl-value dataDetail" id="kodeDetailRole"></span></div>
            <div class="dl-item"><span class="dl-label">Name</span><span class="dl-value dataDetail" id="namaDetailRole"></span></div>
            <div class="dl-item"><span class="dl-label">Level</span><span class="dl-value dataDetail" id="levelDetailRole"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-lock-access"></i>Access rights</div>
          <div id="boxTreeDetail" class="d-flex flex-column align-items-center gap-4 position-relative"></div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-outline-primary btn d-none" id="activateBtnRole">Activate</button>
        <button class="btn-outline-danger btn d-none" id="deactivateBtnRole">Deactivate</button>
        <button class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#modalEditRole" id="editBtnRole">Edit</button>
        <button class="btn btn-danger d-none" id="deleteBtnRole" data-bs-toggle="modal" data-bs-target="#modalHapusRole">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalLevel" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-hierarchy-2"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Level Tree</h4>
          <p class="mf-sub">Roles grouped by level. A lower level number has higher authority.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="boxTree" class="d-flex flex-column align-items-center gap-4 position-relative"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal user -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetailUser" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content mf-modal">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-user"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">User Detail</h4>
          <p class="mf-sub">Profile and login account of this user.</p>
        </div>
        <div class="mf-meta"><div id="statusDetail"></div></div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-id"></i>Profile</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Profile Code</span><span class="dl-value dataDetail" id="kodeDetail"></span></div>
            <div class="dl-item"><span class="dl-label">NIK</span><span class="dl-value dataDetail" id="nikDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Name</span><span class="dl-value dataDetail" id="namaDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Occupation/Position</span><span class="dl-value dataDetail" id="posisiDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Phone</span><span class="dl-value dataDetail" id="teleponDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Email</span><span class="dl-value dataDetail" id="emailDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Address</span><span class="dl-value dataDetail" id="alamatDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Country</span><span class="dl-value dataDetail" id="negaraDetail"></span></div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-user-cog"></i>Account</div>
          <div class="dl-grid">
            <div class="dl-item"><span class="dl-label">Username</span><span class="dl-value dataDetail" id="usernameDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Role</span><span class="dl-value dataDetail" id="roleDetail"></span></div>
            <div class="dl-item dl-wide"><span class="dl-label">Branchs</span><span class="dl-value dataDetail" id="cabangDetail"></span></div>
            <div class="dl-item"><span class="dl-label">Allow Request Rate</span><span class="dl-value dataDetail" id="requestDetail"></span></div>
          </div>
        </div>
      </div>

      <div class="modal-footer flex-wrap">
        <button class="btn-outline-primary btn d-none" id="activateBtn">Activate</button>
        <button class="btn-outline-danger btn d-none" id="deactivateBtn">Deactivate</button>
        <button class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#modalEditUser" id="editBtn">Edit</button>
        <button class="btn btn-danger d-none" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapusUser">Delete</button>
        <button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalEditUser" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog  modal-dialog-scrollable">
    <form class="modal-content mf-modal" id="formEditUser" onsubmit="return false;">
      <div class="mf-head">
        <span class="mf-icon"><i class="icon-base ti tabler-user-edit"></i></span>
        <div>
          <h4 class="mf-title" id="backDropModalTitle">Edit User Data</h4>
          <p class="mf-sub">Change the login account, role and branch access of this user.</p>
        </div>
        <button type="button" class="btn-close mf-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <input type="hidden" id="idEditUser">
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-user-cog"></i>Account</div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="namaEditUser" class="form-label">Username</label>
              <input type="text" id="namaEditUser" class="form-control" placeholder="Input Username" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="emailEditUser" class="form-label">Email</label>
              <input type="email" id="emailEditUser" class="form-control" placeholder="Input Email" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="roleEditUser" class="form-label">Role</label>
              <select id="roleEditUser" class="form-select"></select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="passwordEditUser" class="form-label">Password</label>
              <input type="password" id="passwordEditUser" class="form-control" placeholder="Keep blank unless update the password" />
            </div>
          </div>
        </div>
        <div class="mf-section">
          <div class="mf-section-title"><i class="icon-base ti tabler-building-store"></i>Access</div>
          <div class="row">
            <div class="col-12 mb-3">
              <label for="cabangEditUser" class="form-label">Branchs Limitation</label>
              <select id="cabangEditUser" class="form-select" multiple></select>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-4 mt-1">
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="requestEdit" value="1" />
              <label class="form-check-label" for="requestEdit">Allow Request</label>
            </div>
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="aktifEdit" value="1" />
              <label class="form-check-label" for="aktifEdit">Active</label>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmEditUser" class="btn btn-primary"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save</button>
      </div>
    </form>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalHapusUser" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <form class="modal-content mf-modal mf-confirm" id="formHapusUser" onsubmit="return false;">
      <div class="modal-body text-center">
        <span class="mf-confirm-icon"><i class="icon-base ti tabler-trash"></i></span>
        <h4 class="mf-title mb-2" id="backDropModalTitle">Delete User Data</h4>
        <input type="hidden" id="idHapusUser">
        <p class="mb-1">Continue to delete User <span class="fw-semibold text-heading" id="refHapusUser"></span>?</p>
        <p class="mf-confirm-note mb-0">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmHapusUser" class="btn btn-danger"><i class="icon-base ti tabler-trash icon-sm me-2"></i>Delete</button>
      </div>
    </form>
  </div>
</div>

<script src="js/table-render.js?v=<?= filemtime(__DIR__ . '/../../js/table-render.js') ?>" type="text/javascript"></script>
<script src="js/setting/user.js" type="text/javascript"></script>
<script src="js/setting/role.js" type="text/javascript"></script>
<script src="js/setting/register.js" type="text/javascript"></script>