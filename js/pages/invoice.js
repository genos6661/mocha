// Daftar desain (INVOICE_DESIGNS) ada di js/pages/invoice-designs.js.
// File ini hanya berisi alur: pilih desain -> muat template -> isi data -> cetak.
let urlParams, transaction;
$(document).ready(function () {
  urlParams = new URLSearchParams(window.location.search);
  transaction = urlParams.get('transaction');

  if (!transaction) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops!',
      text: 'No transaction found',
      confirmButtonText: 'OK'
    });
  } else {
    if (window.token) {
      chooseDesign();
    } else {
      // Tanpa token tidak bisa membaca setting -> pakai desain default, tanpa auto print.
      renderInvoice(getInvoiceDesign(INVOICE_DEFAULT_DESIGN), { autoPrint: false });
    }
  }
  window.onafterprint = function () {
    window.close();
  };
});

function setDateTime() {
    const now = new Date();

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear().toString().slice(-2);

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');

    const formatted = `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    $(".datetimePrint").text(formatted);
    $(".timePrint").text(formattedTime);
}

// Data transaksi hanya di-fetch sekali; dipakai untuk menentukan desain
// (desain cabang) sekaligus untuk mengisi isi invoice.
let transactionRequest = null;
function fetchTransaction() {
  if (!transactionRequest) {
    transactionRequest = $.ajax({
      url: url_api + '/transaction/nomor/' + transaction,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
      }
    });
  }
  return transactionRequest;
}

// Urutan prioritas desain:
//   1. desain khusus cabang transaksi (kolom cabang.desain, opsional)
//   2. desain utama di Settings (InvoiceDesain)
//   3. desain default registry (lihat getInvoiceDesign)
function chooseDesign() {
  const settingRequest = $.ajax({
    url: url_api + '/setting',
    type: 'GET',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    }
  });

  $.when(settingRequest, fetchTransaction())
    .done(function (settingRes, transactionRes) {
      const setting = settingRes[0];
      const trx = transactionRes[0];

      const designId = trx.desain_cabang || setting.InvoiceDesain?.strval;
      renderInvoice(getInvoiceDesign(designId), { autoPrint: true });
    })
    .fail(function (xhr) {
      if (xhr.status === 404) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
      } else {
        notif.fire({
          icon: 'error',
          text: 'Terjadi Kesalahan pada server'
        });
      }
    });
}

// Merender invoice sesuai definisi desain dari registry.
function renderInvoice(design, { autoPrint }) {
  if (design.type === 'escpos') {
    loadDataEscPos(design);
    return;
  }

  $("body").load(`../../pages/transaction/desain/${design.template}.html`, function () {
    loadData(design);

    if (autoPrint) {
      setDateTime();

      window.onafterprint = function () {
        window.close();
      };

      setTimeout(() => {
        window.print();
      }, 500);
    }
  });
}

function loadData(design) {
  const logoUrl = url_api + '/setting/logo/';

  const xhr = new XMLHttpRequest();
  xhr.open('GET', logoUrl, true);
  xhr.setRequestHeader('X-Client-Domain', myDomain);
  xhr.responseType = 'blob';

  xhr.onload = function () {
      if (xhr.status === 200) {
          const imgBlob = xhr.response;
          const imgURL = URL.createObjectURL(imgBlob);

          const renderRectangle = function () {
              $('.boxLogo').html(`
                  <img src="${imgURL}" alt="Logo" style="height: 45px;">
              `);
          };

          // Logo persegi (rasio ~1:1) pakai lebar 45% dari wadahnya;
          // logo persegi panjang tetap tinggi 45px seperti sebelumnya.
          const probe = new Image();
          probe.onload = function () {
              const ratio = probe.naturalWidth / probe.naturalHeight;
              const isSquare = ratio >= 0.95 && ratio <= 1.05;

              if (isSquare) {
                  $('.boxLogo').css('width', '100%').html(`
                      <img src="${imgURL}" alt="Logo" style="width: 60%; height: auto;">
                  `);
              } else {
                  renderRectangle();
              }
          };
          probe.onerror = renderRectangle;
          probe.src = imgURL;
      }
  };

  xhr.send();
      
  fetchTransaction()
    .done(function (response) {
      $('.namaCabang').text(response.nama_cabang);
      $('.judulNota').text(response.judul_nota);
      $('.alamatCabang').text(response.alamat_cabang);
      $('.teleponCabang').text(response.telepon_cabang);
      $('.nomorTrans').text(response.nomor);
      $('.namaPelanggan').text(response.nama_pelanggan);
      $('.alamatPelanggan').text(response.alamat);
      $('.teleponPelanggan').text(maskIdNumber(response.telepon));
      $('.emailPelanggan').text(response.email);
      $('.kodePelanggan').text(response.kode_pelanggan);
      $('.idNumber').text(maskIdNumber(response.idNumber));
      $('.negara').text(response.negara_int);
      $('.pekerjaan').text(response.pekerjaan);
      document.title = response.nama_pelanggan + '_' + response.nomor;
      if(response.footer1 && response.footer1 !== '') {
        $('.footer1').removeClass('d-none').text(response.footer1);
      }
      if(response.footer2 && response.footer2 !== '') {
        $('.footer2').removeClass('d-none').text(response.footer2);
      }
      if(response.footer3 && response.footer3 !== '') {
        $('.footer3').removeClass('d-none').text(response.footer3);
      }
      $('.ttdPelanggan').text(response.nama_pelanggan || "Customer");
      $('.ttdPerusahaan').text(response.user || response.judul_nota);

      if (response.footer1 && response.footer1 !== '') {
        $('.footer1').text(response.footer1);
      }

      let jenisTransaksi = "";
      if(response.tipe == 3) {
        jenisTransaksi = "Buying Transaction";
      } else if (response.tipe == 4) {
        jenisTransaksi = "Selling Transaction";
      }
      $('.jenisTransaksi').text(jenisTransaksi);

      const tanggal = new Date(response.tanggal);
      const formattedDate = tanggal.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      $('.tanggalTransaksi').text(formattedDate);

      const details = response.details || [];

      const tbody = $('.tabelDetail tbody');
      tbody.empty();

      if (details.length === 0) {
        tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
      } else {
        let subtotal = 0;

        details.forEach(function (item) {
          let qty;
          if (response.tipe == 3) {
            qty = item.beli;
          } else if(response.tipe == 4) {
            qty = item.jual;
          }
          const totalPerItem = qty * item.rate;
          subtotal += totalPerItem;
          const row = design.renderRow({ item, qty, total: totalPerItem });
          tbody.append(row);
        });

        // ~~~~~~~~~~ footer ~~~~~~~~~~
        const footerHtml = design.renderFooter({ subtotal, $tbody: tbody });
        if (footerHtml) {
          tbody.append(footerHtml);
        }

      }
    })
    .fail(function (xhr) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengambil data transaksi.'
      });
    });
}

function maskIdNumber(id) {
    if (!id || id.length <= 4 || id == '') return 'xxxx';

    return id.slice(0, 2) + 'x'.repeat(id.length - 4) + id.slice(-2);
}

// ESC / POS
async function loadDataEscPos(design) {
  fetchTransaction().done(function (response) {
    const escData = mapInvoiceToEscPos(response);

    downloadEscPos(buildEscPos(design, escData));
  });
}

function mapInvoiceToEscPos(res) {

  let subtotal = 0;
  const tanggal = new Date(res.tanggal);
  const formattedDate = tanggal.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const items = res.details.map(item => {

    let qty = res.tipe == 3 ? item.beli : item.jual;
    let total = qty * item.rate;

    subtotal += total;

    return {
      kode: item.kode,
      nama: item.nama,
      qty,
      rate: item.rate,
      total
    };
  });

  return {
    judul_nota: res.judul_nota,
    alamat_cabang: res.alamat_cabang,
    telepon_cabang: res.telepon_cabang,
    footer1: res.footer1,
    footer2: res.footer2,
    footer3: res.footer3,
    user: res.user,
    cabang: res.nama_cabang,
    nomor: res.nomor,
    tanggal: formattedDate,
    customer: res.nama_pelanggan,
    telepon_pelanggan: res.telepon,
    nationality: res.nationality,
    id_number: maskIdNumber(res.idNumber),
    items,
    subtotal
  };
}

function downloadEscPos(cmd) {

  const blob = new Blob([cmd], { type: "application/octet-stream" });

  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, "_blank");
  window.close();
}