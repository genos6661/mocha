<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />

<div class="settings-page rp-danger">
  <a href="/reports" class="rl-back"><i class="icon-base ti tabler-arrow-left"></i>Reports</a>

  <div class="settings-head">
    <span class="settings-head-icon rl-head-icon"><i class="icon-base ti tabler-id-badge-2"></i></span>
    <div>
      <h4 class="mb-1">Guide Reports</h4>
      <p class="text-body-secondary mb-0">Guide commission and partner data. Pick a report to open it. <span class="rl-count">2 reports</span></p>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-xl-4 col-md-6 col-12 d-none" id="cardGuideCommission">
      <a href="/guide-report" class="rl-card text-decoration-none">
        <span class="rl-icon"><i class="icon-base ti tabler-coins"></i></span>
        <div class="rl-text">
          <h5 class="rl-title">Guide Commission</h5>
          <p class="rl-desc">Commission earned and payment per guide</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </a>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Partner Data" data-url="/partner-report">
        <span class="rl-icon"><i class="icon-base ti tabler-user-plus"></i></span>
        <div class="rl-text">
          <h5 class="rl-title">Partner Data</h5>
          <p class="rl-desc">Guide or partner details</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
  </div>
</div>

<script>
  // kartu laporan bisa dibuka dengan Enter / Spasi
  document.querySelectorAll('.rl-card').forEach(card => card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  }));
</script>

<script>
  // Guide Commission hanya tampil bagi pengguna dengan izin guide_report
  fetch(url_api + '/role/role-permissions?sub_kategori=Guide', {
    headers: { 'X-Client-Domain': myDomain, Authorization: `Bearer ${window.token}` }
  })
    .then(r => (r.ok ? r.json() : []))
    .then(permissions => {
      if (Array.isArray(permissions) && permissions.includes('guide_report')) {
        document.getElementById('cardGuideCommission').classList.remove('d-none');
      }
    })
    .catch(() => {});
</script>

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
        <div class="mb-3" id="boxSimpleRange">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3" id="boxRange">
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
        <div class="mb-3" id="boxCabang">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select"></select>
        </div>
        <div class="mb-3" id="boxNegara">
          <label for="negara" class="form-label">Country</label>
          <select id="negara" class="form-select"></select>
        </div>
        <div class="mb-3" id="boxSort">
          <label for="sort_by" class="form-label">Sort By</label>
          <select id="sort_by" class="form-select">
            <option value="nama">Name</option>
            <option value="nama_int_negara">Country</option>
            <option value="total_transaksi">Transactions Count</option>
            <option value="nilai_transaksi">Transactions Value</option>
          </select>
        </div>
        <div class="mb-3" id="boxSortDir">
          <label for="sort_dir" class="form-label">Sort Direction</label>
          <select id="sort_dir" class="form-select">
            <option value="asc">Ascending (ASC)</option>
            <option value="desc">Descending (DESC)</option>
          </select>
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

<script src="js/reports/guide-reports.js?v=<?= filemtime(__DIR__ . '/../../js/reports/guide-reports.js') ?>" type="text/javascript"></script>
