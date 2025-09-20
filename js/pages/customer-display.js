let valasDisplayed;
$(document).ready(function () {
  $('#selectBranch').select2({
    dropdownParent: $('#modalBranch'),
    ajax: {
      url: url_api + '/cabang/select2',
      dataType: 'json',
      headers: {
        "X-Client-Domain": myDomain
      },
      delay: 250,
      data: function (params) {
        return {
          search: params.term
        };
      },
      processResults: function (data) {
        return {
          results: data.results
        };
      }
    },
    placeholder: 'Choose Branch'
  });

  const urlParams = new URLSearchParams(window.location.search);
  const branchId = urlParams.get('branch');

  if (!branchId) {
    $('#modalBranch').modal('show');
  } else {
    loadMedia();
    loadSettings(branchId);
  }

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
    const scaledBox = baseBoxSize * fontSize;
    document.documentElement.style.setProperty('--box-size', `${scaledBox}px`);
  }

  $('#sbmBranch').on('click', function () {
    const selectedBranch = $('#selectBranch').val();
    if (!selectedBranch) {
      notif.fire({
        icon: 'error',
        text: 'Please select any branch'
      });
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    window.location.href = `${currentUrl}?branch=${selectedBranch}`;
  });
});

function loadSettings(cabang) {
    $.ajax({
        url: url_api + `/setting/customer-display/${cabang}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            valasDisplayed = response.ValasDisplay.strval;
            $(document).attr('title', response.NamaPT.strval);
            $('.namaPT').text(response.NamaPT.strval);
            $('#slogan').text(response.Subheader.strval);
            if (response.cabang.cd_header) { $('.header').text(response.cabang.cd_header); }
            if (response.cabang.cd_footer) { $('#footer').text(response.cabang.cd_footer); }
            loadTabel();

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
                    $('.boxLogo').empty();
                }
            };

            xhr.onerror = function () {
                $('.boxLogo').empty();
            };

            xhr.send();
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
    // const logoUrl = url_api + '/setting/logo/';

    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', logoUrl, true);
    // xhr.setRequestHeader('X-Client-Domain', myDomain);
    // xhr.responseType = 'blob';

    // xhr.onload = function () {
    //     if (xhr.status === 200) {
    //         const imgBlob = xhr.response;
    //         const imgURL = URL.createObjectURL(imgBlob);
    //         $('#boxLogo').html(`
    //             <h5>Logo : </h5>
    //             <img src="${imgURL}" alt="Logo" style="height:80px; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalHapusLogo">
    //         `);
    //     } else {
    //         $('#boxLogo').empty(); 
    //     }
    // };

    // xhr.onerror = function () {
    //     $('#targetLogo').empty();
    // };

    // xhr.send();
}

let fontSize = 1; 
let baseBoxSize = 30;

function generateTabelHTML(dataArray) {
    let html = `
      <table class="table mb-0 national-park">
        <thead class="">
          <tr>
            <th class="text-center" colspan="2">Forex</th>
            <th class="text-end">Buy</th>
            <th class="text-end">Sell</th>
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
              <td class="p-2">${item.kode}</td>
              <td class="text-end p-2">${beliFormatted}</td>
              <td class="text-end p-2">${jualFormatted}</td>
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
      data: JSON.stringify({ valas: valasDisplayed }),
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
              ? $(`<video muted autoplay preload="auto"><source src="${blobUrl}" type="video/${ext}"></video>`)
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
              startCarousel(mediaElements);
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
        video.play();
        video.onended = () => {
          index = (index + 1) % mediaList.length;
          showNext();
        };
      } else {
        // fallback kalau video tidak bisa diputar
        setTimeout(() => {
          index = (index + 1) % mediaList.length;
          showNext();
        }, 5000);
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