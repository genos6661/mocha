<?php
/* Bagian "Piutang / Hutang" modal transaksi. Variabel: $sfx = '' (modal New) atau 'Edit' (modal Edit);
   $kontak = true bila bagian ini punya pilihan kontak sendiri (Adjustment). Logika: js/pages/debt-form.js */
$kontak = $kontak ?? false;
?>
<div class="mf-section" id="utangSection<?= $sfx ?>">
  <div class="mf-section-title">
    <i class="icon-base ti tabler-receipt-2"></i>Payable / Receivable
    <div class="mf-tools">
      <div class="form-check form-switch mf-switch">
        <input type="checkbox" class="form-check-input" id="utangCek<?= $sfx ?>">
        <label class="form-check-label" for="utangCek<?= $sfx ?>">Payable/Hutang &amp; Receivable/Piutang</label>
      </div>
    </div>
  </div>
  <div class="d-none" id="utangBody<?= $sfx ?>">
    <?php if ($kontak): ?>
    <div class="row d-none" id="utangKontakRow<?= $sfx ?>">
      <div class="col-md-6 mb-3">
        <label for="utangKontak<?= $sfx ?>" class="form-label">Contact</label>
        <select id="utangKontak<?= $sfx ?>" class="form-select"></select>
      </div>
    </div>
    <?php else: ?>
    <div id="utangKontakRow<?= $sfx ?>"></div>
    <?php endif; ?>
    <div class="btn-group mf-segment mb-2" role="group" aria-label="Payable/Receivable mode">
      <input type="radio" class="btn-check" name="utangMode<?= $sfx ?>" id="utangModeBaru<?= $sfx ?>" checked>
      <label class="btn btn-outline-primary" for="utangModeBaru<?= $sfx ?>">New</label>
      <input type="radio" class="btn-check" name="utangMode<?= $sfx ?>" id="utangModeBayar<?= $sfx ?>">
      <label class="btn btn-outline-primary" for="utangModeBayar<?= $sfx ?>">Settlement</label>
    </div>
    <p class="text-muted small mb-3" id="utangHint<?= $sfx ?>"></p>

    <div id="utangPanelBaru<?= $sfx ?>">
      <div class="row">
        <div class="col-md-4 mb-2">
          <label for="utangDue<?= $sfx ?>" class="form-label">Due Date (optional)</label>
          <input type="date" id="utangDue<?= $sfx ?>" class="form-control">
        </div>
      </div>
    </div>

    <div class="d-none" id="utangPanelBayar<?= $sfx ?>">
      <div class="table-responsive nowrap">
        <table class="table table-borderless mf-table" id="utangDocs<?= $sfx ?>">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Due</th>
              <th>Currency</th>
              <th class="text-end">Remaining</th>
              <th class="text-end" style="min-width: 150px;">Settle</th>
              <th class="text-end" style="min-width: 130px;">Rate (Rp)</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <button type="button" class="btn btn-sm btn-outline-primary" id="utangAuto<?= $sfx ?>">Fill automatically</button>
        <span class="small" id="utangSum<?= $sfx ?>"></span>
      </div>
    </div>
  </div>
</div>
