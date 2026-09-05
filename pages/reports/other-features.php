<style>
  #tabelDTTOT tbody tr {
    cursor: pointer;
  }
</style>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb breadcrumb-custom-icon">
    <li class="breadcrumb-item">
      <a href="/reports">Reports</a>
      <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
    </li>
    <li class="breadcrumb-item active">Other Features</li>
  </ol>
</nav>

<div class="row row-cols-md-3 row-cols-1 justify-content-center">
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 p-4 cursor-pointer" style="background-color: var(--bs-card-bg);" data-bs-toggle="modal" data-bs-target="#modalUpload" data-nama="DTTOT Identification">
      <div class="avatar">
        <div class="avatar-initial bg-primary rounded">
          <i class="icon-base ti tabler-report icon-xl"></i>
        </div>
      </div>
      <div>
        <h5 class="mb-0 text-body">DTTOT Identification</h5>
        <span class="text-body-secondary">Upload file excel untuk identifikasi DTTOT</span>
      </div>
    </div>
  </div>
  <div class="col mb-6">
    <div class="shadow rounded d-flex align-items-center gap-4 p-4 cursor-pointer" style="background-color: var(--bs-card-bg);" data-bs-toggle="modal" data-bs-target="#filter" data-nama="DTTOT List" data-range="all" data-url="/dttot-list">
      <div class="avatar">
        <div class="avatar-initial bg-primary rounded">
          <i class="icon-base ti tabler-list-details icon-xl"></i>
        </div>
      </div>
      <div>
        <h5 class="mb-0">DTTOT List</h5>
        <span>Daftar pelanggan terindikasi DTTOT</span>
      </div>
    </div>
  </div>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="filter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter"></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <input type="hidden" id="urlToGo">
        <div class="mb-3 d-none" id="boxSimpleRange">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month (Default)</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxSimpleDate">
          <label for="simpleDate" class="form-label">Simple Date</label>
          <select id="simpleDate" class="form-select">
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxRange">
          <div class="row">
            <div class="col-md">
              <label for="startDate" class="form-label">Date From</label>
              <input type="date" class="form-control" id="startDate">
            </div>
            <div class="col-md">
              <label for="endDate" class="form-label">Until</label>
              <input type="date" class="form-control" id="endDate">
            </div>
          </div>
        </div>
        <div class="mb-3 d-none" id="boxSingleDate">
          <label for="singleDate" class="form-label">Date</label>
          <input type="date" class="form-control" id="singleDate">
        </div>
        <div class="mb-3 d-none" id="boxTipeKontak">
          <label for="tipe_kontak" class="form-label">Contact Type</label>
          <select id="tipe_kontak" class="form-select">
            <option value="" selected hidden disabled>All Types</option>
            <option value="101">Personal</option>
            <option value="201">Money Changer (Company)</option>
            <option value="202">Bank (Company)</option>
            <option value="203">Payment Service Provider (PJP)</option>
            <option value="204">Company (Others)</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxNegara">
          <label for="negara" class="form-label">Country</label>
          <select id="negara" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxTipeLog">
          <label for="tipeLog" class="form-label">Type</label>
          <select id="tipeLog" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxAktivitasLog">
          <label for="aktivitasLog" class="form-label">Activity</label>
          <select id="aktivitasLog" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxEmailLog">
          <label for="emailLog" class="form-label">Email</label>
          <select id="emailLog" class="form-select"></select>
        </div>
        <div class="mb-1 d-flex d-none justify-content-end gap-2" id="boxShowDTTOT">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="showDTTOT-1" name="showDTTOT" value="-1">
            <label class="form-check-label" for="showDTTOT-1">Non-DTTOT (Whitelist)</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="showDTTOT1" name="showDTTOT" value="1" checked>
            <label class="form-check-label" for="showDTTOT1">DTTOT</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="showDTTOT2" name="showDTTOT" value="2" checked>
            <label class="form-check-label" for="showDTTOT2">DTTOT (Reported)</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <!-- <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button> -->
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- upload -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalUpload" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">DTTOT Identification</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-6">
        <div class="d-none" id="boxTabelDTTOT">
          <table class="table" id="tabelDTTOT">
            <thead>
              <tr>
                <th>
                  <input
                  type="checkbox"
                  class="form-check-input"
                  value="all" id="checkAllDTTOT">
                </th>
                <th class="table-primary">Input Name</th>
                <th>Customer Name</th>
                <th>ID Number</th>
                <th>Address</th>
                <th class="text-center">Nationality</th>
                <th class="text-center">Similarity</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="d-flex justify-content-between">
            <p class="h6 fst-italic">Click to select data</p>
            <div class="d-flex justify-content-end gap-3">
              <p class="h6" id="dttotCountSelect"></p>
              <button class="btn btn-primary" id="addToList">Add to DTTOT List</button>
            </div>
          </div>
        </div>
        <input type="hidden" id="urlToOpen">
        <div id="boxUploadDTTOT">
          <div class="mb-3">
            <label for="excelDTTOT" class="form-label">Upload File Excel</label>
            <input type="file" class="form-control" id="excelDTTOT" accept=".xlsx, .xls">
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" id="sbmUpload" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="https://unpkg.com/read-excel-file/bundle/read-excel-file.min.js"></script>
<script src="js/reports/other-features.js" type="text/javascript"></script>