<link rel="stylesheet" href="/assets/css/modal-form.css?v=<?= filemtime(__DIR__ . '/../../assets/css/modal-form.css') ?>" />
<link rel="stylesheet" href="/assets/css/edit-page.css?v=<?= filemtime(__DIR__ . '/../../assets/css/edit-page.css') ?>" />

<div class="ep-page">
  <div class="ep-head">
    <span class="ep-head-icon"><i class="icon-base ti tabler-shopping-cart"></i></span>
    <div>
      <h4>Edit Order <span id="nomorOrder"></span></h4>
      <div class="ep-meta">
        <span class="badge rounded-pill bg-label-primary" id="jenisTransaksi"></span>
        <span><i class="icon-base ti tabler-calendar icon-14px me-1"></i>Issued <strong id="tanggalTransaksi"></strong></span>
      </div>
    </div>
  </div>

  <input type="hidden" id="idOrder">
  <input type="hidden" id="tipeTrans">
  <input type="hidden" id="idCabang">

  <div class="row">
    <div class="col-lg-5">
      <div class="ep-card h-100">
        <div class="mf-section-title"><i class="icon-base ti tabler-building-store"></i>Branch</div>
        <div class="mb-3">
          <label for="cabangEdit" class="form-label">Branch</label>
          <select id="cabangEdit" class="form-select"></select>
        </div>
        <div class="ep-brand">
          <span class="app-brand-logo demo" id="boxLogo">
            <span class="text-primary">
              <?php include __DIR__ . '/../../partials/logo.php'; ?>
            </span>
          </span>
          <span class="ep-brand-name" id="judulNota">Beres Mocha</span>
        </div>
        <div class="ep-lines">
          <p><span id="namaCabang"></span></p>
          <p><span id="alamatCabang"></span></p>
          <p><span id="teleponCabang"></span></p>
        </div>
      </div>
    </div>
    <div class="col-lg-7">
      <div class="ep-card h-100">
        <div class="mf-section-title"><i class="icon-base ti tabler-user"></i>Order from
          <div class="mf-tools">
            <span class="badge rounded-pill bg-label-primary d-none" id="partyKodeBadge" title="Customer code"><span id="kodePelanggan"></span></span>
            <button type="button" class="btn btn-sm btn-outline-primary" id="btnEditParty"><i class="icon-base ti tabler-pencil icon-sm me-1"></i>Edit details</button>
            <button type="button" class="btn btn-sm btn-label-secondary d-none" id="btnCancelParty">Cancel</button>
            <button type="button" class="btn btn-sm btn-primary d-none" id="btnDoneParty"><i class="icon-base ti tabler-check icon-sm me-1"></i>Done</button>
          </div>
        </div>
        <dl class="ep-info" id="partyView">
          <div class="ep-wide"><dt>Name</dt><dd id="vNama"></dd></div>
          <div class="ep-wide"><dt>Address</dt><dd id="vAlamat"></dd></div>
          <div><dt>Phone</dt><dd id="vTelepon"></dd></div>
          <div><dt>Email</dt><dd id="vEmail"></dd></div>
          <div><dt>Cust. Code</dt><dd id="vKode"></dd></div>
          <div><dt>ID Number</dt><dd id="vId"></dd></div>
          <div><dt>Nationality</dt><dd id="vNegara"></dd></div>
          <div><dt>Occupation</dt><dd id="vPekerjaan"></dd></div>
        </dl>
        <div id="partyForm" class="d-none">
        <div class="row">
          <div class="col-md-7 mb-3">
            <label for="namaPelanggan" class="form-label">Name</label>
            <input type="text" class="form-control" id="namaPelanggan" autocomplete="off">
          </div>
          <div class="col-md-5 mb-3">
            <label for="idNumber" class="form-label">ID Number</label>
            <input type="text" class="form-control" id="idNumber" autocomplete="off">
          </div>
          <div class="col-md-6 mb-3">
            <label for="teleponPelanggan" class="form-label">Phone</label>
            <input type="text" class="form-control" id="teleponPelanggan" autocomplete="off">
          </div>
          <div class="col-md-6 mb-3">
            <label for="emailPelanggan" class="form-label">Email</label>
            <input type="email" class="form-control" id="emailPelanggan" autocomplete="off">
          </div>
          <div class="col-12 mb-3">
            <label for="alamatPelanggan" class="form-label">Address</label>
            <input type="text" class="form-control" id="alamatPelanggan" autocomplete="off">
          </div>
          <div class="col-md-6 mb-3 mb-md-0">
            <label for="negara" class="form-label">Nationality</label>
            <select id="negara" class="form-select"></select>
          </div>
          <div class="col-md-6">
            <label for="pekerjaan" class="form-label">Occupation</label>
            <input type="text" class="form-control" id="pekerjaan" autocomplete="off">
          </div>
        </div>
        </div>
        <p class="mf-hint d-none" id="partyHint"><i class="icon-base ti tabler-info-circle"></i>Changes update the customer's profile, so they apply to all of this customer's transactions.</p>
      </div>
    </div>
  </div>

  <div class="ep-card">
    <div class="mf-section-title"><i class="icon-base ti tabler-list-details"></i>Order details
      <div class="mf-tools">
        <button class="btn btn-primary" id="tambahBaris" type="button"><i class="icon-base ti tabler-plus icon-sm me-1"></i>Add Row</button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless table-stack mf-table" id="tabelDetail">
        <thead>
          <tr>
            <th style="width: 25%; min-width: 180px;">Currency</th>
            <th class="text-end" style="width: 20%; min-width: 130px;">Amount</th>
            <th class="text-end" style="width: 25%; min-width: 160px;">Rate</th>
            <th class="text-end" style="width: 25%; min-width: 160px;">Subtotal</th>
            <th style="width: 5%;"></th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
    <div class="mf-total">
      <span class="mf-total-label">Total</span>
      <input type="text" class="total form-control text-end" readonly>
    </div>
  </div>

  <div class="ep-actions">
    <a href="/order" class="btn btn-label-secondary"><i class="icon-base ti tabler-x icon-sm me-2"></i>Close and Cancel</a>
    <button class="btn btn-outline-primary" onclick="resetOrder()" id="btnReset"><i class="icon-base ti tabler-restore icon-sm me-2"></i>Reset Default</button>
    <button class="btn btn-primary" id="btnSubmit"><i class="icon-base ti tabler-device-floppy icon-sm me-2"></i>Save Update</button>
  </div>
</div>

<script src="/js/pages/edit-party.js?v=<?= filemtime(__DIR__ . '/../../js/pages/edit-party.js') ?>" type="text/javascript"></script>
<script src="/js/pages/order-edit.js" type="text/javascript"></script>