let urlParams, transaction, design, fileDesain;
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
      fileDesain = 'regular';
      $("body").load(`../../pages/transaction/desain/${fileDesain}.html`);
      loadData(fileDesain);
    }
  }
});

function chooseDesign() {
  $.ajax({
    url: url_api + '/setting',
    type: 'GET',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (response) {
      if(response.InvoiceDesain.strval) {
          design = response.InvoiceDesain.strval;
      } else {
        design = 'A4';
      }

      if (design == 'A4') {
        fileDesain = 'regular';
      } else if (design == 'small') {
        fileDesain = 'small-con';
      } else if (design == 'a4_continous') {
        fileDesain = 'a4-half';
      }

      $("body").load(`../../pages/transaction/desain/${fileDesain}.html`);
      loadData(fileDesain);
    },
    error: function (xhr) {
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
    },
  });
}

function loadData(fileDesain) {
  const logoUrl = url_api + '/setting/logo/';

  const xhr = new XMLHttpRequest();
  xhr.open('GET', logoUrl, true);
  xhr.setRequestHeader('X-Client-Domain', myDomain);
  xhr.responseType = 'blob';

  xhr.onload = function () {
      if (xhr.status === 200) {
          const imgBlob = xhr.response;
          const imgURL = URL.createObjectURL(imgBlob);
          $('#boxLogo').html(`
              <img src="${imgURL}" alt="Logo" style="height: 35px;">
          `);
      }
  };

  xhr.send();
      
  $.ajax({
    url: url_api + '/transaction/nomor/' + transaction,  
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (response) {
      $('#namaCabang').text(response.nama_cabang);
      $('#judulNota').text(response.judul_nota);
      $('#alamatCabang').text(response.alamat_cabang);
      $('#teleponCabang').text(response.telepon_cabang);
      $('#nomorTrans').text(response.nomor);
      $('#namaPelanggan').text(response.nama_pelanggan);
      $('#alamatPelanggan').text(response.alamat);
      $('#teleponPelanggan').text(response.telepon);
      $('#emailPelanggan').text(response.email);
      $('#kodePelanggan').text(response.kode_pelanggan);
      $('#idNumber').text(response.idNumber);
      $('#negara').text(response.nationality);
      $('#pekerjaan').text(response.pekerjaan);
      document.title = response.nama_pelanggan + '_' + response.nomor;
      if(response.footer1 && response.footer1 !== '') {
        $('#footer1').removeClass('d-none').text(response.footer1);
      }
      if(response.footer2 && response.footer2 !== '') {
        $('#footer2').removeClass('d-none').text(response.footer2);
      }
      if(response.footer3 && response.footer3 !== '') {
        $('#footer3').removeClass('d-none').text(response.footer3);
      }
      $('#ttdPelanggan').text(response.nama_pelanggan || "Pelanggan");
      $('#ttdPerusahaan').text(response.user);

      if (response.footer1 && response.footer1 !== '') {
        $('#footer1').text(response.footer1);
      }

      let jenisTransaksi = "";
      if(response.tipe == 3) {
        jenisTransaksi = "Buying Transaction";
      } else if (response.tipe == 4) {
        jenisTransaksi = "Selling Transaction";
      }
      $('#jenisTransaksi').text(jenisTransaksi);

      const tanggal = new Date(response.tanggal);
      const formattedDate = tanggal.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      $('#tanggalTransaksi').text(formattedDate);

      const details = response.details || [];

      const tbody = $('#tabelDetail tbody');
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
          let row;
          if (fileDesain == 'small-con') {
            row = `
                <tr>
                  <td style="padding: 3px;">${item.kode}</td>
                  <td style="text-align: right; padding: 3px;">${Number(qty).toLocaleString('id-ID')}</td>
                  <td style="text-align: right; padding: 3px;">${Number(item.rate).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                  <td colspan="2" style="text-align: right; padding: 3px;">${Number(totalPerItem).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                </tr>
            `;
          } else if (fileDesain == 'small-con2') {
            row = `
                <tr>
                  <td colspan="4" style="padding: 3px;">${item.kode} - ${item.nama}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 3px;">${Number(qty).toLocaleString('id-ID')}</td>
                  <td style="text-align: right; padding: 3px;">${Number(item.rate).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                  <td colspan="2" style="text-align: right; padding: 3px;">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                </tr>
            `;
          } else {
            row = `
                <tr>
                  <td class="nowrap">${item.kode}</td>
                  <td class="text-end nowrap">${Number(qty).toLocaleString('id-ID')}</td>
                  <td class="text-end nowrap">Rp. ${Number(item.rate).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                  <td class="text-end nowrap">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                </tr>
            `;
          }
          tbody.append(row);
        });

        // ~~~~~~~~~~ footer ~~~~~~~~~~
        if(fileDesain == 'regular') {
          $('#subtotal, #total').text(Number(subtotal).toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        } else if (fileDesain == 'small-con' || fileDesain == 'small-con2') {
          tbody.append(`
            <tr>
              <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700;">Total : </td>
              <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700; text-align: right;">Rp. ${Number(subtotal).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
            </tr>
          `);
        } else if (fileDesain == 'a4-half') {
          tbody.append(`
            <tr>
              <td colspan="3" class="fw-bold">Total : </td>
              <td class="text-end fw-bold">Rp. ${Number(subtotal).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
            </tr>
          `);
        }

        setTimeout(() => {
          window.print();
        }, 300);
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengambil data transaksi.'
      });
    }
  });
}