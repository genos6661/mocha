<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
<style>
  .custom-border {
    border-bottom: 1px solid;
  }

  @media (min-width: 768px) {
    .custom-border {
      border-bottom: none;
      border-right: 1px solid;
    }
  }

  .dm-serif-text-regular {
    font-family: "DM Serif Text", serif;
    font-weight: 500;
    font-style: normal;
  }

  .national-park {
    font-family: "National Park", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
  }

  .instrument-serif {
    font-family: "Instrument Serif", serif;
    font-weight: 500;
    font-style: normal;
  }

  .spectral {
    font-family: "Spectral", serif;
    font-weight: 500;
    font-style: normal;
  }
</style>

<div class="row mb-2">
  <div class="col-md">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb breadcrumb-custom-icon">
        <li class="breadcrumb-item">
          <a href="/reports">Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item">
          <a href="/bi-reports">BI Reports</a>
          <i class="breadcrumb-icon icon-base ti tabler-chevron-right align-middle icon-xs"></i>
        </li>
        <li class="breadcrumb-item active">LKPE</li>
      </ol>
    </nav>
  </div>
  <div class="col-md d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-label-primary waves-effect" data-bs-toggle="modal" data-bs-target="#modalFilter"><i class="icon-base ti tabler-filter icon-lg me-2"></i> Filter</button>
  </div>
</div>

<div class="card pb-4" id="cardData">
  <div class="card-header">
    <p class="h4 text-center mb-0 spectral" id="namaPT"></p>
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">LKPE</p>
    <p class="h5 text-center text-secondary spectral mb-1">Laporan Keuangan Perubahan Ekuitas</p>
    <p class="h5 text-center mb-1 text-secondary national-park" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
  </div>
  <div class="card-body">
    <table class="table table-bordered border-collapse">
      <thead class="table-dark">
        <tr>
          <th class="text-center" style="width: 25%;">Keterangan</th>
          <th class="text-center" style="width: 25%;">Modal Disetor</th>
          <th class="text-center" style="width: 25%;">Laba Ditahan (Akumulasi Rugi)</th>
          <th class="text-center" style="width: 25%;">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-3 fw-bold border">Saldo Per Tahun Kemarin</td>
          <td class="border"></td>
          <td class="border"></td>
          <td class="border p-3">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="totalSaldoAwal"></span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Saldo Positif</td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="modalPositif"></span>
            </div>
          </td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="labaPositif"></span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Saldo Negatif</td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="modalNegatif"></span>
            </div>
          </td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="labaNegatif"></span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
        </tr>
        <tr>
          <td class="p-3 fw-bold border">Laba / Rugi Periode Berjalan</td>
          <td class="border"></td>
          <td class="border"></td>
          <td class="border p-3">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="labaBerjalan"></span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Laba</td>
          <td class="border"></td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="labaBerjalanPositif">0</span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Rugi</td>
          <td class="border"></td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="labaBerjalanNegatif">0</span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
        </tr>
        <tr>
          <td class="p-3 fw-bold border">Pembagian Dividen (-/-)</td>
          <td class="border"></td>
          <td class="p-3 border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="dividen">0</span>
            </div>
          </td>
          <td class="border p-3">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="totalDividen">0</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
        </tr>
        <tr>
          <td class="p-3 fw-bold border">Lain - lain</td>
          <td class="border"></td>
          <td class="border"></td>
          <td class="border p-3">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="mutasi"></span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Menambah Ekuitas</td>
          <td class="border"></td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="mutasiPositif"></span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 ps-5 border">- Mengurangi Ekuitas</td>
          <td class="border"></td>
          <td class="p-3 text-end border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="mutasiNegatif"></span>
            </div>
          </td>
          <td class="border"></td>
        </tr>
        <tr>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
          <td class="p-3 border">&nbsp;</td>
        </tr>
        <tr>
          <td class="p-3 fw-bold border">Saldo Per 31 Desember</td>
          <td class="p-3 fw-bold border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="totalModalDisetor"></span>
            </div>
          </td>
          <td class="p-3 fw-bold border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="totalLabaDitahan"></span>
            </div>
          </td>
          <td class=" p-3 fw-bold border">
            <div class="d-flex justify-content-between">
              <span>Rp.</span><span id="total"></span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="btn-group mt-6" role="group" aria-label="First group">
  <button type="button" class="btn btn-outline-primary waves-effect" id="exportPDF"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="exportExcel"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Laba Rugi</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <input type="hidden" id="urlToGo">
        <div class="mb-3">
          <label for="rangeFilter" class="form-label">Simple Range</label>
          <select id="rangeFilter" class="form-select">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year (Default)</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3">
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
        <div class="mb-3">
          <label for="cabangFilter" class="form-label">Branch</label>
          <select id="cabangFilter" class="form-select"></select>
        </div>
        <!-- <div class="mb-3">
          <label for="showOptionFilter" class="form-label">Displayed Option</label>
          <select id="showOptionFilter" class="form-select">
            <option value="1" selected>Show All Forexs</option>
            <option value="2">Only Show Forexs with balance</option>
            <option value="3">Only Show Forexs with mutation</option>
          </select>
        </div>
        <div class="d-flex justify-content-end mb-0">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="includeClosed">
            <label class="form-check-label" for="includeClosed">Include Closed</label>
          </div>
        </div> -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/reports/bi-reports/lkpe.js" type="text/javascript"></script>