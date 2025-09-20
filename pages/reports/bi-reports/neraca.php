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
        <li class="breadcrumb-item active">Neraca</li>
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
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">Balance Sheet</p>
    <p class="h5 text-center text-secondary spectral mb-0" id="headerIndo">Laporan Neraca</p>
    <p class="h5 text-center mb-0 text-secondary national-park" id="range"></p>
    <p class="h5 text-center mb-0 text-secondary national-park d-none" id="cabang"></p>
    <p class="h6 text-center text-secondary national-park fst-italic d-none" id="user"></p>
  </div>
  <div class="card-body row">
    <div class="col-md custom-border pb-3 pb-md-2 pt-0">
      <p class="h4 mb-0 text-center">HARTA</p>
      <p class="h5 mb-0">&nbsp;</p>
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td class="p-1" colspan="5">Kas dan Bank Dalam Rupiah</td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Kas</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%;" id="kasRP" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Bank</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="bankRP" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td colspan="4" class="p-1 text-end">Rp. </td>
            <td class=" p-1 text-end" style="border-bottom: 1px solid;" id="KasBankRP" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">Kas dan Bank Dalam UKA</td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Kas Dalam UKA</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%;" id="kasUKA" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Bank Dalam UKA</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="bankUKA" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td colspan="4" class="p-1 text-end">Rp. </td>
            <td class=" p-1 text-end" style="border-bottom: 1px solid;" id="KasBankUKA" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Piutang TC</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="piutangTC" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Piutang Lain-lain</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="piutangLain" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Sewa Dibayar Dimuka</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="sewa" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Asuransi Dibayar Dimuka</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" style="border-bottom: 1px solid;" id="asuransi" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">Aset Tetap</td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Harga Perolehan</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%;" id="aset" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Akum. Penyusutan</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="penyusutan" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Aset Lain - lain</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" style="border-bottom: 1px solid;" id="asetLain" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1 fw-bold" colspan="3">Total Harta</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end fw-bold" style="border-bottom: 1px solid;" id="totalHarta" contenteditable="true"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- kanan -->
    <div class="col-md pt-3 pt-md-0">
      <p class="h4 text-center mb-0">KEWAJIBAN DAN EKUITAS</p>
      <p class="h5 mb-0">Kewajiban</p>
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td class="p-1" colspan="5">Pinjaman Yang Diterima</td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Dalam Rupiah</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%;" id="pinjamanRP" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">Dalam UKA</td>
            <td class="p-1" style="width: 10%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="pinjamanUKA" contenteditable="true"></td>
            <td class="p-1" style="width: 25%;"></td>
          </tr>
          <tr>
            <td colspan="4" class="p-1 text-end">Rp. </td>
            <td class=" p-1 text-end" style="border-bottom: 1px solid;" id="pinjaman" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Hutang Sewa</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="hutangSewa" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Kewajiban Pengiriman Uang</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="hutangKirimUang" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="3">Kewajiban Lain - lain</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end" id="hutangLain" style="border-bottom: 1px solid;" contenteditable="true"></td>
          </tr>
          <tr>
            <td colspan="4" class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end fw-bold" id="totalKewajiban" style="border-bottom: 1px solid;"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="pt-2 h5 mb-0">Ekuitas</p>
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td class="p-1" style="width: 50%;" colspan="3">Modal Disetor</td>
            <td class="p-1 text-end" style="width: 25%;">Rp. </td>
            <td class="p-1 text-end" id="modal" style="border-bottom: 1px solid;" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">Laba Ditahan/(Akum. rugi) - net</td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">- Laba</td>
            <td class="p-1 text-end" colspan="2" style="width: 35%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%;" id="laba" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" style="width: 7%;"></td>
            <td class="p-1" style="width: 33%;">- Rugi</td>
            <td class="p-1 text-end" colspan="2" style="width: 35%;">Rp. </td>
            <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="rugi" contenteditable="true"></td>
          </tr>
          <tr>
            <td colspan="4" class="p-1 text-end">Rp. </td>
            <td class=" p-1 text-end" style="border-bottom: 1px solid;" id="totalEkuitas" contenteditable="true"></td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1" colspan="5">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td class="p-1 fw-bold" colspan="3">Total Kewajiban + Ekuitas</td>
            <td class="p-1 text-end">Rp. </td>
            <td class="p-1 text-end fw-bold" style="border-bottom: 1px solid;" id="totalKewajibanEkuitas" contenteditable="true"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<div class="btn-group mt-6" role="group" aria-label="First group">
  <button type="button" class="btn btn-outline-primary waves-effect" id="exportPDF"><i class="icon-base ti tabler-file-type-pdf"></i>PDF</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="exportExcel"><i class="icon-base ti tabler-file-spreadsheet"></i>Excel</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-file-type-csv"></i>CSV</button>
  <button type="button" class="btn btn-outline-primary waves-effect" id="eksporTXT"><i class="icon-base ti tabler-file-text"></i>TXT</button>
  <button type="button" class="btn btn-outline-primary waves-effect"><i class="icon-base ti tabler-printer"></i>Print</button>
</div>

<!-- filter -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="judulFilter">Neraca</h5>
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
          <label for="rangeFilter" class="form-label">Simple Date</label>
          <select id="rangeFilter" class="form-select">
            <option value="today">Today (Default)</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        <div class="mb-3">
            <label for="endDate" class="form-label">Until</label>
            <input type="date" class="form-control" id="endDate">
        </div>
        <div class="mb-3">
          <label for="cabangFilter" class="form-label">Branch</label>
          <select id="cabangFilter" class="form-select"></select>
        </div>
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="js/reports/bi-reports/neraca.js" type="text/javascript"></script>