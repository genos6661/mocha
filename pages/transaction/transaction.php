<?php
$nowHour = date('H');
$reportDate = date('Y-m-d');

if ($nowHour >= 15) {
    $reportDate = date('Y-m-d', strtotime('+1 day'));
}
?>
<h5 class="mb-3">Transactions</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md-6 mb-2 mb-md-0">
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base  ti tabler-filter icon-20px"></i><span class="d-md-inline-block d-none"></span>
      </button>
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalTransaksiBaru">
        New Transaction
      </button>
    </div>
    <div class="col-md-6 d-flex justify-content-end">
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
    <table class="table table-bordered table-hover" id="tabelTrans">
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Number</th>
          <th>Type</th>
          <th>Order Number</th>
          <th>Branch</th>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Transactions : <span id="totalTrans"></span></p>
      </div>
  </div>
</div>

<!-- modal -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Filter Transactions</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body pb-2">
        <form id="formFilterOrder">
        <div class="mb-3">
          <label for="range" class="form-label">Simple Range</label>
          <select id="range" class="form-select select2">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year (Default)</option>
            <option value="yesterday">Yesterday</option>
            <option value="tomorrrow">Tomorrow</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="startDate" class="form-label">Date From</label>
            <input type="date" class="form-control" id="startDate">
          </div>
          <div class="col-md mb-3">
            <label for="endDate" class="form-label">Until</label>
            <input type="date" class="form-control" id="endDate">
          </div>
        </div>
        <div class="mb-3">
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select" multiple></select>
        </div>
        <div class="d-flex justify-content-end mb-0 gap-4">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="buy" checked>
            <label class="form-check-label" for="buy">Buy</label>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="sell" checked>
            <label class="form-check-label" for="sell">Sell</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary me-0" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary me-0" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Apply</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between flex-md-row flex-column">
        <h5 class="modal-title" id="backDropModalTitle">Transaction Detail</h5>
        <div class="d-flex gap-2">
          <p class="h5 dataDetail" id="nomorDetail"></p>
          <div id="tipeDetail" class=""></div>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul class="list-unstyled mb-6">
          <li class="mb-2">
            <span class="h6 me-1">Order Number :</span>
            <span class="dataDetail" id="orderDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Branch :</span>
            <span class="dataDetail" id="cabangDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Date :</span>
            <span class="dataDetail" id="tanggalDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Customer :</span>
            <span class="dataDetail" id="pelangganDetail"></span>
          </li>
          <li class="mb-2">
            <span class="h6 me-1">Nationality :</span>
            <span class="dataDetail" id="negaraDetail"></span>
          </li>
        </ul>
        <div class="table-responsive" id="itemDetail">
          <table class="table table-sm" id="tabelItemDetail">
            <thead>
              <tr>
                <th>Forex</th>
                <th class="text-end">Amount</th>
                <th class="text-end">Rates</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between justify-content-md-end">
        <button class="btn-primary btn mx-1 mb-2 mb-md-0" id="jurnalBtn" data-bs-toggle="modal" data-bs-target="#modalJurnal">Jurnal Voucher</button>
        <a class="btn-outline-primary btn mx-1 mb-2 mb-md-0" target="_blank" id="reprintDetail">Reprint</a>
        <a href="#" class="btn btn-outline-secondary mx-1" type="button" id="editBtn">Edit</a>
        <button class="btn btn-danger mx-1 mb-2 mb-md-0" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1 mb-2 mb-md-0" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Transaction</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapusTransaksi">
        <input type="hidden" id="idHapus">
        <h4>Continue to delete transaction <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- jurnal voucher -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalJurnal" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Journal Voucher <span id="refJurnal"></span></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body table-responsive">
        <table class="table table-sm" id="tabelJurnal">
          <thead class="bg-light">
            <tr>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody></tbody>
          <!-- <tfoot class="bg-light">
            <tr>
              <th colspan="2">Total : </th>
              <th class="text-end" id="totalDebit"></th>
              <th class="text-end" id="totalKredit"></th>
            </tr>
          </tfoot> -->
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal kontak baru -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalKontakBaru" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">New Contact Data</p>
        <div class="row">
          <div class="col-md mb-3">
            <label for="nama" class="form-label">Name</label>
            <input
              type="text"
              id="nama"
              class="form-control"
              placeholder="Input Fullname" />
          </div>
          <div class="col-md mb-3">
            <label for="tipe" class="form-label">Type</label>
            <select id="tipe" class="form-select">
              <option value="101" selected>Personal</option>
              <option value="204">Company</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="id_type" class="form-label">ID Type</label>
            <select  id="id_type" class="form-select">
              <option value="PSP" selected>Passport</option>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM (Driving License)</option>
              <option value="OTH">Other</option>
              <option value="SIU">Surat Izin Usaha</option>
              <option value="SAP">Akta Pendirian</option>
              <option value="ADR">Anggaran Dasar</option>
            </select>
          </div>
          <div class="col-md mb-3">
            <label for="idNumber" class="form-label">ID Number</label>
            <input type="text" id="idNumber" class="form-control" placeholder="ID Number" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" id="email" class="form-control" placeholder="Input Email (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="telepon" class="form-label">Phone Number</label>
            <input type="text" id="telepon" class="form-control" placeholder="Input Phone Number (Optional)" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="negara" class="form-label">Country</label>
            <select id="negara" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="alamat" class="form-label">Address</label>
            <input type="text" id="alamat" class="form-control" placeholder="Input Address" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="pekerjaan" class="form-label">Occupation</label>
            <select id="pekerjaan" class="form-select"></select>
          </div>
          <div class="col-md mb-3">
            <label for="paspor" class="form-label">Passport Photo</label>
            <input
              type="file"  accept="image/*" id="paspor" class="form-control" placeholder="Upload Passport Photo (Optional)" />
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="rekening" class="form-label">Bank Account</label>
            <input type="text" id="rekening" class="form-control" placeholder="Input Bank Account (Optional)" />
          </div>
          <div class="col-md mb-3">
            <label for="jk" class="form-label">Gender</label>
            <div class="d-flex justify-content-end">
              <div class="form-check form-check-inline">
                <label class="switch">
                  <input type="radio" name="jk" id="male" class="switch-input" checked>
                  <span class="switch-toggle-slider">
                    <span class="switch-on"></span>
                    <span class="switch-off"></span>
                  </span>
                  <span class="switch-label">Male</span>
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class="switch">
                  <input type="radio" name="jk" id="female" class="switch-input">
                  <span class="switch-toggle-slider">
                    <span class="switch-on"></span>
                    <span class="switch-off"></span>
                  </span>
                  <span class="switch-label">Female</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-cols-4">
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="pelanggan" value="1" />
              <label class="form-check-label" for="pelanggan">Pelanggan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="vendor" value="1" />
              <label class="form-check-label" for="vendor">Vendor</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="karyawan" value="1" />
              <label class="form-check-label" for="karyawan">Karyawan</label>
            </div>
          </div>
          <div class="col mb-0">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="member" value="1" />
              <label class="form-check-label" for="member">Member</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" class="btn btn-label-secondary" data-bs-toggle="modal" data-bs-target="#modalTransaksiBaru" data-bs-dismiss="modal">
            Close
          </button>
        </div>
        <div class="col-md-4 d-grid mb-3 mb-md-0">
          <button type="button" id="sbmTambah" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- modal transaksi baru -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalTransaksiBaru" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-simple">
    <div class="modal-content">
      <div class="modal-body">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
        <p class="h4 text-center mb-4">New Transaction</p>
        <div class="row">
          <div class="col-md-8 mb-3">
            <label for="kontak" class="form-label">Contact</label>
            <select id="kontak" class="form-select"></select>
          </div>
          <div class="col-md-4 mb-3">
            <label for="btnKontakBaru" class="form-label text-center">Or Add New Contact</label>
            <button id="btnKontakBaru" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#modalKontakBaru" data-bs-dismiss="modal">New Contact</button>
          </div>
        </div>
        <div class="row">
          <div class="col-md mb-3">
            <label for="tanggal" class="form-label">Date</label>
            <input type="date" class="form-control" id="tanggal" value="<?php echo date('Y-m-d'); ?>">
          </div>
          <div class="col-md mb-3">
            <label for="tanggal_laporan" class="form-label">Report Date</label>
            <input type="date" class="form-control" id="tanggal_laporan" value="<?php echo $reportDate; ?>">
          </div>
          <div class="col-md mb-3">
            <label for="cabangTrans" class="form-label">Branch</label>
            <select id="cabangTrans" class="form-select"></select>
          </div>
        </div>
        <div class="row">
          <div class="col-md">
            <h5 class="mb-1">Transaction Details :</h5>
          </div>
          <div class="col-md d-flex justify-content-end g-2 mb-1">
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="buyTrans" class="switch-input" checked>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Buy</span>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="switch">
                <input type="radio" name="tipeTrans" id="sellTrans" class="switch-input">
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
                <span class="switch-label">Sell</span>
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col table-responsive">
            <table class="table table-borderless" id="tabelDetail">
              <thead class="border-bottom border-top">
                <tr>
                  <th class="py-3" style="width: 25%; min-width: 200px;">Currency</th>
                  <th class="py-3 text-end" style="width: 20%; min-width: 150px;">Amount</th>
                  <th class="py-3 text-end" style="width: 25%; min-width: 200px;">Rate</th>
                  <th class="py-3 text-end" style="width: 25%; min-width: 200px;">Subtotal</th>
                  <th class="py-3"></th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="3" class="text-end">Total :</th>
                  <th class="px-1">
                    <input type="text" class="total form-control text-end" readonly>
                  </th>
                  <th class="px-1">
                    <button class="btn btn-primary w-100" id="tambahBaris" type="button" disabled="true">
                      <i class="icon-base ti tabler-plus icon-md"></i>
                    </button>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-between justify-content-md-end">
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
        <button class="btn-primary btn mx-1" id="btnSubmit">Submit</button>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/transaction.js" type="text/javascript"></script>
<script src="js/pages/contact-new.js" type="text/javascript"></script>
<script src="js/pages/direct-transaction.js" type="text/javascript"></script>