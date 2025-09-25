<h5 class="mb-3">Transaction Orders</h5>
<div class="card">
  <div class="row p-3">
    <div class="col-md d-grid d-md-block mb-2 mb-md-0">
      <a class="btn btn-primary mb-md-0 mb-2" href="/order-form">
        <i class="icon-base ti tabler-plus icon-16px me-md-2"></i><span>New Order</span>
      </a>
      <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalFilter">
        <i class="icon-base  ti tabler-filter icon-16px"></i><span class="d-inline-block d-md-none">Filter</span>
      </button>
    </div>
    <div class="col-md d-flex justify-content-end gap-1">
      <button class="btn btn-primary" type="button" id="btnReload">
        <i class="icon-base  ti tabler-reload icon-16px"></i>
      </button>
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
    <table class="dt-responsive table table-bordered table-hover" id="tabelOrder">
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Number</th>
          <th>Type</th>
          <th>Branch</th>
          <th>Name</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="row mt-2 px-3">
      <div class="col-md">
          <p>Total Orders : <span id="totalOrder"></span></p>
      </div>
  </div>
</div>

<!-- modal detail -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalDetail" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between flex-md-row flex-column">
        <h5 class="modal-title" id="backDropModalTitle">Order Detail</h5>
        <div class="d-flex gap-2">
          <p class="h5 dataDetail" id="nomorDetail"></p>
          <div id="statusDetail" class=""></div>
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
            <span class="h6 me-1">Transaction Type :</span>
            <span class="dataDetail" id="tipeDetail"></span>
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
                <th class="text-end">Qty</th>
                <th class="text-end">Rates</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn-outline-primary btn d-none mx-1" id="processBtn" data-bs-toggle="modal" data-bs-target="#modalProses">Process</button>
        <!-- <button class="btn-outline-danger btn d-none mx-1" id="deactivateBtn">Deactivate</button> -->
        <a class="btn btn-primary mx-1" id="editBtn">Edit</a>
        <button class="btn btn-danger mx-1" id="deleteBtn" data-bs-toggle="modal" data-bs-target="#modalHapus">Delete</button>
        <button class="btn btn-secondary mx-1" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal hapus -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalHapus" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Delete Order</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formHapusKelompok">
        <input type="hidden" id="idHapus">
        <h4>Do you wish to delete order <span id="refHapus"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmHapus" class="btn btn-danger">Delete</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- modal proses -->
<div class="modal fade animate__animated animate__fadeInUp" id="modalProses" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Process Order</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formProsesOrder">
        <input type="hidden" id="idProses">
        <h4>Continue to process the order <span id="refProses"></span>?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="sbmProses" class="btn btn-primary">Process</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade animate__animated animate__fadeInUp" id="modalFilter" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="backDropModalTitle">Filter Order</h5>
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
          <select id="range" class="form-select">
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
          <label for="cabang" class="form-label">Branch</label>
          <select id="cabang" class="form-select" multiple></select>
        </div>
        <div class="d-flex justify-content-end mb-0">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="includeClosed">
            <label class="form-check-label" for="includeClosed">Include Closed</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary" id="resetFilter">Reset</button>
        <button type="button" id="sbmFilter" class="btn btn-primary">Apply</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="js/pages/order.js" type="text/javascript"></script>