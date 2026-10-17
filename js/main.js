const cookieUser = "user";
const cookieSetting = "setting";
const logoKey = "cachedLogo";
const avatarKey = "cachedAvatar";
let savedProfile = getCookie(cookieUser);
let savedSetting = getCookie(cookieSetting);
let cachedLogo = sessionStorage.getItem(logoKey);
let cachedAvatar = sessionStorage.getItem(avatarKey);
let parsedProfile;

$(document).ready(function () {
	loadMainSettings();
	loadMainProfile();
    $('#btnBackup').on('click', backupData);
    addCopyStartDateButton();
});

// Every page's date-range filter uses the same #startDate/#endDate pair.
// Add a small button between them that copies Date From into Until, so
// users don't have to pick the same date twice for a single-day filter.
function addCopyStartDateButton() {
    const start = document.getElementById('startDate');
    const end = document.getElementById('endDate');

    if (!start || !end || start.type !== 'date' || end.type !== 'date') return;
    if (!start.parentElement || start.parentElement.querySelector('.btnCopyStartDate')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-secondary btnCopyStartDate d-flex align-items-center justify-content-center px-2';
    btn.title = 'Set Until the same as Date From';
    btn.innerHTML = '<i class="icon-base ti tabler-equal"></i>';
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!start.value) return;
        end.value = start.value;
        end.dispatchEvent(new Event('change', { bubbles: true }));
        end.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const btnCol = document.createElement('div');
    btnCol.className = 'col-auto d-flex align-items-end mb-3';
    btnCol.appendChild(btn);

    start.parentElement.after(btnCol);
}

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

    if (savedProfile) {

        parsedProfile = JSON.parse(savedProfile);

        $('#navbarRole').text(parsedProfile.nama_role);
        $('#navbarNama').text(parsedProfile.nama);

        loadAvatarProfile(parsedProfile.id_profile);

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

                parsedProfile = response.data;

                setSessionCookie(cookieUser, JSON.stringify(parsedProfile));

                $('#navbarRole').text(parsedProfile.nama_role);
                $('#navbarNama').text(parsedProfile.nama);

                loadAvatarProfile(parsedProfile.id_profile);

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

            }
        });

    }

}

