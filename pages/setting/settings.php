<div class="nav-align-top">
  <ul class="nav nav-pills flex-column flex-sm-row mb-6 gap-md-0 gap-2">
    <li class="nav-item">
      <button
        id="btnTabGeneral"
        type="button"
        class="nav-link active"
        data-bs-toggle="tab"
        data-bs-target="#general-tab"
        aria-controls="general-tab"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-settings-cog icon-sm me-1_5"></i> General Settings
      </button>
    </li>
    <li class="nav-item">
      <button
        id="btnTabCD"
        type="button"
        class="nav-link"
        data-bs-toggle="tab"
        data-bs-target="#cd-tab"
        aria-controls="cd-tab"
        role="tab"
        aria-selected="true">
        <i class="icon-base ti tabler-device-desktop-cog icon-sm me-1_5"></i> Customer Display
      </button>
    </li>
  </ul>
</div>

<div class="tab-content p-0">
  <!-- ~~~~~~~~~~~~~~~~~~~~~ general ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade active show" id="general-tab" role="tabpanel">
    <div class="card-header border-bottom p-2">
      <div class="row px-3">
        <div class="col-md p-0">
          <h5 class="card-title">General Settings</h5>
        </div>
      </div>      
    </div>
    <div class="card-body p-2">
      <div class="row">
        <div class="col-md mb-3">
          <label for="namaUsaha" class="form-label">Company Name</label>
          <input type="text" class="form-control" id="namaUsaha" name="namaUsaha" placeholder="Enter Your Company Name" />
        </div>
        <div class="col-md mb-3">
          <label for="logoUsaha" class="form-label">Company Logo</label>
          <input type="file" class="form-control" id="logoUsaha">
        </div>
      </div>
      <div class="row">
        <div class="col-md mb-3">
          <label for="idUserBI" class="form-label">ID Login Bank of Indonesia</label>
          <input type="text" class="form-control" id="idUserBI" name="idUserBI" placeholder="Enter Your Bank Indonesia ID" />
        </div>
        <div class="col-md mb-3">
          <label for="batasJam" class="form-label">15.00 PM Report Limit Admission</label>
          <select id="batasJam" class="form-select">
            <option value="1">Active</option>
            <option value="0">Non-Active</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md mb-3">
          <label for="rateJual" class="form-label">Sell's Rate Blank on Default</label>
          <select id="rateJual" class="form-select">
            <option value="1">Active</option>
            <option value="0">Non-Active</option>
          </select>
        </div>
        <div class="col-md mb-3">
          <label for="desain" class="form-label">Invoice Design</label>
          <select id="desain" class="form-select">
            <option value="A4" selected>Regular A4 Invoice</option>
            <option value="small">Small Continous Paper</option>
            <option value="a4_continous">Half A4 Continous Paper</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md mb-3">
          <label for="kasRPDefault" class="form-label">Cash Default (Rupiah)</label>
          <select id="kasRPDefault" class="form-select"></select>
        </div>
        <div class="col-md mb-3">
          <label for="bankRPDefault" class="form-label">Bank Default (Rupiah)</label>
          <select id="bankRPDefault" class="form-select"></select>
        </div>
      </div>
      <div class="row">
        <div class="col-md mb-3">
          <label for="kasUKADefault" class="form-label">Cash Default (Foreign Curr.)</label>
          <select id="kasUKADefault" class="form-select"></select>
        </div>
        <div class="col-md mb-3">
          <label for="bankUKADefault" class="form-label">Bank Default (Foreign Curr.)</label>
          <select id="bankUKADefault" class="form-select"></select>
        </div>
      </div>
      <div class="row">
        <div class="col-md d-flex justify-content-center gap-3 mb-2" id="boxLogo">
          
        </div>
        <div class="col-md d-flex justify-content-end align-items-end mb-2">
          <button class="btn btn-primary" id="sbmGeneral" >Submit</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ~~~~~~~~~~~~~~~~~~~~~ customer display ~~~~~~~~~~~~~~~~~~~~~ -->
  <div class="card p-3 tab-pane fade" id="cd-tab" role="tabpanel">
    <div class="card-header border-bottom p-2">
      <div class="row px-3">
        <div class="col-md p-0">
          <h5 class="card-title">Customer Display</h5>
        </div>
      </div>      
    </div>
    <div class="card-body p-2">
      <div class="row">
        <div class="col-md mb-4">
          <label for="subheader" class="form-label">Subheader Text</label>
          <input type="text" id="subheader" class="form-control" placeholder="Input Your Subheader Text" />
        </div>
        <div class="col-md mb-4">
          <label for="media" class="form-label">Media Display</label>
          <input type="file" id="media" class="form-control">
        </div>
      </div>
      <div id="mediaGrid"></div>
      <hr>
      <div class="row">
        <div class="col-md">
          <h5>Choose Forex To Display</h5>
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
      <div class="row">
        <div class="col table-responsive">
          <table id="tabelValas" class="table table-hover">
            <thead>
              <tr>
                <th>
                  <div class="form-check form-check-primary w-100 h-100">
                    <input class="form-check-input" type="checkbox" value="1" id="displayAllValas">
                  </div>
                </th>
                <th>Code</th>
                <th>Name</th>
                <th>Flag</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md mb-2 d-flex justify-content-end">
          <button class="btn btn-primary" id="sbmCD">Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- modal flags -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalUploadFlag" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Choose Flag for <span id="namaValasFlag"></span></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="idValasFlag">
        <input type="hidden" id="kodeValasFlag">
        <div class="row g-3">
          <?php
            $folderPath = 'assets/img/flags/';
            $files = glob($folderPath . '*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE);
            foreach ($files as $index => $file): 
              $filename = basename($file);
            ?>
            <div class="col-4 col-md-3 col-lg-2">
              <label class="w-100 border rounded text-center p-2 bg-light shadow">
                <input type="radio" name="bendera" value="<?= $filename ?>" class="form-check-input d-block mx-auto mb-2">
                <div class="ratio ratio-1x1 mb-2">
                  <img src="<?= $file ?>" class="w-100 h-auto d-block mx-auto" alt="<?= $filename ?>">
                </div>
                <small class="text-break"><?= $filename ?></small>
              </label>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
      <div class="modal-footer pt-3">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" id="sbmFlag" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalFlag" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content bg-light">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Flag of <span id="namaRemoveFlag"></span></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="idRemoveFlag">
        <input type="hidden" id="kodeRemoveFlag">
        <img src="" alt="" id="viewFlag" class="w-100">
      </div>
      <div class="modal-footer">
        <button type="button" id="removeFlag" class="btn btn-danger">Remove Flag</button>
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalHapusLogo" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Company Logo</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img src="" alt="" id="viewLogo" class="w-100">
      </div>
      <div class="modal-footer">
        <button type="button" id="removeLogo" class="btn btn-danger">Remove Logo</button>
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/setting/setting.js" type="text/javascript"></script>