<link rel="stylesheet" href="/assets/css/settings.css?v=<?= filemtime(__DIR__ . '/../../assets/css/settings.css') ?>" />
<link rel="stylesheet" href="/assets/css/reports.css?v=<?= filemtime(__DIR__ . '/../../assets/css/reports.css') ?>" />

<div class="settings-page rp-success">
  <a href="/reports" class="rl-back"><i class="icon-base ti tabler-arrow-left"></i>Reports</a>

  <div class="settings-head">
    <span class="settings-head-icon rl-head-icon"><i class="icon-base ti tabler-building-bank"></i></span>
    <div>
      <h4 class="mb-1">BI Reports</h4>
      <p class="text-body-secondary mb-0">Reports required by Bank Indonesia. Pick a report to set its filter and open it. <span class="rl-count">6 reports</span></p>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Summary Valas" data-range="month" data-url="/summary-valas">
        <span class="rl-icon rl-img"><img src="/assets/img/report/sv.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">Summary Forex</h5>
          <p class="rl-desc">Ringkasan Mutasi Per Valas</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="LKUB" data-range="month" data-url="/lkub">
        <span class="rl-icon rl-img"><img src="/assets/img/report/LKUB.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">LKUB</h5>
          <p class="rl-desc">Laporan Kegiatan Usaha Bulanan</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Neraca" data-range="today" data-url="/neraca">
        <span class="rl-icon rl-img"><img src="/assets/img/report/neraca.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">Balance Sheet</h5>
          <p class="rl-desc">Laporan Neraca (BI)</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="LKPE" data-range="year" data-url="/lkpe">
        <span class="rl-icon rl-img"><img src="/assets/img/report/LKPE.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">LKPE</h5>
          <p class="rl-desc">Laporan Keuangan Perubahan Ekuitas</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Laba Rugi" data-range="month" data-url="/laba-rugi">
        <span class="rl-icon rl-img"><img src="/assets/img/report/labarugi.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">Profit & Loss</h5>
          <p class="rl-desc">Laporan Keuangan Laba/Rugi</p>
        </div>
        <i class="icon-base ti tabler-chevron-right rl-arrow"></i>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 col-12">
      <div class="rl-card" role="button" tabindex="0" data-bs-toggle="modal" data-bs-target="#filter" data-nama="Summary Valas Advance" data-range="month" data-url="/summary-valas-advance">
        <span class="rl-icon rl-img"><img src="/assets/img/report/logs.png" alt=""></span>
        <div class="rl-text">
          <h5 class="rl-title">Summary Forex Advance</h5>
          <p class="rl-desc">Ringkasan Mutasi Per Valas Advance</p>
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
        <div class="mb-3 d-none" id="boxBulanTahun">
          <div class="mb-3">
            <label for="rangeLKUB" class="form-label">Simple Range</label>
            <select id="rangeLKUB" class="form-select">
              <option value="" selected hidden>Choose a quick range (optional)</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
          <div class="row">
            <div class="col-md">
              <label for="bulanFilter" class="form-label">Month</label>
              <select id="bulanFilter" class="form-select">
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div class="col-md">
              <label for="tahunFilter" class="form-label">Year</label>
              <select id="tahunFilter" class="form-select"></select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select"></select>
        </div>
        <div class="mb-3 d-none" id="boxUser">
          <label for="userInput" class="form-label">User Input</label>
          <select id="userInput" class="form-select"></select>
        </div>
        <div class="mb-3" id="boxShowing">
          <label for="showOption" class="form-label">Displayed Option</label>
          <select id="showOption" class="form-select">
            <option value="1">Show All Forexs</option>
            <option value="2" selected>Only Show Forexs with balance</option>
            <option value="3">Only Show Forexs with mutation</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxShowingLKUB">
          <label for="showOptionLKUB" class="form-label">Displayed Option</label>
          <select id="showOptionLKUB" class="form-select">
            <option value="1">Show All Forexs</option>
            <option value="2" selected>Only Show Forexs with Rate Tengah</option>
            <option value="3">Custom Forex</option>
          </select>
        </div>
        <div class="mb-3 d-none" id="boxCustomForexLKUB">
          <label class="form-label">Select Forex</label>
          <div id="customForexListLKUB" class="d-flex flex-wrap gap-2"></div>
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

<script src="js/reports/bi-reports.js" type="text/javascript"></script>