function loadAvatarProfile(idProfile) {

    // Gunakan cache jika ada
    const cachedAvatar = sessionStorage.getItem(avatarKey);

    if (cachedAvatar) {
        $('.avatarLogin').attr('src', cachedAvatar);
        return;
    }

    const xhr = new XMLHttpRequest();

    xhr.open(
        'GET',
        `${url_api}/profile/paspor/${idProfile}`,
        true
    );

    xhr.responseType = 'blob';

    xhr.setRequestHeader('Authorization', `Bearer ${window.token}`);
    xhr.setRequestHeader('X-Client-Domain', myDomain);

    xhr.onload = function () {

        if (xhr.status === 200) {

            const blob = xhr.response;
            const contentType = xhr.getResponseHeader('Content-Type') || '';

            if (contentType.startsWith('image/')) {

                const reader = new FileReader();

                reader.onloadend = function () {

                    // Base64
                    const base64 = reader.result;

                    // simpan cache
                    sessionStorage.setItem(avatarKey, base64);

                    // tampilkan
                    $('#avatarLogin').attr('src', base64);

                };

                reader.readAsDataURL(blob);

            }

        }

    };

    xhr.send();

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

/**
 * BACKUP DATA (menu profil -> Backup Data)
 * Modal #modalBackup (index.php) menampilkan prosesnya: server membuat & mengenkripsi dump
 * (lama, tanpa progres) -> file diunduh (dengan progres) -> disimpan ke perangkat.
 */
let backupXhr = null;
let backupCancelled = false;

function backupFormatSize(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  if (bytes >= 1024) return Math.round(bytes / 1024) + ' KB';
  return bytes + ' B';
}

// state: run | ok | err; detail: keterangan kecil di kanan langkah
function backupSetStep(step, state, detail) {
  const $li = $('#backupSteps li[data-step="' + step + '"]');
  $li.removeClass('run ok err').addClass(state === 'idle' ? '' : state);
  $li.find('> i').attr('class', 'icon-base ti tabler-' + ({ idle: 'circle', run: 'loader-2', ok: 'circle-check', err: 'circle-x' }[state]));
  if (detail !== undefined) $li.find('.proc-detail').text(detail);
}

function backupSetProgress(fraction) {
  const $box = $('#backupBarBox');
  if (fraction === null) {
    $box.addClass('indeterminate');
    $('#backupBar').css('width', '');
  } else {
    $box.removeClass('indeterminate');
    $('#backupBar').css('width', Math.round(fraction * 100) + '%');
  }
}

// state: run | ok | err
function backupSetState(state, icon, title, subtitle) {
  $('#backupIcon').removeClass('run ok err').addClass(state)
    .find('i').attr('class', 'icon-base ti tabler-' + icon);
  $('#backupTitle').text(title);
  $('#backupSubtitle').text(subtitle);
}

function backupSaveFile(blob, filename) {
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
}

// Respons galat berupa blob: baca isinya untuk mengambil pesan dari API.
function backupErrorMessage(xhr, done) {
  const fallback = xhr.status ? 'The server could not create the backup (' + xhr.status + ').' : 'Could not reach the server.';
  if (!(xhr.response instanceof Blob)) return done(fallback);

  xhr.response.text().then(text => {
    try { done(JSON.parse(text).message || fallback); } catch (e) { done(fallback); }
  }, () => done(fallback));
}

function backupFinishError(step, message) {
  backupXhr = null;
  backupSetStep(step, 'err', 'failed');
  backupSetProgress(0);
  backupSetState('err', 'alert-triangle', 'Backup failed', message);
  $('#btnBackupCancel').addClass('d-none');
  $('#btnBackupClose').removeClass('d-none');
  $('#btnBackupAgain').removeClass('d-none').html('<i class="icon-base ti tabler-refresh me-2"></i>Try again').off('click').on('click', backupData);
}

function backupFinishSuccess(blob, filename) {
  backupXhr = null;
  backupSetStep('save', 'run');
  backupSaveFile(blob, filename);
  backupSetStep('save', 'ok', '');
  backupSetProgress(1);
  backupSetState('ok', 'circle-check', 'Backup complete', filename + ' (' + backupFormatSize(blob.size) + ') has been downloaded.');
  $('#btnBackupCancel').addClass('d-none');
  $('#btnBackupClose').removeClass('d-none');
  $('#btnBackupAgain').removeClass('d-none').html('<i class="icon-base ti tabler-download me-2"></i>Download again')
    .off('click').on('click', () => backupSaveFile(blob, filename));
}

function backupData() {
  const $modal = $('#modalBackup');
  if (backupXhr) { $modal.modal('show'); return; }   // sudah berjalan: tampilkan saja modalnya

  backupCancelled = false;
  ['dump', 'download', 'save'].forEach(step => backupSetStep(step, 'idle', ''));
  backupSetProgress(null);
  backupSetState('run', 'database-export', 'Backing up data…', 'Please keep this window open until the backup file is downloaded.');
  $('#btnBackupCancel').removeClass('d-none');
  $('#btnBackupClose, #btnBackupAgain').addClass('d-none');
  $modal.modal('show');

  backupSetStep('dump', 'run');

  let nativeXhr = null;   // XHR asli: respons galat (blob) hanya terbaca darinya
  backupXhr = $.ajax({
    url: url_api + '/backup',
    method: 'GET',
    headers: {
      'X-Client-Domain': myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    xhrFields: { responseType: 'blob' },
    xhr: function () {
      const xhr = new XMLHttpRequest();
      let receiving = false;
      nativeXhr = xhr;

      // Header diterima = server selesai membuat file; mulai mengunduh.
      xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState !== 2 || xhr.status !== 200) return;
        receiving = true;
        backupSetStep('dump', 'ok', '');
        backupSetStep('download', 'run', '');
      });
      xhr.addEventListener('progress', function (e) {
        if (!receiving) return;   // isi respons galat bukan file backup
        if (e.lengthComputable && e.total) {
          backupSetProgress(e.loaded / e.total);
          backupSetStep('download', 'run', backupFormatSize(e.loaded) + ' / ' + backupFormatSize(e.total));
        } else {
          backupSetStep('download', 'run', backupFormatSize(e.loaded));
        }
      });
      return xhr;
    },
    success: function (data, status, xhr) {
      let filename = "database.backup";

      const disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) filename = matches[1];
      }

      const blob = new Blob([data]);
      backupSetStep('download', 'ok', backupFormatSize(blob.size));
      backupFinishSuccess(blob, filename);
    },
    error: function (xhr) {
      if (backupCancelled) return;
      const step = $('#backupSteps li[data-step="download"]').hasClass('run') ? 'download' : 'dump';
      backupErrorMessage(nativeXhr || xhr, message => backupFinishError(step, message));
    }
  });
}

$(document).on('click', '#btnBackupCancel', function () {
  backupCancelled = true;
  if (backupXhr) backupXhr.abort();
  backupXhr = null;
  $('#modalBackup').modal('hide');
  notif.fire({ icon: 'info', text: 'Backup cancelled' });
});
