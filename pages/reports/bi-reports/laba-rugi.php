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
        <li class="breadcrumb-item active">Laba Rugi</li>
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
    <p class="h2 text-center mb-0 dm-serif-text-regular text-primary">Profit & Loss</p>
    <p class="h5 text-center text-secondary spectral mb-1">Laporan Laba Rugi</p>
    <p class="h5 text-center mb-1 text-secondary national-park" id="range"></p>
    <p class="h5 text-center mb-1 text-secondary national-park d-none" id="cabang"></p>
  </div>
  <div class="card-body">
    <p class="h5 mb-0">Pendapatan dan Beban Operasional</p>
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td class="p-1 fw-bold" colspan="5">Pendapatan Operasional</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Penjualan UKA</td>
          <td class="p-1" style="width: 5%;"></td>
          <td class="p-1 text-end" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="penjualanUKA" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Pencairan TC</td>
          <td class="p-1" style="width: 5%;"></td>
          <td class="p-1 text-end" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="pencairanTC" contenteditable="true"></td>
        </tr>
        <tr>
          <td colspan="4" class="p-1 text-end pe-6">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%;" id="pendapatanOperasional" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1 fw-bold" colspan="5">Harga Pokok Penjualan</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Saldo Awal UKA & TC</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="saldoAwalUKATC" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Pembelian UKA & TC</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="pembelianUKATC" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Saldo Akhir UKA & TC</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="saldoAkhirUKATC" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td colspan="4" class="p-1 text-end pe-6">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%;" id="hargaPokok" contenteditable="true"></td>
        </tr>
        <tr>
          <td colspan="3" class="p-1">Pendapatan/Rugi Operasional Kotor UKA-TC</td>
          <td class="p-1 text-end pe-6" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%;" id="lrOperasional" contenteditable="true"></td>
        </tr>
        <tr>
          <td colspan="3" class="p-1">Pendapatan Pengiriman Uang</td>
          <td class="p-1 text-end" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="pendapatanKirimUang" contenteditable="true"></td>
        </tr>
        <tr>
          <td colspan="3" class="p-1 fw-bold">Pendapatan/Rugi Operasional Kotor</td>
          <td class="p-1 text-end pe-6 fw-bold" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%;" id="lrOperasionalKotor" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" colspan="5">
            <p>&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td class="p-1 fw-bold" colspan="5">Beban Operasional</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Gaji, Upah & Tunjangan</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="gaji" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Sewa</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="sewa" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Iklan & Promosi</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="iklan" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Air, Listrik & Telepon</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="listrik" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Transportasi & Perjalanan</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="transportasi" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Pemeliharaan Kendaraan</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="kendaraan" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Penyusutan Aset Tetap</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="penyusutan" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Asuransi</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="asuransi" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Lain - lain</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="bebanOperasionalLain" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td colspan="4" class="p-1 text-end pe-6">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%; border-bottom: 1px solid;" id="totalBeban" contenteditable="true"></td>
        </tr>
        <tr>
          <td colspan="3" class="p-1 fw-bold">Pendapatan/Rugi Operasional Bersih</td>
          <td class="p-1 text-end pe-6 fw-bold" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%; border-bottom: 1px solid;" id="lrOperasionalBersih" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" colspan="5">
            <p>&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td class="p-1 fw-bold" colspan="5">Pendapatan / Beban Lain-lain</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Pendapatan Bunga Bank</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="bungaBank" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Biaya Administrasi Bank</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="adminBank" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1" style="width: 37%;">Biaya Bunga Pinjaman</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="bungaPinjaman" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td colspan="4" class="p-1" style="width: 92%;">Laba/Rugi Penjualan Aset Tetap (Net)</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Laba</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="labaPenjualanAset" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Rugi</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="rugiPenjualanAset" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td colspan="4" class="p-1" style="width: 92%;">Laba/Rugi Selisih Kurs (Net)</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Laba</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="labaSelisihKurs" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Rugi</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="rugiSelisihKurs" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td colspan="4" class="p-1" style="width: 92%;">Lain - lain</td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Pendapatan</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="pendapatanLain" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td class="p-1" style="width: 8%;"></td>
          <td class="p-1 ps-3" style="width: 37%;">- Beban</td>
          <td class="p-1 text-end" style="width: 5%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%;" id="bebanLain" contenteditable="true"></td>
          <td class="p-1 text-end" style="width: 25%;"></td>
        </tr>
        <tr>
          <td colspan="4" class="p-1 text-end pe-6">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%; border-bottom: 1px solid;" id="labaRugiLain" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" colspan="5">
            <p>&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="p-1 fw-bold">Laba/Rugi Sebelum Pajak Penghasilan</td>
          <td class="p-1 text-end pe-6 fw-bold" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%; border-bottom: 1px solid;" id="labaRugiSP" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" colspan="5">
            <p>&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="p-1">Tafsiran Pajak Penghasilan (-)</td>
          <td class="p-1 text-end" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end" style="width: 25%; border-bottom: 1px solid;" id="pajakPenghasilan" contenteditable="true"></td>
        </tr>
        <tr>
          <td class="p-1" colspan="5">
            <p>&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="p-1 fw-bold">Laba/Rugi Bersih</td>
          <td class="p-1 text-end pe-6 fw-bold" style="width: 25%;">Rp. </td>
          <td class="p-1 text-end fw-bold" style="width: 25%; border-bottom: 1px solid;" id="labaRugi" contenteditable="true"></td>
        </tr>
      </tbody>
    </table>
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
            <option value="month">This Month (Default)</option>
            <option value="year">This Year</option>
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="js/reports/bi-reports/laba-rugi.js" type="text/javascript"></script>