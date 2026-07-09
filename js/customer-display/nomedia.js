let backgroundSet = false;
$(document).ready(function() {
  $('#fontPlus').on('click', function () {
    fontSize += 0.1;
    updateSizes();
  });

  $('#fontMinus').on('click', function () {
    fontSize = Math.max(0.6, fontSize - 0.1);
    updateSizes();
  });

  function updateSizes() {
    document.documentElement.style.setProperty('--tabel-font-size', `${fontSize}rem`);
    document.documentElement.style.setProperty('--font-size-header', `${fontSize}rem`);
    const scaledBox = baseBoxSize * fontSize;
    document.documentElement.style.setProperty('--box-size', `${scaledBox}px`);
  }
  
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
              <img src="${imgURL}" alt="Logo" style="height:70px;">
          `);
      } else {
          $('.boxLogo').html(`
              <img src="/assets/img/favicon/logo.svg" alt="Logo" style="height:70px;">
          `);
      }
  };

  xhr.onerror = function () {
      $('.boxLogo').empty();
  };

  $(document).attr('title', namaPT);
  $('.namaPT').text(namaPT);
  $('#slogan').text(slogan);
  // if (header) { $('.header').text(header); }
  loadTabel();

  if (footer && footer != '') {
    if (footer.length >= 95) {
      $('#footerScroll').text(footer).removeClass('d-none');
      $('#footer').addClass('d-none');
    } else {
      $('#footer').text(footer).removeClass('d-none');
      $('#footerScroll').addClass('d-none');
    }
  }

  function setCurrentDateTime() {
    const now = new Date();

    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'long' }); // December
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;  
    hours = String(hours).padStart(2, '0');

    const formatted = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;

    $("#nowDate").text(formatted);
  }
  setInterval(setCurrentDateTime, 1000);
  xhr.send();
  loadMedia();
});

let fontSize = 1; 
let baseBoxSize = 30;

function generateTabelHTML(dataArray) {
    let html = `
      <table class="table mb-0 national-park">
        <thead class="">
          <tr>
            <th class="text-black tabhead-font" colspan="2"><strong>Forex</strong></th>
            <th class="text-end text-black tabhead-font"><strong>Rate</strong></th>
          </tr>
        </thead>
        <tbody>
    `;

    $.each(dataArray, function(index, item) {
        const beliFormatted = Number(item.beli).toLocaleString('id-ID');
        let urlFlag;
        if (item.flag === null || item.flag == "") {
            urlFlag = "../assets/img/flags/0noflag.png";
        } else {
            urlFlag = "../assets/img/flags/" + item.flag;
        }

        html += `
          <tr>
            <td class="p-1">
              <div class="boxGambar">
                  <img src="${urlFlag}">
              </div>
            </td>
            <td class="p-1 text-black"><div class="d-flex flex-column"><a class="text-heading text-truncate"><span class="fw-bold">${item.kode}</span></a><small>${item.nama}</small></div></td>
            <td class="text-end text-black p-1"><strong>${beliFormatted}</strong></td>
          </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

// function renderTable(data, maxRows) {
//   const container = $('#tabelContainer');
//   container.empty();

//   if (data.length <= maxRows) {
//     container.append(`<div class="tabel-wrapper">${generateTabelHTML(data)}</div>`);
//   } else {
//     const half = Math.ceil(data.length / 2);
//     const firstHalf = data.slice(0, half);
//     const secondHalf = data.slice(half);

//     container.append(`<div class="half-width">${generateTabelHTML(firstHalf)}</div>`);
//     container.append(`<div class="half-width">${generateTabelHTML(secondHalf)}</div>`);
//   }
// }

function renderTable(data, maxRows) {
  const container = $('#tabelContainer3col');
  container.empty();

  if (data.length <= maxRows) {
    container.append(`<div class="tabel-wrapper">${generateTabelHTML(data)}</div>`);
  } else {

    const columnCount = 3; // <-- jumlah kolom
    const chunkSize = Math.ceil(data.length / columnCount);

    for (let i = 0; i < columnCount; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunk = data.slice(start, end);

      if (chunk.length > 0) {
        container.append(`
          <div class="third-width">
            ${generateTabelHTML(chunk)}
          </div>
        `);
      }
    }
  }
}

function loadTabel() {
  const maxRows = parseInt($('#maxRows').val());
  $.ajax({
    url: url_api + '/setting/rates',
    method: 'POST',
    contentType: 'application/json',
    headers: {
      'X-Client-Domain': myDomain
    },
    data: JSON.stringify({ valas: valasDisplayed, display_all: 0 }),
    success: function(response) {
      renderTable(response, maxRows);
    }
  });
}

$('#maxRows').on('change', function () {
    loadTabel();
});

function loadMedia() {
  $('#boxCarousel').empty();
  $.ajax({
    url: url_api + '/setting/media',
    method: 'GET',
    headers: {
      "X-Client-Domain": myDomain
    },
    success: function (fileNames) {
      if (!Array.isArray(fileNames) || fileNames.length === 0) {
        $('#boxCarousel').html('<div class="text-muted">Tidak ada media</div>');
        return;
      }

      const mediaElements = [];
      let loaded = 0;

      fileNames.forEach((fileName, index) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(ext);
        const fileUrl = `${url_api}/setting/media/${fileName}`;

        fetch(fileUrl, {
          headers: { 'X-Client-Domain': myDomain }
        })
          .then(res => {
            if (!res.ok) throw new Error('Gagal memuat media');
            return res.blob();
          })
          .then(blob => {
              const blobUrl = URL.createObjectURL(blob);

              // Jika ini adalah foto pertama, jadikan background
              if (!isVideo && !backgroundSet) {
                  $('.full.nomedia').css({
                      'background-image': `url("${blobUrl}")`,
                      'background-size': 'cover',
                      'background-position': 'center',
                      'background-repeat': 'no-repeat'
                  });

                  backgroundSet = true;
              }

              const $slide = $('<div class="slide"></div>');
              const $media = isVideo
                  ? $(`
                      <video autoplay muted preload="auto" controls>
                          <source src="${blobUrl}" type="video/${ext}">
                      </video>
                  `)
                  : $(`<img src="${blobUrl}" alt="gambar">`);

              $slide.append($media);
              $('#boxCarousel').append($slide);

              mediaElements.push({
                  el: $slide[0],
                  isVideo
              });
          })
          .catch(() => {
            console.warn('Gagal memuat', fileName);
          })
          .finally(() => {
            loaded++;
            if (loaded === fileNames.length) {
              setTimeout(() => {
                startCarousel(mediaElements);
              }, 2000);
            }
          });
      });
    },
    error: function () {
      $('#boxCarousel').html('<div class="text-danger">Gagal memuat daftar media</div>');
    }
  });
}