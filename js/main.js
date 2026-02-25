const cookieUser = "user";
const cookieSetting = "setting";
const logoKey = "cachedLogo";
let savedProfile = getCookie(cookieUser);
let savedSetting = getCookie(cookieSetting);
let cachedLogo = sessionStorage.getItem(logoKey);
let parsedProfile;

$(document).ready(function () {
	loadMainSettings();
	loadMainProfile();
    $('#btnBackup').on('click', backupData);
});

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function setSessionCookie(name, value) {
    document.cookie = name + "=" + (value || "") + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
    }

    function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

function loadMainSettings() {
    if(savedSetting) {
        let parsedData = JSON.parse(savedSetting);
        $('#navbarNamaPT').text(parsedData.NamaPT.strval);
    } else {
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
                setSessionCookie(cookieSetting, JSON.stringify(response));
                $('#navbarNamaPT').text(response.NamaPT.strval);
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

    // if (cachedLogo) {
    //   $('#logoForm').html(`<img src="${cachedLogo}" alt="Logo" style="height:50px;">`);
    //   $('#logoForm').addClass('mb-3');
    //   $('#boxLogo').addClass('d-flex flex-column');
    // } else {
    //   const logoUrl = url_api + '/setting/logo/';
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('GET', logoUrl, true);
    //   xhr.setRequestHeader('X-Client-Domain', myDomain);
    //   xhr.responseType = 'blob';

    //   xhr.onload = function () {
    //     if (xhr.status === 200) {
    //       const reader = new FileReader();
    //       reader.onloadend = function () {
    //         const base64Data = reader.result;
    //         sessionStorage.setItem(logoKey, base64Data);
    //         $('#logoForm').html(`<img src="${base64Data}" alt="Logo" style="height:50px;">`);
    //         $('#logoForm').addClass('mb-3');
    //         $('#boxLogo').addClass('d-flex flex-column');
    //       };
    //       reader.readAsDataURL(xhr.response);
    //     } else {
    //       $('#logoForm').removeClass('mb-3');
    //     }
    //   };

    //   xhr.send();
    // }
}

function loadMainProfile() {
    if(savedProfile) {
        parsedProfile = JSON.parse(savedProfile);
        $('#navbarRole').text(parsedProfile.nama_role);
        $('#navbarNama').text(parsedProfile.nama);
    } else {
        $.ajax({
            url: url_api + '/users/profile',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (response) {
                setSessionCookie(cookieUser, JSON.stringify(response.data));
                $('#navbarRole').text(response.data.nama_role);
                $('#navbarNama').text(response.data.nama);
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
}

// $('#btnBackup').on('click', function () {

//   fetch(url_api + '/backup', {
//     method: 'POST',
//     headers: {
//       'X-Client-Domain': myDomain,
//       'Authorization': 'Bearer ' + token
//     }
//   })
//   .then(response => response.blob())
//   .then(blob => {

//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'backup.enc';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//   })
//   .catch(err => {
//     alert('Backup gagal');
//   });

// });

function backupData() {
  Loading.standard({
      backgroundColor: 'rgba(' + window.Helpers.getCssVar('black-rgb') + ', 0.5)',
      svgSize: '0px'
  });
  let customSpinnerHTML = `
        <div class="sk-wave mx-auto">
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
        </div>
  `;
  let notiflixBlock = document.querySelector('.notiflix-loading');
  notiflixBlock.innerHTML = customSpinnerHTML;

  $.ajax({
    url: url_api + '/backup',
    method: 'GET',
    headers: {
      'X-Client-Domain': myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    xhrFields: {
      responseType: 'blob'
    },
    success: function (data, status, xhr) {

      let filename = "database.backup";

      const disposition = xhr.getResponseHeader('Content-Disposition');

      if (disposition) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = new Blob([data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      Loading.remove();
    },
    error: function (xhr) {
        notif.fire({
            icon: 'error',
            text: xhr.responseJSON?.message || 'Terjadi kesalahan'
          });
      if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
      }
    }
  });
}