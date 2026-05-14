$(document).ready(function() {
  $('#fontPlus').on('click', function () {
    fontSize += 0.1;
    updateSizes();
  });

  $('#fontMinus').on('click', function () {
    fontSize = Math.max(0.6, fontSize - 0.1);
    updateSizes();
  });

  // $('#today').text();

  function updateSizes() {
    document.documentElement.style.setProperty('--tabel-font-size', `${fontSize}rem`);
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
              <img src="${imgURL}" alt="Logo" style="height:80px;">
          `);
      } else {
          $('.boxLogo').html(`
              <img src="/assets/img/favicon/beres.svg" alt="Logo" style="height:80px;">
          `);
      }
  };

  xhr.onerror = function () {
      $('.boxLogo').empty();
  };

  xhr.send();

  loadMedia();

  $(document).attr('title', namaPT);
  $('.namaPT').text(namaPT);
  $('#slogan').text(slogan);
  if (header) { $('.header').text(header); }
  loadTabel();

  if (footer && footer != '') {
    if (footer.length >= 40) {
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

});

let fontSize = 1; 
let baseBoxSize = 30;

function generateTabelHTML(dataArray) {
    let html = `
      <table class="table mb-0 national-park">
        <thead class="">
          <tr>
            <th class="text-center text-black" colspan="2"><strong>Forex</strong></th>
            <th class="text-end text-black"><strong>Buy</strong></th>
            <th class="text-end text-black"><strong>Sell</strong></th>
          </tr>
        </thead>
        <tbody>
    `;

    $.each(dataArray, function(index, item) {
        const beliFormatted = Number(item.beli).toLocaleString('id-ID');
        const jualFormatted = Number(item.jual).toLocaleString('id-ID');
        let urlFlag;
        if (item.flag === null || item.flag == "") {
            urlFlag = "../assets/img/flags/0noflag.png";
        } else {
            urlFlag = "../assets/img/flags/" + item.flag;
        }

        html += `
            <tr>
              <td class="p-2">
                <div class="boxGambar">
                    <img src="${urlFlag}">
                </div>
              </td>
              <td class="p-2 text-black"><strong>${item.kode}</strong></td>
              <td class="text-end text-black p-2"><strong>${beliFormatted}</strong></td>
              <td class="text-end text-black p-2"><strong>${jualFormatted}</strong></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

function renderTable(data, maxRows) {
    const container = $('#tabelContainer');
    container.empty();

    if (data.length <= maxRows) {
      container.append(`<div class="tabel-wrapper">${generateTabelHTML(data)}</div>`);
    } else {
      const half = Math.ceil(data.length / 2);
      const firstHalf = data.slice(0, half);
      const secondHalf = data.slice(half);

      container.append(`<div class="half-width">${generateTabelHTML(firstHalf)}</div>`);
      container.append(`<div class="half-width">${generateTabelHTML(secondHalf)}</div>`);
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
            const $slide = $('<div class="slide"></div>');
            const $media = isVideo
              ? $(`<video autoplay muted preload="auto" control><source src="${blobUrl}" type="video/${ext}"></video>`)
              : $(`<img src="${blobUrl}" alt="gambar">`);
            $slide.append($media);
            $('#boxCarousel').append($slide);
            mediaElements.push({ el: $slide[0], isVideo });
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

function startCarousel(mediaList) {
  if (!mediaList.length) return;

  let index = 0;

  const showNext = () => {
    // Hide all
    mediaList.forEach(m => $(m.el).removeClass('active'));
    const current = mediaList[index];
    $(current.el).addClass('active');

    if (current.isVideo) {
      const video = current.el.querySelector('video');
      if (video) {
        video.currentTime = 0;
        
        video.play().catch(error => {
          console.warn("Autoplay diblokir oleh browser, mencoba play manual atau skip.", error);
          setTimeout(() => {
            index = (index + 1) % mediaList.length;
            showNext();
          }, 5000);
        });

        video.onended = () => {
          index = (index + 1) % mediaList.length;
          showNext();
        };
      }
    } else {
      setTimeout(() => {
        index = (index + 1) % mediaList.length;
        showNext();
      }, 5000); // 5 detik untuk gambar
    }
  };

  showNext();
}