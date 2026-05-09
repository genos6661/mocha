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
      } else if (design == 'small-2') {
        fileDesain = 'small-con2';
      } else if (design == 'small-sign') {
        fileDesain = 'small-sign';
      } else if (design == 'a4_continous') {
        fileDesain = 'a4-half';
      } else if (design == 'small-escpos') {
        fileDesain = 'small-escpos';
      } else if (design == 'small-escpos-long') {
        fileDesain = 'small-escpos-long';
      } else if (design == 'A4-double') {
        fileDesain = 'a4-double';
      }

      $("body").load(`../../pages/transaction/desain/${fileDesain}.html`, function () {

          if (fileDesain === 'small-escpos' || fileDesain === 'small-escpos-long') {
              loadDataEscPos(fileDesain);
              return;
          }

          loadData(fileDesain);

          setDateTime();

          window.onafterprint = function () {
              window.close();
          };

          setTimeout(() => {
            window.print();
          }, 500);
      });
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
          $('.boxLogo').html(`
              <img src="${imgURL}" alt="Logo" style="height: 45px;">
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
      $('.ttdPerusahaan').text(response.user || judul_nota);

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
          let row;
          if (fileDesain == 'small-con' || fileDesain == 'small-sign') {
            row = `
                <tr>
                  <td style="padding: 3px;">${item.kode}</td>
                  <td style="text-align: right; padding: 3px;">${Number(qty).toLocaleString('id-ID')}</td>
                  <td style="text-align: right; padding: 3px;">${Number(item.rate).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4
                })}</td>
                  <td colspan="2" style="text-align: right; padding: 3px;">${Number(totalPerItem).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>
                </tr>
            `;
          } else if (fileDesain == 'small-con2') {
            row = `
                <tr>
                  <td colspan="2" style="padding: 3px;">${item.kode}</td>
                  <td colspan="2" style="padding: 3px; text-align: center;">${Number(qty).toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center; padding: 3px;">${Number(item.rate).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>
                  <td colspan="2" style="text-align: right; padding: 3px;">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
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
          $('.subtotal, .total').text(Number(subtotal).toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        } else if (fileDesain == 'small-con' || fileDesain == 'small-con2' || fileDesain == 'small-sign') {
          tbody.append(`
            <tr>
              <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700;">Total : </td>
              <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700; text-align: right;">Rp. ${Number(subtotal).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>
            </tr>
          `);
        } else if (fileDesain == 'a4-half' || fileDesain == 'a4-double') {
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

function maskIdNumber(id) {
    if (!id || id.length <= 4 || id == '') return 'xxxx';

    return id.slice(0, 2) + 'x'.repeat(id.length - 4) + id.slice(-2);
}

// ESC / POS
async function loadDataEscPos(fileDesain) {

  $.ajax({
    url: url_api + '/transaction/nomor/' + transaction,
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: async function (response) {

      const escData = mapInvoiceToEscPos(response);

      let cmd = esc(27, 64); 

      cmd += generateEscPosInvoice(escData, fileDesain);

      downloadEscPos(cmd);
    }
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

function esc(...bytes) {
  return String.fromCharCode(...bytes);
}

function line(left, right, width = 32) {
  const space = width - left.length - right.length;
  return left + " ".repeat(Math.max(space, 1)) + right + "\n";
}

function generateEscPosInvoice(data, fileDesain) {

  if (fileDesain === 'small-escpos') {
    let cmd = "";

    cmd += esc(27, 97, 1);
    cmd += `${data.judul_nota}\n${data.alamat_cabang}\n${data.telepon_cabang}\n`;
    cmd += esc(27, 97, 0);

    cmd += "--------------------------------\n";
    cmd += `Number : ${data.nomor}\n`;
    cmd += `Date : ${data.tanggal}\n`;
    cmd += `Name : ${data.customer}\n\n`;
    cmd += `Cashier : ${data.user}\n`
    cmd += "--------------------------------\n";

    data.items.forEach(i => {

      cmd += i.kode + " - " + i.nama + "\n";

      cmd += line(
        `${i.qty} x ${formatNumber(i.rate)}`,
        formatNumber(i.total)
      );
    });

    cmd += "--------------------------------\n";
    cmd += esc(27, 69, 1);
    cmd += line("TOTAL", formatNumber(data.subtotal));
    
    cmd += esc(27, 97, 1);
    cmd += `\n${data.footer1}\n${data.footer2}\n${data.footer3}\n`;

    cmd += esc(29, 86, 0); 

    return cmd;
  }
  // desain esc pos long
  else if (fileDesain === 'small-escpos-long') {
    let cmd = "";

    cmd += esc(27, 97, 1);
    cmd += `${data.judul_nota}\n${data.alamat_cabang}\n${data.telepon_cabang}\n${data.footer1}\n`;
    cmd += esc(27, 97, 0);

    cmd += "--------------------------------\n";
    cmd += esc(27, 97, 2);
    cmd += `No. ${data.nomor}\n`;
    cmd += esc(27, 97, 0);
    cmd += `Date : ${data.tanggal}\n`;
    cmd += `Customer : ${data.customer}\n`;
    cmd += `Passport/ID : ${data.id_number}\n`;
    cmd += `Nationality : ${data.nationality}\n`;
    cmd += `Phone : ${data.telepon_pelanggan}\n`;
    cmd += esc(27, 97, 2);
    cmd += `Cashier : ${data.user}\n`;
    cmd += esc(27, 97, 0);
    cmd += "--------------------------------\n";
    cmd += `Forex    Amount    Rate    Total\n`;
    cmd += "--------------------------------\n";

    data.items.forEach(i => {

      cmd += i.kode + " - " + i.nama + "\n";

      cmd += line(
        `${i.qty} x ${formatNumber(i.rate)}`,
        formatNumber(i.total)
      );
    });

    cmd += "--------------------------------\n";
    cmd += esc(27, 69, 1);
    cmd += line("TOTAL", formatNumber(data.subtotal));

    cmd += esc(27, 97, 1);
    cmd += `\n${data.footer2}\n${data.footer3}\n`;

    cmd += esc(29, 86, 0); 

    return cmd;
  }
}

function formatNumber(num) {
  return Number(num).toLocaleString('id-ID');
}

function downloadEscPos(cmd) {

  const blob = new Blob([cmd], { type: "application/octet-stream" });

  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, "_blank");
  window.close();
}