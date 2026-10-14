/**
 * TABEL BERTUMPUK DI SMARTPHONE
 * ------------------------------------------------------------------
 * Pakai: tambahkan class "table-stack" pada <table> input detail
 * (baris diisi form control dan dibuat lewat JS).
 *
 * Di layar < 768px (lihat demo.css) tiap baris tampil sebagai kartu: header
 * tabel disembunyikan dan setiap sel diberi judul kolomnya. Judul diambil dari
 * <thead> dan dipasang otomatis sebagai atribut data-label, termasuk pada
 * baris yang ditambah belakangan oleh JS (MutationObserver), jadi kode yang
 * membuat baris tidak perlu diubah.
 *
 * Sel <tfoot> hanya diberi judul bila berisi input (mis. kolom Total).
 */
(function () {
  function headerLabels(table) {
    const labels = [];
    const headRow = table.querySelector('thead tr');
    if (!headRow) return labels;

    Array.from(headRow.children).forEach(th => {
      const span = th.colSpan || 1;
      for (let i = 0; i < span; i++) labels.push(i === 0 ? th.textContent.trim() : '');
    });
    return labels;
  }

  function labelRows(table) {
    const labels = headerLabels(table);

    table.querySelectorAll('tbody tr, tfoot tr').forEach(row => {
      const inFooter = !!row.closest('tfoot');
      let col = 0;

      Array.from(row.children).forEach(cell => {
        const label = labels[col] || '';
        const labelled = label && (!inFooter || cell.querySelector('input'));

        if (labelled) cell.setAttribute('data-label', label);
        else cell.removeAttribute('data-label');

        col += cell.colSpan || 1;
      });
    });
  }

  function init(table) {
    labelRows(table);
    new MutationObserver(() => labelRows(table))
      .observe(table, { childList: true, subtree: true });
  }

  function initAll() {
    document.querySelectorAll('table.table-stack').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
})();
