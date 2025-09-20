let orderNomor;
$(document).ready(function() {
	const urlParams = new URLSearchParams(window.location.search);
    orderNomor = urlParams.get('order');

    if (!orderNomor) {
        Swal.fire({
	        title: 'Error',
	        text: 'Order Number Not Found',
	        icon: 'error',
	        showDenyButton: false,
	        confirmButtonText: 'Place New Order',
	        customClass: {
	          confirmButton: 'btn btn-primary'
	        },
	     }).then((result) => {
	        if (result.isConfirmed) {
	          window.location.href = '/order-form';
	        }
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
		    
        // Jika parameter tersedia, panggil endpoint API
        $.ajax({
            url: url_api + '/order/nomor/' + orderNomor, 
	        type: 'GET',
	        contentType: 'application/json',
	        headers: {
	            "Content-Type": "application/json",
	            "X-Client-Domain": myDomain
	        },
	        success: function (response) {
	            $('#namaCabang').text(response.nama_cabang);
	            $('#alamatCabang').text(response.alamat_cabang);
	            $('#teleponCabang').text(response.telepon_cabang);
	            $('#nomorOrder').text(response.nomor);
	            $('#namaPelanggan').text(response.nama_pelanggan);
	            $('#alamatPelanggan').text(response.alamat);
	            $('#teleponPelanggan').text(response.telepon);
	            $('#emailPelanggan').text(response.email);
	            $('#kodePelanggan').text(response.kode_pelanggan);
	            $('#idNumber').text(response.idNumber);
	            $('#negara').text(response.nationality);
	            $('#pekerjaan').text(response.pekerjaan);
	            $('#namaPT').text(response.settings.NamaPT.strval);
	            $('#goToForm').attr('href', '/order-form?branch=' + response.cabang);

	           	let jenisTransaksi = "";
	           	if(response.tipe == "buy") {
	           		jenisTransaksi = "Buying Transaction";
	           	} else if (response.tipe == "sell") {
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
									const totalPerItem = item.jumlah * item.rate;
										subtotal += totalPerItem;
									const row = `
									    <tr>
									      <td>${item.kode}</td>
									      <td>${item.nama}</td>
									      <td class="text-end">${Number(item.jumlah).toLocaleString('id-ID')}</td>
									      <td class="text-end">Rp. ${Number(item.rate).toLocaleString('id-ID', {
											  minimumFractionDigits: 2,
											  maximumFractionDigits: 2
											})}</td>
									      <td class="text-end">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
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
	        },
	        error: function (xhr, status, error) {
	            notif.fire({
	              icon: 'error',
	              text: xhr.responseJSON.message
	            });
	        },
        });
    }
});

function printDiv(divId) {
  const content = document.getElementById(divId).innerHTML;
  const printWindow = window.open('', '', 'width=800,height=1000');

  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write(`
  <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap" rel="stylesheet" />

  <link rel="stylesheet" href="assets/vendor/fonts/iconify-icons.css" />
  <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />
  <link rel="stylesheet" href="assets/vendor/libs/pickr/pickr-themes.css" />
  <link rel="stylesheet" href="assets/vendor/css/core.css" />
  <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
  <link rel="stylesheet" href="/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
  <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css" />
  <link rel="stylesheet" href="/assets/vendor/libs/sweetalert2/sweetalert2.css" />
  <link rel="stylesheet" href="/assets/css/demo.css" />
  <link rel="stylesheet" href="/assets/vendor/css/pages/app-invoice.css" />
`);
  printWindow.document.write('</head><body >');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

function downloadPDF() {
  const element = document.getElementById('orderDiv');
  const urlParams = new URLSearchParams(window.location.search);
  const orderNomor = urlParams.get('order');

  const opt = {
    margin:       0.1,
    filename:     orderNomor + '.pdf',
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

$('#checkInvoice').click(function (e) {
  e.preventDefault();

  $.ajax({
    url: url_api + `/order/check-order/${orderNomor}`,
    type: 'GET',
    dataType: 'json',
    headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
    },
    success: function(response) {
    	if(!response.closed || response.closed === 0) {
    		notif.fire({
          icon: 'error',
          text: 'Your order is not processed yet'
        });
    	} else {
    		window.open('/pages/transaction/invoice.php?transaction=' + response.transaksi, '_blank');
    	}
    },
    error: function(xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    }
  });
});