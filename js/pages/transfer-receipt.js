$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const nomor = urlParams.get('number');
  console.log(window.token);

  if (!nomor) {
    console.log('tidak ada');
    Swal.fire({
      icon: 'warning',
      title: 'Oops!',
      text: 'No transaction found',
      confirmButtonText: 'OK'
    });
  } else {
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
      url: url_api + '/transfer/nomor/' + nomor,  
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (response) {
        if(response.NamaPT && response.NamaPT != '') {
          $('#judulNota').text(response.NamaPT);
        }
        $('#namaFrom').text(response.kode_from + ' - ' + response.nama_from);
        $('#alamatFrom').text(response.alamat_from);
        $('#teleponFrom').text(response.telepon_from);
        $('#nomorTrans').text(response.nomor);
        $('#namaTo').text(response.kode_to + ' - ' + response.nama_to);
        $('#teleponTo').text(response.telepon_to);
        $('#alamatTo').text(response.alamat_to);
        $('#idNumber').text(response.idNumber);
        $('#negara').text(response.nationality);
        $('#pekerjaan').text(response.pekerjaan);
        document.title = response.user + '_' + response.nomor;
        $('#ttdPelanggan').text(response.user || "Pengirim");
        $('#ttdPerusahaan').text(response.nama_to);

        if (response.deskripsi && response.deskripsi !== '') {
          $('#footer1').text(response.deskripsi);
        }

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
            let qty = item.jual;
            const totalPerItem = qty * item.rate;
            subtotal += totalPerItem;
            const row = `
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
            tbody.append(row);
          });
          $('#subtotal, #total').text(Number(subtotal).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }));
        }

        setTimeout(() => {
          window.print();
        }, 300);
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
});