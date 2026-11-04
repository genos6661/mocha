/**
 * Inisialisasi isian modal "New Contact" (pages/_modal-kontak-baru.php) untuk halaman yang tidak punya inisialisasinya sendiri
 * (Cash Transaction): pilihan negara, pekerjaan, dan fokus ke kolom nama. Penyimpanan ada di contact-new.js.
 */
$(function () {
  const modal = $('#modalKontakBaru');
  if (!modal.length) return;

  $('#negara').select2({
    dropdownParent: modal,
    ajax: {
      url: url_api + '/profile/negara/select2',
      dataType: 'json',
      headers: { 'X-Client-Domain': myDomain },
      delay: 250,
      data: params => ({ search: params.term }),
      processResults: data => ({ results: data.results })
    },
    placeholder: 'Choose Country'
  });

  $.getJSON('/occupation.json', function (occupations) {
    $('#pekerjaan').select2({
      placeholder: 'Choose Occupation',
      dropdownParent: modal,
      data: [],
      allowClear: true,
      tags: true,
      ajax: {
        transport: function (params, success) {
          const term = params.data.term ? params.data.term.toLowerCase() : '';
          success({ results: occupations.filter(item => item.text.toLowerCase().includes(term)) });
        },
        delay: 250
      }
    });

    // memilih "Others" mengosongkan kolom dan membukanya lagi agar pekerjaan bisa diketik sendiri
    $('#pekerjaan').on('select2:select', function (e) {
      const selected = e.params.data;
      if (!selected.newTag && selected.id && selected.id.trim() === 'Others') {
        $('#pekerjaan').val(null).trigger('change');
        $('#pekerjaan').select2('open');
      }
    });
  });

  modal.on('shown.bs.modal', () => $('#nama').trigger('focus'));
});
