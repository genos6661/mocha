/**
 * PEMBUAT SEL TABEL DAFTAR TRANSAKSI
 * ------------------------------------------------------------------
 * Fungsi render siap pakai untuk kolom DataTables pada halaman daftar
 * (order, transaksi, kas, jurnal, adjustment, forex transfer) supaya tampilan
 * seragam: tanggal + nomor dalam satu kolom, badge berwarna, nominal rata kanan.
 *
 * Pakai di definisi kolom:
 *   { data: 'tanggal', className: 'dt-main nowrap', render: TR.dateNumber }
 *   { data: 'tipe',    className: 'dt-badge',        render: TR.badgeBy({ 3: ['BUY', 'success'] }) }
 *
 * Pengurutan dilakukan lewat kotak pilih di atas tabel (TR.sortBar), bukan klik
 * header: DataTables dipasang `ordering: false` dan urutan diminta ke server.
 *
 * Fungsi render hanya mengubah tampilan: untuk sort/filter/search DataTables
 * tetap menerima nilai aslinya.
 *
 * Class "dt-*" pada className dipakai tampilan kartu di HP (lihat demo.css,
 * class "table-cards"): dt-main, dt-actions, dt-badge, dt-amount, dt-party,
 * dt-branch, dt-extra, dt-desc. Kolom "dt-no" disembunyikan di HP.
 */
