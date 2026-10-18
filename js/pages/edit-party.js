/**
 * CABANG & DATA PELANGGAN PADA HALAMAN EDIT TRANSAKSI / EDIT ORDER
 * ------------------------------------------------------------------
 * Dipakai transaction-edit.js dan order-edit.js. Halaman edit menampilkan pilihan cabang dan isian data
 * pribadi pelanggan (#namaPelanggan, #idNumber, #teleponPelanggan, #emailPelanggan, #alamatPelanggan,
 * #negara, #pekerjaan).
 *
 * Secara bawaan data pelanggan tampil sebagai teks (#partyView); tombol "Edit details" membuka isian
 * (#partyForm). "Done" menerapkan isian ke tampilan, "Cancel" mengembalikan nilai awal.
 *
 * Perubahan pelanggan disimpan lewat endpoint profil yang sudah ada (PUT /profile/:id), BUKAN lewat
 * endpoint edit transaksi/order. Endpoint profil menimpa semua kolom, jadi profil dibaca ulang dulu dan
 * kolom yang tidak ada di halaman ini (jenis kelamin, rekening, tanggal lahir, dst.) dikirim apa adanya.
 * Cabang dikirim bersama simpan transaksi/order seperti biasa lewat #idCabang.
 */
const EditParty = (function () {
  const FIELDS = {
    nama: '#namaPelanggan',
    id: '#idNumber',
    telepon: '#teleponPelanggan',
    email: '#emailPelanggan',
    alamat: '#alamatPelanggan',
    negara: '#negara',
    pekerjaan: '#pekerjaan'
  };

  let profileId = null;
  let initial = null;
  let ready = false;

  const headers = () => ({
    'Content-Type': 'application/json',
    'X-Client-Domain': myDomain,
    'Authorization': `Bearer ${window.token}`
  });

  function current() {
    const values = {};
    Object.keys(FIELDS).forEach(key => { values[key] = ($(FIELDS[key]).val() || '').toString().trim(); });
    return values;
  }

  // ---- tampilan ringkas <-> isian ----
  const VIEW = {
    nama: '#vNama', id: '#vId', telepon: '#vTelepon', email: '#vEmail',
    alamat: '#vAlamat', negara: '#vNegara', pekerjaan: '#vPekerjaan'
  };

  function paintView() {
    const values = current();
    Object.keys(VIEW).forEach(key => {
      $(VIEW[key]).text(key === 'negara' ? ($('#negara option:selected').text() || '') : values[key]);
    });
    $('#vKode').text($('#kodePelanggan').text());
  }

  function setMode(editing) {
    $('#partyView').toggleClass('d-none', editing);
    $('#partyForm, #partyHint, #partyKodeBadge, #btnCancelParty, #btnDoneParty').toggleClass('d-none', !editing);
    $('#btnEditParty').toggleClass('d-none', editing);
  }

  function restoreInitial() {
    Object.keys(FIELDS).forEach(key => {
      if (key !== 'negara') $(FIELDS[key]).val(initial[key]);
    });
    setSelect(FIELDS.negara, initial.negara, initial.negaraText);
  }

  function bindToggle() {
    $('#btnEditParty').on('click', () => setMode(true));
    $('#btnCancelParty').on('click', () => { restoreInitial(); paintView(); setMode(false); });
    $('#btnDoneParty').on('click', () => {
      const problem = validate(current());
      if (problem) { notif.fire({ icon: 'warning', text: problem }); return; }
      paintView();
      setMode(false);
    });
  }

  function ajaxSelect(selector, url, placeholder, onSelect) {
    $(selector).select2({
      placeholder: placeholder,
      ajax: {
        url: url_api + url,
        dataType: 'json',
        headers: { 'X-Client-Domain': myDomain, 'Authorization': `Bearer ${window.token}` },
        delay: 250,
        data: params => ({ search: params.term }),
        processResults: data => ({ results: data.results })
      }
    });
    if (onSelect) $(selector).on('select2:select', e => onSelect(e.params.data));
  }

  // select2 cabang & negara (sekali saja)
  function init() {
    if (ready) return;
    ready = true;

    ajaxSelect('#cabangEdit', '/cabang/select2', 'Choose Branch', branch => {
      $('#idCabang').val(branch.id);
      $('#namaCabang').text(branch.nama || branch.text);
      $('#alamatCabang').text(branch.alamat || '');
      $('#teleponCabang').text('');   // endpoint pilihan cabang tidak memuat telepon
      $('#judulNota').text(branch.nama || branch.text);
    });
    ajaxSelect('#negara', '/profile/negara/select2', 'Choose Country');
    bindToggle();
  }

  function setSelect(selector, id, text) {
    const $el = $(selector);
    if (!id) { $el.val(null).trigger('change'); return; }
    $el.empty().append(new Option(text || id, id, true, true)).trigger('change');
  }

  /**
   * Isi bagian cabang & pelanggan dari respons /transaction/nomor atau /order/nomor.
   * profileKey = nama kolom id profil pada respons ('kontak' atau 'id_pelanggan').
   */
  function fill(response, profileKey) {
    init();

    profileId = response[profileKey];
    $('#idCabang').val(response.cabang);
    setSelect('#cabangEdit', response.cabang, `${response.kode_cabang || ''} - ${response.nama_cabang || ''}`.replace(/^ - /, ''));

    $(FIELDS.nama).val(response.nama_pelanggan);
    $(FIELDS.id).val(response.idNumber);
    $(FIELDS.telepon).val(response.telepon);
    $(FIELDS.email).val(response.email);
    $(FIELDS.alamat).val(response.alamat);
    $(FIELDS.pekerjaan).val(response.pekerjaan);
    setSelect(FIELDS.negara, response.negara, response.nationality);
    $('#kodePelanggan').text(response.kode_pelanggan);

    initial = current();
    initial.negaraText = response.nationality;
    paintView();
    setMode(false);
  }

  const dirty = () => {
    const now = current();
    return Object.keys(now).some(key => now[key] !== initial[key]);
  };

  function validate(values) {
    if (!values.nama) return 'Customer name is required';
    if (!values.id) return 'Customer ID number is required';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Customer email is not valid';
    return null;
  }

  const dateInput = value => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date)) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  /**
   * Simpan perubahan pelanggan (bila ada). Mengembalikan promise: resolve bila tidak ada yang perlu
   * disimpan atau berhasil; reject dengan pesan galat (string).
   */
  function save() {
    const deferred = $.Deferred();
    const values = current();
    const problem = validate(values);

    if (problem) return deferred.reject(problem).promise();
    if (!profileId || !dirty()) return deferred.resolve().promise();

    $.ajax({
      url: url_api + '/profile/id/' + profileId,
      type: 'GET',
      dataType: 'json',
      headers: headers()
    }).then(profile => {
      const body = {
        kode: profile.kode,
        nama: values.nama,
        email: values.email,
        id: values.id,
        telepon: values.telepon,
        negara: values.negara || profile.negara,
        alamat: values.alamat,
        pekerjaan: values.pekerjaan,
        tipe: profile.tipe_kontak,
        id_type: profile.jenis_id,
        jk: profile.jk,
        id_foto: profile.id_foto,
        rekening: profile.rekening,
        tempat_lahir: profile.tempat_lahir,
        tanggal_lahir: dateInput(profile.tanggal_lahir),
        pelanggan: profile.pelanggan,
        karyawan: profile.karyawan,
        vendor: profile.vendor,
        member: profile.member
      };

      $.ajax({
        url: url_api + '/profile/' + profileId,
        type: 'PUT',
        contentType: 'application/json',
        headers: headers(),
        data: JSON.stringify(body)
      }).then(() => {
        initial = Object.assign(current(), { negaraText: $('#negara option:selected').text() });
        deferred.resolve();
      }, xhr => deferred.reject(xhr.responseJSON?.message || 'Failed to update the customer data'));
    }, xhr => deferred.reject(xhr.responseJSON?.message || 'Failed to read the customer data'));

    return deferred.promise();
  }

  return { init, fill, save };
})();