(function (window) {
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));

  // Bungkus fungsi tampilan: sort/filter/search menerima nilai asli.
  const display = (fn) => (data, type, row) => (type === 'display' ? fn(data, row) : data);

  const formatMoney = (value) => Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 });

  const badge = (label, color) => `<span class="badge rounded-pill bg-label-${color}">${escapeHtml(label)}</span>`;

  const icon = (name) => `<i class="icon-base ti tabler-${name} icon-14px me-1 text-body-secondary"></i>`;

  window.TR = {
    escapeHtml,
    badge,

    // Dua data dalam satu kolom: tanggal (menonjol) dan nomor transaksi (kecil, di bawahnya).
    // Dipasang pada kolom "tanggal"; nomor diambil dari row.nomor.
    dateNumber: (value, type, row) => {
      if (type !== 'display') return type === 'filter' ? `${row.nomor ?? ''} ${value ?? ''}` : (value ?? '');

      // Tanpa tanggal (mis. baris "Beginning Balance"): nomor/keterangannya menjadi judul.
      if (!value) return `<div class="fw-semibold text-heading">${escapeHtml(row.nomor)}</div>`;

      const label = new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      return `<div class="fw-semibold text-heading">${label}</div>`
        + `<div class="small text-body-secondary">${escapeHtml(row.nomor)}</div>`;
    },

    // Judul tebal + keterangan kecil di bawahnya, mis. nama (menonjol) dan kode. Dipasang pada kolom
    // judul; keterangan diambil dari row[subKey]. Pencarian ikut membaca keterangannya.
    titleSub: (subKey) => (value, type, row) => {
      if (type !== 'display') return type === 'filter' ? `${row[subKey] ?? ''} ${value ?? ''}` : (value ?? '');
      return `<div class="fw-semibold text-heading">${escapeHtml(value)}</div>`
        + `<div class="small text-body-secondary">${escapeHtml(row[subKey])}</div>`;
    },

    // Label kecil untuk sel pada tampilan kartu di HP (dipakai sebagai createdCell kolom).
    cellLabel: (text) => (td) => td.setAttribute('data-label', text),

    // Angka dengan pemformat sendiri (mis. 15.800,5); `prefix` opsional ("Rp "). Kosong bila tidak ada nilai.
    // `label` hanya terlihat di HP (di PC sudah ada judul kolom), mis. "Buy " di depan angka.
    number: (format, prefix = '', label = '') => display(value => (value || value === 0
      ? `<span class="fw-semibold">${label ? `<span class="d-md-none fw-normal text-body-secondary">${escapeHtml(label)} </span>` : ''}${prefix}${format(value)}</span>`
      : '')),

    // Lencana dari nilai kolom itu sendiri (mis. kode valas).
    pill: (color) => display(value => (value ? badge(value, color) : '')),

    // Beberapa lencana dari penanda 0/1 pada baris: defs = [{ key, label, color }].
    flagBadges: (defs) => display((value, row) => defs
      .filter(d => Number(row[d.key]) === 1)
      .map(d => badge(d.label, d.color))
      .join(' ')),

    // Nama pihak terkait (pelanggan / kontak), tebal.
    name: display(value => (value ? `<span class="fw-medium">${escapeHtml(value)}</span>` : '')),

    // Teks dengan ikon kecil di depannya (mis. user pembuat).
    withIcon: (iconName) => display(value => (value ? `${icon(iconName)}${escapeHtml(value)}` : '')),

    // Teks panjang dipotong satu baris di PC (tooltip berisi teks penuh); di HP boleh turun baris.
    description: display(value => (value
      ? `<span class="dt-ellipsis" title="${escapeHtml(value)}">${escapeHtml(value)}</span>`
      : '<span class="text-body-secondary">-</span>')),

    // Nominal Rupiah rata kanan. Warna opsional lewat class teks Bootstrap, mis. 'text-success'.
    money: (colorClass = '') => display(value => `<span class="fw-semibold ${colorClass}">Rp ${formatMoney(value)}</span>`),

    // Badge dari peta nilai -> [label, warna]; nilai di luar peta ditampilkan kosong.
    badgeBy: (map) => display(value => {
      const entry = map[value];
      return entry ? badge(entry[0], entry[1]) : '';
    }),

    // Rujukan ke dokumen lain (mis. nomor order pada transaksi); "Order " hanya terlihat di HP,
    // karena di PC sudah ada judul kolomnya.
    reference: (label) => display(value => (value
      ? `<span class="text-body-secondary"><span class="d-md-none">${escapeHtml(label)} </span>${escapeHtml(value)}</span>`
      : '')),

    /**
     * Pilihan pengurutan, disisipkan satu baris dengan kotak Search (menggantikan klik header).
     *   tableSelector : '#tabelTrans'
     *   options       : [{ key: 'tanggal', label: 'Date', dir: 'desc' }, ...]  (dir = arah awal saat dipilih)
     *   onChange      : (column, dir) => ...  -> pilihan "Default" memanggil onChange('', 'desc')
     *   opts.host     : selector wadah (untuk halaman tanpa kotak Search di toolbar); bila diisi,
     *                   kontrol ditaruh di wadah itu, bukan di sebelah kotak Search
     * Memakai select2 seperti select lain di aplikasi (tanpa kotak cari). "Default" selalu terpilih
     * di awal; tombol panah di sebelahnya membalik arah urutan. Gaya tata letak: .dt-sort di demo.css.
     */
    sortBar: (tableSelector, options, onChange, opts = {}) => {
      const host = opts.host ? document.querySelector(opts.host) : null;
      const search = host || document.querySelector(tableSelector).closest('.card').querySelector('.filtertabel');
      const optionsHtml = options
        .map(o => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`)
        .join('');

      const anchor = host ? 'beforeend' : 'beforebegin';
      const row = host || search.parentElement;
      row.classList.add('flex-wrap');
      search.insertAdjacentHTML(anchor, `
        <label class="dt-sort-label">Sort By :</label>
        <div class="dt-sort">
          <select class="form-select" aria-label="Sort by">
            <option value="default" selected>Default</option>${optionsHtml}
          </select>
        </div>
        <button type="button" class="btn btn-primary btn-icon dt-sort-dir" disabled></button>
      `);

      const select = row.querySelector('.dt-sort select');
      const toggle = row.querySelector('.dt-sort-dir');
      let dir = 'desc';

      $(select).select2({ width: '100%', minimumResultsForSearch: Infinity });

      const paintToggle = () => {
        toggle.innerHTML = `<i class="icon-base ti tabler-arrow-${dir === 'asc' ? 'up' : 'down'}"></i>`;
        toggle.title = dir === 'asc' ? 'Ascending (A-Z, oldest first)' : 'Descending (Z-A, newest first)';
      };

      const apply = () => {
        const isDefault = select.value === 'default';
        toggle.disabled = isDefault;
        // "Default" dikirim sebagai kolom kosong: server memakai urutan bawaannya.
        onChange(isDefault ? '' : select.value, isDefault ? 'desc' : dir);
      };

      $(select).on('change', () => {
        const chosen = options.find(o => o.key === select.value);
        dir = chosen ? (chosen.dir || 'asc') : 'desc';
        paintToggle();
        apply();
      });

      toggle.addEventListener('click', () => {
        dir = dir === 'asc' ? 'desc' : 'asc';
        paintToggle();
        apply();
      });

      paintToggle();
    },

    // Dua cabang digabung: "Dari → Ke".
    route: (data, type, row) => {
      if (type !== 'display') return type === 'filter' ? `${row.nama_from} ${row.nama_to}` : row.nama_from;
      return `<span class="fw-medium">${escapeHtml(row.nama_from)}</span>`
        + ` <i class="icon-base ti tabler-arrow-right icon-14px mx-1 text-body-secondary"></i> `
        + `<span class="fw-medium">${escapeHtml(row.nama_to)}</span>`;
    }
  };
})(window);
